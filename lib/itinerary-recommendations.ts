export type BudgetPreference = "any" | "value" | "balanced" | "premium";
export type CourseTypePreference =
  | "any"
  | "links"
  | "parkland"
  | "heathland";
export type RecommendationDayType = "Weekday" | "Weekend";

export type RecommendationDay = {
  dayNumber: number;
  dayType: RecommendationDayType;
};

export type RecommendationCourse = {
  id: number;
  course_name: string;
  town?: string | null;
  region?: string | null;
  holes?: number | null;
  independent_guest_days?: string | null;
  price_range?: string | null;
  course_type?: string | null;
  course_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  max_handicap?: number | string | null;
  season_start_month?: number | null;
  season_end_month?: number | null;
  distance?: number | null;
  assigned_day?: number | null;
  assigned_slot?: "Morning" | "Afternoon" | null;
  automatically_recommended?: boolean;
  recommendation_reasons?: string[];
  [key: string]: unknown;
};

type BuildRecommendationInput = {
  courses: RecommendationCourse[];
  existingCourses: RecommendationCourse[];
  days: RecommendationDay[];
  monthNumber: number;
  maxDistanceKm: number;
  budgetPreference: BudgetPreference;
  courseTypePreference: CourseTypePreference;
};

const priceBandOrder = ["€", "€€", "€€€", "€€€€", "€€€€€"];

function normalisePriceBand(value?: string | null) {
  return value?.replace(/Â/g, "").trim() || "";
}

function getPriceBandIndex(value?: string | null) {
  return priceBandOrder.indexOf(normalisePriceBand(value));
}

function getPreferredPriceIndexes(preference: BudgetPreference) {
  if (preference === "value") return [0, 1];
  if (preference === "balanced") return [1, 2];
  if (preference === "premium") return [3, 4];
  return priceBandOrder.map((_, index) => index);
}

function getBudgetScore(
  priceRange: string | null | undefined,
  preference: BudgetPreference,
) {
  if (preference === "any") return 12;

  const priceIndex = getPriceBandIndex(priceRange);
  if (priceIndex < 0) return 0;

  const preferredIndexes = getPreferredPriceIndexes(preference);
  const distanceFromPreference = Math.min(
    ...preferredIndexes.map((preferredIndex) =>
      Math.abs(priceIndex - preferredIndex),
    ),
  );

  return Math.max(0, 32 - distanceFromPreference * 14);
}

function getCourseTypeScore(
  courseType: string | null | undefined,
  preference: CourseTypePreference,
) {
  if (preference === "any") return 10;

  const cleanType = courseType?.trim().toLowerCase() || "";
  if (cleanType.includes(preference)) return 28;
  if (cleanType.includes("mixed")) return 12;
  return 0;
}

function accessMatchesDay(
  access: string | null | undefined,
  dayType: RecommendationDayType,
) {
  const cleanAccess = access?.trim().toLowerCase() || "";

  if (cleanAccess === "everyday") return true;
  if (dayType === "Weekday" && cleanAccess === "weekdays") return true;
  if (
    dayType === "Weekend" &&
    (cleanAccess === "weekend" || cleanAccess === "weekends")
  ) {
    return true;
  }

  return false;
}

function isCourseInSeason(
  course: RecommendationCourse,
  monthNumber: number,
) {
  const start = Number(course.season_start_month);
  const end = Number(course.season_end_month);

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 1 ||
    start > 12 ||
    end < 1 ||
    end > 12
  ) {
    return true;
  }

  if (start <= end) return monthNumber >= start && monthNumber <= end;
  return monthNumber >= start || monthNumber <= end;
}

function getRecommendationReasons(
  course: RecommendationCourse,
  day: RecommendationDay,
  budgetPreference: BudgetPreference,
  courseTypePreference: CourseTypePreference,
) {
  const reasons: string[] = [];

  if (typeof course.distance === "number") {
    reasons.push(`${Math.round(course.distance)} km from your base`);
  }

  if (budgetPreference !== "any" && getBudgetScore(course.price_range, budgetPreference) >= 25) {
    reasons.push("Matches your budget preference");
  }

  const cleanType = course.course_type?.trim();
  if (
    cleanType &&
    (courseTypePreference === "any" ||
      cleanType.toLowerCase().includes(courseTypePreference))
  ) {
    reasons.push(cleanType);
  }

  reasons.push(
    day.dayType === "Weekend"
      ? "Visitor access matches weekend play"
      : "Visitor access matches weekday play",
  );

  return reasons.slice(0, 3);
}

function getCourseScore(
  course: RecommendationCourse,
  day: RecommendationDay,
  maxDistanceKm: number,
  budgetPreference: BudgetPreference,
  courseTypePreference: CourseTypePreference,
  usedCourseTypes: Set<string>,
) {
  const distance =
    typeof course.distance === "number" ? course.distance : maxDistanceKm;
  const distanceScore = Math.max(
    0,
    40 - (Math.min(distance, maxDistanceKm) / maxDistanceKm) * 40,
  );
  const accessScore =
    course.independent_guest_days?.trim().toLowerCase() === "everyday"
      ? 16
      : 12;
  const cleanType = course.course_type?.trim().toLowerCase() || "";
  const varietyScore =
    courseTypePreference === "any" && cleanType && !usedCourseTypes.has(cleanType)
      ? 8
      : 0;

  return (
    distanceScore +
    accessScore +
    getBudgetScore(course.price_range, budgetPreference) +
    getCourseTypeScore(course.course_type, courseTypePreference) +
    varietyScore +
    (day.dayType === "Weekend" ? 1 : 0)
  );
}

export function buildRecommendedItinerary({
  courses,
  existingCourses,
  days,
  monthNumber,
  maxDistanceKm,
  budgetPreference,
  courseTypePreference,
}: BuildRecommendationInput) {
  const updatedCourses = existingCourses.map((course) => ({ ...course }));
  const selectedIds = new Set(
    updatedCourses.map((course) => Number(course.id)),
  );
  const occupiedDays = new Set(
    updatedCourses
      .map((course) => Number(course.assigned_day))
      .filter((dayNumber) => Number.isInteger(dayNumber) && dayNumber > 0),
  );
  const usedCourseTypes = new Set(
    updatedCourses
      .map((course) => course.course_type?.trim().toLowerCase())
      .filter((courseType): courseType is string => Boolean(courseType)),
  );
  const unassignedExisting = updatedCourses.filter(
    (course) => !course.assigned_day,
  );
  const addedCourseIds: number[] = [];
  const newlyAssignedCourseIds: number[] = [];
  const unfilledDays: number[] = [];

  for (const day of days) {
    if (occupiedDays.has(day.dayNumber)) continue;

    const existingCandidate = unassignedExisting
      .filter(
        (course) =>
          accessMatchesDay(course.independent_guest_days, day.dayType) &&
          (typeof course.distance !== "number" ||
            course.distance <= maxDistanceKm),
      )
      .sort(
        (left, right) =>
          getCourseScore(
            right,
            day,
            maxDistanceKm,
            budgetPreference,
            courseTypePreference,
            usedCourseTypes,
          ) -
          getCourseScore(
            left,
            day,
            maxDistanceKm,
            budgetPreference,
            courseTypePreference,
            usedCourseTypes,
          ),
      )[0];

    if (existingCandidate) {
      existingCandidate.assigned_day = day.dayNumber;
      existingCandidate.assigned_slot = "Morning";
      occupiedDays.add(day.dayNumber);
      newlyAssignedCourseIds.push(Number(existingCandidate.id));

      const existingIndex = unassignedExisting.findIndex(
        (course) => Number(course.id) === Number(existingCandidate.id),
      );
      if (existingIndex >= 0) unassignedExisting.splice(existingIndex, 1);
      continue;
    }

    const candidate = courses
      .filter((course) => {
        if (selectedIds.has(Number(course.id))) return false;
        if (!accessMatchesDay(course.independent_guest_days, day.dayType)) {
          return false;
        }
        if (!isCourseInSeason(course, monthNumber)) return false;
        return (
          typeof course.distance === "number" &&
          course.distance <= maxDistanceKm
        );
      })
      .sort(
        (left, right) =>
          getCourseScore(
            right,
            day,
            maxDistanceKm,
            budgetPreference,
            courseTypePreference,
            usedCourseTypes,
          ) -
          getCourseScore(
            left,
            day,
            maxDistanceKm,
            budgetPreference,
            courseTypePreference,
            usedCourseTypes,
          ),
      )[0];

    if (!candidate) {
      unfilledDays.push(day.dayNumber);
      continue;
    }

    const recommendedCourse: RecommendationCourse = {
      ...candidate,
      assigned_day: day.dayNumber,
      assigned_slot: "Morning",
      automatically_recommended: true,
      recommendation_reasons: getRecommendationReasons(
        candidate,
        day,
        budgetPreference,
        courseTypePreference,
      ),
    };

    updatedCourses.push(recommendedCourse);
    selectedIds.add(Number(candidate.id));
    occupiedDays.add(day.dayNumber);
    addedCourseIds.push(Number(candidate.id));

    const cleanType = candidate.course_type?.trim().toLowerCase();
    if (cleanType) usedCourseTypes.add(cleanType);
  }

  return {
    selectedCourses: updatedCourses,
    addedCourseIds,
    newlyAssignedCourseIds,
    unfilledDays,
    filledDayCount: days.length - unfilledDays.length,
  };
}
