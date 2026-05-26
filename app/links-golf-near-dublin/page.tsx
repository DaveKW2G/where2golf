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
  title: "Best Links Golf Near Dublin | Visiting Golfer Guide",
  description:
    "Find the best links golf near Dublin for visiting golfers. Fewer than 250 true links golf courses are believed to exist worldwide, making Dublin a strong base for rare Irish links golf.",
  alternates: {
    canonical: "/links-golf-near-dublin",
  },
  openGraph: {
    title: "Best Links Golf Near Dublin | GuestPlayGolf",
    description:
      "Discover visitor-friendly links golf near Dublin, including classic coastal courses and world-famous Irish links within easy reach of the city.",
    url: `${siteUrl}/links-golf-near-dublin`,
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

export default async function LinksGolfNearDublinPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude, course_type"
    )
    .ilike("country", "Ireland")
    .eq("course_type", "Links")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .limit(300)

  const linksCoursesWithinDublinHub =
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

  const courseCount = linksCoursesWithinDublinHub.length

  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link
            href="/golf-near-dublin"
            className="text-sm text-white/90 no-underline"
          >
            ← Golf near Dublin
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Links golf near Dublin
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Best Links Golf Near Dublin
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Find classic Irish links golf within easy reach of Dublin. Fewer
            than 250 true links golf courses are believed to exist worldwide,
            making links golf one of the rarest and most distinctive experiences
            in the game.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} links courses within {dublinRadiusKm} km of Dublin
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play links golf near Dublin
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dublin is one of the best bases in Ireland for visiting golfers who
            want to experience links golf. Within a realistic drive of the city,
            you can reach classic coastal courses, championship links and
            visitor-friendly seaside layouts.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            True links golf is remarkably rare. Golf historians generally
            believe fewer than 250 true links courses exist worldwide, with many
            concentrated across Ireland, Scotland.
            Staying in Dublin gives visiting golfers unusually strong access to
            this distinctive style of golf within a practical day-trip range.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Links golf is one of Ireland’s strongest golf experiences, with firm
            turf, coastal wind, dunes and fast-running fairways shaping the way
            each course plays. For golfers staying in Dublin, the surrounding
            east coast offers several strong links options without needing to
            build a full multi-day trip.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use the distance buttons below to start broad within 100 km, then
            narrow the list to links courses closer to Dublin city.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading links golf courses near Dublin.
          </div>
        )}

        <DublinDistanceFilteredCourses courses={linksCoursesWithinDublinHub} />

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Explore more visitor golf in Ireland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Planning a wider Ireland golf trip? Explore more regional golf hubs
            and visitor-friendly course guides.
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href="/golf-near-dublin"
              className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100"
            >
              Golf Near Dublin →
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