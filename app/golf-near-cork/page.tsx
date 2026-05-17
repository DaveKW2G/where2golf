import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const corkLat = 51.8985
const corkLng = -8.4756
const corkRadiusKm = 70

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Cork | Best courses for visiting golfers",
  description:
    "Find golf courses near Cork. Explore coastal links, parkland courses and where to play as a visiting golfer in southern Ireland.",
  alternates: {
    canonical: "/golf-near-cork",
  },
  openGraph: {
    title: "Golf near Cork | GuestPlayGolf",
    description:
      "Discover golf courses near Cork, including coastal links, scenic parkland and southern Ireland golf options.",
    url: `${siteUrl}/golf-near-cork`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
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

export default async function GolfNearCorkPage() {
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
          corkLat,
          corkLng,
          course.latitude,
          course.longitude
        )

        return {
          ...course,
          distance,
        }
      })
      .filter((course) => course.distance <= corkRadiusKm)
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
            Golf near Cork
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Cork for visiting golfers
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Discover golf courses near Cork, from famous coastal links to scenic
            parkland layouts across southern Ireland. Compare distance, course
            style and location before deciding where to play.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses within {corkRadiusKm} km of Cork
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Cork
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Cork is one of Ireland’s strongest golf bases, combining city access
            with some of the best coastal golf in the country. A 70km radius
            keeps the focus on realistic day-trip golf from Cork while still
            covering strong visitor options across southern Ireland.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf near Cork offers a powerful mix of course styles. The coast
            delivers dramatic links and seaside golf, while inland areas provide
            parkland courses, resort layouts and more accessible local clubs.
            This makes Cork especially useful for golfers who want variety
            without building an entire trip around one course type.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Cork Airport, the regional road network and access towards Kinsale,
            Fota, Kerry and Waterford make the city a practical starting point
            for a southern Ireland golf itinerary. GuestPlayGolf helps you
            compare location, course style, price and visitor access before
            choosing where to play.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading golf courses near Cork.
          </div>
        )}

        {coursesWithDistance.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm">
            No golf courses found within {corkRadiusKm} km of Cork.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {coursesWithDistance.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                userLat={corkLat}
                userLng={corkLng}
                searchParams={{
                  country: "ireland",
                  source: "cork",
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}