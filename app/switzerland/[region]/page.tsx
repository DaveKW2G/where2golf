import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "../../../lib/supabase/server"
import CourseCard from "../../../components/CourseCard"

type RegionPageProps = {
  params: Promise<{
    region: string
  }>
}

const regionNames: Record<string, string> = {
  AG: "Aargau",
  AI: "Appenzell Innerrhoden",
  AR: "Appenzell Ausserrhoden",
  BE: "Bern",
  BL: "Basel-Landschaft",
  BS: "Basel-Stadt",
  FR: "Fribourg",
  GE: "Geneva",
  GL: "Glarus",
  GR: "Graubünden",
  JU: "Jura",
  LU: "Lucerne",
  NE: "Neuchâtel",
  NW: "Nidwalden",
  OW: "Obwalden",
  SG: "St. Gallen",
  SH: "Schaffhausen",
  SO: "Solothurn",
  SZ: "Schwyz",
  TG: "Thurgau",
  TI: "Ticino",
  UR: "Uri",
  VD: "Vaud",
  VS: "Valais",
  ZG: "Zug",
  ZH: "Zurich",
}

const regionInsights: Record<string, string> = {
  ZH: "Zurich is one of the most practical regions in Switzerland for independent guest play, with convenient access, flatter layouts and strong day-trip appeal.",
  VD: "Vaud combines lakeside scenery, varied course settings and a good mix of golf options for independent guests, especially on weekdays.",
  VS: "Valais offers a distinctive alpine golf experience, with dramatic mountain scenery and stronger seasonal variation depending on altitude.",
  TI: "Ticino benefits from a milder climate and one of the longer golf seasons in Switzerland, making it especially appealing for independent guest play.",
  BE: "Bern mixes traditional parkland golf with more rural settings, offering a broad range of playing environments across the canton.",
  GE: "Geneva is a more restricted golf market, with fewer options and a generally more private club landscape, so planning matters more here.",
  SG: "St. Gallen offers a varied golf landscape, from flatter courses to more rolling terrain, with a solid mix of guest-friendly options.",
  GR: "Graubünden is known for scenic mountain golf, where altitude, season length and weather can have a bigger impact on playing conditions.",
  LU: "Lucerne offers a smaller but high-quality golf selection in an attractive central Swiss setting.",
  SZ: "Schwyz is a compact golf region with scenic surroundings and a smaller number of accessible options for independent guests.",
  ZG: "Zug has limited golf inventory, so finding the right independent guest option is more about quality and timing than volume.",
  AG: "Aargau offers a solid cluster of established courses, making it one of the steadier regions for independent guest golf.",
  TG: "Thurgau is a quieter golf region with a more relaxed feel and generally straightforward access for independent guests.",
  SH: "Schaffhausen offers a smaller, less crowded golf scene with a relaxed pace and practical access.",
  SO: "Solothurn is a smaller golf market, but can still offer good independent guest options with less competition for tee times.",
  BL: "Basel-Landschaft has a limited but relevant golf offering, with access depending more on club policy and timing.",
  BS: "Basel-Stadt itself has very limited golf inventory, with most practical playing options found just outside the canton.",
  FR: "Fribourg combines countryside golf with a mix of more accessible and more restricted clubs.",
  NE: "Neuchâtel offers a smaller golf selection in attractive surroundings, with access varying by club.",
  JU: "Jura has a quieter, less commercial golf feel and can suit independent guests looking for a more relaxed round.",
  GL: "Glarus has very limited golf infrastructure, so nearby regional access matters more than in-canton volume.",
  UR: "Uri has minimal golf inventory, with most practical options located in neighbouring cantons.",
  OW: "Obwalden offers a small number of scenic golf options where seasonality and location play a bigger role.",
  NW: "Nidwalden combines attractive scenery with a limited but potentially appealing golf offering for independent guests.",
  AI: "Appenzell Innerrhoden has very limited golf inventory, so nearby guest-friendly options are especially important.",
  AR: "Appenzell Ausserrhoden offers access to a small golf market with a more relaxed regional feel.",
}

const nearbyRegions: Record<string, string[]> = {
  ZH: ["ZG", "AG", "SZ"],
  GE: ["VD"],
  VD: ["GE", "FR", "VS"],
  TI: ["GR"],
  ZG: ["ZH", "SZ", "AG"],
  AG: ["ZH", "ZG", "SO"],
  SZ: ["ZH", "ZG", "LU"],
  FR: ["VD", "BE"],
  VS: ["VD", "TI"],
  GR: ["TI", "SG"],
}

function getTagline(regionName: string) {
  return `Find where you can play golf as an independent guest in ${regionName}.`
}

function getCourseCountLabel(courseCount: number) {
  if (courseCount === 1) return "1 course"
  return `${courseCount} courses`
}

function getAvailabilityLabel(courseCount: number) {
  if (courseCount === 0) return "Currently no listed courses"
  if (courseCount === 1) return "1 listed option"
  if (courseCount <= 3) return "Small but relevant selection"
  if (courseCount <= 7) return "Good regional selection"
  return "Strong regional selection"
}

function getInsightText(
  regionCode: string,
  regionName: string,
  courseCount: number
) {
  const baseInsight =
    regionInsights[regionCode] ||
    `${regionName} offers golf opportunities for independent guests, with access varying by club, season and demand.`

  if (courseCount === 0) {
    return `${baseInsight} There are currently no listed courses in this region, so nearby cantons may offer the best alternatives.`
  }

  if (courseCount === 1) {
    return `${baseInsight} At the moment, only 1 listed course appears here, so this page is best used as a focused local option rather than a broad regional comparison.`
  }

  if (courseCount <= 3) {
    return `${baseInsight} With ${courseCount} listed courses, this is a more limited regional market, but still worth checking if you want a nearby independent guest option.`
  }

  return `${baseInsight} With ${courseCount} listed courses, this region offers a useful range of options for comparing access, location and playing style.`
}

function getRegionIntro(regionCode: string, regionName: string) {
  if (regionCode === "ZH") {
    return "Looking for golf near Zurich? Compare golf courses in Zurich for independent guests, with clear information on guest access, handicap requirements and when you can play."
  }

  if (regionCode === "GE") {
    return "Explore golf in Geneva for independent guests and compare the limited but relevant options available in and around the canton."
  }

  if (regionCode === "VD") {
    return "Explore golf in Vaud for independent guests, with a strong mix of lakeside and inland golf courses across one of Switzerland’s most attractive playing regions."
  }

  if (regionCode === "TI") {
    return "Explore golf in Ticino for independent guests and discover courses in one of Switzerland’s mildest and longest-playing golf regions."
  }

  return `Explore golf in ${regionName} for independent guests and compare courses by location, access and playing requirements.`
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const regionCode = resolvedParams.region.toUpperCase()
  const regionName = regionNames[regionCode] || regionCode

  const title =
    regionCode === "ZH"
      ? "Golf near Zurich | Play as an independent guest"
      : `Golf in ${regionName} | Play as an independent guest`

  const description =
    regionCode === "ZH"
      ? "Find golf near Zurich for independent guests. Compare golf courses in Zurich by guest access, handicap requirements and playing availability."
      : `Find golf in ${regionName} for independent guests. Compare courses by guest access, handicap requirements and playing availability.`

  return {
    title,
    description,
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const supabase = await createClient()

  const resolvedParams = await params
  const regionCode = resolvedParams.region.toUpperCase()

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap"
    )
    .eq("region", regionCode)

  const regionName = regionNames[regionCode] || regionCode
  const courseCount = courses?.length || 0
  const insightText = getInsightText(regionCode, regionName, courseCount)
  const introText = getRegionIntro(regionCode, regionName)

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 px-5 pb-8 pt-8 text-white">
        <div className="mx-auto max-w-[480px]">
          <div className="mb-4 text-[13px] font-semibold tracking-wide text-emerald-100/90">
            GuestPlayGolf
          </div>

          <Link
            href="/switzerland"
            className="mb-4 inline-block text-sm text-emerald-200 no-underline transition hover:text-white"
          >
            ← Switzerland
          </Link>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200/90">
                  Switzerland / {regionCode}
                </p>

                <h1 className="mt-2 text-[24px] font-semibold leading-snug tracking-tight text-white">
                  {regionCode === "ZH"
                    ? "Golf near Zurich for independent guests"
                    : `Golf in ${regionName} for independent guests`}
                </h1>

                <p className="mt-3 text-[15px] leading-6 text-emerald-50/95">
                  {getTagline(regionName)}
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
                <div className="text-[18px] font-semibold text-white">
                  {courseCount}
                </div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/80">
                  {courseCount === 1 ? "course" : "courses"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-emerald-50 backdrop-blur-sm">
                {getCourseCountLabel(courseCount)}
              </span>
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-emerald-50 backdrop-blur-sm">
                {getAvailabilityLabel(courseCount)}
              </span>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/10 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-md">
              <p className="text-[14px] leading-7 text-emerald-50/95">
                {introText}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-base font-semibold text-slate-900">
            Golf in {regionName} — what to expect
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {insightText}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading courses for this region.
          </div>
        )}

        {courses?.length === 0 && !error ? (
          <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <h2 className="text-base font-semibold text-slate-900">
              No listed courses in {regionName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              There are currently no courses listed for independent guests in this region.
              Try nearby cantons or return to Switzerland to browse all available options.
            </p>
            <div className="mt-4">
              <Link
                href="/switzerland"
                className="inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-emerald-800"
              >
                Browse Switzerland
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-base font-semibold text-slate-900">
                Golf courses in {regionName}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Browse listed golf courses in {regionName} that welcome independent guests.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {courses?.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </>
        )}

        {nearbyRegions[regionCode] && (
          <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <h2 className="text-base font-semibold text-slate-900">
              Nearby regions
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {nearbyRegions[regionCode].map((code) => (
                <Link
                  key={code}
                  href={`/switzerland/${code.toLowerCase()}`}
                  className="rounded-full border px-3 py-1.5 text-sm text-slate-700 no-underline"
                >
                  {code === "ZH"
                    ? "Golf near Zurich"
                    : `Golf in ${regionNames[code]}`}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-base font-semibold text-slate-900">
            Access and requirements
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Most golf courses in {regionName} require a recognised handicap and may
            limit independent guest access by day or availability.
          </p>
        </div>
      </div>
    </main>
  )
}