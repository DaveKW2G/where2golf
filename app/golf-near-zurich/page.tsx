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
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-7 pt-6 text-white">
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

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-[18px] font-semibold">{courseCount}</span>
            <span className="text-sm text-emerald-100">
              courses around Zurich
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Zurich
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Zurich is the most practical base for golf in Switzerland, with a
            strong concentration of courses within easy reach of the city. The
            surrounding regions — including Zug, Aargau and Schwyz — offer a
            wide mix of layouts, typically more playable and less extreme than
            alpine courses, making the area ideal for consistent rounds and
            short-notice golf.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf around Zurich is defined by accessibility and reliability
            rather than altitude or remoteness. Many courses are set in
            parkland-style terrain or gently rolling landscapes, offering
            enjoyable, well-maintained conditions without the travel complexity
            of mountain regions. This makes Zurich particularly well suited for
            weekend golf trips or combining golf with business travel.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Zurich is also the best-connected golf hub in the country, with
            direct international access via Zurich Airport and fast train links
            across Switzerland. Most courses can be reached within 30–60
            minutes. GuestPlayGolf helps you quickly identify where independent
            guests can play, when access is available and what each course
            requires.
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
            Explore more golf in Switzerland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Planning golf beyond Zurich? Explore more Swiss golf hubs and
            regional guides for independent guests.
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href="/switzerland/zh"
              className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100"
            >
              Golf in Zurich →
            </Link>

            <Link
              href="/golf-near-lucerne"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Lucerne →
            </Link>

            <Link
              href="/golf-near-basel"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Basel →
            </Link>

            <Link
              href="/golf-near-geneva"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Geneva →
            </Link>

            <Link
              href="/golf-near-lausanne"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Lausanne →
            </Link>

            <Link
              href="/golf-in-the-swiss-alps"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf in the Swiss Alps →
            </Link>

            <Link
              href="/switzerland"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white no-underline"
            >
              Browse Switzerland →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}