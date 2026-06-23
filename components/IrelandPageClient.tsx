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

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h2 className="text-[18px] font-semibold text-slate-900">
        Find golf in Ireland
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Use GuestPlayGolf to search Irish courses by location, course type,
        guest access, price and distance.
      </p>

      <div className="mt-4 grid gap-3">
        <Link
          href="/filters?country=Ireland&source=ireland"
          className="block rounded-2xl bg-emerald-800 px-5 py-4 text-white no-underline shadow-sm"
        >
          <div className="font-semibold">⚙️ Advanced Search</div>
          <p className="mt-1 text-sm leading-5 text-white/85">
            Filter Irish courses by location, course type, guest access, holes
            and price.
          </p>
        </Link>

        <button
          onClick={handleNearMe}
          className="rounded-2xl bg-white px-5 py-4 text-left text-slate-900 shadow-sm ring-1 ring-slate-200"
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
          <div className="font-semibold">Browse Ireland courses</div>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            View all Irish courses without applying filters.
          </p>
        </Link>
      </div>
    </div>
  )
}