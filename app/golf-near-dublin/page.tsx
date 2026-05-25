import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import DublinDistanceFilteredCourses from "@/components/DublinDistanceFilteredCourses"

const siteUrl = "https://guestplaygolf.com"

const dublinLat = 53.3498
const dublinLng = -6.2603
const dublinRadiusKm = 100

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf Near Dublin: Best Courses for Visiting Golfers",
  description:
    "Find the best golf near Dublin for visiting golfers. Compare links and parkland courses, discover visitor-friendly golf, and plan where to play near Dublin.",
  alternates: {
    canonical: "/golf-near-dublin",
  },
  openGraph: {
    title: "Golf Near Dublin: Best Courses for Visiting Golfers | GuestPlayGolf",
    description:
      "Discover visitor-friendly golf near Dublin, including world-famous links, accessible parkland courses and strong options within easy reach of the city.",
    url: `${siteUrl}/golf-near-dublin`,
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

export default async function GolfNearDublinPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type"
    )
    .ilike("country", "Ireland")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .limit(300)

  const coursesWithinDublinHub =
    courses
      ?.map((course) => {
        const distance = getDistanceKm(
          dublinLat,
          dublinLng,
          course.latitude,
          course.longitude
        )

        return {
          ...course,
          distance,
        }
      })
      .filter((course) => course.distance <= dublinRadiusKm)
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)) || []

  const courseCount = coursesWithinDublinHub.length

  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Golf near Dublin
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf Near Dublin: Best Courses for Visiting Golfers
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Discover visitor-friendly golf near Dublin, from famous coastal
            links to accessible parkland courses. Compare distance, course style
            and location to plan where to actually play.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses within {dublinRadiusKm} km of Dublin
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Dublin
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dublin is one of the best golf bases in Ireland for visiting
            golfers. Within a short drive of the city, you can play famous links
            courses, resort parkland layouts and strong inland options across
            Dublin, Kildare, Meath, Louth and Wicklow.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            The Dublin region offers a rare mix of world-class coastal golf and
            visitor-friendly inland courses. That makes it ideal for golfers who
            want variety, flexibility and strong course choice without long
            travel times.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dublin is also Ireland’s main international gateway, with excellent
            flight connections and easy road access to many of the country’s
            best visitor golf options.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading golf courses near Dublin.
          </div>
        )}

        <DublinDistanceFilteredCourses courses={coursesWithinDublinHub} />

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Explore more visitor golf in Ireland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Planning a wider Ireland golf trip? Explore other regional golf hubs
            and specialist guides for visiting golfers.
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href="/links-golf-near-dublin"
              className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100"
            >
              Best Links Golf Near Dublin →
            </Link>

            <Link
              href="/golf-near-cork"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
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
              href="/golf-near-belfast"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Belfast →
            </Link>

            <Link
              href="/golf-near-adare-manor"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Adare Manor →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}