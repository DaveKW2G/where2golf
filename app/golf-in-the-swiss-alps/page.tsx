import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

const siteUrl = "https://guestplaygolf.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf in the Swiss Alps | Mountain golf in Switzerland",
  description:
    "Find golf courses in the Swiss Alps where independent guests can play. Explore mountain golf in Switzerland with guest access, season and handicap details.",
  alternates: {
    canonical: "/golf-in-the-swiss-alps",
  },
  openGraph: {
    title: "Golf in the Swiss Alps | GuestPlayGolf",
    description:
      "Explore mountain golf courses in Switzerland where independent guests can play.",
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

export default async function GolfInSwissAlpsPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap"
    )
    .in("region", alpineRegions)
    .order("course_name", { ascending: true })

  const courseCount = courses?.length || 0

  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-7 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link href="/switzerland" className="text-sm text-white/90 no-underline">
            ← Switzerland
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Mountain golf in Switzerland
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf in the Swiss Alps
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Explore golf courses in Switzerland’s alpine and mountain regions,
            where independent guests can play surrounded by dramatic scenery,
            cooler summer air and some of the country’s most memorable golfing
            landscapes.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-[18px] font-semibold">{courseCount}</span>
            <span className="text-sm text-emerald-100">
              alpine golf courses
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Mountain golf in Switzerland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Golf in the Swiss Alps is a very different experience from playing
            near Zurich, Geneva or Basel. Courses in regions such as Valais and
            Graubünden are shaped by altitude, mountain views and shorter
            playing seasons, making them ideal for golfers who want scenery and
            a sense of place rather than simply the closest tee time.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Alpine golf can mean dramatic backdrops, cooler summer temperatures
            and more varied terrain, from resort-style mountain courses to
            quieter regional clubs. The trade-off is that seasonality matters
            more: opening dates, snow conditions and weather can affect when
            courses are playable.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            These regions are usually less immediate than the major city hubs,
            often requiring an onward train or car journey from Zurich, Geneva or
            Basel. That extra travel is part of the appeal: Swiss alpine golf is
            best suited to day trips, weekend breaks and golfers looking for a
            more scenic round. GuestPlayGolf helps you understand where
            independent guests can play, when access is available and what each
            course requires.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {alpineRegions.map((region, index) => (
            <Link
              key={region}
              href={`/switzerland/${region.toLowerCase()}`}
              className={
                index === 0
                  ? "rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white no-underline"
                  : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline"
              }
            >
              {regionNames[region]}
            </Link>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading Swiss Alps golf courses.
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {courses?.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-base font-semibold text-slate-900">
            Things to know about alpine golf
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Mountain golf courses can have shorter seasons than lower-altitude
            courses. Weather, snow conditions and opening dates may change, so
            always confirm directly with the club before travelling.
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-base font-semibold text-slate-900">
            Explore more Swiss golf
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/switzerland/vs"
              className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white no-underline"
            >
              Golf in Valais
            </Link>

            <Link
              href="/switzerland/gr"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline"
            >
              Golf in Graubünden
            </Link>

            <Link
              href="/switzerland"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline"
            >
              Browse Switzerland
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}