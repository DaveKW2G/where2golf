'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SwitzerlandPageClient() {
  const router = useRouter()

  function handleNearMe() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        router.push(
          `/results?lat=${lat}&lng=${lng}&country=Switzerland&source=switzerland`
        )
      },
      () => {
        alert(
          'Location access was denied. Please allow location access in your browser settings.'
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  function handlePlayToday() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        router.push(
          `/results?lat=${lat}&lng=${lng}&country=Switzerland&today=true&radius=50&source=switzerland`
        )
      },
      () => {
        alert(
          'Location access was denied. Please allow location access in your browser settings.'
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h2 className="text-[18px] font-semibold text-slate-900">
        Find golf in Switzerland
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Search Swiss courses by location, guest access, handicap, price and
        distance, see where you can play today, or browse the full Swiss golf
        directory.
      </p>

      <div className="mt-4 grid gap-3">
        <Link
          href="/filters?country=Switzerland&source=switzerland"
          className="block rounded-2xl bg-emerald-800 px-5 py-4 text-white no-underline shadow-sm"
        >
          <div className="font-semibold">⚙️ Advanced Search</div>
          <p className="mt-1 text-sm leading-5 text-white/85">
            Filter Swiss courses by location, guest access, handicap, holes and
            price.
          </p>
        </Link>

        <button
          onClick={handleNearMe}
          className="rounded-2xl bg-white px-5 py-4 text-left text-slate-900 shadow-sm ring-1 ring-slate-200"
        >
          <div className="font-semibold">📍 Find golf near me</div>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            Use your location to find nearby golf courses that welcome
            independent guests.
          </p>
        </button>

        <button
          onClick={handlePlayToday}
          className="rounded-2xl bg-white px-5 py-4 text-left text-slate-900 shadow-sm ring-1 ring-slate-200"
        >
          <div className="font-semibold">🟢 Play today</div>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            Check nearby courses where guest play may be available today based
            on access rules and seasonality.
          </p>
        </button>

        <Link
          href="/results?country=Switzerland&source=switzerland"
          className="block rounded-2xl bg-white px-5 py-4 text-slate-900 no-underline shadow-sm ring-1 ring-slate-200"
        >
          <div className="font-semibold">Browse all Swiss golf courses</div>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            View all Swiss courses without applying filters.
          </p>
        </Link>
      </div>
    </div>
  )
}