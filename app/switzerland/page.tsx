import type { Metadata } from 'next'
import Link from 'next/link'
import SwitzerlandPageClient from '@/components/SwitzerlandPageClient'

const regions = [
  { code: 'AG', name: 'Aargau' },
  { code: 'AI', name: 'Appenzell Innerrhoden' },
  { code: 'BE', name: 'Bern' },
  { code: 'BL', name: 'Basel-Landschaft' },
  { code: 'FR', name: 'Fribourg' },
  { code: 'GE', name: 'Geneva' },
  { code: 'GR', name: 'Graubünden' },
  { code: 'JU', name: 'Jura' },
  { code: 'LU', name: 'Lucerne' },
  { code: 'NE', name: 'Neuchâtel' },
  { code: 'OW', name: 'Obwalden' },
  { code: 'SG', name: 'St. Gallen' },
  { code: 'SH', name: 'Schaffhausen' },
  { code: 'SO', name: 'Solothurn' },
  { code: 'SZ', name: 'Schwyz' },
  { code: 'TG', name: 'Thurgau' },
  { code: 'TI', name: 'Ticino' },
  { code: 'UR', name: 'Uri' },
  { code: 'VD', name: 'Vaud' },
  { code: 'VS', name: 'Valais' },
  { code: 'ZG', name: 'Zug' },
  { code: 'ZH', name: 'Zurich' },
]

export const metadata: Metadata = {
  title: 'Golf in Switzerland | Play as an independent guest',
  description:
    'Find golf courses in Switzerland where independent guests can play. Browse by region, check guest access, handicap requirements and where to play today.',
}

export default function SwitzerlandPage() {
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
              GuestPlayGolf
            </div>

            <div className="w-10" />
          </div>

          <div className="mt-5">
            <p className="text-[12px] uppercase tracking-wide text-white/70">
              Switzerland
            </p>

            <h1 className="mt-2 text-[26px] font-bold leading-tight">
              Golf in Switzerland for independent guests
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-white/85">
              Find golf courses in Switzerland where independent guests can play.
              Browse by region, understand access rules, and see where you can play
              before contacting the club.
            </p>

            <p className="mt-4 text-[15px] font-medium text-white">
              GuestPlayGolf makes it easy to see where you can play, when you can
              play, and what each course requires.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[480px] px-5 py-6">
        {/* QUICK ACCESS */}
        <SwitzerlandPageClient />

        {/* REGIONS */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Browse golf in Switzerland by region
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Explore golf courses across Switzerland by canton and find places
            that welcome independent guests.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {regions.map((region) => (
              <Link
                key={region.code}
                href={`/switzerland/${region.code.toLowerCase()}`}
                className="rounded-xl border p-4 no-underline"
              >
                <div className="font-semibold text-slate-900">
                  {region.code === 'ZH'
                    ? 'Golf near Zurich'
                    : `Golf in ${region.name}`}
                </div>
                <div className="text-sm text-slate-500">
                  {region.code}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* WHY SECTION */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Why use GuestPlayGolf in Switzerland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Most golf directories in Switzerland do not clearly show whether independent
            guests can play. You often need to visit multiple club websites or contact
            clubs directly just to understand access rules.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            GuestPlayGolf brings this together in one place — showing which courses allow
            independent guest play, when access is available, and what requirements apply.
          </p>
        </div>

        {/* RULES SECTION */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Golf in Switzerland — key things to know
          </h2>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>• Most courses require a recognised handicap</li>
            <li>• A valid golf membership or Swiss Golf Card is often expected</li>
            <li>• Weekend guest access can be more limited than weekdays</li>
            <li>• Booking in advance is usually required</li>
            <li>• Playing seasons vary, especially for higher-altitude courses</li>
          </ul>
        </div>
      </section>
    </main>
  )
}