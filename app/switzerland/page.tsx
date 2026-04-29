import type { Metadata } from 'next'
import Link from 'next/link'
import SwitzerlandPageClient from '@/components/SwitzerlandPageClient'

const siteUrl = 'https://guestplaygolf.com'

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

const popularDestinations = [
  {
    title: 'Golf near Zurich',
    href: '/golf-near-zurich',
    description:
      'The strongest Swiss golf hub, with a high concentration of courses across Zurich, Zug, Aargau and Schwyz.',
  },
  {
    title: 'Golf near Geneva',
    href: '/golf-near-geneva',
    description:
      'Premium golf around Geneva and Lake Geneva, where guest access can be more selective and worth checking carefully.',
  },
  {
    title: 'Golf near Basel',
    href: '/golf-near-basel',
    description:
      'A compact golf base with useful access to Basel-Landschaft, Aargau and nearby cross-border golf options.',
  },
  {
    title: 'Golf near Lausanne',
    href: '/golf-near-lausanne',
    description:
      'A strong Lake Geneva base for scenic golf across Vaud, with access towards Geneva, Fribourg and Valais.',
  },
  {
    title: 'Golf near Lucerne',
    href: '/golf-near-lucerne',
    description:
      'Central Swiss golf with lake settings, mountain views and practical access to Lucerne, Zug, Schwyz and Aargau.',
  },
  {
    title: 'Golf in the Swiss Alps',
    href: '/golf-in-the-swiss-alps',
    description:
      'Scenic mountain golf across Valais, Graubünden and alpine Switzerland, with shorter seasonal windows.',
  },
]

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Golf in Switzerland | Play as an independent guest',
  description:
    'Find golf courses in Switzerland where independent guests can play. Browse Swiss golf by city, region, guest access, handicap requirements and playing season.',
  alternates: {
    canonical: '/switzerland',
  },
  openGraph: {
    title: 'Golf in Switzerland | Play as an independent guest',
    description:
      'Find golf courses in Switzerland where independent guests can play. Browse Swiss golf by city, region, guest access, handicap requirements and playing season.',
    url: `${siteUrl}/switzerland`,
    siteName: 'GuestPlayGolf',
    type: 'website',
  },
}

export default function SwitzerlandPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden px-5 pb-8 pt-5 text-white">
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
              Find golf courses in Switzerland where you can play without being a
              member of that specific club. Compare guest access, handicap
              requirements, regions, city hubs and playing seasons before
              contacting the club.
            </p>

            <p className="mt-4 text-[15px] font-medium text-white">
              GuestPlayGolf helps you see where you can play, when you can play,
              and what each course requires.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="#find-golf"
                className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white no-underline backdrop-blur"
              >
                Find courses
              </a>
              <a
                href="#planning"
                className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white no-underline backdrop-blur"
              >
                Plan your golf
              </a>
              <a
                href="#city-guides"
                className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white no-underline backdrop-blur"
              >
                City guides
              </a>
              <a
                href="#regions"
                className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white no-underline backdrop-blur"
              >
                Regions
              </a>
              <a
                href="#key-things"
                className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white no-underline backdrop-blur"
              >
                Key things
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div id="find-golf" className="scroll-mt-6">
          <SwitzerlandPageClient />
        </div>

        <div
          id="planning"
          className="mt-6 scroll-mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70"
        >
          <h2 className="text-[18px] font-semibold text-slate-900">
            Planning golf in Switzerland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Golf in Switzerland is unusually varied for such a compact country.
            A round can mean a practical city course near Zurich, a premium lake
            setting around Geneva or Lausanne, a central Swiss day trip near
            Lucerne, or a memorable alpine course surrounded by mountain views.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            The best base depends on the type of golf you want. Zurich is the
            strongest all-round hub for course choice and transport links. Geneva
            and Lausanne are ideal for Lake Geneva golf, Basel is compact and
            convenient, while Lucerne gives easy access to central Switzerland and
            more scenic day-trip options.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Alpine golf is one of Switzerland’s real strengths, especially in
            Valais and Graubünden. These courses can feel special and memorable,
            but they are also more seasonal, so opening months, weather and guest
            access are worth checking carefully before you travel.
          </p>
        </div>

        <div
          id="city-guides"
          className="mt-6 scroll-mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70"
        >
          <h2 className="text-[18px] font-semibold text-slate-900">
            Golf near major Swiss cities
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Start with high-demand golf locations where independent guests
            commonly search for nearby courses, practical access and clear
            playing requirements.
          </p>

          <div className="mt-4 grid gap-3">
            {popularDestinations.map((destination) => (
              <Link
                key={destination.href}
                href={destination.href}
                className="block rounded-2xl bg-emerald-800 px-5 py-5 text-white no-underline shadow-sm transition hover:bg-emerald-900"
              >
                <div className="text-[17px] font-semibold">
                  {destination.title}
                </div>
                <p className="mt-1 text-sm leading-5 text-white/85">
                  {destination.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div
          id="regions"
          className="mt-6 scroll-mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70"
        >
          <h2 className="text-[18px] font-semibold text-slate-900">
            Browse golf in Switzerland by region
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Explore Swiss golf by canton and find courses that welcome
            independent guests across the country.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {regions.map((region) => (
              <Link
                key={region.code}
                href={`/switzerland/${region.code.toLowerCase()}`}
                className="rounded-xl border border-slate-200 bg-white p-4 no-underline"
              >
                <div className="font-semibold text-slate-900">
                  {region.code === 'ZH'
                    ? 'Golf in Zurich'
                    : `Golf in ${region.name}`}
                </div>
                <div className="text-sm text-slate-500">{region.code}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Why use GuestPlayGolf in Switzerland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Many golf directories show where courses are located, but they do not
            always make it clear whether independent guests can play. In
            Switzerland, this matters because guest access, handicap rules,
            booking expectations and weekend availability can vary significantly
            by club.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            GuestPlayGolf brings this information together so you can compare
            Swiss golf courses before visiting multiple club websites or calling
            clubs directly.
          </p>
        </div>

        <div
          id="key-things"
          className="mt-6 scroll-mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70"
        >
          <h2 className="text-[18px] font-semibold text-slate-900">
            Golf in Switzerland — key things to know
          </h2>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>• Most Swiss courses require a recognised handicap</li>
            <li>
              • A valid golf club membership or Swiss Golf Card is usually
              expected
            </li>
            <li>
              • Foreign golf memberships are often accepted, but requirements
              vary by club
            </li>
            <li>
              • Weekend and public holiday guest access is often more restricted
              than weekday access
            </li>
            <li>• Advance booking is normally required</li>
            <li>
              • Much of Switzerland has a reduced playing season compared with
              year-round golf destinations
            </li>
            <li>
              • Alpine courses usually have significantly shorter seasons and
              are more weather dependent
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}