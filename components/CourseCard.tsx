'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface CourseCardProps {
  id: number
  country?: string
  course_name: string
  town: string
  region: string
  holes?: number
  independent_guest_days?: string
  season?: string
  price_range?: string
  course_type?: string
  course_image?: string
  distance?: number
  latitude?: number
  longitude?: number
  max_handicap?: number
  userLat?: number | null
  userLng?: number | null
  searchParams?: Record<string, string | string[] | undefined>
}

type PlannerCourse = {
  id: number
  course_name: string
  town: string
  region: string
  holes?: number
  independent_guest_days?: string
  price_range?: string
  course_type?: string
  course_image?: string
  distance?: number
  latitude?: number
  longitude?: number
  max_handicap?: number
}

const genericPlannerCoursesKey = 'guestplaygolf_planner_courses'
const genericPlannerTripIdKey = 'guestplaygolf_trip_id'
const switzerlandPlannerCoursesKey = 'guestplaygolf_switzerland_planner_courses'
const switzerlandPlannerTripIdKey = 'guestplaygolf_switzerland_trip_id'

function isLikelyOpenToday(guestPlay?: string): boolean {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDay()

  if (month <= 2 || month === 12) return false

  const isWeekend = day === 0 || day === 6

  if (guestPlay === 'Everyday') return true
  if (isWeekend && guestPlay === 'Weekend') return true
  if (!isWeekend && guestPlay === 'Weekdays') return true

  return false
}

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

function getCountryFromParams(
  country?: string,
  searchParams?: Record<string, string | string[] | undefined>
) {
  const paramCountry = getSingleParam(searchParams?.country)

  if (country) return country.toLowerCase()
  if (paramCountry) return paramCountry.toLowerCase()

  return ''
}

function getPlannerStorageKeys(countryValue: string) {
  if (countryValue === 'switzerland') {
    return {
      coursesKey: switzerlandPlannerCoursesKey,
      tripIdKey: switzerlandPlannerTripIdKey,
    }
  }

  return {
    coursesKey: genericPlannerCoursesKey,
    tripIdKey: genericPlannerTripIdKey,
  }
}

function getPlannerBasePath(countryValue: string) {
  if (countryValue === 'switzerland') return '/switzerland/planner'
  return '/ireland/planner'
}

function getPlannerHref(countryValue: string, tripId?: string | null) {
  const basePath = getPlannerBasePath(countryValue)

  if (isValidTripId(tripId || null)) {
    return `${basePath}?tripId=${encodeURIComponent(tripId!)}`
  }

  return basePath
}

function getAccessLabel(access?: string, isIreland?: boolean) {
  if (!access) return null

  const cleanAccess = access.trim()

  if (cleanAccess === 'Limited Access' || cleanAccess === 'Limited') {
    return isIreland ? 'Limited Visitor Access' : 'Limited Guest Access'
  }

  if (cleanAccess === 'Resort') {
    return 'Resort Access'
  }

  if (isIreland) {
    if (cleanAccess === 'Everyday') return 'Visitors Everyday'
    if (cleanAccess === 'Weekdays') return 'Visitors Weekdays'
    if (cleanAccess === 'Weekend') return 'Visitors Weekend'

    if (cleanAccess.startsWith('Guests ')) {
      return cleanAccess.replace('Guests', 'Visitors')
    }

    return `Visitors ${cleanAccess}`
  }

  if (cleanAccess === 'Everyday') return 'Guests Everyday'
  if (cleanAccess === 'Weekdays') return 'Guests Weekdays'
  if (cleanAccess === 'Weekend') return 'Guests Weekend'

  if (cleanAccess.startsWith('Guests ')) {
    return cleanAccess
  }

  return `Guests ${cleanAccess}`
}

function shouldShowIrelandHandicap(maxHandicap?: number) {
  if (maxHandicap === undefined || maxHandicap === null) return false
  return maxHandicap > 0 && maxHandicap < 54
}

function isValidTripId(value: string | null) {
  return Boolean(value && value !== 'undefined' && value !== 'null')
}

export default function CourseCard({
  id,
  country,
  course_name,
  town,
  region,
  holes,
  independent_guest_days,
  price_range,
  course_type,
  course_image,
  distance,
  latitude,
  longitude,
  max_handicap,
  searchParams,
}: CourseCardProps) {
  const [isAddedToPlanner, setIsAddedToPlanner] = useState(false)
  const [isSavingToPlanner, setIsSavingToPlanner] = useState(false)
  const [plannerSaveError, setPlannerSaveError] = useState('')
  const [hasActiveTrip, setHasActiveTrip] = useState(false)
  const [storedTripIdState, setStoredTripIdState] = useState<string | null>(null)

  const params = new URLSearchParams()

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim() !== '') {
        params.set(key, value)
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item.trim() !== '') params.append(key, item)
        })
      }
    })
  }

  const returnParams = new URLSearchParams(params)
  const resultsQueryString = params.toString()
  const source = getSingleParam(searchParams?.source)

  const sourceReturnTo: Record<string, string> = {
    'irish-links-golf': '/irish-links-golf',
    'links-golf-near-dublin': '/links-golf-near-dublin',
    'golf-near-dublin': '/golf-near-dublin',
    'golf-near-cork': '/golf-near-cork',
    'golf-near-galway': '/golf-near-galway',
    'golf-near-belfast': '/golf-near-belfast',
    'golf-near-adare-manor': '/golf-near-adare-manor',
    'golf-near-zurich': '/golf-near-zurich',
    'golf-near-geneva': '/golf-near-geneva',
    'golf-near-basel': '/golf-near-basel',
    'golf-near-lausanne': '/golf-near-lausanne',
    'golf-near-lucerne': '/golf-near-lucerne',
    'golf-in-the-swiss-alps': '/golf-in-the-swiss-alps',
    'golf-near-st-gallen': '/golf-near-st-gallen',
    'golf-near-lugano': '/golf-near-lugano',
    'golf-near-winterthur': '/golf-near-winterthur',
  }

  if (!returnParams.get('returnTo')) {
    if (source && sourceReturnTo[source]) {
      returnParams.set('returnTo', sourceReturnTo[source])
    } else if (resultsQueryString) {
      returnParams.set('returnTo', `/results?${resultsQueryString}`)
    }
  }

  const courseQueryString = returnParams.toString()
  const href = courseQueryString ? `/courses/${id}?${courseQueryString}` : `/courses/${id}`

  const countryValue = getCountryFromParams(country, searchParams)
  const isIreland = countryValue === 'ireland'
  const isSwitzerland = countryValue === 'switzerland'
  const isPlannerCountry = isIreland || isSwitzerland
  const plannerStorageKeys = getPlannerStorageKeys(countryValue)
  const isPlannerMode = getSingleParam(searchParams?.planner) === 'true'
  const urlTripId = getSingleParam(searchParams?.tripId)
  const activeTripIdForLink = urlTripId || storedTripIdState
  const plannerHref = getPlannerHref(countryValue, activeTripIdForLink)

  const accessLabel = getAccessLabel(independent_guest_days, isIreland)

  const plannerCourse: PlannerCourse = useMemo(
    () => ({
      id,
      course_name: course_name?.trim(),
      town: town?.trim(),
      region: region?.trim(),
      holes,
      independent_guest_days: independent_guest_days?.trim(),
      price_range: price_range?.trim(),
      course_type: course_type?.trim(),
      course_image,
      distance,
      latitude,
      longitude,
      max_handicap,
    }),
    [
      id,
      course_name,
      town,
      region,
      holes,
      independent_guest_days,
      price_range,
      course_type,
      course_image,
      distance,
      latitude,
      longitude,
      max_handicap,
    ]
  )

  useEffect(() => {
    try {
      const storedTripId = window.localStorage.getItem(plannerStorageKeys.tripIdKey)
      const activeTripId = urlTripId || storedTripId
      const existing = window.localStorage.getItem(plannerStorageKeys.coursesKey)
      const courses = existing ? (JSON.parse(existing) as PlannerCourse[]) : []

      setStoredTripIdState(storedTripId)
      setHasActiveTrip(isValidTripId(activeTripId))
      setIsAddedToPlanner(courses.some((course) => course.id === id))
    } catch {
      setStoredTripIdState(null)
      setHasActiveTrip(false)
      setIsAddedToPlanner(false)
    }
  }, [id, urlTripId])

  async function handleAddToPlanner() {
    if (isSavingToPlanner) return

    setPlannerSaveError('')
    setIsSavingToPlanner(true)

    try {
      const storedTripId = window.localStorage.getItem(plannerStorageKeys.tripIdKey)
      const activeTripId = urlTripId || storedTripId

      if (!isValidTripId(activeTripId)) {
        setPlannerSaveError('Start a trip first to save this course.')
        setIsAddedToPlanner(false)
        setHasActiveTrip(false)
        return
      }

      window.localStorage.setItem(plannerStorageKeys.tripIdKey, activeTripId!)
      setStoredTripIdState(activeTripId!)
      setHasActiveTrip(true)

      const response = await fetch('/api/trips/add-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: activeTripId,
          course: plannerCourse,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        setPlannerSaveError(
          responseData.details ||
            responseData.error ||
            'Course was not synced to your trip.'
        )
        setIsAddedToPlanner(false)
        return
      }

      const syncedCourses = Array.isArray(responseData.selected_courses)
        ? responseData.selected_courses
        : []

      window.localStorage.setItem(plannerStorageKeys.coursesKey, JSON.stringify(syncedCourses))
      setIsAddedToPlanner(syncedCourses.some((course: PlannerCourse) => course.id === id))
      window.dispatchEvent(new Event('guestplaygolf-planner-courses-updated'))
    } catch {
      setPlannerSaveError('Could not add this course. Please try again.')
      setIsAddedToPlanner(false)
    } finally {
      setIsSavingToPlanner(false)
    }
  }

  const cardContent = (
    <>
      {course_image && (
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={course_image}
            alt={`${course_name} golf course`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
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

        {getSingleParam(searchParams?.today) === 'true' &&
          isLikelyOpenToday(independent_guest_days) && (
            <div className="mt-2">
              <span className="rounded-full bg-green-600 px-3 py-1 text-[12px] font-semibold text-white">
                Likely Open Today
              </span>
            </div>
          )}

        <div className="mt-3 flex flex-wrap gap-2">
          {isIreland ? (
            <>
              {course_type && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700">
                  {course_type}
                </span>
              )}

              {price_range && (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-[12px] font-bold text-yellow-800">
                  {price_range}
                </span>
              )}

              {accessLabel && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-800">
                  {accessLabel}
                </span>
              )}

              {shouldShowIrelandHandicap(max_handicap) && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-[12px] font-medium text-blue-800">
                  Max Handicap {max_handicap}
                </span>
              )}
            </>
          ) : (
            <>
              {accessLabel && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-800">
                  {accessLabel}
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
            </>
          )}
        </div>
      </div>
    </>
  )

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={href} className="block no-underline">
        {cardContent}
      </Link>

      {isPlannerMode ? (
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleAddToPlanner}
            disabled={isSavingToPlanner}
            className={`w-full rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-75 ${
              isAddedToPlanner
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-800 text-white'
            }`}
          >
            {isSavingToPlanner
              ? 'Adding...'
              : isAddedToPlanner
              ? 'Added to Trip'
              : 'Add to Trip'}
          </button>

          <Link
            href={plannerHref}
            className="mt-2 block rounded-full border border-emerald-200 bg-white px-5 py-3 text-center text-sm font-semibold text-emerald-800 no-underline"
          >
            Back to Planner
          </Link>

          {plannerSaveError && (
            <p className="mt-2 text-center text-xs text-red-600">
              {plannerSaveError}
            </p>
          )}
        </div>
      ) : isPlannerCountry ? (
        <div className="border-t border-slate-100 p-4">
          {hasActiveTrip && (
            <div className="mb-3 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
              Active golf trip detected
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={href}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 no-underline"
            >
              View Course
            </Link>

            {hasActiveTrip ? (
              <button
                type="button"
                onClick={handleAddToPlanner}
                disabled={isSavingToPlanner}
                className={`rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-75 ${
                  isAddedToPlanner
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-emerald-800 text-white'
                }`}
              >
                {isSavingToPlanner
                  ? 'Adding...'
                  : isAddedToPlanner
                  ? 'Added'
                  : 'Add to Trip'}
              </button>
            ) : (
              <Link
                href={plannerHref}
                className="rounded-full bg-emerald-800 px-4 py-3 text-center text-sm font-semibold text-white no-underline"
              >
                Plan Trip
              </Link>
            )}
          </div>

          {plannerSaveError && (
            <p className="mt-2 text-center text-xs text-red-600">
              {plannerSaveError}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
