import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

// Adare Manor coordinates — Ryder Cup venue near Limerick
const adareManorLat = 52.5627
const adareManorLng = -8.7944
const adareManorRadiusKm = 80

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Adare Manor | Ryder Cup golf region",
  description:
    "Find golf courses near Adare Manor, including Ryder Cup region golf, west of Ireland links, parkland courses and visitor-friendly places to play.",
  alternates: {
    canonical: "/golf-near-adare-manor",
  },
  openGraph: {
    title: "Golf near Adare Manor | GuestPlayGolf",
    description:
      "Discover golf courses near Adare Manor and the Ryder Cup region, including west coast links, castle estate golf and accessible inland courses.",
    url: `${siteUrl}/golf-near-adare-manor`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
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

export default async function GolfNearAdareManorPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type"
    )
    .eq("country", "Ireland")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .limit(300)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance = getDistanceKm(
          adareManorLat,
          adareManorLng,
          course.latitude,
          course.longitude
        )

        return {
          ...course,
          distance,
        }
      })
      .filter((course) => course.distance <= adareManorRadiusKm)
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)) || []

  const courseCount = coursesWithDistance.length

  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Golf near Adare Manor
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Adare Manor for visiting golfers
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Discover golf courses near Adare Manor and the Ryder Cup region.
            Explore west of Ireland links, castle estate parkland and accessible
            inland courses within easy reach.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses within {adareManorRadiusKm} km of Adare Manor
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Adare Manor
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Adare Manor is set to host one of the biggest events in world golf,
            the Ryder Cup, and the surrounding region offers some of the best
            golf in Ireland. From Adare Manor near Limerick, visiting golfers can
            reach renowned links courses on the west coast as well as strong
            inland parkland courses across Limerick, Clare and Kerry.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            This part of Ireland is a natural base for golfers planning a west of
            Ireland golf trip. It combines Ryder Cup interest, Shannon Airport
            access, Limerick city connections, castle estate golf and dramatic
            Atlantic links within a realistic driving distance.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Many of Ireland’s most famous courses, including Ballybunion,
            Lahinch and Doonbeg, are all within reach, making the Adare Manor
            region one of the strongest golf areas in the country for visiting
            golfers.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading golf courses near Adare Manor.
          </div>
        )}

        {coursesWithDistance.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm">
            No golf courses found within {adareManorRadiusKm} km of Adare Manor.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {coursesWithDistance.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                userLat={adareManorLat}
                userLng={adareManorLng}
                searchParams={{
                  country: "ireland",
                  source: "adare",
                }}
              />
            ))}
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Explore more golf in Ireland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Planning a wider Ireland golf trip? Explore more regional golf hubs
            and visitor-friendly golf destinations across Ireland.
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href="/golf-near-cork"
              className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100"
            >
              Golf Near Cork →
            </Link>

            <Link
              href="/golf-near-galway"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Galway →
            </Link>

            <Link
              href="/golf-near-dublin"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Dublin →
            </Link>

            <Link
              href="/golf-near-belfast"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Belfast →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}