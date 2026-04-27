import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const zurichLat = 47.3769
const zurichLng = 8.5417

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Zurich | Play as an independent guest",
  description:
    "Find golf courses near Zurich where independent guests can play. Compare guest access, handicap requirements, distance from Zurich and course details.",
  alternates: {
    canonical: "/golf-near-zurich",
  },
  openGraph: {
    title: "Golf near Zurich | GuestPlayGolf",
    description:
      "Find golf courses near Zurich where independent guests can play, with clear access and handicap information.",
    url: `${siteUrl}/golf-near-zurich`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const zurichAreaRegions = ["ZH", "ZG", "AG", "SZ"]

const regionNames: Record<string, string> = {
  ZH: "Zurich",
  ZG: "Zug",
  AG: "Aargau",
  SZ: "Schwyz",
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

export default async function GolfNearZurichPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", zurichAreaRegions)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(zurichLat, zurichLng, course.latitude, course.longitude)
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
            Golf near Zurich
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Zurich for independent guests
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Find golf courses near Zurich where you can play without being a
            member of that specific club. Compare guest access, handicap
            requirements, distance from Zurich and course details before
            contacting the club.
          </p>

          <div className="mt-5 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-[22px] font-semibold">{courseCount}</div>
            <div className="text-sm text-emerald-100">
              listed golf courses around Zurich
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Zurich
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Zurich is one of the most practical starting points for independent
            guest golf in Switzerland. The surrounding area includes courses in
            Zurich, Zug, Aargau and Schwyz, giving golfers a wider choice of
            guest-friendly options within day-trip distance.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            GuestPlayGolf helps you quickly see which courses welcome
            independent guests, when access is available and whether handicap
            requirements apply.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {zurichAreaRegions.map((region, index) => (
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
            Error loading golf courses near Zurich.
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {coursesWithDistance.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={zurichLat}
              userLng={zurichLng}
            />
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-base font-semibold text-slate-900">
            Playing as an independent guest near Zurich
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Many Swiss golf courses require a recognised handicap, valid golf
            membership or proof of playing ability. Access can also vary between
            weekdays and weekends, so always confirm directly with the club
            before booking.
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-base font-semibold text-slate-900">
            Explore more Swiss golf
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/switzerland/zh"
              className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white no-underline"
            >
              Golf in Zurich
            </Link>

            <Link
              href="/switzerland"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline"
            >
              Browse Switzerland
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}