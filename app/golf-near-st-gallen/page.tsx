import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const stGallenLat = 47.4245
const stGallenLng = 9.3767

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near St. Gallen | Play as an independent guest",
  description:
    "Find golf courses near St. Gallen where independent guests can play. Compare guest access, handicap requirements, distance from St. Gallen and course details.",
  alternates: {
    canonical: "/golf-near-st-gallen",
  },
  openGraph: {
    title: "Golf near St. Gallen | GuestPlayGolf",
    description:
      "Find golf courses near St. Gallen where independent guests can play, with clear access and handicap information.",
    url: `${siteUrl}/golf-near-st-gallen`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const stGallenRegions = ["SG", "TG", "AI", "AR"]

const regionNames: Record<string, string> = {
  SG: "St. Gallen",
  TG: "Thurgau",
  AI: "Appenzell Innerrhoden",
  AR: "Appenzell Ausserrhoden",
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

export default async function GolfNearStGallenPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", stGallenRegions)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(
                stGallenLat,
                stGallenLng,
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
            Golf near St. Gallen
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near St. Gallen for independent guests
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Find golf courses near St. Gallen where you can play without being a
            member of that specific club. Compare guest access, handicap
            requirements, distance from St. Gallen and course details before
            contacting the club.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses around St. Gallen
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near St. Gallen
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            St. Gallen is the main golf base for eastern Switzerland, giving
            independent guests access to courses across St. Gallen, Thurgau and
            the Appenzell region. It fills an important gap between Zurich,
            Lake Constance and the quieter eastern Swiss countryside.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf near St. Gallen often feels more regional and relaxed than the
            larger Swiss city hubs. Expect countryside settings, rolling terrain,
            practical club courses and a more local feel, with useful options for
            golfers based in eastern Switzerland or travelling towards Lake
            Constance.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            St. Gallen is well connected by rail and road, while nearby Thurgau
            and Appenzell broaden the choice of courses within a realistic day
            trip. GuestPlayGolf helps you compare guest access, handicap
            requirements and playing rules before contacting the club.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {stGallenRegions.map((region, index) => (
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
            Error loading golf courses near St. Gallen.
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {coursesWithDistance.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={stGallenLat}
              userLng={stGallenLng}
              searchParams={{ source: "st-gallen" }}
            />
          ))}
        </div>
      </section>
    </main>
  )
}