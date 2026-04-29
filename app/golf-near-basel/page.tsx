import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const baselLat = 47.5596
const baselLng = 7.5886

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Basel | Play as an independent guest",
  description:
    "Find golf courses near Basel where independent guests can play. Compare guest access, handicap requirements, distance from Basel and course details.",
  alternates: {
    canonical: "/golf-near-basel",
  },
  openGraph: {
    title: "Golf near Basel | GuestPlayGolf",
    description:
      "Find golf courses near Basel where independent guests can play, with clear access and handicap information.",
    url: `${siteUrl}/golf-near-basel`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const baselRegions = ["BS", "BL", "AG"]

const regionNames: Record<string, string> = {
  BS: "Basel-Stadt",
  BL: "Basel-Landschaft",
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

export default async function GolfNearBaselPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", baselRegions)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(baselLat, baselLng, course.latitude, course.longitude)
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
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-7 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link href="/switzerland" className="text-sm text-white/90 no-underline">
            ← Switzerland
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Golf near Basel
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Basel for independent guests
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Find golf courses near Basel where you can play without being a
            member of that specific club. Compare guest access, handicap
            requirements, distance from Basel and course details before
            contacting the club.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-[18px] font-semibold">{courseCount}</span>
            <span className="text-sm text-emerald-100">
              courses around Basel
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Basel
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Basel is a practical golf base for north-west Switzerland, with a
            compact selection of courses around the city and nearby
            Basel-Landschaft. It is not as broad a golf market as Zurich, but it
            works well for golfers who want shorter journeys, quieter regional
            clubs and straightforward access from the city.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf near Basel often feels more regional and understated, with
            established parkland-style courses and additional options extending
            into Aargau. The appeal is convenience rather than volume: fewer
            courses, but several realistic choices for independent guests within
            a manageable travel radius.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Basel is also one of Switzerland’s best-connected border cities,
            with access via EuroAirport Basel-Mulhouse and strong rail links
            into Switzerland, France and Germany. GuestPlayGolf helps you compare
            which nearby courses welcome independent guests, when access is
            available and what each course requires.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {baselRegions.map((region, index) => (
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
            Error loading golf courses near Basel.
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {coursesWithDistance.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={baselLat}
              userLng={baselLng}
            />
          ))}
        </div>
      </section>
    </main>
  )
}