import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const lausanneLat = 46.5197
const lausanneLng = 6.6323

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Lausanne | Play as an independent guest",
  description:
    "Find golf courses near Lausanne where independent guests can play. Compare guest access, handicap requirements, distance from Lausanne and course details.",
  alternates: {
    canonical: "/golf-near-lausanne",
  },
  openGraph: {
    title: "Golf near Lausanne | GuestPlayGolf",
    description:
      "Find golf courses near Lausanne where independent guests can play, with clear access and handicap information.",
    url: `${siteUrl}/golf-near-lausanne`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const lausanneRegions = ["VD", "GE", "FR", "VS"]

const regionNames: Record<string, string> = {
  VD: "Vaud",
  GE: "Geneva",
  FR: "Fribourg",
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

export default async function GolfNearLausannePage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", lausanneRegions)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(
                lausanneLat,
                lausanneLng,
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
      {/* HERO */}
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link href="/switzerland" className="text-sm text-white/90 no-underline">
            ← Switzerland
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Golf near Lausanne
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Lausanne for independent guests
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Find golf courses near Lausanne where you can play without being a
            member of that specific club. Compare guest access, handicap
            requirements, distance from Lausanne and course details before
            contacting the club.
          </p>

          {/* IMPROVED BADGE */}
          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses around Lausanne
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[480px] px-5 py-6">
        {/* SEO BLOCK */}
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Lausanne
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Lausanne is one of the best locations in Switzerland for combining
            city access with scenic golf. Positioned on Lake Geneva, it gives you
            direct access to a high-quality mix of courses across Vaud, with
            additional options stretching towards Geneva, Fribourg and the lower
            Valais.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf around Lausanne is typically more open to independent guests
            than Geneva, while still offering strong course quality. You’ll find a
            mix of parkland layouts, elevated lake-view courses and a few more
            mountainous designs as you move into Valais — making it ideal for both
            quick local rounds and more scenic golf days.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            With excellent train connections and short driving distances, most
            courses can be reached within 30 to 60 minutes, making Lausanne one of
            the most practical bases for golf in western Switzerland.
          </p>
        </div>

        {/* REGION CHIPS */}
        <div className="mt-6 flex flex-wrap gap-2">
          {lausanneRegions.map((region, index) => (
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
            Error loading golf courses near Lausanne.
          </div>
        )}

        {/* COURSE LIST */}
        <div className="mt-6 grid gap-4">
          {coursesWithDistance.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={lausanneLat}
              userLng={lausanneLng}
            />
          ))}
        </div>
      </section>
    </main>
  )
}