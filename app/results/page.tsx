import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CourseCard from "@/components/CourseCard"

export const metadata: Metadata = {
  title: "Golf Course Results | GuestPlayGolf",
  description:
    "Browse golf course results by guest access, region, handicap, price and distance.",
  robots: {
    index: false,
    follow: true,
  },
}

type ResultsPageProps = {
  searchParams: Promise<{
    country?: string
    region?: string
    guestPlay?: string
    holes?: string
    season?: string
    handicap?: string
    lat?: string
    lng?: string
    where?: string
    search?: string
    today?: string
    radius?: string
    price?: string
    source?: string
    courseType?: string
    planner?: string
    tripId?: string
    day?: string
    slot?: string
  }>
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

async function geocodePlace(place: string, country?: string) {
  try {
    const countryName =
      country === "ireland"
        ? "Ireland"
        : country === "switzerland"
        ? "Switzerland"
        : "Switzerland"

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        `${place}, ${countryName}`
      )}`,
      {
        headers: {
          "User-Agent": "GuestPlayGolf/1.0",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) return null

    const data = await response.json()

    if (!data || data.length === 0) return null

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    }
  } catch {
    return null
  }
}

function normaliseCountry(country?: string) {
  if (!country) return null
  return country.toLowerCase()
}

function displayCountry(country?: string | null) {
  if (country === "ireland") return "Ireland"
  if (country === "switzerland") return "Switzerland"
  return undefined
}

function getPlannerBaseHref(country?: string | null) {
  if (country === "switzerland") return "/switzerland/planner"
  return "/ireland/planner"
}

function getPlannerHref(country?: string | null, tripId?: string) {
  const baseHref = getPlannerBaseHref(country)

  if (tripId && tripId !== "undefined" && tripId !== "null") {
    return `${baseHref}?tripId=${encodeURIComponent(tripId)}`
  }

  return baseHref
}

function buildFiltersHref(params: Awaited<ResultsPageProps["searchParams"]>) {
  const filterParams = new URLSearchParams()

  if (params.country) filterParams.set("country", params.country)
  if (params.source) filterParams.set("source", params.source)
  if (params.planner) filterParams.set("planner", params.planner)
  if (params.tripId) filterParams.set("tripId", params.tripId)
  if (params.where) filterParams.set("where", params.where)
  if (params.radius) filterParams.set("radius", params.radius)
  if (params.courseType) filterParams.set("courseType", params.courseType)
  if (params.guestPlay) filterParams.set("guestPlay", params.guestPlay)
  if (params.holes) filterParams.set("holes", params.holes)
  if (params.handicap) filterParams.set("handicap", params.handicap)
  if (params.price) filterParams.set("price", params.price)

  const queryString = filterParams.toString()

  return queryString ? `/filters?${queryString}` : "/filters"
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const selectedCountry = normaliseCountry(params.country || params.source)
  const selectedCountryDisplay = displayCountry(selectedCountry)
  const isPlannerMode = params.source === "planner" || params.planner === "true"

  const plannerHref = getPlannerHref(selectedCountry, params.tripId)

  let userLat = params.lat ? Number(params.lat) : null
  let userLng = params.lng ? Number(params.lng) : null

  if ((userLat == null || userLng == null) && params.where) {
    const geocoded = await geocodePlace(params.where, selectedCountry || undefined)
    if (geocoded) {
      userLat = geocoded.lat
      userLng = geocoded.lng
    }
  }

  const hasLocation = userLat != null && userLng != null

  const hasIrelandAdvancedFilters =
    selectedCountry === "ireland" &&
    Boolean(
      params.where ||
        params.radius ||
        params.courseType ||
        params.guestPlay ||
        params.holes ||
        params.price
    )

  const hasSwitzerlandAdvancedFilters =
    selectedCountry === "switzerland" &&
    Boolean(
      params.where ||
        params.radius ||
        params.guestPlay ||
        params.holes ||
        params.handicap ||
        params.price
    )

  const backHref = isPlannerMode
    ? plannerHref
    : params.source === "home"
    ? "/"
    : hasIrelandAdvancedFilters
    ? buildFiltersHref(params)
    : hasSwitzerlandAdvancedFilters
    ? buildFiltersHref(params)
    : selectedCountry === "switzerland"
    ? "/switzerland"
    : selectedCountry === "ireland"
    ? "/ireland"
    : "/filters"

  const selectedHandicap =
    params.handicap && params.handicap !== "N/A"
      ? Number(params.handicap)
      : null

  const zurichWeekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Europe/Zurich",
  }).format(new Date())

  const isWeekendToday = zurichWeekday === "Sat" || zurichWeekday === "Sun"

  let query = supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, latitude, longitude, handicap_required, max_handicap, search_text, course_type"
    )

  if (selectedCountry) {
    query = query.ilike("country", selectedCountry)
  }

  if (params.search) {
    query = query.ilike("search_text", `%${params.search.toLowerCase()}%`)
  }

  if (params.today === "true") {
    query = query.in(
      "independent_guest_days",
      isWeekendToday ? ["Weekend", "Everyday"] : ["Weekdays", "Everyday"]
    )
  }

  if (params.region) query = query.eq("region", params.region)

  if (params.courseType) {
    query = query.ilike("course_type", params.courseType)
  }

  if (params.guestPlay === "Weekend") {
    query = query.in("independent_guest_days", ["Weekend", "Everyday"])
  } else if (params.guestPlay === "Weekdays") {
    query = query.in("independent_guest_days", ["Weekdays", "Everyday"])
  } else if (params.guestPlay === "Everyday") {
    query = query.eq("independent_guest_days", "Everyday")
  } else if (params.guestPlay === "Limited Access") {
    query = query.eq("independent_guest_days", "Limited Access")
  }

  if (params.holes) query = query.eq("holes", Number(params.holes))
  if (params.season) query = query.eq("season", params.season)

  if (params.handicap === "N/A") {
    query = query.eq("handicap_required", false)
  }

  if (params.price) query = query.eq("price_range", params.price)

  const { data: courses, error } = await query.limit(300)

  let sortedCourses = courses ? [...courses] : []

  if (params.handicap === "N/A") {
    sortedCourses = sortedCourses.filter(
      (course: any) => course.handicap_required === false
    )
  }

  if (selectedHandicap != null && !Number.isNaN(selectedHandicap)) {
    sortedCourses = sortedCourses.filter((course: any) => {
      if (course.handicap_required === false) return true

      const maxHandicap =
        typeof course.max_handicap === "number"
          ? course.max_handicap
          : Number(course.max_handicap)

      return !Number.isNaN(maxHandicap) && maxHandicap >= selectedHandicap
    })
  }

  if (!hasLocation) {
    sortedCourses.sort((a: any, b: any) =>
      a.course_name.localeCompare(b.course_name)
    )
  }

  if (hasLocation) {
    sortedCourses = sortedCourses.map((c: any) => {
      let distance
      if (c.latitude && c.longitude) {
        distance = getDistanceKm(userLat!, userLng!, c.latitude, c.longitude)
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
    const urlParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, String(value))
    })

    if (selectedCountryDisplay && !urlParams.get("country")) {
      urlParams.set("country", selectedCountryDisplay)
    }

    return `/map?${urlParams.toString()}`
  })()

  const titleCountry =
    selectedCountry === "ireland"
      ? "Ireland"
      : selectedCountry === "switzerland"
      ? "Switzerland"
      : ""

  return (
    <main className="min-h-screen bg-stone-100 pb-24">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 py-7 text-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4">
          <Link href={backHref} className="text-sm font-semibold text-white no-underline">
            ← Back
          </Link>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/15">
            {sortedCourses.length} found
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-[1180px]">
          {isPlannerMode && (
            <div className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-900">
              Trip Planner Mode
            </div>
          )}

          <h1 className="text-[28px] font-bold leading-tight md:text-[40px]">
            {isPlannerMode
              ? "Choose courses for your trip"
              : titleCountry
              ? `Golf Courses in ${titleCountry}`
              : "Golf Courses"}
          </h1>

          <p className="mt-3 max-w-[680px] text-sm leading-6 text-white/80 md:text-base">
            {isPlannerMode
              ? "Add courses to your saved itinerary, then return to the planner to assign them to days and check access."
              : "Browse guest-friendly golf courses by location, access, price and distance."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-5 py-7">
        {error && <p>Error loading courses</p>}

        {!isPlannerMode && selectedCountry === "ireland" && (
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 p-5 text-white shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-100/80">
                  Golf Trip Planner
                </div>

                <h2 className="mt-2 text-xl font-bold">
                  Planning a golf trip?
                </h2>

                <p className="mt-2 max-w-[700px] text-sm leading-6 text-white/85">
                  Compare nearby courses, build a day-by-day itinerary, vote with your
                  golf group and share your plans.
                </p>
              </div>

              <Link
                href="/ireland/planner"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-emerald-900 no-underline"
              >
                Start Planning
              </Link>
            </div>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCourses.map((course: any) => (
            <CourseCard
              key={course.id}
              {...course}
              userLat={userLat}
              userLng={userLng}
              searchParams={{
                ...params,
                country: selectedCountryDisplay || params.country,
              }}
            />
          ))}
        </div>
      </div>

      {!isPlannerMode && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-5">
          <Link
            href={mapHref}
            className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white shadow-lg no-underline"
          >
            View Map
          </Link>
        </div>
      )}

      {isPlannerMode && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-5">
          <Link
            href={plannerHref}
            className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white shadow-lg no-underline"
          >
            Back to Planner
          </Link>
        </div>
      )}
    </main>
  )
}