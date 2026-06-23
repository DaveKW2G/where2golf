'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function IrelandPageClient() {
  const router = useRouter()

  const [where, setWhere] = useState('')
  const [radius, setRadius] = useState('')
  const [courseType, setCourseType] = useState('')
  const [guestPlay, setGuestPlay] = useState('')
  const [holes, setHoles] = useState('')
  const [handicap, setHandicap] = useState('')
  const [price, setPrice] = useState('')

  function toggle(value: string, current: string, setter: (v: string) => void) {
    setter(current === value ? '' : value)
  }

  function handleSearch() {
    const params = new URLSearchParams()

    params.set('country', 'Ireland')
    params.set('source', 'ireland')

    if (where) params.set('where', where)
    if (radius) params.set('radius', radius)
    if (courseType) params.set('courseType', courseType)
    if (guestPlay) params.set('guestPlay', guestPlay)
    if (holes) params.set('holes', holes)
    if (handicap) params.set('handicap', handicap)
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

  function handleNearMe() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        router.push(`/results?lat=${lat}&lng=${lng}&country=Ireland&source=ireland`)
      },
      () => {
        alert('Location access was denied. Please allow location access in your browser settings.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
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
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900">
            Advanced Filters
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Find Irish golf courses by location, course type, access, price,
            holes and handicap requirements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-medium text-slate-500"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Play Near
          </h3>

          <input
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="Dublin, Cork, Galway, Belfast..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
          />

          <div className="mt-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Radius
            </h3>

            <div className="flex flex-wrap gap-2">
              {['25', '50', '75', '100'].map((option) => (
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

        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Course Type
          </h3>

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

        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Guest Access
          </h3>

          <div className="flex flex-wrap gap-2">
            {['Everyday', 'Weekdays', 'Weekend', 'Limited Access'].map((option) => (
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

        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Holes
          </h3>

          <div className="flex flex-wrap gap-2">
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

        <section>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Handicap
          </h3>

          <p className="mb-3 text-[13px] leading-5 text-slate-500">
            Show courses that accept your handicap or select N/A for courses
            that do not require one.
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

        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Price
          </h3>

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

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={handleSearch}
          className="w-full rounded-2xl bg-emerald-800 px-5 py-4 text-left text-white shadow-sm"
        >
          <div className="font-semibold">Show Ireland Courses</div>
          <p className="mt-1 text-sm leading-5 text-white/85">
            Search Irish courses using your selected filters.
          </p>
        </button>

        <button
          type="button"
          onClick={handleNearMe}
          className="w-full rounded-2xl bg-white px-5 py-4 text-left text-slate-900 shadow-sm ring-1 ring-slate-200"
        >
          <div className="font-semibold">📍 Find golf near me</div>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            Use your location to find nearby Irish golf courses.
          </p>
        </button>

        <Link
          href="/results?country=Ireland&source=ireland"
          className="block rounded-2xl bg-white px-5 py-4 text-slate-900 no-underline shadow-sm ring-1 ring-slate-200"
        >
          <div className="font-semibold">Browse all Ireland courses</div>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            View all Irish courses without filters.
          </p>
        </Link>
      </div>
    </div>
  )
}