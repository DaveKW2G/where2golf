'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type GolfIrelandMember = 'Yes' | 'No' | 'Not sure'
type DayType = 'Weekday' | 'Weekend'
type PlannerStep = 'setup' | 'planner'

type TripDay = {
  dayNumber: number
  dayType: DayType
}

type GeocodedBase = {
  label: string
  latitude: number
  longitude: number
}

type PlannerCourse = {
  id: number
  course_name: string
  town?: string
  region?: string
  holes?: number
  independent_guest_days?: string
  price_range?: string
  course_type?: string
  course_image?: string
  distance?: number
  max_handicap?: number | string
  assigned_day?: number | null
  assigned_slot?: 'Morning' | 'Afternoon' | null
}

type SavedTrip = {
  trip_id: string
  trip_name?: string
  base_location?: string
  month_of_travel?: string
  number_of_golfers?: number
  number_of_golf_days?: number
  selected_courses?: PlannerCourse[] | null
  created_at?: string
}

const quickBases = [
  'Dublin',
  'Cork',
  'Shannon',
  'Belfast',
  'Galway',
  'Killarney',
  'Lahinch',
  'Adare',
]

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function createTripDays(numberOfGolfDays: number, existingDays: TripDay[]) {
  return Array.from({ length: numberOfGolfDays }, (_, index) => {
    const existingDay = existingDays[index]

    return {
      dayNumber: index + 1,
      dayType: existingDay?.dayType || 'Weekday',
    }
  })
}

function getAverageDistance(courses: PlannerCourse[]) {
  const distances = courses
    .map((course) => course.distance)
    .filter((distance): distance is number => typeof distance === 'number')

  if (distances.length === 0) return null

  const totalDistance = distances.reduce((sum, distance) => sum + distance, 0)

  return totalDistance / distances.length
}

function getCourseMix(courses: PlannerCourse[]) {
  const courseTypes = Array.from(
    new Set(courses.map((course) => course.course_type).filter(Boolean))
  )

  if (courseTypes.length === 0) return '—'

  return courseTypes.join(' / ')
}

function getGreenFeeRange(priceRange?: string) {
  const cleanPrice = priceRange?.trim()

  if (cleanPrice === '€') return { low: 0, high: 100 }
  if (cleanPrice === '€€') return { low: 101, high: 200 }
  if (cleanPrice === '€€€') return { low: 201, high: 300 }
  if (cleanPrice === '€€€€') return { low: 300, high: 450 }

  return null
}

function formatEuroAmount(amount: number) {
  return `€${Math.round(amount).toLocaleString('en-IE')}`
}

function getGreenFeeEstimate(courses: PlannerCourse[]) {
  const courseRanges = courses
    .map((course) => getGreenFeeRange(course.price_range))
    .filter((range): range is { low: number; high: number } => Boolean(range))

  if (courseRanges.length === 0) return null

  const perGolferLow = courseRanges.reduce((sum, range) => sum + range.low, 0)
  const perGolferHigh = courseRanges.reduce((sum, range) => sum + range.high, 0)

  return {
    pricedCourses: courseRanges.length,
    perGolferLow,
    perGolferHigh,
  }
}

function generatePlannerUserId() {
  return `GPG-USER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
}

function getOrCreatePlannerUserId() {
  const existingUserId = window.localStorage.getItem('guestplaygolf_planner_user_id')

  if (existingUserId) return existingUserId

  const newUserId = generatePlannerUserId()
  window.localStorage.setItem('guestplaygolf_planner_user_id', newUserId)

  return newUserId
}

function getShortPlaceName(place?: string) {
  if (!place) return ''

  return place
    .split('\n')[0]
    .split(',')[0]
    .trim()
}


function parseAssignmentValue(value: string) {
  if (value === 'unassigned') {
    return {
      assignedDay: null as number | null,
      assignedSlot: null as 'Morning' | 'Afternoon' | null,
    }
  }

  const [dayPart, slotPart] = value.split('-')
  const assignedDay = Number(dayPart)
  const assignedSlot = slotPart === 'Afternoon' ? 'Afternoon' : 'Morning'

  return {
    assignedDay: Number.isNaN(assignedDay) ? null : assignedDay,
    assignedSlot: Number.isNaN(assignedDay)
      ? null
      : (assignedSlot as 'Morning' | 'Afternoon'),
  }
}

function getAssignmentValue(course: PlannerCourse) {
  if (!course.assigned_day || !course.assigned_slot) return 'unassigned'

  return `${course.assigned_day}-${course.assigned_slot}`
}

function getAssignedCourse(
  courses: PlannerCourse[],
  dayNumber: number,
  slot: 'Morning' | 'Afternoon'
) {
  return courses.find(
    (course) => course.assigned_day === dayNumber && course.assigned_slot === slot
  )
}


function getAccessValidation(course: PlannerCourse, dayType: DayType) {
  const access = course.independent_guest_days?.trim()

  if (!access) {
    return {
      isValid: false,
      message: 'Check visitor access',
    }
  }

  if (access === 'Everyday') {
    return {
      isValid: true,
      message: 'Access matches day',
    }
  }

  if (dayType === 'Weekday' && access === 'Weekdays') {
    return {
      isValid: true,
      message: 'Access matches day',
    }
  }

  if (dayType === 'Weekend' && access === 'Weekend') {
    return {
      isValid: true,
      message: 'Access matches day',
    }
  }

  if (access === 'Weekdays') {
    return {
      isValid: false,
      message: 'Weekday guests only',
    }
  }

  if (access === 'Weekend') {
    return {
      isValid: false,
      message: 'Weekend guests only',
    }
  }

  if (access === 'Limited Access' || access === 'Limited') {
    return {
      isValid: false,
      message: 'Check limited visitor access',
    }
  }

  return {
    isValid: false,
    message: 'Check visitor access',
  }
}

export default function PlannerPage() {
  const [step, setStep] = useState<PlannerStep>('setup')

  const [baseInput, setBaseInput] = useState('')
  const [geocodedBase, setGeocodedBase] = useState<GeocodedBase | null>(null)
  const [isCreatingTrip, setIsCreatingTrip] = useState(false)
  const [isLoadingTrip, setIsLoadingTrip] = useState(false)
  const [isRemovingCourse, setIsRemovingCourse] = useState<number | null>(null)
  const [isAssigningCourse, setIsAssigningCourse] = useState<number | null>(null)
  const [baseError, setBaseError] = useState('')
  const [tripError, setTripError] = useState('')
  const [tripId, setTripId] = useState('')
  const [plannerUserId, setPlannerUserId] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<PlannerCourse[]>([])
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  const [tripName, setTripName] = useState('')
  const [month, setMonth] = useState('April')
  const [golfIrelandMember, setGolfIrelandMember] =
    useState<GolfIrelandMember>('No')
  const [numberOfGolfers, setNumberOfGolfers] = useState(4)
  const [numberOfGolfDays, setNumberOfGolfDays] = useState(3)

  const [tripDays, setTripDays] = useState<TripDay[]>([
    { dayNumber: 1, dayType: 'Weekday' },
    { dayNumber: 2, dayType: 'Weekday' },
    { dayNumber: 3, dayType: 'Weekday' },
  ])

  const averageDistance = getAverageDistance(selectedCourses)
  const courseMix = getCourseMix(selectedCourses)
  const greenFeeEstimate = getGreenFeeEstimate(selectedCourses)

  useEffect(() => {
    setTripDays((currentDays) => createTripDays(numberOfGolfDays, currentDays))
  }, [numberOfGolfDays])

  useEffect(() => {
    const currentPlannerUserId = getOrCreatePlannerUserId()
    setPlannerUserId(currentPlannerUserId)

    async function loadExistingTrip(existingTripId: string) {
      setIsLoadingTrip(true)
      setTripError('')

      try {
        const response = await fetch(`/api/trips/get?tripId=${existingTripId}`)
        const data = await response.json()

        if (!response.ok || !data.trip) {
          setTripError('We could not load this trip.')
          setIsLoadingTrip(false)
          return
        }

        const trip = data.trip
        const courses = Array.isArray(trip.selected_courses)
          ? trip.selected_courses
          : []

        setTripId(trip.trip_id)
        setTripName(trip.trip_name || '')
        setBaseInput(getShortPlaceName(trip.base_location || ''))
        setMonth(trip.month_of_travel || 'April')
        setGolfIrelandMember(trip.golf_ireland_member || 'No')
        setNumberOfGolfers(trip.number_of_golfers || 4)
        setNumberOfGolfDays(trip.number_of_golf_days || 3)
        setSelectedCourses(courses)

        setGeocodedBase({
          label: getShortPlaceName(trip.base_location || ''),
          latitude: trip.base_latitude || 0,
          longitude: trip.base_longitude || 0,
        })

        window.localStorage.setItem('guestplaygolf_trip_id', trip.trip_id)
        window.localStorage.setItem(
          'guestplaygolf_planner_courses',
          JSON.stringify(courses)
        )

        setStep('planner')
      } catch {
        setTripError('Something went wrong loading this trip.')
      } finally {
        setIsLoadingTrip(false)
      }
    }

    async function loadSavedTrips() {
      setIsLoadingTrips(true)

      try {
        const response = await fetch(`/api/trips/list?plannerUserId=${currentPlannerUserId}`)
        const data = await response.json()

        if (response.ok && Array.isArray(data.trips)) {
          setSavedTrips(data.trips)
        }
      } catch {
        setSavedTrips([])
      } finally {
        setIsLoadingTrips(false)
      }
    }

    const params = new URLSearchParams(window.location.search)
    const urlTripId = params.get('tripId')

    if (urlTripId) {
      loadExistingTrip(urlTripId)
    } else {
      loadSavedTrips()
    }
  }, [])

  const isReadyToStart = useMemo(() => {
    return (
      baseInput.trim().length > 0 &&
      tripName.trim().length > 0 &&
      month.length > 0 &&
      numberOfGolfers > 0 &&
      numberOfGolfDays > 0 &&
      !isCreatingTrip
    )
  }, [
    baseInput,
    tripName,
    month,
    numberOfGolfers,
    numberOfGolfDays,
    isCreatingTrip,
  ])

  async function handleStartPlanning() {
    if (!isReadyToStart) return

    setBaseError('')
    setTripError('')
    setIsCreatingTrip(true)

    const currentPlannerUserId = plannerUserId || getOrCreatePlannerUserId()
    setPlannerUserId(currentPlannerUserId)

    try {
      const geocodeResponse = await fetch(
        `/api/geocode?place=${encodeURIComponent(
          baseInput.trim()
        )}&country=Ireland`
      )

      const geocodeData = await geocodeResponse.json()

      if (!geocodeResponse.ok) {
        setBaseError(
          'We could not find that location in Ireland. Try a town, city, airport or resort name.'
        )
        setIsCreatingTrip(false)
        return
      }

      const confirmedBase = {
        label: getShortPlaceName(geocodeData.label || baseInput.trim()),
        latitude: geocodeData.latitude,
        longitude: geocodeData.longitude,
      }

      const tripResponse = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planner_user_id: currentPlannerUserId,
          trip_name: tripName.trim(),
          base_location: confirmedBase.label,
          base_latitude: confirmedBase.latitude,
          base_longitude: confirmedBase.longitude,
          month_of_travel: month,
          golf_ireland_member: golfIrelandMember,
          number_of_golfers: numberOfGolfers,
          number_of_golf_days: numberOfGolfDays,
        }),
      })

      const tripData = await tripResponse.json()

      if (!tripResponse.ok || !tripData.trip_id) {
        setTripError('We could not create your trip. Please try again.')
        setIsCreatingTrip(false)
        return
      }

      setGeocodedBase(confirmedBase)
      setTripId(tripData.trip_id)
      setSelectedCourses([])

      window.localStorage.setItem('guestplaygolf_trip_id', tripData.trip_id)
      window.localStorage.setItem('guestplaygolf_planner_courses', '[]')

      setStep('planner')
    } catch {
      setTripError('Something went wrong creating your trip. Please try again.')
    } finally {
      setIsCreatingTrip(false)
    }
  }

  async function handleRemoveCourse(courseId: number) {
    if (!tripId || isRemovingCourse) return

    setTripError('')
    setIsRemovingCourse(courseId)

    try {
      const response = await fetch('/api/trips/remove-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: tripId,
          course_id: courseId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setTripError('We could not remove this course. Please try again.')
        return
      }

      const updatedCourses = Array.isArray(data.selected_courses)
        ? data.selected_courses
        : selectedCourses.filter((course) => course.id !== courseId)

      setSelectedCourses(updatedCourses)
      window.localStorage.setItem(
        'guestplaygolf_planner_courses',
        JSON.stringify(updatedCourses)
      )
    } catch {
      setTripError('Something went wrong removing this course.')
    } finally {
      setIsRemovingCourse(null)
    }
  }

  async function handleAssignCourse(courseId: number, assignmentValue: string) {
    if (!tripId || isAssigningCourse) return

    const { assignedDay, assignedSlot } = parseAssignmentValue(assignmentValue)

    setTripError('')
    setIsAssigningCourse(courseId)

    try {
      const response = await fetch('/api/trips/assign-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: tripId,
          course_id: courseId,
          assigned_day: assignedDay,
          assigned_slot: assignedSlot,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setTripError('We could not assign this course. Please try again.')
        return
      }

      const updatedCourses = Array.isArray(data.selected_courses)
        ? data.selected_courses
        : selectedCourses.map((course) => {
            if (course.id === courseId) {
              return {
                ...course,
                assigned_day: assignedDay,
                assigned_slot: assignedSlot,
              }
            }

            if (
              assignedDay &&
              assignedSlot &&
              course.assigned_day === assignedDay &&
              course.assigned_slot === assignedSlot
            ) {
              return {
                ...course,
                assigned_day: null,
                assigned_slot: null,
              }
            }

            return course
          })

      setSelectedCourses(updatedCourses)
      window.localStorage.setItem(
        'guestplaygolf_planner_courses',
        JSON.stringify(updatedCourses)
      )
    } catch {
      setTripError('Something went wrong assigning this course.')
    } finally {
      setIsAssigningCourse(null)
    }
  }

  async function handleCopyShareLink() {
    if (!tripId) return

    const shareUrl = `${window.location.origin}/ireland/planner?tripId=${tripId}`

    try {
      await window.navigator.clipboard.writeText(shareUrl)
      setShareCopied(true)
      window.setTimeout(() => setShareCopied(false), 2500)
    } catch {
      setTripError('We could not copy the link. Please copy it from your browser address bar.')
    }
  }

  function updateTripDay(dayNumber: number, dayType: DayType) {
    setTripDays((currentDays) =>
      currentDays.map((day) =>
        day.dayNumber === dayNumber
          ? {
              ...day,
              dayType,
            }
          : day
      )
    )
  }

  function getChooseCoursesHref() {
    const params = new URLSearchParams()

    params.set('country', 'Ireland')
    params.set('source', 'planner')
    params.set('planner', 'true')
    params.set('where', baseInput.trim())

    if (tripId) {
      params.set('tripId', tripId)
    }

    return `/filters?${params.toString()}`
  }

  if (isLoadingTrip) {
    return (
      <main className="min-h-screen bg-stone-100 px-5 py-10 text-slate-800">
        <div className="mx-auto max-w-[480px] rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200/70">
          <p className="text-sm font-semibold text-slate-900">
            Loading your trip...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pt-8 pb-10 text-white">
        <div className="relative z-10 mx-auto max-w-[480px] text-left">
          <div className="text-[15px] font-semibold uppercase tracking-[0.28em] text-white/85">
            GuestPlayGolf
          </div>

          <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.18em] text-emerald-100/80">
            Irish Golf Trip Planner
          </p>

          <h1 className="mt-4 text-[32px] font-bold leading-[1.08] text-white">
            Plan your Irish golf trip
          </h1>

          <p className="mt-4 text-[15px] text-white/85">
            Build a flexible day-by-day golf itinerary around where you are
            staying.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6 text-left">
        {step === 'setup' && (
          <>
            <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[21px] font-semibold text-slate-900">
                    My Trips
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Open a saved trip or start a new one below.
                  </p>
                </div>

                {isLoadingTrips && (
                  <span className="text-xs font-semibold text-slate-500">
                    Loading...
                  </span>
                )}
              </div>

              {!isLoadingTrips && savedTrips.length === 0 && (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  No saved trips yet.
                </p>
              )}

              {savedTrips.length > 0 && (
                <div className="mt-4 grid gap-3">
                  {savedTrips.map((savedTrip) => {
                    const courseCount = Array.isArray(savedTrip.selected_courses)
                      ? savedTrip.selected_courses.length
                      : 0

                    return (
                      <div
                        key={savedTrip.trip_id}
                        className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {savedTrip.trip_name || 'Untitled trip'}
                            </div>

                            <p className="mt-1 text-sm text-slate-600">
                              {[getShortPlaceName(savedTrip.base_location), savedTrip.month_of_travel]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {courseCount} course{courseCount === 1 ? '' : 's'} ·{' '}
                              {savedTrip.number_of_golf_days || 0} golf day
                              {savedTrip.number_of_golf_days === 1 ? '' : 's'}
                            </p>
                          </div>

                          <Link
                            href={`/ireland/planner?tripId=${savedTrip.trip_id}`}
                            className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-semibold text-white no-underline"
                          >
                            Open
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <h2 className="text-[21px] font-semibold text-slate-900">
              Tell us about your trip
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your base is the anchor of the trip. We use it to suggest nearby
              courses and estimate distance.
            </p>

            <div className="mt-5 grid gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Where are you staying?
                </label>

                <input
                  value={baseInput}
                  onChange={(event) => {
                    setBaseInput(event.target.value)
                    setBaseError('')
                    setTripError('')
                  }}
                  placeholder="Example: Lahinch, Killarney, Dublin Airport"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {quickBases.map((base) => (
                    <button
                      key={base}
                      type="button"
                      onClick={() => {
                        setBaseInput(base)
                        setBaseError('')
                        setTripError('')
                      }}
                      className={`rounded-full border px-4 py-2.5 text-sm font-medium ${
                        baseInput === base
                          ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-emerald-700'
                      }`}
                    >
                      {base}
                    </button>
                  ))}
                </div>

                {baseError && (
                  <p className="mt-3 text-sm leading-6 text-red-600">
                    {baseError}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Trip name
                </label>

                <input
                  value={tripName}
                  onChange={(event) => {
                    setTripName(event.target.value)
                    setTripError('')
                  }}
                  placeholder="Example: Dave’s Ireland Golf Trip"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Month of travel
                </label>

                <select
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-700"
                >
                  {months.map((monthOption) => (
                    <option key={monthOption} value={monthOption}>
                      {monthOption}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Golf Ireland member?
                </label>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['Yes', 'No', 'Not sure'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGolfIrelandMember(option)}
                      className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                        golfIrelandMember === option
                          ? 'bg-emerald-800 text-white'
                          : 'border border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Number of golfers
                </label>

                <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setNumberOfGolfers((current) => Math.max(1, current - 1))
                    }
                    className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                  >
                    -
                  </button>

                  <div className="text-[18px] font-semibold text-slate-900">
                    {numberOfGolfers}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNumberOfGolfers((current) => Math.min(32, current + 1))
                    }
                    className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Number of golf days
                </label>

                <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setNumberOfGolfDays((current) => Math.max(1, current - 1))
                    }
                    className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                  >
                    -
                  </button>

                  <div className="text-[18px] font-semibold text-slate-900">
                    {numberOfGolfDays}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNumberOfGolfDays((current) => Math.min(10, current + 1))
                    }
                    className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              {tripError && (
                <p className="text-sm leading-6 text-red-600">{tripError}</p>
              )}

              <button
                type="button"
                disabled={!isReadyToStart}
                onClick={handleStartPlanning}
                className="rounded-full bg-slate-900 px-5 py-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isCreatingTrip ? 'Creating your trip...' : 'Start Planning'}
              </button>
            </div>
          </div>
          </>
        )}

        {step === 'planner' && geocodedBase && (
          <div className="grid gap-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                    My Trip
                  </p>

                  <h2 className="mt-1 text-[22px] font-semibold text-slate-900">
                    {tripName}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {month} · {numberOfGolfers} golfers · Golf Ireland:{' '}
                    {golfIrelandMember}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Staying near: {baseInput}
                  </p>

                  {tripId && (
                    <p className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      Trip saved · {tripId}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('setup')}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Edit
                  </button>

                  {tripId && (
                    <button
                      type="button"
                      onClick={handleCopyShareLink}
                      className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white"
                    >
                      {shareCopied ? 'Copied ✓' : 'Share'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-[18px] font-semibold text-slate-900">
                Trip structure
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Assign selected courses to each day and slot. We will flag any
                possible access issues based on whether the day is a weekday or
                weekend.
              </p>

              <div className="mt-5 grid gap-4">
                {tripDays.map((day) => {
                  const morningCourse = getAssignedCourse(
                    selectedCourses,
                    day.dayNumber,
                    'Morning'
                  )
                  const afternoonCourse = getAssignedCourse(
                    selectedCourses,
                    day.dayNumber,
                    'Afternoon'
                  )

                  return (
                    <div
                      key={day.dayNumber}
                      className="rounded-3xl border border-slate-200 bg-stone-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[17px] font-semibold text-slate-900">
                            Day {day.dayNumber}
                          </div>

                          <p className="mt-1 text-sm text-slate-600">
                            Morning and afternoon planning slots
                          </p>
                        </div>

                        <div className="flex gap-2">
                          {(['Weekday', 'Weekend'] as const).map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => updateTripDay(day.dayNumber, option)}
                              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                                day.dayType === option
                                  ? 'bg-emerald-800 text-white'
                                  : 'border border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        {(['Morning', 'Afternoon'] as const).map((slot) => {
                          const assignedCourse =
                            slot === 'Morning' ? morningCourse : afternoonCourse
                          const validation = assignedCourse
                            ? getAccessValidation(assignedCourse, day.dayType)
                            : null

                          return (
                            <div
                              key={`${day.dayNumber}-${slot}`}
                              className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
                            >
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {slot}
                              </div>

                              {assignedCourse ? (
                                <div className="mt-2">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-sm font-semibold text-slate-900">
                                        {assignedCourse.course_name}
                                      </div>

                                      <p className="mt-1 text-sm text-slate-600">
                                        {[
                                          assignedCourse.course_type,
                                          assignedCourse.region,
                                          assignedCourse.price_range,
                                        ]
                                          .filter(Boolean)
                                          .join(' · ')}
                                      </p>
                                    </div>

                                    <span
                                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        validation?.isValid
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {validation?.isValid ? '✓' : '⚠'}
                                    </span>
                                  </div>

                                  {validation && (
                                    <p
                                      className={`mt-2 text-xs font-semibold ${
                                        validation.isValid
                                          ? 'text-emerald-700'
                                          : 'text-amber-700'
                                      }`}
                                    >
                                      {validation.message}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="mt-2 text-sm text-slate-500">
                                  Not assigned
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Link
                href={getChooseCoursesHref()}
                className="mt-5 block rounded-full bg-emerald-800 px-5 py-4 text-center text-sm font-semibold text-white no-underline"
              >
                Choose Courses ({selectedCourses.length} selected)
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-[18px] font-semibold text-slate-900">
                Selected Courses ({selectedCourses.length})
              </h2>

              {selectedCourses.length === 0 ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No courses selected yet.
                </p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {selectedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900">
                            {course.course_name}
                          </div>

                          <p className="mt-1 text-sm text-slate-600">
                            {[course.course_type, course.region, course.price_range]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>

                          {typeof course.distance === 'number' && (
                            <p className="mt-1 text-sm text-slate-500">
                              {course.distance.toFixed(1)} km from base
                            </p>
                          )}

                          <div className="mt-3">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Assignment
                            </label>

                            <select
                              value={getAssignmentValue(course)}
                              onChange={(event) =>
                                handleAssignCourse(course.id, event.target.value)
                              }
                              disabled={isAssigningCourse === course.id}
                              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-700 disabled:opacity-50"
                            >
                              <option value="unassigned">Not Assigned</option>
                              {tripDays.flatMap((day) =>
                                (['Morning', 'Afternoon'] as const).map((slot) => (
                                  <option
                                    key={`${day.dayNumber}-${slot}`}
                                    value={`${day.dayNumber}-${slot}`}
                                  >
                                    Day {day.dayNumber} {slot}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(course.id)}
                          disabled={isRemovingCourse === course.id}
                          className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
                        >
                          {isRemovingCourse === course.id ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedCourses.length > 0 && (
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                      Course shortlist
                    </p>

                    <h2 className="mt-1 text-[20px] font-semibold text-slate-900">
                      Compare Courses
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Review the courses in your trip by access, assignment, price band and distance.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-center ring-1 ring-emerald-100">
                    <div className="text-[20px] font-bold text-emerald-900">
                      {selectedCourses.length}
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      Courses
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {selectedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900">
                            {course.course_name}
                          </div>

                          <p className="mt-1 text-sm text-slate-600">
                            {[course.course_type, course.region, course.price_range]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </div>

                        <div className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {typeof course.distance === 'number'
                            ? `${course.distance.toFixed(1)} km`
                            : 'Distance —'}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Access
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-900">
                            {course.independent_guest_days || '—'}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Assignment
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-900">
                            {course.assigned_day && course.assigned_slot
                              ? `Day ${course.assigned_day} ${course.assigned_slot}`
                              : 'Not assigned'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Overview
                </p>

                <h2 className="mt-1 text-[20px] font-semibold text-slate-900">
                  Trip Summary
                </h2>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-stone-50 p-3 text-center ring-1 ring-slate-200">
                  <div className="text-[20px] font-bold text-slate-900">
                    {selectedCourses.length}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Courses
                  </div>
                </div>

                <div className="rounded-2xl bg-stone-50 p-3 text-center ring-1 ring-slate-200">
                  <div className="text-[20px] font-bold text-slate-900">
                    {numberOfGolfDays}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Days
                  </div>
                </div>

                <div className="rounded-2xl bg-stone-50 p-3 text-center ring-1 ring-slate-200">
                  <div className="text-[20px] font-bold text-slate-900">
                    {averageDistance === null
                      ? '—'
                      : `${averageDistance.toFixed(1)} km`}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Avg distance
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-[13px] font-semibold text-slate-500">
                  Course mix
                </div>
                <div className="mt-1 text-[18px] font-bold text-slate-900">
                  {courseMix}
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <div className="text-[13px] font-semibold text-emerald-800">
                  Green Fee Guide
                </div>

                {greenFeeEstimate ? (
                  <div className="mt-2 grid gap-2">
                    <div className="text-[22px] font-bold text-slate-900">
                      {formatEuroAmount(greenFeeEstimate.perGolferLow)} - {formatEuroAmount(greenFeeEstimate.perGolferHigh)}
                    </div>

                    <p className="text-xs leading-5 text-slate-600">
                      Per golfer guide only. Actual green fees can vary by weekday/weekend, season, tee time and booking conditions.
                    </p>

                    {greenFeeEstimate.pricedCourses < selectedCourses.length && (
                      <p className="text-xs leading-5 text-slate-600">
                        Guide excludes {selectedCourses.length - greenFeeEstimate.pricedCourses} course
                        {selectedCourses.length - greenFeeEstimate.pricedCourses === 1 ? '' : 's'} without a price band.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Add courses with price bands to estimate green fees.
                  </p>
                )}
              </div>

              {tripError && (
                <p className="mt-4 text-sm leading-6 text-red-600">
                  {tripError}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}