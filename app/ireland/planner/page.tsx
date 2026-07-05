"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GolfIrelandMember = "Yes" | "No" | "Not sure";
type DayType = "Weekday" | "Weekend";
type PlannerStep = "setup" | "planner";
type VoteValue = "must_play" | "happy_to_play" | "not_for_me";

type TripDay = {
  dayNumber: number;
  dayType: DayType;
};

type GeocodedBase = {
  label: string;
  latitude: number;
  longitude: number;
};

type PlannerCourse = {
  id: number;
  course_name: string;
  town?: string;
  region?: string;
  holes?: number;
  independent_guest_days?: string;
  price_range?: string;
  course_type?: string;
  course_image?: string;
  distance?: number;
  max_handicap?: number | string;
  assigned_day?: number | null;
  assigned_slot?: "Morning" | "Afternoon" | null;
};

type SavedTrip = {
  trip_id: string;
  trip_code?: string;
  trip_name?: string;
  base_location?: string;
  month_of_travel?: string;
  number_of_golfers?: number;
  number_of_golf_days?: number;
  selected_courses?: PlannerCourse[] | null;
  created_at?: string;
};

type VoteSummary = Record<
  number,
  {
    must_play: number;
    happy_to_play: number;
    not_for_me: number;
    score: number;
  }
>;

const quickBases = [
  "Dublin",
  "Cork",
  "Shannon",
  "Belfast",
  "Galway",
  "Killarney",
  "Lahinch",
  "Adare",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const voteOptions: { value: VoteValue; emoji: string; label: string }[] = [
  { value: "must_play", emoji: "🔥", label: "Must Play" },
  { value: "happy_to_play", emoji: "👍", label: "Happy To Play" },
  { value: "not_for_me", emoji: "👎", label: "Not For Me" },
];

function createTripDays(numberOfGolfDays: number, existingDays: TripDay[]) {
  return Array.from({ length: numberOfGolfDays }, (_, index) => {
    const existingDay = existingDays[index];

    return {
      dayNumber: index + 1,
      dayType: existingDay?.dayType || "Weekday",
    };
  });
}

function getAverageDistance(courses: PlannerCourse[]) {
  const distances = courses
    .map((course) => course.distance)
    .filter((distance): distance is number => typeof distance === "number");

  if (distances.length === 0) return null;

  const totalDistance = distances.reduce((sum, distance) => sum + distance, 0);

  return totalDistance / distances.length;
}

function getCourseMix(courses: PlannerCourse[]) {
  const courseTypes = Array.from(
    new Set(courses.map((course) => course.course_type).filter(Boolean)),
  );

  if (courseTypes.length === 0) return "—";

  return courseTypes.join(" / ");
}

function getGreenFeeRange(priceRange?: string) {
  const cleanPrice = priceRange?.trim();

  if (cleanPrice === "€") return { low: 0, high: 100 };
  if (cleanPrice === "€€") return { low: 101, high: 200 };
  if (cleanPrice === "€€€") return { low: 201, high: 300 };
  if (cleanPrice === "€€€€") return { low: 300, high: 450 };

  return null;
}

function formatEuroAmount(amount: number) {
  return `€${Math.round(amount).toLocaleString("en-IE")}`;
}

function getGreenFeeEstimate(courses: PlannerCourse[]) {
  const courseRanges = courses
    .map((course) => getGreenFeeRange(course.price_range))
    .filter((range): range is { low: number; high: number } => Boolean(range));

  if (courseRanges.length === 0) return null;

  const perGolferLow = courseRanges.reduce((sum, range) => sum + range.low, 0);
  const perGolferHigh = courseRanges.reduce(
    (sum, range) => sum + range.high,
    0,
  );

  return {
    pricedCourses: courseRanges.length,
    perGolferLow,
    perGolferHigh,
  };
}

function generatePlannerUserId() {
  return `GPG-USER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

function getOrCreatePlannerUserId() {
  const existingUserId = window.localStorage.getItem(
    "guestplaygolf_planner_user_id",
  );

  if (existingUserId) return existingUserId;

  const newUserId = generatePlannerUserId();
  window.localStorage.setItem("guestplaygolf_planner_user_id", newUserId);

  return newUserId;
}

function generateParticipantId() {
  return `GPG-P-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

function getOrCreateParticipantId() {
  const existingId = window.localStorage.getItem(
    "guestplaygolf_participant_id",
  );

  if (existingId) return existingId;

  const newId = generateParticipantId();
  window.localStorage.setItem("guestplaygolf_participant_id", newId);

  return newId;
}

function getShortPlaceName(place?: string) {
  if (!place) return "";

  return place.split("\n")[0].split(",")[0].trim();
}

function parseAssignmentValue(value: string) {
  if (value === "unassigned") {
    return {
      assignedDay: null as number | null,
      assignedSlot: null as "Morning" | "Afternoon" | null,
    };
  }

  const [dayPart, slotPart] = value.split("-");
  const assignedDay = Number(dayPart);
  const assignedSlot = slotPart === "Afternoon" ? "Afternoon" : "Morning";

  return {
    assignedDay: Number.isNaN(assignedDay) ? null : assignedDay,
    assignedSlot: Number.isNaN(assignedDay)
      ? null
      : (assignedSlot as "Morning" | "Afternoon"),
  };
}

function getAssignmentValue(course: PlannerCourse) {
  if (!course.assigned_day || !course.assigned_slot) return "unassigned";

  return `${course.assigned_day}-${course.assigned_slot}`;
}

function getAssignmentLabel(course: PlannerCourse) {
  if (!course.assigned_day || !course.assigned_slot) return "Not assigned";

  return `Day ${course.assigned_day} ${course.assigned_slot}`;
}

function getAssignedCourse(
  courses: PlannerCourse[],
  dayNumber: number,
  slot: "Morning" | "Afternoon",
) {
  return courses.find(
    (course) =>
      course.assigned_day === dayNumber && course.assigned_slot === slot,
  );
}

function getAccessValidation(course: PlannerCourse, dayType: DayType) {
  const access = course.independent_guest_days?.trim();

  if (!access) {
    return {
      isValid: false,
      message: "Check visitor access",
    };
  }

  if (access === "Everyday") {
    return {
      isValid: true,
      message: "Access matches day",
    };
  }

  if (dayType === "Weekday" && access === "Weekdays") {
    return {
      isValid: true,
      message: "Access matches day",
    };
  }

  if (dayType === "Weekend" && access === "Weekend") {
    return {
      isValid: true,
      message: "Access matches day",
    };
  }

  if (access === "Weekdays") {
    return {
      isValid: false,
      message: "Weekday guests only",
    };
  }

  if (access === "Weekend") {
    return {
      isValid: false,
      message: "Weekend guests only",
    };
  }

  if (access === "Limited Access" || access === "Limited") {
    return {
      isValid: false,
      message: "Check limited visitor access",
    };
  }

  return {
    isValid: false,
    message: "Check visitor access",
  };
}

function getCourseVoteSummary(voteSummary: VoteSummary, courseId: number) {
  return (
    voteSummary[courseId] || {
      must_play: 0,
      happy_to_play: 0,
      not_for_me: 0,
      score: 0,
    }
  );
}

export default function PlannerPage() {
  const [step, setStep] = useState<PlannerStep>("setup");

  const [baseInput, setBaseInput] = useState("");
  const [geocodedBase, setGeocodedBase] = useState<GeocodedBase | null>(null);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isLoadingTrip, setIsLoadingTrip] = useState(false);
  const [isRemovingCourse, setIsRemovingCourse] = useState<number | null>(null);
  const [isAssigningCourse, setIsAssigningCourse] = useState<number | null>(
    null,
  );
  const [baseError, setBaseError] = useState("");
  const [tripError, setTripError] = useState("");
  const [tripId, setTripId] = useState("");
  const [tripCode, setTripCode] = useState("");
  const [openTripCode, setOpenTripCode] = useState("");
  const [isOpeningTripCode, setIsOpeningTripCode] = useState(false);
  const [plannerUserId, setPlannerUserId] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<PlannerCourse[]>([]);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [participantId, setParticipantId] = useState("");
  const [voteSummary, setVoteSummary] = useState<VoteSummary>({});
  const [selectedVotes, setSelectedVotes] = useState<Record<number, VoteValue>>({});
  const [isSubmittingVote, setIsSubmittingVote] = useState<number | null>(null);

  const [tripName, setTripName] = useState("");
  const [month, setMonth] = useState("April");
  const [golfIrelandMember, setGolfIrelandMember] =
    useState<GolfIrelandMember>("No");
  const [numberOfGolfers, setNumberOfGolfers] = useState(4);
  const [numberOfGolfDays, setNumberOfGolfDays] = useState(3);

  const [tripDays, setTripDays] = useState<TripDay[]>([
    { dayNumber: 1, dayType: "Weekday" },
    { dayNumber: 2, dayType: "Weekday" },
    { dayNumber: 3, dayType: "Weekday" },
  ]);

  const averageDistance = getAverageDistance(selectedCourses);
  const courseMix = getCourseMix(selectedCourses);
  const greenFeeEstimate = getGreenFeeEstimate(selectedCourses);

  async function loadVoteTotals(activeTripId: string) {
    if (!activeTripId) return;

    try {
      const response = await fetch(`/api/trips/vote?tripId=${activeTripId}`);
      const data = await response.json();

      if (response.ok && data.summary) {
        setVoteSummary(data.summary);
      } else {
        setVoteSummary({});
      }
    } catch {
      setVoteSummary({});
    }
  }

  useEffect(() => {
    setTripDays((currentDays) => createTripDays(numberOfGolfDays, currentDays));
  }, [numberOfGolfDays]);

  useEffect(() => {
    const currentPlannerUserId = getOrCreatePlannerUserId();
    setPlannerUserId(currentPlannerUserId);

    const currentParticipantId = getOrCreateParticipantId();
    setParticipantId(currentParticipantId);

    async function loadExistingTrip({
      existingTripId,
      existingTripCode,
    }: {
      existingTripId?: string;
      existingTripCode?: string;
    }) {
      setIsLoadingTrip(true);
      setTripError("");

      try {
        const query = existingTripCode
          ? `tripCode=${encodeURIComponent(existingTripCode.trim().toUpperCase())}`
          : `tripId=${encodeURIComponent(existingTripId || "")}`;

        const response = await fetch(`/api/trips/get?${query}`);
        const data = await response.json();

        if (!response.ok || !data.trip) {
          setTripError("We could not load this trip.");
          setIsLoadingTrip(false);
          return;
        }

        const trip = data.trip;
        const courses = Array.isArray(trip.selected_courses)
          ? trip.selected_courses
          : [];

        setTripId(trip.trip_id);
        setTripCode(trip.trip_code || "");
        setTripName(trip.trip_name || "");
        setBaseInput(getShortPlaceName(trip.base_location || ""));
        setMonth(trip.month_of_travel || "April");
        setGolfIrelandMember(trip.golf_ireland_member || "No");
        setNumberOfGolfers(trip.number_of_golfers || 4);
        setNumberOfGolfDays(trip.number_of_golf_days || 3);
        setSelectedCourses(courses);

        setGeocodedBase({
          label: getShortPlaceName(trip.base_location || ""),
          latitude: trip.base_latitude || 0,
          longitude: trip.base_longitude || 0,
        });

        window.localStorage.setItem("guestplaygolf_trip_id", trip.trip_id);
        window.localStorage.setItem(
          "guestplaygolf_planner_courses",
          JSON.stringify(courses),
        );

        await loadVoteTotals(trip.trip_id);

        try {
          const storedVotes = window.localStorage.getItem(
            `guestplaygolf_trip_votes_${trip.trip_id}`,
          );
          setSelectedVotes(storedVotes ? JSON.parse(storedVotes) : {});
        } catch {
          setSelectedVotes({});
        }

        setStep("planner");
      } catch {
        setTripError("Something went wrong loading this trip.");
      } finally {
        setIsLoadingTrip(false);
      }
    }

    async function loadSavedTrips() {
      setIsLoadingTrips(true);

      try {
        const response = await fetch(
          `/api/trips/list?plannerUserId=${currentPlannerUserId}`,
        );
        const data = await response.json();

        if (response.ok && Array.isArray(data.trips)) {
          setSavedTrips(data.trips);
        }
      } catch {
        setSavedTrips([]);
      } finally {
        setIsLoadingTrips(false);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const urlTripId = params.get("tripId");
    const urlTripCode = params.get("tripCode");

    if (urlTripId) {
      loadExistingTrip({ existingTripId: urlTripId });
    } else if (urlTripCode) {
      loadExistingTrip({ existingTripCode: urlTripCode });
    } else {
      loadSavedTrips();
    }
  }, []);

  const isReadyToStart = useMemo(() => {
    return (
      baseInput.trim().length > 0 &&
      tripName.trim().length > 0 &&
      month.length > 0 &&
      numberOfGolfers > 0 &&
      numberOfGolfDays > 0 &&
      !isCreatingTrip
    );
  }, [
    baseInput,
    tripName,
    month,
    numberOfGolfers,
    numberOfGolfDays,
    isCreatingTrip,
  ]);

  async function handleOpenTripByCode() {
    const cleanCode = openTripCode.trim().toUpperCase();

    if (!cleanCode || isOpeningTripCode) return;

    setTripError("");
    setIsOpeningTripCode(true);

    try {
      const response = await fetch(
        `/api/trips/get?tripCode=${encodeURIComponent(cleanCode)}`,
      );
      const data = await response.json();

      if (!response.ok || !data.trip?.trip_id) {
        setTripError("We could not find a trip with that code.");
        return;
      }

      window.location.href = `/ireland/planner?tripId=${data.trip.trip_id}`;
    } catch {
      setTripError("Something went wrong opening this trip.");
    } finally {
      setIsOpeningTripCode(false);
    }
  }

  async function handleStartPlanning() {
    if (!isReadyToStart) return;

    setBaseError("");
    setTripError("");
    setIsCreatingTrip(true);

    const currentPlannerUserId = plannerUserId || getOrCreatePlannerUserId();
    setPlannerUserId(currentPlannerUserId);

    try {
      const geocodeResponse = await fetch(
        `/api/geocode?place=${encodeURIComponent(
          baseInput.trim(),
        )}&country=Ireland`,
      );

      const geocodeData = await geocodeResponse.json();

      if (!geocodeResponse.ok) {
        setBaseError(
          "We could not find that location in Ireland. Try a town, city, airport or resort name.",
        );
        setIsCreatingTrip(false);
        return;
      }

      const confirmedBase = {
        label: getShortPlaceName(geocodeData.label || baseInput.trim()),
        latitude: geocodeData.latitude,
        longitude: geocodeData.longitude,
      };

      const tripResponse = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planner_user_id: currentPlannerUserId,
          trip_name: tripName.trim(),
          base_location: confirmedBase.label,
          base_latitude: confirmedBase.latitude,
          base_longitude: confirmedBase.longitude,
          month_of_travel: month,
          golf_ireland_member: golfIrelandMember,
          number_of_golfers: numberOfGolfers,
          number_of_golf_days: numberOfGolfDays,
        }),
      });

      const tripData = await tripResponse.json();

      if (!tripResponse.ok || !tripData.trip_id) {
        setTripError("We could not create your trip. Please try again.");
        setIsCreatingTrip(false);
        return;
      }

      setGeocodedBase(confirmedBase);
      setTripId(tripData.trip_id);
      setTripCode(tripData.trip_code || "");
      setSelectedCourses([]);
      setVoteSummary({});
      setSelectedVotes({});

      window.localStorage.setItem("guestplaygolf_trip_id", tripData.trip_id);
      window.localStorage.setItem("guestplaygolf_planner_courses", "[]");

      setStep("planner");
    } catch {
      setTripError(
        "Something went wrong creating your trip. Please try again.",
      );
    } finally {
      setIsCreatingTrip(false);
    }
  }

  async function handleRemoveCourse(courseId: number) {
    if (!tripId || isRemovingCourse) return;

    setTripError("");
    setIsRemovingCourse(courseId);

    try {
      const response = await fetch("/api/trips/remove-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: tripId,
          course_id: courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTripError("We could not remove this course. Please try again.");
        return;
      }

      const updatedCourses = Array.isArray(data.selected_courses)
        ? data.selected_courses
        : selectedCourses.filter((course) => course.id !== courseId);

      setSelectedCourses(updatedCourses);
      window.localStorage.setItem(
        "guestplaygolf_planner_courses",
        JSON.stringify(updatedCourses),
      );
    } catch {
      setTripError("Something went wrong removing this course.");
    } finally {
      setIsRemovingCourse(null);
    }
  }

  async function handleAssignCourse(courseId: number, assignmentValue: string) {
    if (!tripId || isAssigningCourse) return;

    const { assignedDay, assignedSlot } = parseAssignmentValue(assignmentValue);

    setTripError("");
    setIsAssigningCourse(courseId);

    try {
      const response = await fetch("/api/trips/assign-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: tripId,
          course_id: courseId,
          assigned_day: assignedDay,
          assigned_slot: assignedSlot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTripError("We could not assign this course. Please try again.");
        return;
      }

      const updatedCourses = Array.isArray(data.selected_courses)
        ? data.selected_courses
        : selectedCourses.map((course) => {
            if (course.id === courseId) {
              return {
                ...course,
                assigned_day: assignedDay,
                assigned_slot: assignedSlot,
              };
            }

            if (
              assignedDay &&
              assignedSlot &&
              course.assigned_day === assignedDay &&
              course.assigned_slot === assignedSlot
            ) {
              return {
                ...course,
                assigned_day: null,
                assigned_slot: null,
              };
            }

            return course;
          });

      setSelectedCourses(updatedCourses);
      window.localStorage.setItem(
        "guestplaygolf_planner_courses",
        JSON.stringify(updatedCourses),
      );
    } catch {
      setTripError("Something went wrong assigning this course.");
    } finally {
      setIsAssigningCourse(null);
    }
  }

  async function handleCopyShareLink() {
    if (!tripId) return;

    const shareUrl = `${window.location.origin}/ireland/planner?tripId=${tripId}`;

    try {
      await window.navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2500);
    } catch {
      setTripError(
        "We could not copy the link. Please copy it from your browser address bar.",
      );
    }
  }

  async function handleSubmitVote(courseId: number, vote: VoteValue) {
    if (!tripId || !participantId || isSubmittingVote) return;

    setTripError("");
    setIsSubmittingVote(courseId);

    try {
      const response = await fetch("/api/trips/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: tripId,
          course_id: courseId,
          participant_id: participantId,
          vote,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTripError(data.error || "We could not save your vote.");
        return;
      }

      if (data.summary) {
        setVoteSummary(data.summary);
      }

      const nextSelectedVotes = {
        ...selectedVotes,
        [courseId]: vote,
      };

      setSelectedVotes(nextSelectedVotes);
      window.localStorage.setItem(
        `guestplaygolf_trip_votes_${tripId}`,
        JSON.stringify(nextSelectedVotes),
      );
    } catch {
      setTripError("Something went wrong saving your vote.");
    } finally {
      setIsSubmittingVote(null);
    }
  }

  function updateTripDay(dayNumber: number, dayType: DayType) {
    setTripDays((currentDays) =>
      currentDays.map((day) =>
        day.dayNumber === dayNumber
          ? {
              ...day,
              dayType,
            }
          : day,
      ),
    );
  }

  function getChooseCoursesHref() {
    const params = new URLSearchParams();

    params.set("country", "Ireland");
    params.set("source", "planner");
    params.set("planner", "true");
    params.set("where", baseInput.trim());

    if (tripId) {
      params.set("tripId", tripId);
    }

    return `/filters?${params.toString()}`;
  }

  if (isLoadingTrip) {
    return (
      <main className="min-h-screen bg-stone-100 px-5 py-10 text-slate-800">
        <div className="mx-auto max-w-[480px] rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200/70">
          <p className="text-sm font-semibold text-slate-900">
            Loading your trip...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pt-8 pb-10 text-white">
        <div className="relative z-10 mx-auto max-w-[480px] text-left lg:max-w-[1120px]">
          <div className="text-[15px] font-semibold uppercase tracking-[0.28em] text-white/85">
            GuestPlayGolf
          </div>

          <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.18em] text-emerald-100/80">
            Irish Golf Trip Planner
          </p>

          <h1 className="mt-4 text-[32px] font-bold leading-[1.08] text-white">
            Plan your Irish golf trip
          </h1>

          <p className="mt-4 text-[15px] text-white/85">
            Build a flexible day-by-day golf itinerary around where you are
            staying.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] overflow-x-hidden px-4 py-6 text-left lg:max-w-[1120px] lg:px-5">
        {step === "setup" && (
          <div className="mx-auto max-w-[1120px]">
            <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[21px] font-semibold text-slate-900">
                    My Trips
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Open a saved trip or start a new one below.
                  </p>
                </div>

                {isLoadingTrips && (
                  <span className="text-xs font-semibold text-slate-500">
                    Loading...
                  </span>
                )}
              </div>

              {!isLoadingTrips && savedTrips.length === 0 && (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  No saved trips yet.
                </p>
              )}

              {savedTrips.length > 0 && (
                <div className="mt-4 grid gap-3">
                  {savedTrips.map((savedTrip) => {
                    const courseCount = Array.isArray(
                      savedTrip.selected_courses,
                    )
                      ? savedTrip.selected_courses.length
                      : 0;

                    return (
                      <div
                        key={savedTrip.trip_id}
                        className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {savedTrip.trip_name || "Untitled trip"}
                            </div>

                            <p className="mt-1 text-sm text-slate-600">
                              {[
                                getShortPlaceName(savedTrip.base_location),
                                savedTrip.month_of_travel,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {courseCount} course{courseCount === 1 ? "" : "s"}{" "}
                              · {savedTrip.number_of_golf_days || 0} golf day
                              {savedTrip.number_of_golf_days === 1 ? "" : "s"}
                            </p>

                            {savedTrip.trip_code && (
                              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                Trip Code: {savedTrip.trip_code}
                              </p>
                            )}
                          </div>

                          <Link
                            href={`/ireland/planner?tripId=${savedTrip.trip_id}`}
                            className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-semibold text-white no-underline"
                          >
                            Open
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
            <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-[19px] font-semibold text-slate-900">
                Have a trip code?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter a shared trip code to open a trip, even if it is not saved
                on this device.
              </p>

              <div className="mt-4 grid gap-3">
                <input
                  value={openTripCode}
                  onChange={(event) => {
                    setOpenTripCode(event.target.value.toUpperCase());
                    setTripError("");
                  }}
                  placeholder="Example: ABC123"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 outline-none placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-700"
                />

                <button
                  type="button"
                  onClick={handleOpenTripByCode}
                  disabled={!openTripCode.trim() || isOpeningTripCode}
                  className="rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isOpeningTripCode ? "Opening trip..." : "Open Trip"}
                </button>
              </div>
            </div>

            </div>
          </div>

            <div className="min-w-0 max-w-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-[21px] font-semibold text-slate-900">
                Tell us about your trip
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your base is the anchor of the trip. We use it to suggest nearby
                courses and estimate distance.
              </p>

              <div className="mt-5 grid gap-5">
                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    Where are you staying?
                  </label>

                  <input
                    value={baseInput}
                    onChange={(event) => {
                      setBaseInput(event.target.value);
                      setBaseError("");
                      setTripError("");
                    }}
                    placeholder="Example: Lahinch, Killarney, Dublin Airport"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickBases.map((base) => (
                      <button
                        key={base}
                        type="button"
                        onClick={() => {
                          setBaseInput(base);
                          setBaseError("");
                          setTripError("");
                        }}
                        className={`rounded-full border px-4 py-2.5 text-sm font-medium ${
                          baseInput === base
                            ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                            : "border-slate-300 bg-white text-slate-700 hover:border-emerald-700"
                        }`}
                      >
                        {base}
                      </button>
                    ))}
                  </div>

                  {baseError && (
                    <p className="mt-3 text-sm leading-6 text-red-600">
                      {baseError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    Trip name
                  </label>

                  <input
                    value={tripName}
                    onChange={(event) => {
                      setTripName(event.target.value);
                      setTripError("");
                    }}
                    placeholder="Example: Dave’s Ireland Golf Trip"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    Month of travel
                  </label>

                  <select
                    value={month}
                    onChange={(event) => setMonth(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-700"
                  >
                    {months.map((monthOption) => (
                      <option key={monthOption} value={monthOption}>
                        {monthOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    Golf Ireland member?
                  </label>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["Yes", "No", "Not sure"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setGolfIrelandMember(option)}
                        className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                          golfIrelandMember === option
                            ? "bg-emerald-800 text-white"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    Number of golfers
                  </label>

                  <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setNumberOfGolfers((current) =>
                          Math.max(1, current - 1),
                        )
                      }
                      className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                    >
                      -
                    </button>

                    <div className="text-[18px] font-semibold text-slate-900">
                      {numberOfGolfers}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setNumberOfGolfers((current) =>
                          Math.min(32, current + 1),
                        )
                      }
                      className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    Number of golf days
                  </label>

                  <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setNumberOfGolfDays((current) =>
                          Math.max(1, current - 1),
                        )
                      }
                      className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                    >
                      -
                    </button>

                    <div className="text-[18px] font-semibold text-slate-900">
                      {numberOfGolfDays}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setNumberOfGolfDays((current) =>
                          Math.min(10, current + 1),
                        )
                      }
                      className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {tripError && (
                  <p className="text-sm leading-6 text-red-600">{tripError}</p>
                )}

                <button
                  type="button"
                  disabled={!isReadyToStart}
                  onClick={handleStartPlanning}
                  className="rounded-full bg-slate-900 px-5 py-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isCreatingTrip ? "Creating your trip..." : "Start Planning"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "planner" && geocodedBase && (
          <div className="grid w-full min-w-0 max-w-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start">
            <div className="min-w-0 max-w-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/70 lg:col-span-2">
              <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-5 text-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-emerald-100/80">
                      My Trip
                    </p>

                    <h2 className="mt-2 text-[24px] font-bold leading-tight text-white">
                      {tripName}
                    </h2>

                    <div className="mt-4 grid gap-2 text-sm text-white/90">
                      <div>📍 {baseInput}</div>
                      <div>📅 {month}</div>
                      <div>👥 {numberOfGolfers} golfers</div>
                      {tripCode && <div>🔑 Trip Code: {tripCode}</div>}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    {tripId && (
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm"
                      >
                        {shareCopied ? "Copied ✓" : "Share"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setStep("setup")}
                      className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/90"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span>Golf Ireland: {golfIrelandMember}</span>
                {tripCode && (
                  <span className="font-semibold uppercase tracking-wide text-emerald-800">
                    Trip Code: {tripCode}
                  </span>
                )}
              </div>
            </div>

            <div className="min-w-0 max-w-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                    Itinerary builder
                  </p>

                  <h2 className="mt-1 text-[20px] font-semibold text-slate-900">
                    Trip Structure
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Assign courses to each day. We flag any possible
                    visitor-access issues based on weekday or weekend play.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {tripDays.map((day) => {
                  const morningCourse = getAssignedCourse(
                    selectedCourses,
                    day.dayNumber,
                    "Morning",
                  );
                  const afternoonCourse = getAssignedCourse(
                    selectedCourses,
                    day.dayNumber,
                    "Afternoon",
                  );
                  const assignedCourses = [
                    morningCourse,
                    afternoonCourse,
                  ].filter((course): course is PlannerCourse =>
                    Boolean(course),
                  );

                  return (
                    <div
                      key={day.dayNumber}
                      className="rounded-3xl border border-slate-200 bg-stone-50 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-[18px] font-semibold text-slate-900">
                            Day {day.dayNumber}
                          </div>

                          <p className="mt-1 text-sm text-slate-600">
                            {assignedCourses.length === 0
                              ? "No course assigned yet"
                              : assignedCourses.length === 1
                                ? "One round planned"
                                : "Two rounds planned"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(["Weekday", "Weekend"] as const).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                updateTripDay(day.dayNumber, option)
                              }
                              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                                day.dayType === option
                                  ? "bg-emerald-800 text-white"
                                  : "border border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        {assignedCourses.length === 0 && (
                          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                            <div className="text-sm font-semibold text-slate-900">
                              Not assigned
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              Choose a course below and assign it to this day.
                            </p>
                          </div>
                        )}

                        {assignedCourses.length === 1 &&
                          (() => {
                            const assignedCourse = assignedCourses[0];
                            const validation = getAccessValidation(
                              assignedCourse,
                              day.dayType,
                            );

                            return (
                              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="min-w-0">
                                    <div className="text-[17px] font-bold text-slate-900">
                                      {assignedCourse.course_name}
                                    </div>

                                    <p className="mt-1 text-sm text-slate-600">
                                      {[
                                        assignedCourse.course_type,
                                        assignedCourse.price_range,
                                      ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                    </p>
                                  </div>

                                  <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                      validation.isValid
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {validation.isValid ? "✓" : "⚠"}
                                  </span>
                                </div>

                                <p
                                  className={`mt-2 text-xs font-semibold ${
                                    validation.isValid
                                      ? "text-emerald-700"
                                      : "text-amber-700"
                                  }`}
                                >
                                  {validation.message}
                                </p>
                              </div>
                            );
                          })()}

                        {assignedCourses.length > 1 &&
                          (["Morning", "Afternoon"] as const).map((slot) => {
                            const assignedCourse =
                              slot === "Morning"
                                ? morningCourse
                                : afternoonCourse;
                            const validation = assignedCourse
                              ? getAccessValidation(assignedCourse, day.dayType)
                              : null;

                            return (
                              <div
                                key={`${day.dayNumber}-${slot}`}
                                className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
                              >
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  {slot}
                                </div>

                                {assignedCourse && validation ? (
                                  <div className="mt-2">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                      <div className="min-w-0">
                                        <div className="text-[16px] font-bold text-slate-900">
                                          {assignedCourse.course_name}
                                        </div>

                                        <p className="mt-1 text-sm text-slate-600">
                                          {[
                                            assignedCourse.course_type,
                                            assignedCourse.price_range,
                                          ]
                                            .filter(Boolean)
                                            .join(" · ")}
                                        </p>
                                      </div>

                                      <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                          validation.isValid
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-amber-100 text-amber-800"
                                        }`}
                                      >
                                        {validation.isValid ? "✓" : "⚠"}
                                      </span>
                                    </div>

                                    <p
                                      className={`mt-2 text-xs font-semibold ${
                                        validation.isValid
                                          ? "text-emerald-700"
                                          : "text-amber-700"
                                      }`}
                                    >
                                      {validation.message}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="mt-2 text-sm text-slate-500">
                                    Not assigned
                                  </p>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href={getChooseCoursesHref()}
                className="mt-5 block rounded-full bg-emerald-800 px-5 py-4 text-center text-sm font-semibold text-white no-underline"
              >
                Choose Courses ({selectedCourses.length} selected)
              </Link>
            </div>

            <div className="min-w-0 max-w-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-[18px] font-semibold text-slate-900">
                Selected Courses ({selectedCourses.length})
              </h2>

              {selectedCourses.length === 0 ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No courses selected yet.
                </p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {selectedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900">
                            {course.course_name}
                          </div>

                          <p className="mt-1 text-sm text-slate-600">
                            {[
                              course.course_type,
                              course.region,
                              course.price_range,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          {typeof course.distance === "number" && (
                            <p className="mt-1 text-sm text-slate-500">
                              {course.distance.toFixed(1)} km from base
                            </p>
                          )}

                          <div className="mt-3">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Assignment
                            </label>

                            <select
                              value={getAssignmentValue(course)}
                              onChange={(event) =>
                                handleAssignCourse(
                                  course.id,
                                  event.target.value,
                                )
                              }
                              disabled={isAssigningCourse === course.id}
                              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-700 disabled:opacity-50"
                            >
                              <option value="unassigned">Not Assigned</option>
                              {tripDays.flatMap((day) =>
                                (["Morning", "Afternoon"] as const).map(
                                  (slot) => (
                                    <option
                                      key={`${day.dayNumber}-${slot}`}
                                      value={`${day.dayNumber}-${slot}`}
                                    >
                                      Day {day.dayNumber} {slot}
                                    </option>
                                  ),
                                ),
                              )}
                            </select>
                          </div>

                          <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Group vote
                              </div>

                              <div className="text-xs font-semibold text-slate-500">
                                {(() => {
                                  const summary = getCourseVoteSummary(voteSummary, course.id);
                                  return `${summary.must_play + summary.happy_to_play + summary.not_for_me} votes`;
                                })()}
                              </div>
                            </div>

                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                              {voteOptions.map((option) => {
                                const isSelected =
                                  selectedVotes[course.id] === option.value;

                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                      handleSubmitVote(course.id, option.value)
                                    }
                                    disabled={isSubmittingVote === course.id}
                                    className={`rounded-2xl px-3 py-2.5 text-left text-xs font-semibold transition disabled:opacity-60 ${
                                      isSelected
                                        ? "bg-emerald-800 text-white shadow-sm"
                                        : "bg-stone-50 text-slate-700 ring-1 ring-slate-200"
                                    }`}
                                  >
                                    <span className="block text-base leading-none">
                                      {option.emoji}
                                    </span>
                                    <span className="mt-1 block">
                                      {option.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                              <span className="rounded-full bg-stone-50 px-3 py-1 ring-1 ring-slate-200">
                                🔥 {getCourseVoteSummary(voteSummary, course.id).must_play}
                              </span>
                              <span className="rounded-full bg-stone-50 px-3 py-1 ring-1 ring-slate-200">
                                👍 {getCourseVoteSummary(voteSummary, course.id).happy_to_play}
                              </span>
                              <span className="rounded-full bg-stone-50 px-3 py-1 ring-1 ring-slate-200">
                                👎 {getCourseVoteSummary(voteSummary, course.id).not_for_me}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(course.id)}
                          disabled={isRemovingCourse === course.id}
                          className="self-start rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
                        >
                          {isRemovingCourse === course.id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedCourses.length > 0 && (
              <div className="min-w-0 max-w-full overflow-hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:col-span-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                      Course shortlist
                    </p>

                    <h2 className="mt-1 text-[20px] font-semibold text-slate-900">
                      Compare Courses
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Compare your selected courses side-by-side by type, price,
                      access, assignment and distance.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-center ring-1 ring-emerald-100">
                    <div className="text-[20px] font-bold text-emerald-900">
                      {selectedCourses.length}
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      Courses
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:hidden">
                  {selectedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"
                    >
                      <div className="text-sm font-semibold text-slate-900">
                        {course.course_name}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {course.course_type || "—"}
                        </span>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          {course.price_range || "—"}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                          {course.independent_guest_days || "—"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                          <div className="font-semibold uppercase tracking-wide text-slate-400">
                            Day
                          </div>
                          <div className="mt-1 font-semibold text-slate-800">
                            {getAssignmentLabel(course)}
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                          <div className="font-semibold uppercase tracking-wide text-slate-400">
                            Distance
                          </div>
                          <div className="mt-1 font-semibold text-slate-800">
                            {typeof course.distance === "number"
                              ? `${course.distance.toFixed(1)} km`
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 hidden overflow-x-auto rounded-2xl ring-1 ring-slate-200 md:block">
                  <table className="w-full min-w-[720px] border-collapse bg-white text-left text-sm">
                    <thead className="bg-stone-50">
                      <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-3 font-semibold">Course</th>
                        <th className="px-4 py-3 font-semibold">Type</th>
                        <th className="px-4 py-3 font-semibold">Price</th>
                        <th className="px-4 py-3 font-semibold">Access</th>
                        <th className="px-4 py-3 font-semibold">Day</th>
                        <th className="px-4 py-3 font-semibold">Distance</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedCourses.map((course) => (
                        <tr
                          key={course.id}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-4 py-4 font-semibold text-slate-900">
                            {course.course_name}
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {course.course_type || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                              {course.price_range || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                              {course.independent_guest_days || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-700">
                            {getAssignmentLabel(course)}
                          </td>
                          <td className="px-4 py-4 font-semibold text-slate-700">
                            {typeof course.distance === "number"
                              ? `${course.distance.toFixed(1)} km`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="min-w-0 max-w-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Overview
                </p>

                <h2 className="mt-1 text-[20px] font-semibold text-slate-900">
                  Trip Summary
                </h2>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 p-3 text-center ring-1 ring-slate-200">
                  <div className="text-[20px] font-bold text-slate-900">
                    {selectedCourses.length}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Courses
                  </div>
                </div>

                <div className="rounded-2xl bg-stone-50 p-3 text-center ring-1 ring-slate-200">
                  <div className="text-[20px] font-bold text-slate-900">
                    {numberOfGolfDays}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Days
                  </div>
                </div>

                <div className="rounded-2xl bg-stone-50 p-3 text-center ring-1 ring-slate-200">
                  <div className="text-[20px] font-bold text-slate-900">
                    {averageDistance === null
                      ? "—"
                      : `${averageDistance.toFixed(1)} km`}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Avg distance
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-[13px] font-semibold text-slate-500">
                  Course mix
                </div>
                <div className="mt-1 text-[18px] font-bold text-slate-900">
                  {courseMix}
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <div className="text-[13px] font-semibold text-emerald-800">
                  Green Fee Guide
                </div>

                {greenFeeEstimate ? (
                  <div className="mt-2 grid gap-2">
                    <div className="text-[22px] font-bold text-slate-900">
                      {formatEuroAmount(greenFeeEstimate.perGolferLow)} -{" "}
                      {formatEuroAmount(greenFeeEstimate.perGolferHigh)}
                    </div>

                    <p className="text-xs leading-5 text-slate-600">
                      Per golfer guide only. Actual green fees can vary by
                      weekday/weekend, season, tee time and booking conditions.
                    </p>

                    {greenFeeEstimate.pricedCourses <
                      selectedCourses.length && (
                      <p className="text-xs leading-5 text-slate-600">
                        Guide excludes{" "}
                        {selectedCourses.length -
                          greenFeeEstimate.pricedCourses}{" "}
                        course
                        {selectedCourses.length -
                          greenFeeEstimate.pricedCourses ===
                        1
                          ? ""
                          : "s"}{" "}
                        without a price band.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Add courses with price bands to estimate green fees.
                  </p>
                )}
              </div>

              {tripError && (
                <p className="mt-4 text-sm leading-6 text-red-600">
                  {tripError}
                </p>
              )}
            </div>

            <div className="min-w-0 max-w-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Coming soon
              </p>

              <h2 className="mt-1 text-[20px] font-semibold text-slate-900">
                Accommodation Partners
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                A curated stay section for golf trips is being prepared. Future
                listings will be reserved for selected GuestPlayGolf partners.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-8">
          <h2 className="text-[24px] font-semibold text-slate-900">
            Ireland Golf Trip Planner
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Planning a golf trip to Ireland can be challenging, particularly
            when comparing courses across different regions. The GuestPlayGolf
            Ireland Golf Trip Planner helps golfers build a personalised
            itinerary based on where they are staying, the number of golf days
            available and the type of courses they want to play.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Start by choosing a base location such as Dublin, Cork, Killarney,
            Lahinch, Shannon, Galway or Belfast. GuestPlayGolf then helps you
            compare nearby courses, estimate travel distances and organise your
            trip day by day.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            The planner allows golf groups to shortlist courses, compare course
            types, estimate green fees and create a shared itinerary. Each
            course can be assigned to a specific day, making it easy to
            visualise your trip before booking accommodation or tee times.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Golf groups can also share trips with friends and vote on
            shortlisted courses. This makes it easier to agree on which courses
            should be included in the final itinerary while keeping all trip
            information in one place.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Whether you are planning a links golf trip along Ireland's west
            coast, a golf weekend near Dublin or a multi-day golf holiday across
            several regions, the GuestPlayGolf Trip Planner provides a simple
            way to organise and compare your options.
          </p>
        </div>
      </section>
    </main>
  );
}