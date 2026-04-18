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
        router.push(`/results?lat=${lat}&lng=${lng}`)
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

  function handlePlayToday() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        router.push(`/results?lat=${lat}&lng=${lng}&today=true&radius=50`)
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

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-[18px] font-semibold text-slate-900">
        Quick access
      </h2>

      <div className="mt-4 grid gap-3">
        <button
          onClick={handlePlayToday}
          className="rounded-xl bg-emerald-700 px-5 py-4 text-left text-white"
        >
          <div className="font-semibold">Play Today</div>
          <p className="text-sm opacity-80">
            Find nearby courses that may be playable today
          </p>
        </button>

        <button
          onClick={handleNearMe}
          className="rounded-xl border px-5 py-4 text-left"
        >
          <div className="font-semibold">Near Me</div>
          <p className="text-sm text-slate-600">
            Explore golf courses closest to your location
          </p>
        </button>

        <Link
          href="/results"
          className="block rounded-xl border px-5 py-4 no-underline"
        >
          <div className="font-semibold">Browse all golf in Switzerland</div>
          <p className="text-sm text-slate-600">
            View all courses in the directory
          </p>
        </Link>
      </div>
    </div>
  )
}