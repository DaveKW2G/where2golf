import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const luganoLat = 46.0037
const luganoLng = 8.9511

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Lugano | Play as an independent guest",
  description:
    "Find golf courses near Lugano where independent guests can play. Compare guest access, handicap requirements, distance from Lugano and course details.",
  alternates: {
    canonical: "/golf-near-lugano",
  },
  openGraph: {
    title: "Golf near Lugano | GuestPlayGolf",
    description:
      "Find golf courses near Lugano where independent guests can play, with clear access and handicap information.",
    url: `${siteUrl}/golf-near-lugano`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const luganoRegions = ["TI", "GR", "UR", "VS"]

const regionNames: Record<string, string> = {
  TI: "Ticino",
  GR: "Graubünden",
  UR: "Uri",
  VS: "Valais",
}

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

export default async function GolfNearLuganoPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", luganoRegions)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(
                luganoLat,
                luganoLng,
                course.latitude,
                course.longitude
              )
            : undefined

        return {
          ...course,
          distance,
        }
      })
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)) || []

  const courseCount = coursesWithDistance.length

  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link href="/switzerland" className="text-sm text-white/90 no-underline">
            ← Switzerland
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Golf near Lugano
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Lugano for independent guests
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Find golf courses near Lugano where you can play without being a
            member of that specific club. Compare guest access, handicap
            requirements, distance from Lugano and course details before
            contacting the club.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses around Lugano
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Lugano
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Lugano is the main golf base for southern Switzerland, with access
            to courses in Ticino and selected alpine options further north.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf near Lugano has a different feel from much of Switzerland:
            warmer weather, Italian-speaking culture, lakeside scenery and
            mountain surroundings all shape the experience.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            GuestPlayGolf helps independent guests compare access rules,
            handicap requirements and course details before contacting the club,
            especially where seasons and travel distances can vary.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {luganoRegions.map((region, index) => (
            <Link
              key={region}
              href={`/switzerland/${region.toLowerCase()}`}
              className={
                index === 0
                  ? "rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white no-underline"
                  : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline"
              }
            >
              {regionNames[region]}
            </Link>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading golf courses near Lugano.
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {coursesWithDistance.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={luganoLat}
              userLng={luganoLng}
            />
          ))}
        </div>
      </section>
    </main>
  )
}