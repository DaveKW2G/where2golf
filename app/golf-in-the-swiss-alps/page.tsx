import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf in the Swiss Alps | Courses & Free Golf Trip Planner",
  description:
    "Find golf courses in the Swiss Alps for visiting golfers. Compare mountain golf, guest access, handicap rules and seasonality, then use our free Swiss golf trip planner.",
  alternates: {
    canonical: "/golf-in-the-swiss-alps",
  },
  openGraph: {
    title:
      "Golf in the Swiss Alps | Courses & Free Golf Trip Planner | GuestPlayGolf",
    description:
      "Compare alpine golf courses in Switzerland, build a free Swiss golf itinerary, share your trip and vote on courses with your group.",
    url: `${siteUrl}/golf-in-the-swiss-alps`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const alpineRegions = ["VS", "GR", "TI", "BE", "LU", "SZ", "OW", "NW", "UR", "GL"]

const regionNames: Record<string, string> = {
  VS: "Valais",
  GR: "Graubünden",
  TI: "Ticino",
  BE: "Bern",
  LU: "Lucerne",
  SZ: "Schwyz",
  OW: "Obwalden",
  NW: "Nidwalden",
  UR: "Uri",
  GL: "Glarus",
}

function AlpineGolfLinks() {
  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
        Continue planning your Swiss golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare other Swiss golf hubs, regional guides and alpine bases before
        adding courses to your free GuestPlayGolf itinerary.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/golf-near-lucerne"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          Golf Near Lucerne →
        </Link>

        <Link
          href="/golf-near-zurich"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Zurich →
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
          href="/golf-near-basel"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Basel →
        </Link>

        <Link
          href="/switzerland"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Browse All Swiss Golf →
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

export default async function GolfInSwissAlpsPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type"
    )
    .in("region", alpineRegions)
    .order("course_name", { ascending: true })

  const courseCount = courses?.length || 0

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/switzerland" className="text-sm text-white/90 no-underline">
            ← Switzerland
          </Link>

          <div className="mt-6 lg:max-w-[800px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Mountain golf in Switzerland
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf in the Swiss Alps: Find Courses and Plan Your Trip
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Explore alpine golf courses in Switzerland, compare visitor
              access, handicap requirements and seasonal play, then add your
              preferred mountain courses to a free Swiss golf itinerary.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <span className="text-[18px]">{courseCount}</span>
                <span>alpine golf courses</span>
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Valais, Graubünden, Ticino and mountain regions
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Swiss Alps golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Where to play golf in the Swiss Alps
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Golf in the Swiss Alps is a very different experience from playing
              near Zurich, Geneva or Basel. Courses in regions such as Valais
              and Graubünden are shaped by altitude, mountain views and shorter
              playing seasons, making them ideal for golfers who want scenery
              and a sense of place rather than simply the closest tee time.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Alpine golf can mean dramatic backdrops, cooler summer
              temperatures and more varied terrain, from resort-style mountain
              courses to quieter regional clubs. The trade-off is that
              seasonality matters more: opening dates, snow conditions and
              weather can affect when courses are playable.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              These regions are usually less immediate than the major city hubs,
              often requiring an onward train or car journey from Zurich, Geneva
              or Basel. That extra travel is part of the appeal: Swiss alpine
              golf is best suited to day trips, weekend breaks and golfers
              looking for a more scenic round.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Mountain settings
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Scenic golf with alpine backdrops, resort bases and cooler
                  summer conditions.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Shorter seasons
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Opening months can be more limited and weather dependent at
                  altitude.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Worth planning
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Compare access, handicap rules and travel time before building
                  your itinerary.
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
                Build your Swiss Alps golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose alpine courses, build a day-by-day itinerary and organise
                your Swiss golf trip in one place. Share the plan and let your
                group vote on where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Shortlist mountain courses by region and access.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    2
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Build a realistic itinerary around travel and seasonality.
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
                  Start Free Swiss Golf Trip Planner
                </Link>

                <p className="mt-3 text-center text-xs leading-5 text-slate-600">
                  Browse the alpine courses below and add your preferred options
                  as you go.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Alpine golf regions in Switzerland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Explore mountain golf by canton and use these regional links to
            compare courses, access and seasonal availability.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {alpineRegions.map((region, index) => (
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
        </section>

        <section className="mt-6">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading Swiss Alps golf courses.
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Golf courses in the Swiss Alps
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              These courses are included because they are relevant for alpine
              and mountain golf in Switzerland. Use the planner to shortlist the
              courses that best fit your route, timing and preferred regions.
            </p>
          </div>

          {courseCount === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No Swiss Alps golf courses found.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {courses?.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  searchParams={{
                    country: "switzerland",
                    source: "swiss-alps",
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Things to know about alpine golf
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Mountain golf courses can have shorter seasons than lower-altitude
            courses. Weather, snow conditions and opening dates may change, so
            always confirm directly with the club before travelling.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Handicap requirements, visitor access and weekend availability can
            also vary by club. The Swiss planner helps you compare courses first,
            then build a realistic itinerary before booking tee times.
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <AlpineGolfLinks />
        </section>
      </section>
    </main>
  )
}
