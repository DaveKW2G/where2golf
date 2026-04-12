'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [isLocatingToday, setIsLocatingToday] = useState(false)
  const [isLocatingNearMe, setIsLocatingNearMe] = useState(false)
  const [playTodayError, setPlayTodayError] = useState('')
  const [nearMeError, setNearMeError] = useState('')
  const router = useRouter()

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && search.trim() !== '') {
      router.push(`/results?search=${encodeURIComponent(search)}`)
    }
  }

  function getLocationErrorMessage(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access was denied. Please allow location access in your browser settings.'
      case error.POSITION_UNAVAILABLE:
        return 'Your location is currently unavailable. Please try again.'
      case error.TIMEOUT:
        return 'Location request timed out. Please try again.'
      default:
        return 'Unable to access your location.'
    }
  }

  function handleNearMe() {
    if (isLocatingNearMe) return

    setNearMeError('')
    setIsLocatingNearMe(true)

    if (!navigator.geolocation) {
      setNearMeError('Geolocation is not supported on this device.')
      setIsLocatingNearMe(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setIsLocatingNearMe(false)
        router.push(`/results?lat=${lat}&lng=${lng}&source=home`)
      },
      (error) => {
        setNearMeError(getLocationErrorMessage(error))
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

    setPlayTodayError('')
    setIsLocatingToday(true)

    if (!navigator.geolocation) {
      setPlayTodayError('Geolocation is not supported on this device.')
      setIsLocatingToday(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setIsLocatingToday(false)
        router.push(`/results?lat=${lat}&lng=${lng}&today=true&radius=50&source=home`)
      },
      (error) => {
        setPlayTodayError(getLocationErrorMessage(error))
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
              Find golf courses you can play
            </h1>

            <p className="mt-2 text-[18px] font-semibold text-emerald-50">
              Without being a member
            </p>

            <p className="mt-4 text-[15px] italic text-white/85">
              Golf isn&apos;t easy. Finding where you can play should be.
            </p>

            <p className="mt-4 text-[15px] text-white/85">
              Discover clear information on guest access, handicap requirements, pricing, and when you can play — all in one place.
            </p>

            <p className="mt-4 text-[16px] font-semibold text-white">
              Where are you playing next?
            </p>
          </div>

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

      <section className="mx-auto max-w-[480px] px-5 py-6 text-left">
        <div className="grid gap-3">
          <Link
            href="/filters"
            className="block rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
          >
            <div className="text-[17px] font-semibold text-slate-900">
              Advanced Filters
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Filter by handicap, price, holes and guest access
            </p>
          </Link>

          <div>
            <button
              onClick={handlePlayToday}
              disabled={isLocatingToday}
              className="w-full rounded-2xl bg-emerald-800 px-5 py-5 text-left text-white shadow-sm disabled:opacity-90"
            >
              <div className="text-[17px] font-semibold">
                {isLocatingToday ? 'Getting your location...' : 'Play Golf Today'}
              </div>
              <p className="mt-1 text-sm text-white/80">
                Find courses near you that may be playable today
              </p>
            </button>

            {playTodayError && (
              <p className="mt-2 text-sm text-red-600">
                {playTodayError}
              </p>
            )}
          </div>

          <div>
            <button
              onClick={handleNearMe}
              disabled={isLocatingNearMe}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-5 text-left shadow-sm disabled:opacity-90"
            >
              <div className="text-[17px] font-semibold text-slate-900">
                {isLocatingNearMe ? 'Getting your location...' : 'Near Me'}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Explore golf courses closest to your location
              </p>
            </button>

            {nearMeError && (
              <p className="mt-2 text-sm text-red-600">
                {nearMeError}
              </p>
            )}
          </div>

          <Link
            href="/switzerland"
            className="block rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
          >
            <div className="text-[17px] font-semibold text-slate-900">
              Browse by Location
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Explore by region and destination
            </p>
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Location not working? Use Advanced Filters instead.
        </div>

        <div className="mt-6 space-y-1 text-center text-sm text-slate-500">
          <div>
            Contact: guestplaygolf@gmail.com
          </div>
          <div>
            <a
              href="https://www.instagram.com/guestplaygolf"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-700 no-underline"
            >
              Instagram: @guestplaygolf
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}