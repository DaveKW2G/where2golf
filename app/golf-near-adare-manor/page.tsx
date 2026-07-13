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
      "Discover golf courses near Adare Manor and the Ryder Cup region, including west coast links, castle estate golf and visitor-friendly inland courses.",
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
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-10 pt-6 text-white sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
                Golf near Adare Manor
              </p>

              <h1 className="mt-3 max-w-3xl text-[32px] font-bold leading-tight sm:text-4xl lg:text-5xl">
                Golf near Adare Manor for visiting golfers
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-emerald-50/95 sm:text-base">
                Discover golf courses near Adare Manor and the Ryder Cup region.
                Compare visitor-friendly parkland courses, west of Ireland links
                and strong inland golf options across Limerick, Clare and Kerry.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  {courseCount} courses within {adareManorRadiusKm} km
                </span>

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  Ryder Cup region
                </span>

                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  Links and parkland golf
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">
                Planning an Ireland golf trip?
              </h2>

              <p className="mt-3 text-sm leading-6 text-emerald-50/90">
                Use the Adare Manor region as a base to compare nearby courses,
                understand guest access and build a stronger west of Ireland
                golf itinerary.
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/ireland"
                  className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-emerald-950 no-underline"
                >
                  Explore Ireland golf →
                </Link>

                <Link
                  href="/golf-near-cork"
                  className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white no-underline ring-1 ring-white/20"
                >
                  Compare with Cork →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Where to play golf near Adare Manor
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600 sm:text-[15px]">
              <p>
                Adare Manor is one of the most important golf locations in
                Ireland because of its Ryder Cup profile, but the wider region
                is also a serious base for visiting golfers. From Adare and
                nearby Limerick, golfers can reach a mix of castle estate golf,
                inland parkland courses and Atlantic links.
              </p>

              <p>
                The strongest golf trips in this part of Ireland usually combine
                Adare Manor interest with nearby courses across Limerick, Clare
                and Kerry. That gives visiting golfers a realistic mix of
                famous names, accessible visitor golf and different course
                styles.
              </p>

              <p>
                Courses such as Ballybunion, Lahinch and Doonbeg are within
                reach for many itineraries, while Limerick and Shannon access
                make the region especially useful for golfers arriving into the
                west of Ireland.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-sm font-semibold text-slate-500">
                Best for
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                West of Ireland golf trips
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-sm font-semibold text-slate-500">
                Course styles
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                Links, parkland and resort golf
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-sm font-semibold text-slate-500">
                Search radius
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {adareManorRadiusKm} km from Adare Manor
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-emerald-950 p-5 text-white shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Build a better Adare Manor golf itinerary
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50/90 sm:text-[15px]">
                GuestPlayGolf helps visiting golfers compare where they can play
                independently, understand guest access and plan stronger golf
                trips across Ireland.
              </p>
            </div>

            <Link
              href="/ireland"
              className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-emerald-950 no-underline"
            >
              Start from Ireland →
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading golf courses near Adare Manor.
          </div>
        )}

        <div className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Courses near Adare Manor
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Visitor-friendly golf within {adareManorRadiusKm} km
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              Sorted by distance from Adare Manor
            </p>
          </div>

          {coursesWithDistance.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm">
              No golf courses found within {adareManorRadiusKm} km of Adare
              Manor.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
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
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Why base a golf trip near Adare Manor?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-[15px]">
              Adare Manor gives visiting golfers a premium anchor point, but the
              wider region is the real strength. You can combine Ryder Cup
              interest with west coast links, inland parkland golf and easy
              access through Limerick and Shannon.
            </p>

            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                Strong access to Limerick, Clare and Kerry golf.
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                Useful base for famous links and accessible inland courses.
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                Natural fit for Ryder Cup-inspired Ireland golf trips.
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Explore more golf in Ireland
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-[15px]">
              Planning a wider Ireland golf trip? Compare Adare Manor with other
              regional golf hubs and visitor-friendly destinations across
              Ireland.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
        </div>
      </section>
    </main>
  )
}