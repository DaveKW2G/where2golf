"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import CourseCard from "@/components/CourseCard";

const CountyCourseMap = dynamic(
  () => import("@/components/CountyCourseMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] items-center justify-center rounded-3xl bg-white text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/70">
        Loading map…
      </div>
    ),
  },
);

export type CountyCourse = {
  id: number;
  country?: string | null;
  course_name: string;
  town?: string | null;
  region?: string | null;
  holes?: number | null;
  independent_guest_days?: string | null;
  season?: string | null;
  price_range?: string | null;
  course_image?: string | null;
  handicap_required?: string | boolean | null;
  max_handicap?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  course_type?: string | null;
};

type CountyCourseExplorerProps = {
  courses: CountyCourse[];
  countyName: string;
  source: string;
  initialCenter: [number, number];
};

const priceOptions = [
  {
    value: "€",
    label: "€",
  },
  {
    value: "€€",
    label: "€€",
  },
  {
    value: "€€€",
    label: "€€€",
  },
  {
    value: "€€€€",
    label: "€€€€",
  },
  {
    value: "€€€€€",
    label: "€€€€€",
  },
];

const courseTypeOptions = [
  "Links",
  "Parkland",
  "Heathland",
];

const holesOptions = [
  {
    value: "9",
    label: "9 holes",
  },
  {
    value: "18",
    label: "18 holes",
  },
];

export default function CountyCourseExplorer({
  courses,
  countyName,
  source,
  initialCenter,
}: CountyCourseExplorerProps) {
  const [price, setPrice] = useState("");
  const [courseType, setCourseType] = useState("");
  const [holes, setHoles] = useState("");
  const [view, setView] = useState<"list" | "map">("list");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (
        price &&
        course.price_range?.trim() !== price
      ) {
        return false;
      }

      if (
        courseType &&
        course.course_type?.trim().toLowerCase() !==
          courseType.toLowerCase()
      ) {
        return false;
      }

      if (
        holes &&
        String(course.holes || "").trim() !== holes
      ) {
        return false;
      }

      return true;
    });
  }, [courses, price, courseType, holes]);

  const hasFilters = Boolean(
    price || courseType || holes,
  );

  const returnTo = `/${source}`;

  function clearFilters() {
    setPrice("");
    setCourseType("");
    setHoles("");
  }

  return (
    <div>
      <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 lg:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <label className="text-sm font-semibold text-slate-700">
              Price
              <select
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-emerald-600"
              >
                <option value="">
                  All prices
                </option>

                {priceOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Course type
              <select
                value={courseType}
                onChange={(event) =>
                  setCourseType(event.target.value)
                }
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-emerald-600"
              >
                <option value="">
                  All types
                </option>

                {courseTypeOptions.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Holes
              <select
                value={holes}
                onChange={(event) =>
                  setHoles(event.target.value)
                }
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-emerald-600"
              >
                <option value="">
                  All holes
                </option>

                {holesOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-800"
              >
                Clear filters
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setView((current) =>
                  current === "list"
                    ? "map"
                    : "list",
                )
              }
              className="rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              {view === "list"
                ? "View map"
                : "View list"}
            </button>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
          Showing{" "}
          <strong className="font-semibold text-slate-800">
            {filteredCourses.length}
          </strong>{" "}
          of {courses.length} golf courses in{" "}
          {countyName}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
          No golf courses match those
          filters.
        </div>
      ) : view === "map" ? (
        <CountyCourseMap
          courses={filteredCourses}
          source={source}
          initialCenter={initialCenter}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              country={
                course.country || "Ireland"
              }
              course_name={course.course_name}
              town={course.town || ""}
              region={course.region || ""}
              holes={
                course.holes ?? undefined
              }
              independent_guest_days={
                course.independent_guest_days ??
                undefined
              }
              price_range={
                course.price_range ?? undefined
              }
              course_type={
                course.course_type ?? undefined
              }
              course_image={
                course.course_image ?? undefined
              }
              latitude={
                course.latitude ?? undefined
              }
              longitude={
                course.longitude ?? undefined
              }
              max_handicap={
                course.max_handicap ?? undefined
              }
              searchParams={{
                country: "ireland",
                source,
                returnTo,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}