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
  ZH: "Zurich offers some of the most accessible golf in Switzerland, with several courses allowing independent guest play. Layouts are generally flat and walkable, making it a convenient option for regular play, though weekend availability can be more restricted.",
  VD: "Vaud combines scenic lakeside golf with a strong selection of courses open to independent guests. The region offers variety in layout and pricing, with generally good weekday availability and more limited access at peak times.",
  VS: "Valais provides a unique alpine golf experience, with dramatic mountain surroundings and a longer playing season in lower valleys. Course access can vary depending on time of year and demand.",
  TI: "Ticino offers one of the longest golf seasons in Switzerland, with a milder climate and more consistent playing conditions. Courses tend to be more accessible for independent guests, particularly outside peak weekends.",
  BE: "Bern features a mix of traditional parkland courses and more rural layouts, with varying levels of guest access. Availability is generally good during the week, with some restrictions depending on the club.",
  GE: "Geneva has a limited number of courses, many of which are highly private. Independent guest access is more restricted, making advance planning essential.",
  SG: "St. Gallen offers a range of courses across varied terrain, from flatter layouts to more undulating designs. Guest access is typically available, though conditions can vary depending on the club.",
  GR: "Graubünden is known for high-altitude golf with spectacular views and shorter seasonal windows. Access depends heavily on weather and opening periods.",
  LU: "Lucerne provides a small but quality selection of courses, often set in scenic central locations. Guest play is available, though availability can be influenced by club demand.",
  SZ: "Schwyz offers a limited number of courses in a compact region, with generally good accessibility for independent players. Layouts are typically straightforward and playable.",
  ZG: "Zug has very limited golf options, with most courses operating on a more private basis. Independent guest play is possible but typically requires careful timing.",
  AG: "Aargau features several well-established parkland courses with relatively good access for independent guests. The region offers consistent playing conditions and straightforward layouts.",
  TG: "Thurgau provides a quieter golf experience with less crowded courses and generally good availability. Layouts are often flat and accessible for a wide range of players.",
  SH: "Schaffhausen has a small number of courses with a relaxed playing environment. Independent guest access is usually straightforward, particularly during weekdays.",
  SO: "Solothurn offers a limited but accessible selection of courses, typically with fewer restrictions for independent players. Conditions are generally consistent throughout the main season.",
  BL: "Basel-Landschaft provides access to a small number of courses, often with moderate availability for guests. Booking ahead is recommended at busier times.",
  BS: "Basel-Stadt has very limited golf availability within the canton itself, with most options located nearby. Access depends on neighbouring course policies.",
  FR: "Fribourg combines scenic countryside golf with a mix of accessible and more restricted courses. Guest play is generally possible but varies by club.",
  NE: "Neuchâtel offers a smaller selection of courses, often set in picturesque surroundings. Guest access is typically available but may vary.",
  JU: "Jura provides a quieter and less commercial golf experience, with generally good accessibility for independent players. Courses tend to be less crowded and more relaxed.",
  GL: "Glarus has very limited golf infrastructure, with few nearby options. Access depends on surrounding regions rather than within the canton itself.",
  UR: "Uri has minimal golf presence, with most playable courses located in neighbouring cantons. Planning ahead is required.",
  OW: "Obwalden offers access to a small number of scenic courses with generally good availability. Conditions are influenced by altitude and season.",
  NW: "Nidwalden provides limited but attractive golf options in lake and mountain settings. Access is typically available but may vary.",
  AI: "Appenzell Innerrhoden has very limited golf facilities, with most play taking place in nearby regions. Access depends on surrounding courses.",
  AR: "Appenzell Ausserrhoden offers access to a small number of courses with generally relaxed playing conditions. Independent guests are typically welcomed.",
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

  return (
    <main className="min-h-screen bg-stone-100">

      {/* HERO */}
      <div className="bg-gradient-to-b from-emerald-800 to-emerald-900 px-5 py-8 text-white">
        <div className="mx-auto max-w-[480px]">

          <Link
            href="/switzerland"
            className="text-sm text-emerald-200 no-underline block mb-3"
          >
            ← Switzerland
          </Link>

          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold">
              {regionName}
            </h1>

            <span className="text-sm text-emerald-200">
              {courseCount} courses
            </span>
          </div>

          <p className="mt-2 text-sm text-emerald-100">
            Where2Golf shows where independent guests can play.
          </p>

        </div>
      </div>

      {/* REGION INSIGHT PANEL */}
      {regionInsights[regionCode] && (
        <div className="mx-auto max-w-[480px] px-5 pt-4">
          <div className="rounded-xl bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              {regionInsights[regionCode]}
            </p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="mx-auto max-w-[480px] px-5 py-6">

        {error && (
          <p className="text-red-500">
            Error loading courses for this region.
          </p>
        )}

        <div className="grid gap-4">
          {courses?.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {courses?.length === 0 && !error && (
          <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
            No courses found in this region.
          </div>
        )}
      </div>
    </main>
  )
}