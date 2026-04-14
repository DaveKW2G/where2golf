'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FiltersPage() {
  const router = useRouter()

  const [where, setWhere] = useState('')
  const [radius, setRadius] = useState('50')
  const [guestPlay, setGuestPlay] = useState('')
  const [holes, setHoles] = useState('')
  const [handicap, setHandicap] = useState('')
  const [price, setPrice] = useState('')

  function toggle(value: string, current: string, setter: (v: string) => void) {
    setter(current === value ? '' : value)
  }

  function handleSearch() {
    const params = new URLSearchParams()

    if (where) params.set('where', where)
    if (radius) params.set('radius', radius)
    if (guestPlay) params.set('guestPlay', guestPlay)
    if (holes) params.set('holes', holes)
    if (handicap) params.set('handicap', handicap)
    if (price) params.set('price', price)

    router.push(`/results?${params.toString()}`)
  }

  function handleClear() {
    setWhere('')
    setRadius('50')
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
        className={`rounded-full px-4 py-2.5 text-sm font-medium border transition ${
          selected
            ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
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
            <Link href="/" className="text-white no-underline">
              ← Back
            </Link>

            <div className="text-[13px] uppercase tracking-wide text-white/80">
              GuestPlayGolf
            </div>

            <button type="button" onClick={handleClear} className="text-sm text-white/80">
              Clear
            </button>
          </div>

          <div className="mt-5">
            <h1 className="text-[24px] font-bold">
              Advanced Filters
            </h1>

            <p className="mt-2 text-[14px] text-white/80">
              Refine your search to find where you can play as an independent guest.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[480px] px-5 py-6 space-y-6 pb-24">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Play Near
          </h2>

          <input
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="Zurich, Geneva, Zug..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
          />

          <div className="mt-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Radius
            </h3>

            <div className="flex gap-2 flex-wrap">
              {['25', '50', '100'].map((option) => (
                <Chip
                  key={option}
                  label={`${option} km`}
                  value={option}
                  selected={radius === option}
                  onClick={(v) => setRadius(v)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Guest Access
          </h2>

          <div className="flex gap-2 flex-wrap">
            {['Everyday', 'Weekdays', 'Weekend'].map((option) => (
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

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">
            Your Handicap
          </h2>

          <p className="mb-3 text-[13px] leading-5 text-slate-500">
            Show courses that accept your handicap or higher. Enter N/A for courses that do not require a handicap.
          </p>

          <div className="flex gap-2 flex-wrap">
            {['N/A', '18', '24', '28', '36', '45', '54'].map((option) => (
              <Chip
                key={option}
                label={option}
                value={option === 'N/A' ? 'N/A' : option}
                selected={handicap === (option === 'N/A' ? 'N/A' : option)}
                onClick={(v) => toggle(v, handicap, setHandicap)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Price
          </h2>

          <div className="flex gap-2 flex-wrap">
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