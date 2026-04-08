import { createClient } from "@/lib/supabase/server"
import BackButton from "@/components/BackButton"

type CoursePageProps = {
  params: Promise<{
    id: string
  }>
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

type Course = {
  id: number
  course_name: string
  town: string
  region: string
  full_address?: string | null
  holes: number
  independent_guest_days: string
  season: string
  price_range?: string | null
  handicap_required?: boolean | null
  max_handicap?: number | null
  website?: string | null
  phone_number?: string | null
  notes?: string | null
  course_image?: string | null
  latitude?: number | null
  longitude?: number | null
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value?: string
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 last:border-b-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-900">
        {value || "—"}
      </span>
    </div>
  )
}

function getSingleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

function buildFallbackHref(searchParams: {
  [key: string]: string | string[] | undefined
}) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && value.trim() !== "") {
      params.set(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item.trim() !== "") {
          params.append(key, item)
        }
      })
    }
  }

  const queryString = params.toString()
  return queryString ? `/results?${queryString}` : "/results"
}

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
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

function getWebsiteUrl(website?: string | null) {
  if (!website) return null

  const trimmed = website.trim()
  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

export default async function CoursePage({
  params,
  searchParams,
}: CoursePageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, full_address, holes, independent_guest_days, season, price_range, handicap_required, max_handicap, website, phone_number, notes, course_image, latitude, longitude"
    )
    .eq("id", Number(resolvedParams.id))
    .single()

  const fallbackHref = buildFallbackHref(resolvedSearchParams)

  if (error || !data) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6">
        <div className="mx-auto max-w-[480px] rounded-[28px] bg-white p-6 shadow-sm">
          <BackButton
            fallbackHref={fallbackHref}
            className="inline-block text-slate-700"
          >
            ← Back
          </BackButton>

          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Course not found
          </h1>
        </div>
      </main>
    )
  }

  const course = data as Course

  const latParam = getSingleParam(resolvedSearchParams.lat)
  const lngParam = getSingleParam(resolvedSearchParams.lng)

  let distanceBadge: string | null = null

  if (
    latParam &&
    lngParam &&
    course.latitude != null &&
    course.longitude != null
  ) {
    const userLat = Number(latParam)
    const userLng = Number(lngParam)

    if (!Number.isNaN(userLat) && !Number.isNaN(userLng)) {
      const distanceKm = getDistanceKm(
        userLat,
        userLng,
        course.latitude,
        course.longitude
      )

      distanceBadge = `📍 ${distanceKm.toFixed(1)} km`
    }
  }

  const websiteUrl = getWebsiteUrl(course.website)

  const directionsQuery = encodeURIComponent(
    `${course.course_name}, ${course.town}, ${course.region}`
  )

  const handicapText =
    course.max_handicap != null
      ? `Max Handicap ${course.max_handicap}`
      : course.handicap_required
      ? "Handicap Required"
      : "Max Handicap —"

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-4 pb-28">
      <div className="mx-auto max-w-[480px] overflow-hidden rounded-[30px] bg-white shadow-sm">

        <div className="relative h-60 w-full overflow-hidden bg-slate-200">
          {course.course_image ? (
            <img
              src={course.course_image}
              alt={course.course_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[15px] text-slate-500">
              No image available
            </div>
          )}

          <div className="absolute inset-x-0 top-0 p-4">
            <BackButton
              fallbackHref={fallbackHref}
              className="rounded-full bg-white px-3 py-2 text-[14px] font-medium text-slate-800 shadow-sm"
            >
              ← Back
            </BackButton>
          </div>

          <div className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="px-5 pt-5 pb-4 space-y-2">
          <h1 className="text-[22px] font-bold text-slate-900">
            {course.course_name}
          </h1>

          <p className="text-[14px] text-slate-500">
            {course.town}, {course.region}
          </p>

          {distanceBadge && (
            <p className="text-sm text-slate-600">
              {distanceBadge}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-800">
              Guests {course.independent_guest_days}
            </span>

            <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-800">
              {handicapText}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-700">
              {course.holes} Holes
            </span>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <DetailRow label="Season" value={course.season} />
          <DetailRow label="Price" value={course.price_range || "Not listed"} />
        </div>

        {course.notes && (
          <div className="border-t border-slate-200 px-5 py-5">
            <p className="text-[15px] leading-7 text-slate-600 whitespace-pre-line">
              {course.notes}
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
        <div className="flex w-full max-w-[480px] gap-3">

          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-[1.5] rounded-xl bg-emerald-700 px-4 py-3 text-center text-[14px] font-semibold text-white shadow-lg no-underline"
            >
              Website
            </a>
          ) : (
            <div className="flex-[1.5] rounded-xl bg-slate-300 px-4 py-3 text-center text-[14px] text-slate-600">
              Website
            </div>
          )}

          {course.phone_number ? (
            <a
              href={`tel:${course.phone_number}`}
              className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-center text-[14px] font-semibold text-white shadow-md no-underline"
            >
              Call
            </a>
          ) : (
            <div className="flex-1 rounded-xl bg-slate-300 px-4 py-3 text-center text-[14px] text-slate-600">
              Call
            </div>
          )}

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${directionsQuery}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-xl bg-green-700 px-4 py-3 text-center text-[14px] font-semibold text-white shadow-md no-underline"
          >
            Directions
          </a>
        </div>
      </div>
    </main>
  )
}