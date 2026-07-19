import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const lucerneLat = 47.0502
const lucerneLng = 8.3093

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf Near Lucerne | Courses & Free Golf Trip Planner",
  description:
    "Find the best golf near Lucerne for visiting golfers. Compare Swiss golf courses, guest access, handicap rules and seasonality, then use our free golf trip planner to build, share and vote on your itinerary.",
  alternates: {
    canonical: "/golf-near-lucerne",
  },
  openGraph: {
    title: "Golf Near Lucerne | Courses & Free Golf Trip Planner | GuestPlayGolf",
    description:
      "Compare visitor-friendly golf near Lucerne, build a free Swiss golf itinerary, share your trip and vote on courses with your group.",
    url: `${siteUrl}/golf-near-lucerne`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const lucerneRegions = ["LU", "ZG", "SZ", "AG"]

const regionNames: Record<string, string> = {
  LU: "Lucerne",
  ZG: "Zug",
  SZ: "Schwyz",
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

function SwissGolfLinks() {
  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
        Continue planning your Swiss golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare other Swiss golf hubs, regional guides and courses available to
        independent guests, then add more courses to your free GuestPlayGolf
        itinerary.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/golf-near-zurich"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          Golf Near Zurich →
        </Link>

        <Link
          href="/golf-near-basel"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Basel →
        </Link>

        <Link
          href="/golf-near-lausanne"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Lausanne →
        </Link>

        <Link
          href="/golf-near-geneva"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Geneva →
        </Link>

        <Link
          href="/golf-in-the-swiss-alps"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf in the Swiss Alps →
        </Link>
      </div>

      <Link
        href="/switzerland/planner"
        className="mt-5 block text-center text-sm font-semibold text-emerald-700 no-underline"
      >
        Open your Swiss golf trip planner →
      </Link>
    </>
  )
}

export default async function GolfNearLucernePage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", lucerneRegions)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(
                lucerneLat,
                lucerneLng,
                course.latitude,
                course.longitude
              )
            : undefined

        return {
          ...course,
          distance,
        }
      })
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)) || []

  const courseCount = coursesWithDistance.length

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/switzerland" className="text-sm text-white/90 no-underline">
            ← Switzerland
          </Link>

          <div className="mt-6 lg:max-w-[780px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Golf near Lucerne
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Near Lucerne: Find Courses and Plan Your Trip
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[720px] lg:text-[17px] lg:leading-7">
              Compare visitor-friendly golf near Lucerne, from scenic lake and
              mountain settings to practical central Swiss courses. Add your
              preferred courses to a free itinerary, share the trip and vote with
              your group.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {courseCount} courses around Lucerne
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Lucerne, Zug, Schwyz and Aargau
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Lucerne golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Where to play golf near Lucerne
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Lucerne is one of the most useful starting points for golf in
              central Switzerland. From the city, independent guests can compare
              courses around Lucerne itself, nearby Zug, Schwyz and parts of
              Aargau without needing to search each club separately.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Golf near Lucerne has a different feel from golf near Basel or
              Zurich. The area is more scenic and spread out, with lake settings,
              rolling countryside and mountain views often shaping the
              experience. For many golfers, the appeal is not just convenience
              but the setting of the round.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Because Lucerne sits between the Swiss Plateau and the alpine
              cantons, travel time and seasonality can vary more than in flatter
              parts of Switzerland. GuestPlayGolf helps you check which nearby
              courses are realistic for independent guest play before you contact
              the club.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Scenic central base
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Lake settings, mountain views and memorable central Swiss golf.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Regional variety
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Compare courses across Lucerne, Zug, Schwyz and Aargau.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Trip planning matters
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Check guest access, handicap rules and seasonal play before booking.
                </p>
              </div>
            </div>
          </section>

          <aside className="min-w-0">
            <div className="flex h-full flex-col rounded-3xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100 lg:p-6">
              <span className="inline-block w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
                Free online tool
              </span>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Build your Lucerne golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose courses, build a day-by-day itinerary and organise your
                Lucerne golf trip in one place. Share the plan and let your group
                vote on where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Add courses to your shortlist.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    2
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Assign courses to each golf day.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    3
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Share the trip and vote as a group.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-5">
                <Link
                  href="/switzerland/planner"
                  className="block w-full rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline transition hover:bg-emerald-900"
                >
                  Start Free Golf Trip Planner
                </Link>

                <p className="mt-3 text-center text-xs leading-5 text-slate-600">
                  Browse the courses below and add your preferred options as you
                  go.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6">
          <div className="flex flex-wrap gap-2">
            {lucerneRegions.map((region, index) => (
              <Link
                key={region}
                href={`/switzerland/${region.toLowerCase()}`}
                className={
                  index === 0
                    ? "rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white no-underline"
                    : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:border-emerald-700"
                }
              >
                {regionNames[region]}
              </Link>
            ))}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading golf courses near Lucerne.
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Golf courses near Lucerne
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              These courses are sorted by distance from Lucerne city centre and
              are included because they are relevant for independent guest golf in
              central Switzerland.
            </p>
          </div>

          {coursesWithDistance.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No golf courses found near Lucerne.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {coursesWithDistance.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  userLat={lucerneLat}
                  userLng={lucerneLng}
                  searchParams={{
                    country: "switzerland",
                    source: "lucerne",
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <SwissGolfLinks />
        </section>
      </section>
    </main>
  )
}
