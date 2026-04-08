'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [isLocatingToday, setIsLocatingToday] = useState(false)
  const [isLocatingNearMe, setIsLocatingNearMe] = useState(false)
  const router = useRouter()

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && search.trim() !== '') {
      router.push(`/results?search=${encodeURIComponent(search)}`)
    }
  }

  function getLocationErrorMessage(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access was denied. Please allow location access.'
      case error.POSITION_UNAVAILABLE:
        return 'Location unavailable. Please try again.'
      case error.TIMEOUT:
        return 'Location request timed out. Please try again.'
      default:
        return 'Unable to access location.'
    }
  }

  function handleNearMe() {
    if (isLocatingNearMe) return
    setIsLocatingNearMe(true)

    if (!navigator.geolocation) {
      alert('Geolocation is not supported.')
      setIsLocatingNearMe(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        router.push(`/results?lat=${lat}&lng=${lng}&source=home`)
        setIsLocatingNearMe(false)
      },
      (error) => {
        alert(getLocationErrorMessage(error))
        setIsLocatingNearMe(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  function handlePlayToday() {
    if (isLocatingToday) return
    setIsLocatingToday(true)

    if (!navigator.geolocation) {
      alert('Geolocation is not supported.')
      setIsLocatingToday(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        router.push(`/results?lat=${lat}&lng=${lng}&today=true&radius=50&source=home`)
        setIsLocatingToday(false)
      },
      (error) => {
        alert(getLocationErrorMessage(error))
        setIsLocatingToday(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pt-8 pb-10 text-white">
        <div className="relative z-10 mx-auto max-w-[480px] text-left">

          <div className="mb-8">
            <div className="text-[15px] font-semibold uppercase tracking-[0.28em] text-white/85">
              GuestPlayGolf
            </div>

            <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.18em] text-emerald-100/80">
              Golf for independent guests
            </p>

            <h1 className="mt-4 text-[32px] font-bold leading-[1.08] text-white">
              Find golf courses you can actually play
            </h1>

            <p className="mt-4 text-[15px] text-white/85">
              GuestPlayGolf helps you find golf courses where you can actually play as an independent guest — without needing a membership or host.
            </p>

            <p className="mt-3 text-[15px] text-white/85">
              Discover clear information on guest access, handicap requirements, pricing, and when you can play — all in one place.
            </p>
          </div>

          {/* SEARCH */}
          <div className="rounded-[28px] bg-white p-4 shadow-lg">
            <input
              type="text"
              placeholder="Search courses, towns, or regions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full text-[15px] text-slate-700 outline-none"
            />
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section className="mx-auto max-w-[480px] px-5 py-6 text-left">

        <div className="grid gap-3">

          <Link
            href="/filters"
            className="block rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
          >
            <div className="text-[17px] font-semibold text-slate-900">
              Advanced Filters
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Filter by handicap, price, holes and guest access
            </p>
          </Link>

          <button
            onClick={handlePlayToday}
            disabled={isLocatingToday}
            className="rounded-2xl bg-emerald-800 px-5 py-5 text-left text-white shadow-sm"
          >
            <div className="text-[17px] font-semibold">
              {isLocatingToday ? 'Getting your location...' : 'Play Golf Today'}
            </div>
            <p className="text-sm text-white/80 mt-1">
              Find courses near you that may be playable today
            </p>
          </button>

          <button
            onClick={handleNearMe}
            disabled={isLocatingNearMe}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-left shadow-sm"
          >
            <div className="text-[17px] font-semibold text-slate-900">
              {isLocatingNearMe ? 'Getting your location...' : 'Near Me'}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Explore golf courses closest to your location
            </p>
          </button>

          <Link
            href="/switzerland"
            className="block rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
          >
            <div className="text-[17px] font-semibold text-slate-900">
              Browse by Location
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Explore by region and destination
            </p>
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Location not working? Use Advanced Filters instead.
        </div>

      </section>
    </main>
  )
}