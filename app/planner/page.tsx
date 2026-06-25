'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type GolfIrelandMember = 'Yes' | 'No' | 'Not sure'
type DayType = 'Weekday' | 'Weekend'
type TimePreference = 'Morning' | 'Afternoon'

type TripDay = {
  dayNumber: number
  dayType: DayType
  timePreference: TimePreference
}

const bases = [
  'Dublin',
  'Cork',
  'Shannon',
  'Belfast',
  'Galway',
  'Killarney / Southwest',
  'Other / not sure',
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

export default function PlannerPage() {
  const [tripName, setTripName] = useState('')
  const [base, setBase] = useState('Dublin')
  const [month, setMonth] = useState('April')
  const [golfIrelandMember, setGolfIrelandMember] =
    useState<GolfIrelandMember>('No')
  const [numberOfGolfers, setNumberOfGolfers] = useState(4)
  const [numberOfGolfDays, setNumberOfGolfDays] = useState(3)
  const [tripStarted, setTripStarted] = useState(false)
  const [tripDays, setTripDays] = useState<TripDay[]>([
    { dayNumber: 1, dayType: 'Weekday', timePreference: 'Afternoon' },
    { dayNumber: 2, dayType: 'Weekday', timePreference: 'Afternoon' },
    { dayNumber: 3, dayType: 'Weekday', timePreference: 'Afternoon' },
  ])

  useEffect(() => {
    setTripDays((currentDays) =>
      Array.from({ length: numberOfGolfDays }, (_, index) => {
        const existingDay = currentDays[index]

        return {
          dayNumber: index + 1,
          dayType: existingDay?.dayType || 'Weekday',
          timePreference: existingDay?.timePreference || 'Afternoon',
        }
      })
    )
  }, [numberOfGolfDays])

  const isReadyToStart = useMemo(() => {
    return (
      tripName.trim().length > 0 &&
      base.length > 0 &&
      month.length > 0 &&
      numberOfGolfers > 0 &&
      numberOfGolfDays > 0
    )
  }, [tripName, base, month, numberOfGolfers, numberOfGolfDays])

  function updateTripDay(
    dayNumber: number,
    field: 'dayType' | 'timePreference',
    value: DayType | TimePreference
  ) {
    setTripDays((currentDays) =>
      currentDays.map((day) =>
        day.dayNumber === dayNumber
          ? {
              ...day,
              [field]: value,
            }
          : day
      )
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
            Build a simple day-by-day golf trip using Irish courses that
            independent golfers can play.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6 text-left">
        {!tripStarted && (
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <h2 className="text-[20px] font-semibold text-slate-900">
              Tell us about your trip
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Answer a few quick questions so we can structure the planner
              around your trip.
            </p>

            <div className="mt-5 grid gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Trip name
                </label>
                <input
                  value={tripName}
                  onChange={(event) => setTripName(event.target.value)}
                  placeholder="Example: Southwest Ireland 2027"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Starting base
                </label>
                <select
                  value={base}
                  onChange={(event) => setBase(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-700"
                >
                  {bases.map((baseOption) => (
                    <option key={baseOption} value={baseOption}>
                      {baseOption}
                    </option>
                  ))}
                </select>
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
                      setNumberOfGolfDays((current) =>
                        Math.max(1, current - 1)
                      )
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
                      setNumberOfGolfDays((current) =>
                        Math.min(10, current + 1)
                      )
                    }
                    className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={!isReadyToStart}
                onClick={() => setTripStarted(true)}
                className="rounded-full bg-slate-900 px-5 py-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                Start Planning
              </button>
            </div>
          </div>
        )}

        {tripStarted && (
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
                    {base} · {month} · {numberOfGolfers} golfers · Golf
                    Ireland: {golfIrelandMember}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setTripStarted(false)}
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
                Choose whether each golf day is a weekday or weekend, and
                whether you prefer to play in the morning or afternoon.
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
                          No course selected yet
                        </p>
                      </div>

                      <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        Add course
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {(['Weekday', 'Weekend'] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateTripDay(day.dayNumber, 'dayType', option)
                          }
                          className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                            day.dayType === option
                              ? 'bg-emerald-800 text-white'
                              : 'border border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {(['Morning', 'Afternoon'] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            updateTripDay(
                              day.dayNumber,
                              'timePreference',
                              option
                            )
                          }
                          className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                            day.timePreference === option
                              ? 'bg-slate-900 text-white'
                              : 'border border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
              <h2 className="text-[18px] font-semibold text-slate-900">
                Saved courses
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Courses added from course pages will appear here. You will then
                be able to assign them to a day.
              </p>

              <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-stone-50 p-5 text-center">
                <p className="text-sm font-semibold text-slate-900">
                  No courses added yet
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Next step: we will add an Add to Trip button to course pages.
                </p>

                <Link
                  href="/ireland"
                  className="mt-4 inline-block rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white no-underline"
                >
                  Browse Ireland courses
                </Link>
              </div>
            </div>

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
                    0
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