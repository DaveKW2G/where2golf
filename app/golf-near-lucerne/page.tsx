import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const lucerneLat = 47.0502
const lucerneLng = 8.3093

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Lucerne | Independent guest golf in central Switzerland",
  description:
    "Find golf courses near Lucerne where independent guests can play. Compare distance, guest access, handicap requirements, seasonality and course details.",
  alternates: {
    canonical: "/golf-near-lucerne",
  },
  openGraph: {
    title: "Golf near Lucerne | GuestPlayGolf",
    description:
      "Find golf courses near Lucerne where independent guests can play, with clear access, handicap and distance information.",
    url: `${siteUrl}/golf-near-lucerne`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const lucerneRegions = ["LU", "ZG", "SZ", "AG"]

const regionNames: Record<string, string> = {
  LU: "Lucerne",
  ZG: "Zug",
  SZ: "Schwyz",
  AG: "Aargau",
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

export default async function GolfNearLucernePage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", lucerneRegions)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(
                lucerneLat,
                lucerneLng,
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
            Golf near Lucerne
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Lucerne for independent guests
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Find golf courses around Lucerne where independent guests can play.
            Compare distance from the city, guest access, handicap requirements,
            seasonality and course details before contacting the club.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses around Lucerne
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Lucerne
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Lucerne is one of the most useful starting points for golf in central
            Switzerland. From the city, independent guests can compare courses
            around Lucerne itself, nearby Zug, Schwyz and parts of Aargau without
            needing to search each club separately.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf near Lucerne has a different feel from golf near Basel or
            Zurich. The area is more scenic and spread out, with lake settings,
            rolling countryside and mountain views often shaping the experience.
            For many golfers, the appeal is not just convenience but the setting
            of the round.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Because Lucerne sits between the Swiss Plateau and the alpine
            cantons, travel time and seasonality can vary more than in flatter
            parts of Switzerland. GuestPlayGolf helps you check which nearby
            courses are realistic for independent guest play before you contact
            the club.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {lucerneRegions.map((region, index) => (
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
            Error loading golf courses near Lucerne.
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Golf courses near Lucerne
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            These courses are sorted by distance from Lucerne city centre and
            are included because they are relevant for independent guest golf in
            central Switzerland.
          </p>
        </div>

        <div className="mt-4 grid gap-4">
          {coursesWithDistance.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={lucerneLat}
              userLng={lucerneLng}
            />
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Explore more golf destinations in Switzerland
          </h2>

          <div className="mt-4 grid gap-3">
            <Link
              href="/golf-near-zurich"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 no-underline"
            >
              Golf near Zurich
            </Link>
            <Link
              href="/golf-near-basel"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 no-underline"
            >
              Golf near Basel
            </Link>
            <Link
              href="/golf-near-lausanne"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 no-underline"
            >
              Golf near Lausanne
            </Link>
            <Link
              href="/golf-near-geneva"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 no-underline"
            >
              Golf near Geneva
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}