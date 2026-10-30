import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildRecommendedItinerary,
  type BudgetPreference,
  type CourseTypePreference,
  type RecommendationCourse,
  type RecommendationDay,
} from "@/lib/itinerary-recommendations";

const monthNumbers: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const budgetPreferences = new Set<BudgetPreference>([
  "any",
  "value",
  "balanced",
  "premium",
]);
const courseTypePreferences = new Set<CourseTypePreference>([
  "any",
  "links",
  "parkland",
  "heathland",
]);

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * radiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normaliseDays(value: unknown, numberOfGolfDays: number) {
  const suppliedDays = Array.isArray(value) ? value : [];
  const days = suppliedDays
    .map((day): RecommendationDay | null => {
      if (!day || typeof day !== "object") return null;

      const rawDay = day as { dayNumber?: unknown; dayType?: unknown };
      const dayNumber = Number(rawDay.dayNumber);
      if (
        !Number.isInteger(dayNumber) ||
        dayNumber < 1 ||
        dayNumber > numberOfGolfDays
      ) {
        return null;
      }

      return {
        dayNumber,
        dayType: rawDay.dayType === "Weekend" ? "Weekend" : "Weekday",
      };
    })
    .filter((day): day is RecommendationDay => Boolean(day));

  if (days.length === numberOfGolfDays) {
    return days.sort((left, right) => left.dayNumber - right.dayNumber);
  }

  return Array.from({ length: numberOfGolfDays }, (_, index) => ({
    dayNumber: index + 1,
    dayType: "Weekday" as const,
  }));
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const tripId = String(body.trip_id || "").trim();

    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 },
      );
    }

    const budgetPreference = budgetPreferences.has(body.budget_preference)
      ? (body.budget_preference as BudgetPreference)
      : "balanced";
    const courseTypePreference = courseTypePreferences.has(
      body.course_type_preference,
    )
      ? (body.course_type_preference as CourseTypePreference)
      : "any";
    const requestedDistance = Number(body.max_distance_km);
    const maxDistanceKm = Number.isFinite(requestedDistance)
      ? Math.min(200, Math.max(10, requestedDistance))
      : 75;

    const { data: tripRows, error: tripError } = await supabase
      .from("trips")
      .select(
        "selected_courses, base_latitude, base_longitude, month_of_travel, number_of_golf_days",
      )
      .eq("trip_id", tripId)
      .limit(1);

    if (tripError || !tripRows?.[0]) {
      return NextResponse.json(
        {
          error: "Unable to load the trip",
          details: tripError?.message,
        },
        { status: tripError ? 500 : 404 },
      );
    }

    const trip = tripRows[0];
    const baseLatitude = Number(trip.base_latitude);
    const baseLongitude = Number(trip.base_longitude);

    if (Number.isNaN(baseLatitude) || Number.isNaN(baseLongitude)) {
      return NextResponse.json(
        { error: "The trip needs a valid base location" },
        { status: 400 },
      );
    }

    const { data: courseRows, error: courseError } = await supabase
      .from("courses")
      .select(
        "id, course_name, town, region, holes, independent_guest_days, price_range, course_type, course_image, latitude, longitude, max_handicap, season_start_month, season_end_month",
      )
      .eq("country", "Ireland")
      .order("course_name", { ascending: true })
      .range(0, 499);

    if (courseError) {
      return NextResponse.json(
        { error: "Unable to load Irish courses", details: courseError.message },
        { status: 500 },
      );
    }

    const courses: RecommendationCourse[] = (
      (courseRows || []) as RecommendationCourse[]
    ).flatMap((course) => {
        const latitude = Number(course.latitude);
        const longitude = Number(course.longitude);

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) return [];

        return [
          {
            ...course,
            latitude,
            longitude,
            distance: getDistanceKm(
              baseLatitude,
              baseLongitude,
              latitude,
              longitude,
            ),
          },
        ];
      });

    const numberOfGolfDays = Math.min(
      10,
      Math.max(1, Number(trip.number_of_golf_days) || 3),
    );
    const days = normaliseDays(body.trip_days, numberOfGolfDays);
    const result = buildRecommendedItinerary({
      courses,
      existingCourses: Array.isArray(trip.selected_courses)
        ? (trip.selected_courses as RecommendationCourse[])
        : [],
      days,
      monthNumber: monthNumbers[trip.month_of_travel] || 4,
      maxDistanceKm,
      budgetPreference,
      courseTypePreference,
    });

    const { error: updateError } = await supabase
      .from("trips")
      .update({ selected_courses: result.selectedCourses })
      .eq("trip_id", tripId);

    if (updateError) {
      return NextResponse.json(
        { error: "Unable to save recommendations", details: updateError.message },
        { status: 500 },
      );
    }

    const addedCount = result.addedCourseIds.length;
    const assignedCount = result.newlyAssignedCourseIds.length;
    const message = result.unfilledDays.length
      ? `We filled ${result.filledDayCount} of ${days.length} golf days. Increase the distance or broaden your preferences to find more options.`
      : addedCount > 0 || assignedCount > 0
        ? `Your ${days.length}-day itinerary is ready. You can swap or move any course.`
        : "Every golf day already has a course assigned.";

    return NextResponse.json({
      success: true,
      selected_courses: result.selectedCourses,
      added_count: addedCount,
      assigned_count: assignedCount,
      filled_day_count: result.filledDayCount,
      unfilled_days: result.unfilledDays,
      message,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to build the itinerary" },
      { status: 500 },
    );
  }
}
