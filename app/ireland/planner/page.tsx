'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type GolfIrelandMember = 'Yes' | 'No' | 'Not sure'
type DayType = 'Weekday' | 'Weekend'
type SlotName = 'Morning' | 'Afternoon'
type PlannerStep = 'setup' | 'planner'

type TripSlot = {
  slot: SlotName
}

type TripDay = {
  dayNumber: number
  dayType: DayType
  slots: TripSlot[]
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
      slots: [
        { slot: 'Morning' as const },
        { slot: 'Afternoon' as const },
      ],
    }
  })
}

export default function PlannerPage() {
  const [step, setStep] = useState<PlannerStep>('setup')

  const [baseInput, setBaseInput] = useState('')
  const [geocodedBase, setGeocodedBase] = useState<GeocodedBase | null>(null)
  const [isCreatingTrip, setIsCreatingTrip] = useState(false)
  const [isLoadingTrip, setIsLoadingTrip] = useState(false)
  const [baseError, setBaseError] = useState('')
  const [tripError, setTripError] = useState('')
  const [tripId, setTripId] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<PlannerCourse[]>([])

  const [tripName, setTripName] = useState('')
  const [month, setMonth] = useState('April')
  const [golfIrelandMember, setGolfIrelandMember] =
    useState<GolfIrelandMember>('No')
  const [numberOfGolfers, setNumberOfGolfers] = useState(4)
  const [numberOfGolfDays, setNumberOfGolfDays] = useState(3)

  const [tripDays, setTripDays] = useState<TripDay[]>([
    {
      dayNumber: 1,
      dayType: 'Weekday',
      slots: [{ slot: 'Morning' }, { slot: 'Afternoon' }],
    },
    {
      dayNumber: 2,
      dayType: 'Weekday',
      slots: [{ slot: 'Morning' }, { slot: 'Afternoon' }],
    },
    {
      dayNumber: 3,
      dayType: 'Weekday',
      slots: [{ slot: 'Morning' }, { slot: 'Afternoon' }],
    },
  ])

  useEffect(() => {
    setTripDays((currentDays) => createTripDays(numberOfGolfDays, currentDays))
  }, [numberOfGolfDays])

  useEffect(() => {
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

        setTripId(trip.trip_id)
        setTripName(trip.trip_name || '')
        setBaseInput(trip.base_location || '')
        setMonth(trip.month_of_travel || 'April')
        setGolfIrelandMember(trip.golf_ireland_member || 'No')
        setNumberOfGolfers(trip.number_of_golfers || 4)
        setNumberOfGolfDays(trip.number_of_golf_days || 3)
        setSelectedCourses(
          Array.isArray(trip.selected_courses) ? trip.selected_courses : []
        )

        setGeocodedBase({
          label: trip.base_location || '',
          latitude: trip.base_latitude || 0,
          longitude: trip.base_longitude || 0,
        })

        window.localStorage.setItem('guestplaygolf_trip_id', trip.trip_id)
        window.localStorage.setItem(
          'guestplaygolf_planner_courses',
          JSON.stringify(
            Array.isArray(trip.selected_courses) ? trip.selected_courses : []
          )
        )

        setStep('planner')
      } catch {
        setTripError('Something went wrong loading this trip.')
      } finally {
        setIsLoadingTrip(false)
      }
    }

    const params = new URLSearchParams(window.location.search)
    const urlTripId = params.get('tripId')

    if (urlTripId) {
      loadExistingTrip(urlTripId)
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
        label: geocodeData.label || baseInput.trim(),
        latitude: geocodeData.latitude,
        longitude: geocodeData.longitude,
      }

      const tripResponse = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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

  function getAddCourseHref(dayNumber: number, slot: SlotName) {
    const params = new URLSearchParams()

    params.set('country', 'Ireland')
    params.set('source', 'planner')
    params.set('planner', 'true')
    params.set('day', String(dayNumber))
    params.set('slot', slot)
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

                <button
                  type="button"
                  onClick={() => setStep('setup')}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-[18px] font-semibold text-slate-900">
                Day-by-day plan
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Each day can include a morning round, an afternoon round, or
                both. Use the filters on the results page to choose the right
                course for each slot.
              </p>

              <div className="mt-5 grid gap-4">
                {tripDays.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="rounded-3xl border border-slate-200 bg-stone-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[17px] font-semibold text-slate-900">
                          Day {day.dayNumber}
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          Choose courses for morning or afternoon.
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
                      {day.slots.map((slot) => (
                        <div
                          key={`${day.dayNumber}-${slot.slot}`}
                          className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {slot.slot}
                              </div>

                              <p className="mt-1 text-sm text-slate-500">
                                No course selected
                              </p>
                            </div>

                            <Link
                              href={getAddCourseHref(day.dayNumber, slot.slot)}
                              className="rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white no-underline"
                            >
                              Choose Course
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedCourses.length > 0 && (
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
                <h2 className="text-[18px] font-semibold text-slate-900">
                  Compare Courses
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Compare your selected courses by type, price, access and distance from your base.
                </p>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <th className="py-3 pr-4 font-semibold">Course</th>
                        <th className="py-3 pr-4 font-semibold">Type</th>
                        <th className="py-3 pr-4 font-semibold">Price</th>
                        <th className="py-3 pr-4 font-semibold">Access</th>
                        <th className="py-3 pr-4 font-semibold">Distance</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedCourses.map((course) => (
                        <tr key={course.id} className="border-b border-slate-100">
                          <td className="py-3 pr-4 font-semibold text-slate-900">
                            {course.course_name}
                          </td>
                          <td className="py-3 pr-4 text-slate-700">
                            {course.course_type || '—'}
                          </td>
                          <td className="py-3 pr-4 text-slate-700">
                            {course.price_range || '—'}
                          </td>
                          <td className="py-3 pr-4 text-slate-700">
                            {course.independent_guest_days || '—'}
                          </td>
                          <td className="py-3 pr-4 text-slate-700">
                            {typeof course.distance === 'number'
                              ? `${course.distance.toFixed(1)} km`
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-[18px] font-semibold text-slate-900">
                Trip summary
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-[13px] font-semibold text-slate-500">
                    Courses
                  </div>
                  <div className="mt-1 text-[22px] font-bold text-slate-900">
                    {selectedCourses.length}
                  </div>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-[13px] font-semibold text-slate-500">
                    Golf days
                  </div>
                  <div className="mt-1 text-[22px] font-bold text-slate-900">
                    {numberOfGolfDays}
                  </div>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-[13px] font-semibold text-slate-500">
                    Price guide
                  </div>
                  <div className="mt-1 text-[22px] font-bold text-slate-900">
                    —
                  </div>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-[13px] font-semibold text-slate-500">
                    Distance
                  </div>
                  <div className="mt-1 text-[22px] font-bold text-slate-900">
                    —
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-5 w-full rounded-full bg-slate-900 px-5 py-4 text-sm font-semibold text-white opacity-50"
              >
                Save Trip coming next
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}