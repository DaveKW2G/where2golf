"use client";

import { useEffect, useMemo, useState } from "react";

type PlannerCourse = {
  id: number;
  course_name: string;
  town: string;
  region: string;
  holes?: number;
  independent_guest_days?: string;
  price_range?: string;
  course_type?: string;
  course_image?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
  max_handicap?: number;
};

type CourseAddToTripButtonProps = {
  course: PlannerCourse;
};

const plannerCoursesKey = "guestplaygolf_planner_courses";
const plannerTripIdKey = "guestplaygolf_trip_id";

export default function CourseAddToTripButton({
  course,
}: CourseAddToTripButtonProps) {
  const [activeTripId, setActiveTripId] = useState("");
  const [isAddedToPlanner, setIsAddedToPlanner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const cleanCourse = useMemo(
    () => ({
      ...course,
      course_name: course.course_name?.trim(),
      town: course.town?.trim(),
      region: course.region?.trim(),
      independent_guest_days: course.independent_guest_days?.trim(),
      price_range: course.price_range?.trim(),
      course_type: course.course_type?.trim(),
    }),
    [course],
  );

  useEffect(() => {
    const storedTripId = window.localStorage.getItem(plannerTripIdKey) || "";
    setActiveTripId(storedTripId);

    try {
      const existing = window.localStorage.getItem(plannerCoursesKey);
      const courses = existing ? (JSON.parse(existing) as PlannerCourse[]) : [];
      setIsAddedToPlanner(
        courses.some((existingCourse) => existingCourse.id === course.id),
      );
    } catch {
      setIsAddedToPlanner(false);
    }
  }, [course.id]);

  async function handleAddToTrip() {
    if (isSaving) return;

    if (!activeTripId) {
      window.location.href = "/ireland/planner";
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/trips/add-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: activeTripId,
          course: cleanCourse,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.details || data.error || "Could not add this course.");
        return;
      }

      const updatedCourses = Array.isArray(data.selected_courses)
        ? data.selected_courses
        : [cleanCourse];

      window.localStorage.setItem(
        plannerCoursesKey,
        JSON.stringify(updatedCourses),
      );

      setIsAddedToPlanner(true);
      setMessage("Added to golf trip");
    } catch {
      setMessage("Could not add this course. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-slate-900">
            Planning a golf trip?
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Add this course to your saved trip and compare it with the rest of
            your itinerary.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToTrip}
        disabled={isSaving}
        className={`mt-4 w-full rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70 ${
          isAddedToPlanner
            ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
            : "bg-emerald-800 text-white"
        }`}
      >
        {isSaving
          ? "Adding..."
          : isAddedToPlanner
            ? "Added to Golf Trip"
            : activeTripId
              ? "Add to Golf Trip"
              : "Start Planner"}
      </button>

      {message && (
        <p className="mt-2 text-center text-xs font-semibold text-emerald-800">
          {message}
        </p>
      )}
    </div>
  );
}
