"use client";

import Link from "next/link";
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
  source: string;
  initialCenter: [number, number];
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
    const points = courses
      .map((course) => {
        const lat = Number(course.latitude);
        const lng = Number(course.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        return [lat, lng] as [number, number];
      })
      .filter((point): point is [number, number] => Boolean(point));

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
  }, [courses, initialCenter, map]);

  return null;
}

export default function CountyCourseMap({
  courses,
  source,
  initialCenter,
}: CountyCourseMapProps) {
  const mappedCourses = courses.filter((course) => {
    const lat = Number(course.latitude);
    const lng = Number(course.longitude);

    return Number.isFinite(lat) && Number.isFinite(lng);
  });

  if (mappedCourses.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
        Map locations are not currently available for these courses.
      </div>
    );
  }

  const returnTo = `/${source}`;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <MapContainer
        center={initialCenter}
        zoom={9}
        scrollWheelZoom
        className="h-[520px] w-full"
        style={{ height: "520px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitCourses
          courses={mappedCourses}
          initialCenter={initialCenter}
        />

        {mappedCourses.map((course) => {
          const lat = Number(course.latitude);
          const lng = Number(course.longitude);

          const query = new URLSearchParams({
            country: "ireland",
            source,
            returnTo,
          });

          return (
            <CircleMarker
              key={course.id}
              center={[lat, lng]}
              radius={9}
              pathOptions={{
                color: "#065f46",
                fillColor: "#10b981",
                fillOpacity: 0.9,
                weight: 2,
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
                      <span>· {course.holes} holes</span>
                    )}

                    {course.price_range && (
                      <span>· {course.price_range}</span>
                    )}
                  </div>

                  <Link
                    href={`/courses/${course.id}?${query.toString()}`}
                    className="mt-3 inline-block font-semibold text-emerald-700 no-underline"
                  >
                    View course →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}