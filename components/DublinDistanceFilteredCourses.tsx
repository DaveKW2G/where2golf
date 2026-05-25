"use client"

import { useState } from "react"
import CourseCard from "@/components/CourseCard"

const dublinLat = 53.3498
const dublinLng = -6.2603
const radiusOptions = [25, 50, 75, 100]

type Course = {
  id: number
  country: string
  course_name: string
  town: string
  region: string
  holes: number
  independent_guest_days: string
  season: string
  price_range?: string | null
  course_image?: string | null
  handicap_required?: boolean | null
  max_handicap?: number | null
  latitude: number
  longitude: number
  course_type?: string | null
  distance: number
}

type Props = {
  courses: Course[]
}

export default function DublinDistanceFilteredCourses({ courses }: Props) {
  const [selectedRadiusKm, setSelectedRadiusKm] = useState(100)

  const visibleCourses = courses.filter(
    (course) => course.distance <= selectedRadiusKm
  )

  return (
    <>
      <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
        <h2 className="text-lg font-semibold text-slate-900">
          Filter by distance from Dublin
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Showing {visibleCourses.length} courses within {selectedRadiusKm} km
          of Dublin.
        </p>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {radiusOptions.map((radius) => {
            const isSelected = radius === selectedRadiusKm

            return (
              <button
                key={radius}
                type="button"
                onClick={() => setSelectedRadiusKm(radius)}
                className={`rounded-2xl px-3 py-3 text-center text-sm font-semibold ring-1 ${
                  isSelected
                    ? "bg-emerald-900 text-white ring-emerald-900"
                    : "bg-slate-50 text-slate-800 ring-slate-200"
                }`}
              >
                {radius} km
              </button>
            )
          })}
        </div>
      </div>

      {visibleCourses.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm">
          No golf courses found within {selectedRadiusKm} km of Dublin.
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {visibleCourses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={dublinLat}
              userLng={dublinLng}
              searchParams={{
                country: "ireland",
                source: "dublin",
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}