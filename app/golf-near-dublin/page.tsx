import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const dublinLat = 53.3498
const dublinLng = -6.2603

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf near Dublin | Best courses for visiting golfers",
  description:
    "Find golf courses near Dublin. Explore links and parkland courses, compare distance, and discover where to play as a visiting golfer.",
  alternates: {
    canonical: "/golf-near-dublin",
  },
  openGraph: {
    title: "Golf near Dublin | GuestPlayGolf",
    description:
      "Discover the best golf courses near Dublin, including world-famous links and accessible parkland options.",
    url: `${siteUrl}/golf-near-dublin`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const dublinRegions = ["LEINSTER", "DUBLIN", "KILDARE", "MEATH", "WICKLOW"]

const regionNames: Record<string, string> = {
  LEINSTER: "Leinster",
  DUBLIN: "Dublin",
  KILDARE: "Kildare",
  MEATH: "Meath",
  WICKLOW: "Wicklow",
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

export default async function GolfNearDublinPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", ["LEINSTER"]) // TEMP until Ireland data is added

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(dublinLat, dublinLng, course.latitude, course.longitude)
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
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Golf near Dublin
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf near Dublin for visiting golfers
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Discover golf courses near Dublin, including world-famous links and
            accessible parkland layouts. Compare distance, course style and
            location to plan where to play.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses near Dublin
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Dublin
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dublin is the most accessible golf base in Ireland and one of the
            best places in the world to start a golf trip. Within a short
            distance of the city, you can play some of the most famous links
            courses globally, alongside a large number of high-quality parkland
            courses.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            The Dublin region offers a unique combination of world-class links
            golf along the coast and more accessible inland courses. This makes
            it ideal for visiting golfers who want variety, flexibility and
            strong course choice without long travel times.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dublin is also the main international gateway into Ireland, with
            excellent flight connections and easy access to surrounding regions
            by road and rail. Many of Ireland’s best courses can be reached
            within a short drive, making it a natural starting point for any golf
            itinerary.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading golf courses near Dublin.
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {coursesWithDistance.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={dublinLat}
              userLng={dublinLng}
              searchParams={{ source: "dublin" }}
            />
          ))}
        </div>
      </section>
    </main>
  )
}