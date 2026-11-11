"use client";

import "leaflet/dist/leaflet.css";

import Link from "next/link";
import { hasCoordinates } from "@/lib/course-explorer";
import { rememberCourseReturnTo } from "@/lib/course-navigation";
import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

type MapCourse = {
  id: number;
  course_name: string;
  town?: string | null;
  region?: string | null;
  holes?: number | null;
  price_range?: string | null;
  course_type?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type CountyCourseMapProps = {
  courses: MapCourse[];
  initialCenter: [number, number];
  highlightedCourseIds?: number[];
  onAddCourse?: (courseId: number) => void;
};

function FitCourses({
  courses,
  initialCenter,
}: {
  courses: MapCourse[];
  initialCenter: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();

      const points = courses
        .map((course) => {
          const lat = Number(course.latitude);
          const lng = Number(course.longitude);

          if (
            !hasCoordinates(course)
          ) {
            return null;
          }

          return [lat, lng] as [number, number];
        })
        .filter(
          (
            point,
          ): point is [number, number] =>
            Boolean(point),
        );

      if (points.length === 0) {
        map.setView(initialCenter, 9);
        return;
      }

      if (points.length === 1) {
        map.setView(points[0], 11);
        return;
      }

      map.fitBounds(points, {
        padding: [30, 30],
        maxZoom: 11,
      });
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [courses, initialCenter, map]);

  return null;
}

export default function CountyCourseMap({
  courses,
  initialCenter,
  highlightedCourseIds = [],
  onAddCourse,
}: CountyCourseMapProps) {
  const mappedCourses = courses.filter(
    (course) => {
      return (
        hasCoordinates(course)
      );
    },
  );

  if (mappedCourses.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
        Map locations are not currently available for
        these courses.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/70">
      {mappedCourses.length < courses.length && <p className="p-4 text-sm text-slate-600">{courses.length - mappedCourses.length} matching courses have no map location. View the list to see all results.</p>}
      <MapContainer
        center={initialCenter}
        zoom={9}
        scrollWheelZoom
        className="h-[520px] w-full"
        style={{
          height: "520px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitCourses
          courses={mappedCourses}
          initialCenter={initialCenter}
        />

        {mappedCourses.map((course) => {
          const lat = Number(course.latitude);
          const lng = Number(course.longitude);
          const isShortlisted = highlightedCourseIds.includes(course.id);

          return (
            <CircleMarker
              key={course.id}
              center={[lat, lng]}
              radius={isShortlisted ? 12 : 9}
              pathOptions={{
                color: isShortlisted ? "#92400e" : "#065f46",
                fillColor: isShortlisted ? "#fbbf24" : "#10b981",
                fillOpacity: 0.9,
                weight: isShortlisted ? 3 : 2,
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <div className="font-semibold text-slate-900">
                    {course.course_name}
                  </div>

                  {course.town && (
                    <div className="mt-1 text-sm text-slate-600">
                      {course.town}
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap gap-1 text-xs text-slate-600">
                    {course.course_type && (
                      <span>{course.course_type}</span>
                    )}

                    {course.holes && (
                      <span>
                        · {course.holes} holes
                      </span>
                    )}

                    {course.price_range && (
                      <span>
                        · {course.price_range}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    onClick={() => rememberCourseReturnTo(course.id)}
                    className="mt-3 inline-block font-semibold text-emerald-700 no-underline"
                  >
                    View course →
                  </Link>
                  {!isShortlisted && onAddCourse && (
                    <button
                      type="button"
                      onClick={() => onAddCourse(course.id)}
                      className="mt-2 block rounded-full bg-emerald-800 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Add to Trip
                    </button>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
