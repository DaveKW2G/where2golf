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

const nearbyRegions: Record<string, string[]> = {
  ZH: ["ZG", "AG", "SZ"],
  GE: ["VD"],
  VD: ["GE", "FR", "VS"],
  TI: ["GR"],
}

function getTagline(regionCode: string, regionName: string) {
  if (regionCode === "ZH") {
    return "Find golf courses near Zurich where you can play without being a member of that club."
  }
  return `Find where you can play golf as an independent guest in ${regionName}.`
}

function getRegionIntro(regionCode: string, regionName: string) {
  if (regionCode === "ZH") {
    return "Looking for golf near Zurich? Compare golf courses in Zurich for independent guests, with clear information on guest access, handicap requirements and when you can play."
  }
  return `Explore golf in ${regionName} for independent guests and compare courses by location, access and playing requirements.`
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const regionCode = resolvedParams.region.toUpperCase()
  const regionName = regionNames[regionCode] || regionCode

  return {
    title:
      regionCode === "ZH"
        ? "Golf near Zurich | Play as an independent guest"
        : `Golf in ${regionName} | Play as an independent guest`,
    description:
      regionCode === "ZH"
        ? "Find golf near Zurich for independent guests. Compare golf courses in Zurich by guest access, handicap requirements and playing availability."
        : `Find golf in ${regionName} for independent guests. Compare courses by guest access, handicap requirements and playing availability.`,
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const supabase = await createClient()
  const resolvedParams = await params
  const regionCode = resolvedParams.region.toUpperCase()

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("region", regionCode)

  const regionName = regionNames[regionCode] || regionCode

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 px-5 pb-8 pt-8 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link href="/switzerland" className="text-sm text-white">
            ← Switzerland
          </Link>

          {/* FIXED HEADER LAYOUT */}
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="w-full">
              <h1 className="text-[24px] font-semibold">
                {regionCode === "ZH"
                  ? "Golf near Zurich for independent guests"
                  : `Golf in ${regionName} for independent guests`}
              </h1>

              <p className="mt-2 text-[15px]">
                {getTagline(regionCode, regionName)}
              </p>

              <p className="mt-3 text-[14px]">
                {getRegionIntro(regionCode, regionName)}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
              {courses?.length || 0} courses
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[480px] px-5 py-6">
        <h2 className="text-base font-semibold">
          Golf courses in {regionName}
        </h2>

        <div className="mt-4 grid gap-4">
          {courses?.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {nearbyRegions[regionCode] && (
          <div className="mt-6">
            <h3 className="font-semibold">Nearby regions</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {nearbyRegions[regionCode].map((code) => (
                <Link key={code} href={`/switzerland/${code.toLowerCase()}`}>
                  {regionNames[code]}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}