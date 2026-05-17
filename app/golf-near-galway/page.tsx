import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const galwayLat = 53.2707
const galwayLng = -9.0568
const galwayRadiusKm = 70

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Galway | Best courses for visiting golfers",
  description:
    "Find golf courses near Galway. Explore west coast links, scenic parkland courses and where to play as a visiting golfer in western Ireland.",
  alternates: {
    canonical: "/golf-near-galway",
  },
  openGraph: {
    title: "Golf near Galway | GuestPlayGolf",
    description:
      "Discover golf courses near Galway, including west coast links, scenic parkland and destination golf in western Ireland.",
    url: `${siteUrl}/golf-near-galway`,
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

export default async function GolfNearGalwayPage() {
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
          galwayLat,
          galwayLng,
          course.latitude,
          course.longitude
        )

        return {
          ...course,
          distance,
        }
      })
      .filter((course) => course.distance <= galwayRadiusKm)
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
            Golf near Galway
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Galway for visiting golfers
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Discover golf courses near Galway, from west coast links to scenic
            parkland layouts across western Ireland. Compare distance, course
            style and location before deciding where to play.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses within {galwayRadiusKm} km of Galway
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Galway
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Galway is one of the best starting points for golf on Ireland’s west
            coast, especially for visiting golfers who want scenery, Atlantic
            links and a true destination-golf feel. A 70km radius gives access
            to strong courses across Galway, Clare and the wider west of Ireland.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf near Galway is less about quick city convenience and more about
            memorable golf days. The region is shaped by coastal landscapes,
            exposed links conditions, rugged scenery and traditional Irish golf
            clubs, with parkland options adding variety inland.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Galway works especially well for golfers building a west-of-Ireland
            itinerary, with routes towards Connemara, Lahinch, Clare and Mayo.
            GuestPlayGolf helps you compare distance, course style, price and
            visitor access before choosing where to play.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading golf courses near Galway.
          </div>
        )}

        {coursesWithDistance.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm">
            No golf courses found within {galwayRadiusKm} km of Galway.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {coursesWithDistance.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                userLat={galwayLat}
                userLng={galwayLng}
                searchParams={{
                  country: "ireland",
                  source: "galway",
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}