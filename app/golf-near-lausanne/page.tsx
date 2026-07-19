import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

const lausanneLat = 46.5197
const lausanneLng = 6.6323

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf Near Lausanne | Courses & Free Golf Trip Planner",
  description:
    "Find golf courses near Lausanne for visiting golfers. Compare guest access, handicap requirements and distance, then use our free Swiss golf trip planner to build, share and vote on your itinerary.",
  alternates: {
    canonical: "/golf-near-lausanne",
  },
  openGraph: {
    title:
      "Golf Near Lausanne | Courses & Free Golf Trip Planner | GuestPlayGolf",
    description:
      "Compare golf near Lausanne, build a free Swiss golf itinerary, share your trip and vote on courses with your group.",
    url: `${siteUrl}/golf-near-lausanne`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const lausanneRegions = ["VD", "GE", "FR", "VS"]

const regionNames: Record<string, string> = {
  VD: "Vaud",
  GE: "Geneva",
  FR: "Fribourg",
  VS: "Valais",
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
        Continue planning your Switzerland golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare other Swiss golf hubs, regional guides and scenic golf-trip
        options, then add more courses to your free GuestPlayGolf itinerary.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/switzerland/vd"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          Golf in Vaud →
        </Link>

        <Link
          href="/golf-near-geneva"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Geneva →
        </Link>

        <Link
          href="/golf-near-zurich"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
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
          href="/golf-near-lucerne"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Lucerne →
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

export default async function GolfNearLausannePage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude"
    )
    .in("region", lausanneRegions)

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(
                lausanneLat,
                lausanneLng,
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
          <Link
            href="/switzerland"
            className="text-sm text-white/90 no-underline"
          >
            ← Switzerland
          </Link>

          <div className="mt-6 lg:max-w-[800px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Golf near Lausanne
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Near Lausanne: Find Courses and Plan Your Trip
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Compare golf near Lausanne across Vaud, Geneva, Fribourg and
              Valais. Add your preferred Swiss courses to a free itinerary,
              share the trip and vote with your group.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <span className="text-[18px]">{courseCount}</span>
                <span>courses around Lausanne</span>
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Lake Geneva, Vaud and western Switzerland
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Lausanne golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Where to play golf near Lausanne
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Lausanne is one of the strongest bases for golf in western
              Switzerland. Positioned on Lake Geneva, it gives visiting golfers
              access to a high-quality mix of courses across Vaud, with
              additional options towards Geneva, Fribourg and Valais.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Golf near Lausanne has a different feel from central and northern
              Switzerland. The region combines lake views, vineyard landscapes
              and more open terrain, with many courses offering scenic layouts
              alongside practical access for independent guests.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Compared with Geneva, courses around Lausanne can feel more
              balanced for visiting golfers: still high-quality, still scenic,
              but often with more practical options when building a Swiss golf
              itinerary.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Lake Geneva base
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Scenic golf around Lausanne, Vaud and the wider lake region.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Western Swiss variety
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Compare courses across Vaud, Geneva, Fribourg and Valais.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Strong trip base
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Useful for city breaks, lake holidays and wider Swiss golf
                  trips.
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
                Build your Lausanne golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose courses, build a day-by-day itinerary and organise your
                western Switzerland golf trip in one place. Share the plan and
                let your group vote on where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Add Lausanne-area courses to your shortlist.
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

        <section className="mt-6 min-w-0">
          <div className="flex flex-wrap gap-2">
            {lausanneRegions.map((region, index) => (
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
              Error loading golf courses near Lausanne.
            </div>
          )}

          {coursesWithDistance.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No golf courses found near Lausanne.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {coursesWithDistance.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  userLat={lausanneLat}
                  userLng={lausanneLng}
                  searchParams={{
                    country: "switzerland",
                    source: "lausanne",
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Playing as an independent guest near Lausanne
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Swiss golf access varies by club. Around Lausanne, independent guests
            should still check recognised handicap requirements, membership or
            Swiss Golf Card expectations, booking windows and whether visitor
            access differs between weekdays and weekends.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Seasonality also matters. Courses around Lake Geneva may have longer
            playing windows than alpine venues, while Valais and mountain-region
            options can be more weather dependent.
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <SwissGolfLinks />
        </section>
      </section>
    </main>
  )
}
