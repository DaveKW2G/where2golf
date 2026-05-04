import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const baselLat = 47.5596
const baselLng = 7.5886

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Basel | Independent guest golf in north-west Switzerland",
  description:
    "Find golf courses near Basel where independent guests can play. Compare distance, guest access, handicap requirements, seasonality and course details.",
  alternates: {
    canonical: "/golf-near-basel",
  },
  openGraph: {
    title: "Golf near Basel | GuestPlayGolf",
    description:
      "Find golf courses near Basel where independent guests can play, with clear access, handicap and distance information.",
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
            Find golf courses around Basel where independent guests can play.
            Compare distance from the city, guest access, handicap requirements,
            seasonality and course details before contacting the club.
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
            Basel is one of Switzerland’s most practical golf bases for players
            in the north-west of the country. The city sits close to
            Basel-Landschaft and Aargau, giving independent guests a compact
            choice of Swiss courses within a realistic driving distance.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf near Basel is different from golf near Zurich or Geneva. The
            choice is smaller, but the area can work well for golfers who value
            shorter journeys, quieter regional clubs and straightforward access
            from the city rather than a large volume of courses.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Because Basel is close to France and Germany, golfers may also think
            about cross-border options. GuestPlayGolf focuses here on Swiss golf
            courses where independent guests can check access, handicap
            expectations, likely seasonality and course details in one place.
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

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Golf courses near Basel
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            These courses are sorted by distance from Basel city centre and are
            included because they are relevant for independent guest golf in the
            Basel area.
          </p>
        </div>

        <div className="mt-4 grid gap-4">
          {coursesWithDistance.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={baselLat}
              userLng={baselLng}
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
              href="/golf-near-lucerne"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 no-underline"
            >
              Golf near Lucerne
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