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
  ZH: "Zurich",
  GE: "Geneva",
  VD: "Vaud",
  TI: "Ticino",
}

const regionInsights: Record<string, string> = {
  ZH: "Zurich is one of the most practical regions in Switzerland for independent guest play, with convenient access, flatter layouts and strong day-trip appeal.",
  GE: "Geneva is a more restricted golf market, where planning ahead matters more for independent guests.",
  VD: "Vaud offers a strong mix of lakeside and inland golf, with good variety for independent guests.",
  TI: "Ticino benefits from a milder climate and longer playing season than most of Switzerland.",
}

const nearbyRegions: Record<string, string[]> = {
  ZH: ["ZG", "AG", "SZ"],
  GE: ["VD"],
  VD: ["GE", "FR"],
  TI: ["GR"],
}

function getTagline(regionCode: string, regionName: string) {
  if (regionCode === "ZH") {
    return "Find golf courses near Zurich where you can play without being a member of that club."
  }
  return `Find where you can play golf as an independent guest in ${regionName}.`
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
        ? "Find golf near Zurich for independent guests. Compare golf courses in Zurich by access, handicap requirements and availability."
        : `Find golf in ${regionName} for independent guests.`,
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
  const courseCount = courses?.length || 0

  return (
    <main className="min-h-screen bg-stone-100">

      {/* HEADER */}
      <div className="bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 px-5 py-8 text-white">
        <div className="mx-auto max-w-[720px]"> {/* ✅ widened */}

          <Link href="/switzerland" className="text-sm text-white">
            ← Switzerland
          </Link>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="flex-1">

              <h1 className="text-[28px] font-semibold leading-tight">
                {regionCode === "ZH"
                  ? "Golf near Zurich for independent guests"
                  : `Golf in ${regionName} for independent guests`}
              </h1>

              <p className="mt-3 text-[16px] text-white/90">
                {getTagline(regionCode, regionName)}
              </p>

              <p className="mt-4 text-[15px] text-white/85">
                {regionInsights[regionCode]}
              </p>

            </div>

            <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-center">
              <div className="text-[20px] font-semibold">{courseCount}</div>
              <div className="text-xs uppercase tracking-wide opacity-80">
                courses
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-[720px] px-5 py-6"> {/* ✅ widened */}

        <h2 className="text-lg font-semibold text-slate-900">
          Golf courses in {regionName}
        </h2>

        <div className="mt-4 grid gap-4">
          {courses?.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {/* NEARBY */}
        {nearbyRegions[regionCode] && (
          <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Nearby regions
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {nearbyRegions[regionCode].map((code) => (
                <Link
                  key={code}
                  href={`/switzerland/${code.toLowerCase()}`}
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 no-underline"
                >
                  Golf in {regionNames[code]}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ACCESS */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Access and requirements
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Most golf courses in {regionName} require a recognised handicap and may limit independent guest access depending on the day and availability.
          </p>
        </div>

      </div>
    </main>
  )
}