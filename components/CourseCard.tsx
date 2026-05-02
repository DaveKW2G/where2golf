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

function isLikelyOpenToday(guestPlay?: string): boolean {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDay()

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
  course_image,
  distance,
  max_handicap,
  searchParams,
}: CourseCardProps) {
  const href = `/courses/${id}`

  let guestLabel = independent_guest_days

  if (independent_guest_days === "Everyday") guestLabel = "Guests Everyday"
  if (independent_guest_days === "Weekdays") guestLabel = "Guests Weekdays"
  if (independent_guest_days === "Weekend") guestLabel = "Guests Weekend"

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {course_image && (
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={course_image}
            alt={`${course_name} golf course`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="space-y-1.5 p-4">
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