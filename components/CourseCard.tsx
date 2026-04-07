import Link from "next/link"

interface CourseCardProps {
  id: number
  course_name: string
  town: string
  region: string
  holes?: number
  independent_guest_days?: string
  season?: string
  price_range?: string
  course_image?: string
  distance?: number
  max_handicap?: number
  userLat?: number | null
  userLng?: number | null
  searchParams?: Record<string, string | string[] | undefined>
}

function buildCourseHref(
  id: number,
  searchParams?: Record<string, string | string[] | undefined>,
  userLat?: number | null,
  userLng?: number | null
) {
  const params = new URLSearchParams()

  if (searchParams) {
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
  }

  if (userLat != null && !params.get("lat")) {
    params.set("lat", String(userLat))
  }

  if (userLng != null && !params.get("lng")) {
    params.set("lng", String(userLng))
  }

  const queryString = params.toString()
  return queryString ? `/courses/${id}?${queryString}` : `/courses/${id}`
}

// ✅ NEW FUNCTION
function isLikelyOpenToday(guestPlay?: string): boolean {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDay() // 0 = Sunday

  // Winter (very unlikely open)
  if (month <= 2 || month === 12) return false

  const isWeekend = day === 0 || day === 6

  if (guestPlay === "Everyday") return true
  if (isWeekend && guestPlay === "Weekend") return true
  if (!isWeekend && guestPlay === "Weekdays") return true

  return false
}

export default function CourseCard({
  id,
  course_name,
  town,
  region,
  holes,
  independent_guest_days,
  season,
  price_range,
  course_image,
  distance,
  max_handicap,
  userLat,
  userLng,
  searchParams,
}: CourseCardProps) {
  const href = buildCourseHref(id, searchParams, userLat, userLng)

  let guestLabel = independent_guest_days

  if (independent_guest_days === "Everyday") guestLabel = "Guests Everyday"
  if (independent_guest_days === "Weekdays") guestLabel = "Guests Weekdays"
  if (independent_guest_days === "Weekend") guestLabel = "Guests Weekend"

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
    >
      {course_image && (
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={course_image}
            alt={course_name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="p-4 space-y-1.5">
        <h3 className="text-[17px] font-semibold text-slate-900">
          {course_name}
        </h3>

        <p className="text-[14px] text-slate-500">
          {town}, {region}
        </p>

        {distance !== undefined && distance !== null && (
          <p className="text-sm text-slate-600">
            📍 {distance.toFixed(1)} km
          </p>
        )}

        {/* ✅ NEW BADGE */}
        {searchParams?.today === "true" &&
          isLikelyOpenToday(independent_guest_days) && (
            <div className="mt-2">
              <span className="rounded-full bg-green-600 px-3 py-1 text-[12px] font-semibold text-white">
                Likely Open Today
              </span>
            </div>
          )}

        <div className="mt-3 flex flex-wrap gap-2">
          {guestLabel && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-800">
              {guestLabel}
            </span>
          )}

          {max_handicap !== undefined && max_handicap !== null && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-800">
              Max Handicap {max_handicap}
            </span>
          )}

          {holes && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-700">
              {holes} Holes
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}