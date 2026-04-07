'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const regions = [
  { code: 'ZH', name: 'Zurich' },
  { code: 'VD', name: 'Vaud' },
  { code: 'BE', name: 'Bern' },
  { code: 'TI', name: 'Ticino' },
  { code: 'VS', name: 'Valais' },
  { code: 'GR', name: 'Graubünden' },
  { code: 'SG', name: 'St. Gallen' },
  { code: 'LU', name: 'Lucerne' },
  { code: 'AG', name: 'Aargau' },
  { code: 'FR', name: 'Fribourg' },
  { code: 'TG', name: 'Thurgau' },
  { code: 'NE', name: 'Neuchâtel' },
  { code: 'SO', name: 'Solothurn' },
  { code: 'GE', name: 'Geneva' },
]

export default function SwitzerlandPage() {
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
    <main className="min-h-screen bg-stone-100 text-slate-800">

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-5 pb-8 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=1600&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-800/90" />

        <div className="relative z-10 mx-auto max-w-[480px]">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white no-underline">
              ← Back
            </Link>

            <div className="text-[13px] uppercase tracking-wide text-white/80">
              Where2Golf
            </div>

            <div className="w-10" />
          </div>

          <div className="mt-5">
            <p className="text-[12px] uppercase tracking-wide text-white/70">
              Switzerland
            </p>

            <h1 className="mt-2 text-[26px] font-bold leading-tight">
              Golf in Switzerland for Independent Guests
            </h1>

            {/* ✅ KEY DIFFERENTIATOR TEXT (RESTORED + OPTIMISED) */}
            <p className="mt-4 text-[15px] leading-6 text-white/85">
              Switzerland offers some of Europe’s most scenic golf, with courses set around lakes, mountains and countryside. Many courses allow independent guest play, but access is often structured and requires planning.
            </p>

            <p className="mt-4 text-[15px] leading-6 text-white/85">
              Most courses require a recognised handicap and expect players to hold a valid golf membership or Swiss Golf Card. Availability can vary by day, with weekends often more restricted.
            </p>

            <p className="mt-4 text-[15px] font-medium text-white">
              Where2Golf makes this simple — showing where you can play, when you can play, and the exact requirements for each course.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[480px] px-5 py-6">

        {/* QUICK ACCESS */}
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
              <div className="font-semibold">Browse All Switzerland</div>
              <p className="text-sm text-slate-600">
                View all courses in the directory
              </p>
            </Link>
          </div>
        </div>

        {/* REGIONS */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Browse by region
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {regions.map((region) => (
              <Link
                key={region.code}
                href={`/switzerland/${region.code.toLowerCase()}`}
                className="rounded-xl border p-4 no-underline"
              >
                <div className="font-semibold text-slate-900">
                  {region.name}
                </div>
                <div className="text-sm text-slate-500">
                  {region.code}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>
    </main>
  )
}