'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function IrelandPageClient() {
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
        router.push(`/results?lat=${lat}&lng=${lng}&source=ireland`)
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
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h2 className="text-[18px] font-semibold text-slate-900">
        Find golf in Ireland
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Use GuestPlayGolf to find courses near you, browse Irish golf by region,
        or start with the major golf hubs.
      </p>

      <div className="mt-4 grid gap-3">
        <button
          onClick={handleNearMe}
          className="rounded-2xl bg-emerald-800 px-5 py-4 text-left text-white shadow-sm"
        >
          <div className="font-semibold">📍 Find golf near me</div>
          <p className="mt-1 text-sm leading-5 text-white/85">
            Use your location to find nearby golf courses and compare where to
            play.
          </p>
        </button>

        <Link
          href="/results?source=ireland"
          className="block rounded-2xl bg-white px-5 py-4 text-slate-900 no-underline shadow-sm ring-1 ring-slate-200"
        >
          <div className="font-semibold">⚙️ Browse all golf courses</div>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            Open the full course search and filter by location, price, course
            details and access.
          </p>
        </Link>
      </div>
    </div>
  )
}