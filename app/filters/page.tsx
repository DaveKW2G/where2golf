'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function FiltersPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const countryParam = searchParams.get('country')
  const sourceParam = searchParams.get('source')
  const plannerParam = searchParams.get('planner')
  const whereParam = searchParams.get('where')
  const [tripId, setTripId] = useState('')

  const isIreland = countryParam === 'Ireland'

  const [where, setWhere] = useState('')
  const [radius, setRadius] = useState('')
  const [courseType, setCourseType] = useState('')
  const [guestPlay, setGuestPlay] = useState('')
  const [holes, setHoles] = useState('')
  const [handicap, setHandicap] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const urlWhere = params.get('where')
  const urlTripId = params.get('tripId')

  if (urlWhere) {
    setWhere(urlWhere)
  }

  if (urlTripId) {
    setTripId(urlTripId)
  }
}, [])

  function toggle(value: string, current: string, setter: (v: string) => void) {
    setter(current === value ? '' : value)
  }

  function handleSearch() {
    const params = new URLSearchParams()

    if (countryParam) params.set('country', countryParam)
    if (sourceParam) params.set('source', sourceParam)
    if (plannerParam) params.set('planner', plannerParam)
    if (tripId) params.set('tripId', tripId)

    if (where) params.set('where', where)
    if (radius) params.set('radius', radius)
    if (courseType) params.set('courseType', courseType)
    if (guestPlay) params.set('guestPlay', guestPlay)
    if (holes) params.set('holes', holes)
    if (!isIreland && handicap) params.set('handicap', handicap)
    if (price) params.set('price', price)

    router.push(`/results?${params.toString()}`)
  }

  function handleClear() {
    setWhere('')
    setRadius('')
    setCourseType('')
    setGuestPlay('')
    setHoles('')
    setHandicap('')
    setPrice('')
  }

  function Chip({
    label,
    value,
    selected,
    onClick,
  }: {
    label: string
    value: string
    selected: boolean
    onClick: (v: string) => void
  }) {
    return (
      <button
        type="button"
        onClick={() => onClick(value)}
        className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
          selected
            ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm'
            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <main className="min-h-screen bg-stone-100">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pt-5 pb-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <div className="flex items-center justify-between">
            <Link
              href={
                sourceParam === 'planner'
                  ? '/ireland/planner'
                  : isIreland
                  ? '/ireland'
                  : '/'
              }
              className="text-white no-underline"
            >
              ← Back
            </Link>

            <div className="text-[13px] font-semibold uppercase tracking-wide text-white/90">
              GuestPlayGolf
            </div>

            <button type="button" onClick={handleClear} className="text-sm text-white/80">
              Clear
            </button>
          </div>

          <div className="mt-5">
            <h1 className="text-[24px] font-bold">
              {isIreland ? 'Advanced Search Ireland' : 'Advanced Filters'}
            </h1>

            <p className="mt-2 text-[14px] text-white/80">
              {isIreland
                ? 'Refine your search to find Irish golf courses by location, course type, access and price.'
                : 'Refine your search to find where you can play as an independent guest.'}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[480px] space-y-6 px-5 py-6 pb-24">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Play Near
          </h2>

          <input
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder={isIreland ? 'Dublin, Cork, Galway, Belfast...' : 'Zurich, Geneva, Zug...'}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
          />

          <div className="mt-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Radius
            </h3>

            <div className="flex flex-wrap gap-2">
              {(isIreland ? ['25', '50', '75', '100'] : ['25', '50', '100']).map((option) => (
                <Chip
                  key={option}
                  label={`${option} km`}
                  value={option}
                  selected={radius === option}
                  onClick={(v) => toggle(v, radius, setRadius)}
                />
              ))}
            </div>
          </div>
        </section>

        {isIreland && (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              Course Type
            </h2>

            <div className="flex flex-wrap gap-2">
              {['Links', 'Parkland', 'Heathland'].map((option) => (
                <Chip
                  key={option}
                  label={option}
                  value={option}
                  selected={courseType === option}
                  onClick={(v) => toggle(v, courseType, setCourseType)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Guest Access
          </h2>

          <div className="flex flex-wrap gap-2">
            {(isIreland
              ? ['Everyday', 'Weekdays', 'Weekend', 'Limited Access']
              : ['Everyday', 'Weekdays', 'Weekend']
            ).map((option) => (
              <Chip
                key={option}
                label={option}
                value={option}
                selected={guestPlay === option}
                onClick={(v) => toggle(v, guestPlay, setGuestPlay)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Holes
          </h2>

          <div className="flex gap-2">
            {['18', '9'].map((option) => (
              <Chip
                key={option}
                label={`${option} holes`}
                value={option}
                selected={holes === option}
                onClick={(v) => toggle(v, holes, setHoles)}
              />
            ))}
          </div>
        </section>

        {!isIreland && (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">
              Your Handicap
            </h2>

            <p className="mb-3 text-[13px] leading-5 text-slate-500">
              Show courses that accept your handicap or higher. Enter N/A for
              courses that do not require a handicap.
            </p>

            <div className="flex flex-wrap gap-2">
              {['N/A', '18', '24', '28', '36', '45', '54'].map((option) => (
                <Chip
                  key={option}
                  label={option}
                  value={option}
                  selected={handicap === option}
                  onClick={(v) => toggle(v, handicap, setHandicap)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Price
          </h2>

          <div className="flex flex-wrap gap-2">
            {['€', '€€', '€€€', '€€€€'].map((option) => (
              <Chip
                key={option}
                label={option}
                value={option}
                selected={price === option}
                onClick={(v) => toggle(v, price, setPrice)}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-5">
        <div className="mx-auto max-w-[480px]">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full rounded-2xl bg-emerald-700 py-4 font-semibold text-white shadow-lg"
          >
            Show Courses
          </button>
        </div>
      </div>
    </main>
  )
}

export default function FiltersPage() {
  return (
    <Suspense fallback={null}>
      <FiltersPageContent />
    </Suspense>
  )
}