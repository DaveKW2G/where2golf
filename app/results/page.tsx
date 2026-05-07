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
  }>
}

type ResultsSearchParams = {
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

  const value = country.toLowerCase()

  if (value === "ireland") return "ireland"
  if (value === "switzerland") return "switzerland"

  return null
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const selectedCountry = normaliseCountry(params.country || params.source)

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

  const backHref =
    params.source === "home"
      ? "/"
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
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, latitude, longitude, handicap_required, max_handicap, search_text"
    )

  if (selectedCountry) {
    query = query.eq("country", selectedCountry)
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

  if (params.guestPlay === "Weekend") {
    query = query.in("independent_guest_days", ["Weekend", "Everyday"])
  } else if (params.guestPlay === "Weekdays") {
    query = query.in("independent_guest_days", ["Weekdays", "Everyday"])
  } else if (params.guestPlay === "Everyday") {
    query = query.eq("independent_guest_days", "Everyday")
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
      if (course.handicap_required === false) {
        return true
      }

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

    if (selectedCountry && !urlParams.get("country")) {
      urlParams.set("country", selectedCountry)
    }

    const url = urlParams.toString()

    return url ? `/map?${url}` : "/map"
  })()

  const titleCountry =
    selectedCountry === "ireland"
      ? "Ireland"
      : selectedCountry === "switzerland"
      ? "Switzerland"
      : ""

  return (
    <main className="min-h-screen bg-stone-100">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pt-5 pb-6 text-white">
        <div className="relative z-10 mx-auto max-w-[480px]">
          <div className="flex items-center justify-between">
            <Link href={backHref} className="text-white no-underline">
              ← Back
            </Link>

            <div className="text-[14px] font-semibold uppercase tracking-wide text-white/85">
              GuestPlayGolf
            </div>

            <div className="text-[13px] text-white/75">
              {sortedCourses.length} found
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-[24px] font-bold text-white">
              {params.where
                ? `Golf near ${params.where}`
                : titleCountry
                ? `Golf Courses in ${titleCountry}`
                : "Golf Courses"}
            </h1>

            <p className="mt-2 text-[14px] text-white/80">
              Courses available for independent guests with clear access rules.
            </p>

            <p className="mt-2 text-[13px] text-white/70">
              {hasLocation
                ? params.radius
                  ? `Within ${params.radius} km • Sorted by distance`
                  : "Sorted by distance"
                : "Sorted A–Z"}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[480px] px-5 pb-24">
        {error && <p className="text-red-600">Error loading courses</p>}

        {sortedCourses.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm">
            <div className="text-[16px] font-semibold text-slate-900">
              No courses match your filters
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Try increasing your radius or adjusting your filters.
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
                searchParams={{
                  ...params,
                  country: selectedCountry || params.country,
                }}
              />
            ))}
          </div>
        )}
      </div>

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