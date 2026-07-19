import type { Metadata } from 'next'
import Link from 'next/link'
import SwitzerlandPageClient from '@/components/SwitzerlandPageClient'

const siteUrl = 'https://guestplaygolf.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Switzerland Golf Trip Planner | Courses, Itineraries & Group Voting',
  description:
    'Plan your Switzerland golf trip for free. Compare visitor-friendly Swiss golf courses, build a day-by-day itinerary, share plans and vote on where to play.',
  alternates: {
    canonical: '/switzerland',
  },
  openGraph: {
    title: 'Switzerland Golf Trip Planner | GuestPlayGolf',
    description:
      'Compare Swiss golf courses, build a free itinerary, share your trip and vote on where to play with your group.',
    url: `${siteUrl}/switzerland`,
    siteName: 'GuestPlayGolf',
    type: 'website',
  },
}

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
    title: 'Golf Near Zurich',
    href: '/golf-near-zurich',
    description:
      'Use Switzerland’s strongest golf hub to compare courses across Zurich, Zug, Aargau and Schwyz.',
  },
  {
    title: 'Golf Near Geneva',
    href: '/golf-near-geneva',
    description:
      'Plan golf around Geneva and Lake Geneva, where guest access can be selective and worth checking carefully.',
  },
  {
    title: 'Golf Near Basel',
    href: '/golf-near-basel',
    description:
      'Explore a compact golf base with access to Basel-Landschaft, Aargau and nearby regional options.',
  },
  {
    title: 'Golf Near Lausanne',
    href: '/golf-near-lausanne',
    description:
      'Compare Lake Geneva golf across Vaud, with access towards Geneva, Fribourg and Valais.',
  },
  {
    title: 'Golf Near Lucerne',
    href: '/golf-near-lucerne',
    description:
      'Plan central Swiss golf with lake settings, mountain views and access to Lucerne, Zug and Schwyz.',
  },
  {
    title: 'Golf Near Bern',
    href: '/golf-near-bern',
    description:
      'Use Bern as a central Swiss base for golf across Bern, Fribourg, Solothurn and mountain regions.',
  },
  {
    title: 'Golf Near St. Gallen',
    href: '/golf-near-st-gallen',
    description:
      'Find eastern Swiss golf across St. Gallen, Thurgau and the Appenzell region.',
  },
  {
    title: 'Golf Near Lugano',
    href: '/golf-near-lugano',
    description:
      'Explore southern Swiss golf in Ticino, with warmer weather, lake scenery and mountain surroundings.',
  },
  {
    title: 'Golf Near Winterthur',
    href: '/golf-near-winterthur',
    description:
      'Compare courses from a useful northern Zurich base with access towards Thurgau and Schaffhausen.',
  },
  {
    title: 'Golf in the Swiss Alps',
    href: '/golf-in-the-swiss-alps',
    description:
      'Plan scenic mountain golf across Valais, Graubünden and alpine Switzerland with shorter seasonal windows.',
  },
]

const priceCategories = [
  {
    label: '€',
    range: 'Value · CHF 0–80',
    description:
      'Accessible visitor golf and practical local courses for budget-conscious Swiss golf planning.',
  },
  {
    label: '€€',
    range: 'Mid-range · CHF 81–120',
    description:
      'Established Swiss clubs and strong regional courses with a broader visitor-golf experience.',
  },
  {
    label: '€€€',
    range: 'Premium · CHF 121–160',
    description:
      'Higher-end lake, resort and championship-style golf experiences across Switzerland.',
  },
  {
    label: '€€€€',
    range: 'Bucket List · CHF 161+',
    description:
      'Prestige venues, standout alpine settings and the most memorable Swiss golf experiences.',
  },
]

function PlannerCard() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-5 text-white shadow-sm lg:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-900">
          Free online tool
        </span>

        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
          Plan. Share. Vote.
        </span>
      </div>

      <h2 className="mt-4 text-[24px] font-bold leading-tight">
        Build your Swiss golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-white/85">
        Compare courses, organise each golf day, review visitor access and keep
        your complete Swiss golf itinerary together in one place.
      </p>

      <div className="mt-5 grid gap-3">
        <div className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-900">
            1
          </span>

          <div>
            <p className="text-sm font-semibold text-white">
              Plan your itinerary
            </p>

            <p className="mt-1 text-xs leading-5 text-white/70">
              Choose a base and assign courses to each golf day.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-900">
            2
          </span>

          <div>
            <p className="text-sm font-semibold text-white">
              Share with your group
            </p>

            <p className="mt-1 text-xs leading-5 text-white/70">
              Send the itinerary by link or trip code.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-900">
            3
          </span>

          <div>
            <p className="text-sm font-semibold text-white">
              Vote on the courses
            </p>

            <p className="mt-1 text-xs leading-5 text-white/70">
              Let everyone vote before agreeing the final trip.
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/switzerland/planner"
        className="mt-6 block rounded-full bg-white px-5 py-3.5 text-center text-sm font-semibold text-emerald-900 no-underline transition hover:bg-emerald-50"
      >
        Start Free Golf Trip Planner
      </Link>

      <p className="mt-3 text-center text-xs text-white/70">
        No spreadsheet or group-message chaos required.
      </p>
    </div>
  )
}

export default function SwitzerlandPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden px-5 pb-10 pt-5 text-white lg:pb-14 lg:pt-7">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=1800&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-800/90" />

        <div className="relative z-10 mx-auto max-w-[480px] lg:max-w-[1120px]">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-white no-underline">
              ← Back
            </Link>

            <div className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/80">
              GuestPlayGolf
            </div>

            <Link
              href="/about"
              className="text-[13px] text-white/85 no-underline"
            >
              About
            </Link>
          </div>

          <div className="mt-7 max-w-[820px] lg:mt-12">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-100/80">
              Free Switzerland golf trip planner
            </p>

            <h1 className="mt-3 text-[30px] font-bold leading-[1.08] sm:text-[34px] lg:text-[48px]">
              Plan Your Swiss Golf Trip
            </h1>

            <p className="mt-5 max-w-[760px] text-[15px] leading-6 text-white/90 lg:text-[18px] lg:leading-8">
              Compare Swiss golf courses independent guests can play, build a
              day-by-day itinerary, share plans with your group and vote on
              where to play.
            </p>

            <p className="mt-5 text-[14px] font-bold uppercase tracking-[0.15em] text-emerald-100">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/switzerland/planner"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 no-underline transition hover:bg-emerald-50"
              >
                Start Free Golf Trip Planner
              </Link>

              <Link
                href="#find-courses"
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline ring-1 ring-white/25 backdrop-blur transition hover:bg-white/15"
              >
                Find Swiss Golf Courses
              </Link>
            </div>

            <p className="mt-5 text-[14px] font-medium text-white/90">
              Golf isn&apos;t easy. Finding where to play should be.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div id="find-courses">
          <SwitzerlandPageClient />
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
          <div className="min-w-0">
            <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Swiss golf planning
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                How to plan a Switzerland golf trip
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                Switzerland is a compact but surprisingly varied golf
                destination. A trip can include practical city golf near Zurich,
                premium lake settings around Geneva or Lausanne, central Swiss
                golf near Lucerne, or memorable alpine courses in Valais and
                Graubünden.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                GuestPlayGolf combines course information with a free online
                planning tool. Compare Swiss golf courses, understand visitor
                access, review handicap requirements, check seasonality and add
                your preferred options directly to a day-by-day itinerary.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                Switzerland is different from many golf destinations because
                guest access, handicap expectations and weekend availability can
                vary significantly by club. The right plan depends on where you
                are staying, when you are travelling and how flexible your group
                can be.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Choose a base
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Start from Zurich, Geneva, Basel, Lausanne, Lucerne,
                    Interlaken or another Swiss destination.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Compare courses
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review distance, visitor access, handicap rules, seasonality
                    and price bands before choosing where to play.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Build the trip
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Assign courses to each day, share the plan and collect your
                    group&apos;s votes.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Regional golf guides
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                Golf near major Swiss destinations
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Compare the strongest Swiss golf regions, major city bases and
                popular travel hubs before adding courses to your itinerary.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {popularDestinations.map((destination) => (
                  <Link
                    key={destination.href}
                    href={destination.href}
                    className="group block rounded-3xl bg-emerald-800 px-5 py-5 text-white no-underline shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-md"
                  >
                    <div className="text-[17px] font-semibold">
                      {destination.title}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {destination.description}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-emerald-100">
                      Explore courses →
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Course settings
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                Types of golf experiences in Switzerland
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Understanding the main Swiss golf settings makes it easier to
                build a balanced itinerary.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-stone-50 p-5 ring-1 ring-slate-200">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    City golf hubs
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Practical courses around Zurich, Basel, Geneva and Lausanne
                    can work well for visiting golfers with limited travel time.
                  </p>
                </div>

                <div className="rounded-3xl bg-stone-50 p-5 ring-1 ring-slate-200">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Lake and resort golf
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Scenic courses around Lake Geneva, Lucerne and Ticino often
                    combine stronger settings with more premium visitor golf.
                  </p>
                </div>

                <div className="rounded-3xl bg-stone-50 p-5 ring-1 ring-slate-200">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Alpine golf
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Mountain courses in Valais, Graubünden and alpine regions
                    can be highly memorable, but usually have shorter seasons.
                  </p>
                </div>
              </div>
            </section>

            <section
              id="pricing-guide"
              className="mt-6 scroll-mt-24 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Price-band guide
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                Understanding Swiss golf price categories
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                GuestPlayGolf uses simple price bands to help you compare
                courses quickly. Exact green fees can vary by season, day, tee
                time and booking conditions.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {priceCategories.map((category) => (
                  <div
                    key={category.label}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-[22px] font-bold text-emerald-800">
                        {category.label}
                      </div>

                      <div className="text-right text-sm font-semibold text-slate-900">
                        {category.range}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Browse by canton
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                Golf in Switzerland by region
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Explore Swiss golf by canton and find courses that welcome
                independent guests across the country.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {regions.map((region) => (
                  <Link
                    key={region.code}
                    href={`/switzerland/${region.code.toLowerCase()}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4 no-underline transition hover:border-emerald-700 hover:bg-emerald-50"
                  >
                    <div className="font-semibold text-slate-900">
                      {region.code === 'ZH'
                        ? 'Golf in Zurich'
                        : `Golf in ${region.name}`}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {region.code}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Key things to know
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                Golf in Switzerland for visiting golfers
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Handicap rules matter
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Most Swiss courses require a recognised handicap. Exact
                    limits can vary by club.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Guest access varies
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Weekday, weekend and public-holiday access can differ
                    significantly between clubs.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Seasonality is important
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Alpine and higher-altitude courses often have much shorter
                    playing seasons.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Advance booking helps
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Swiss clubs often expect advance booking and may require
                    proof of membership or handicap.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Why GuestPlayGolf
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                More than a Swiss golf course directory
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                Many golf directories show where courses are located, but they
                do not always make it clear whether independent guests can play.
                In Switzerland, that matters because access, handicap rules,
                booking expectations and seasonality can vary significantly by
                club.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                GuestPlayGolf brings practical course information and trip
                planning together. Discover courses through Google, compare
                nearby options, add them to an itinerary and organise the full
                trip without relying on spreadsheets or long group-message
                threads.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                Our goal is simple: help golfers discover courses, build
                itineraries, share plans and organise better golf trips.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/switzerland/planner"
                  className="rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white no-underline"
                >
                  Start Planning
                </Link>

                <Link
                  href="/about"
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline"
                >
                  About GuestPlayGolf
                </Link>
              </div>
            </section>
          </div>

          <aside className="mt-6 min-w-0 lg:mt-0">
            <div className="lg:sticky lg:top-6">
              <PlannerCard />

              <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Start exploring
                </p>

                <h2 className="mt-1 text-[19px] font-semibold text-slate-900">
                  Popular Swiss golf bases
                </h2>

                <div className="mt-4 grid gap-3">
                  <Link
                    href="/golf-near-zurich"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Zurich →
                  </Link>

                  <Link
                    href="/golf-near-geneva"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Geneva →
                  </Link>

                  <Link
                    href="/golf-near-basel"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Basel →
                  </Link>

                  <Link
                    href="/golf-near-lausanne"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Lausanne →
                  </Link>

                  <Link
                    href="/golf-near-lucerne"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Lucerne →
                  </Link>

                  <Link
                    href="/golf-in-the-swiss-alps"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Swiss Alps →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
