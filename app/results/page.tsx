import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

type ResultsPageProps = {
  searchParams: Promise<{
    region?: string
    guestPlay?: string
    holes?: string
    season?: string
    handicap?: string
    lat?: string
    lng?: string
    search?: string
    today?: string
    radius?: string
    price?: string
    source?: string
  }>
}

type ResultsSearchParams = {
  region?: string
  guestPlay?: string
  holes?: string
  season?: string
  handicap?: string
  lat?: string
  lng?: string
  search?: string
  today?: string
  radius?: string
  price?: string
}

const regionNames: Record<string, string> = {
  ZH: "Zurich",
  VD: "Vaud",
  BE: "Bern",
  TI: "Ticino",
  GE: "Geneva",
  VS: "Valais",
  GR: "Graubünden",
  SG: "St. Gallen",
  LU: "Lucerne",
  ZG: "Zug",
  AG: "Aargau",
  FR: "Fribourg",
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[13px] font-medium text-emerald-800">
      {label}
    </span>
  )
}

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/* ✅ FIXED: preserves lat/lng + all params */
function buildResultsHref(
  params: ResultsSearchParams,
  updates: Partial<Record<keyof ResultsSearchParams, string>>
) {
  const nextParams: ResultsSearchParams = {
    ...params,
    ...updates,
  }

  const urlParams = new URLSearchParams()

  Object.entries(nextParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.set(key, String(value))
    }
  })

  return `/results?${urlParams.toString()}`
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const userLat = params.lat ? Number(params.lat) : null
  const userLng = params.lng ? Number(params.lng) : null

  const backHref = params.source === "home" ? "/" : "/filters"

  let query = supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, latitude, longitude, max_handicap, search_text"
    )

  if (params.search) {
    query = query.ilike("search_text", `%${params.search.toLowerCase()}%`)
  }

  if (params.today === "true") {
    query = query.in("independent_guest_days", [
      "Everyday",
      "Weekdays",
      "Weekend",
    ])
  }

  if (params.region) query = query.eq("region", params.region)
  if (params.guestPlay) query = query.eq("independent_guest_days", params.guestPlay)
  if (params.holes) query = query.eq("holes", Number(params.holes))
  if (params.season) query = query.eq("season", params.season)
  if (params.handicap) query = query.lte("max_handicap", Number(params.handicap))
  if (params.price) query = query.eq("price_range", params.price)

  const { data: courses, error } = await query.limit(200)

  let sortedCourses = courses ? [...courses] : []

  if (userLat != null && userLng != null) {
    sortedCourses = sortedCourses.map((c: any) => {
      let distance

      if (c.latitude && c.longitude) {
        distance = getDistanceKm(userLat, userLng, c.latitude, c.longitude)
      }

      return { ...c, distance }
    })

    if (params.radius) {
      const radius = Number(params.radius)
      sortedCourses = sortedCourses.filter(
        (c: any) => c.distance && c.distance <= radius
      )
    }

    sortedCourses.sort((a: any, b: any) => {
      return (a.distance ?? 9999) - (b.distance ?? 9999)
    })
  }

  const mapHref = (() => {
    const url = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v) as [string, string][]
    ).toString()

    return url ? `/map?${url}` : "/map"
  })()

  return (
    <main className="min-h-screen bg-stone-100">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pt-5 pb-6 text-white">
        <div className="relative z-10 mx-auto max-w-[480px]">
          
          <div className="flex items-center justify-between">
            <Link href={backHref} className="text-white no-underline">
              ← Back
            </Link>

            <div className="text-[14px] font-semibold uppercase tracking-wide text-white/85">
              Where2Golf
            </div>

            <div className="text-[13px] text-white/75">
              {sortedCourses.length} found
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-[24px] font-bold text-white">
              Golf Courses
            </h1>

            <p className="mt-2 text-[14px] text-white/80">
              Courses available for independent guests with clear access rules.
            </p>
          </div>
        </div>
      </section>

      {/* SUBTLE DISCLAIMER */}
      {params.today === "true" && (
        <div className="mx-auto max-w-[480px] px-5 mt-3">
          <p className="text-[13px] text-slate-500">
            Availability is based on typical season and access rules. Always confirm with the club.
          </p>
        </div>
      )}

      {/* FILTER CHIPS + RADIUS */}
      <div className="mx-auto max-w-[480px] px-5 py-3">

        <div className="flex flex-wrap gap-2 mb-3">
          {params.price && <FilterChip label={`Price: ${params.price}`} />}
          {params.region && (
            <FilterChip label={regionNames[params.region] || params.region} />
          )}
          {params.guestPlay && <FilterChip label={params.guestPlay} />}
          {params.holes && <FilterChip label={`${params.holes} Holes`} />}
          {params.handicap && <FilterChip label={`HCP ≤ ${params.handicap}`} />}
          {params.radius && <FilterChip label={`Within ${params.radius}km`} />}
        </div>

        {/* ✅ RADIUS BUTTONS */}
        {userLat != null && userLng != null && (
          <div className="flex gap-2">
            <Link
              href={buildResultsHref(params, { radius: "25" })}
              className={`rounded-xl border px-3 py-1 text-sm ${
                params.radius === "25"
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              25km
            </Link>

            <Link
              href={buildResultsHref(params, { radius: "50" })}
              className={`rounded-xl border px-3 py-1 text-sm ${
                params.radius === "50"
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              50km
            </Link>

            <Link
              href={buildResultsHref(params, { radius: "100" })}
              className={`rounded-xl border px-3 py-1 text-sm ${
                params.radius === "100"
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              100km
            </Link>
          </div>
        )}

      </div>

      {/* RESULTS */}
      <div className="mx-auto max-w-[480px] px-5 pb-24">
        {error && <p className="text-red-600">Error loading courses</p>}

        {sortedCourses.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="text-[16px] font-semibold text-slate-900">
              No courses match your filters
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Try adjusting your filters or expanding your search.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCourses.map((course: any) => (
              <CourseCard
                key={course.id}
                {...course}
                userLat={userLat}
                userLng={userLng}
                searchParams={params}
              />
            ))}
          </div>
        )}
      </div>

      {/* MAP BUTTON */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <Link
          href={mapHref}
          className="rounded-full bg-emerald-700 px-7 py-3 text-[15px] font-semibold text-white shadow-lg no-underline"
        >
          View Map
        </Link>
      </div>
    </main>
  )
}