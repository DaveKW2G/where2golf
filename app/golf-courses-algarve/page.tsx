import Breadcrumbs from '@/components/Breadcrumbs'
import CountyCourseExplorer from '@/components/CountyCourseExplorer'
import GolfTripPlannerAside from '@/components/GolfTripPlannerAside'
import { getAlgarveCourses } from '@/lib/portugal-courses'
import type { Metadata } from 'next'
import Link from 'next/link'

const siteUrl = 'https://guestplaygolf.com'
const algarveCenter: [number, number] = [37.1, -8.15]

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Golf Courses in the Algarve | Green Fees, Maps & Visitor Golf',
  description: 'Explore Algarve golf courses, visitor access and price guidance from the latest published tariffs, including clearly labelled 2025 fallbacks where required.',
  alternates: { canonical: '/golf-courses-algarve' },
  openGraph: {
    title: 'Golf Courses in the Algarve | Green Fees, Maps & Visitor Golf',
    description: 'Compare Algarve golf courses and plan a golf-in-the-sun trip with great food, lively evenings and plenty for groups and families.',
    url: `${siteUrl}/golf-courses-algarve`,
    siteName: 'GuestPlayGolf',
    type: 'website',
  },
}

export default async function AlgarveGolfPage() {
  const { courses, error } = await getAlgarveCourses()
  const courseCount = courses.length

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Golf Courses in the Algarve', href: '/golf-courses-algarve' },
      ]} />

      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/" className="text-sm text-white/90 no-underline">← Home</Link>

          <div className="mt-6 lg:max-w-[780px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">Golf in Portugal</p>
            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Courses in the Algarve
            </h1>
            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[720px] lg:text-[17px] lg:leading-7">
              Explore <strong>{courseCount} Algarve golf courses</strong> with clear visitor access, course information and price guidance from the latest published tariffs.
            </p>
            <p className="mt-3 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[720px] lg:text-[17px] lg:leading-7">
              Combine golf in the sun with the beautiful Algarve coastline, great food, a relaxed atmosphere and lively evenings—ideal for a dedicated golf trip or a family getaway.
            </p>
            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">Plan. Compare. Book.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">{courseCount} Algarve courses</span>
              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">Latest published tariff bands</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section id="pricing-guide" className="min-w-0 scroll-mt-24 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">Algarve golf guide</p>
            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">Where to play golf in the Algarve</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The Algarve offers more than a strong choice of golf courses. Its coastal scenery, welcoming resort towns and easy-going pace make it a natural setting for golf in the sun, while excellent restaurants and lively evening entertainment give golf groups plenty to enjoy after the final putt.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              It also works well when golf is only part of the holiday. Golfers can build a shared course shortlist while partners, friends and families enjoy a relaxed Algarve getaway. Use the course list below to compare verified details; full notes and official links are available on each course page.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The price symbols are planning bands based on the latest published adult visitor information available. We use 2026 prices where available; any preserved 2025 tariff, partner rate, event price or stay-and-play package is identified clearly in the course notes. These are not live quotes, so confirm the selected tee-time price before booking.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"><div className="text-sm font-semibold text-slate-900">Golf in the sun</div><p className="mt-1 text-xs leading-5 text-slate-500">Beautiful surroundings and a relaxed Algarve atmosphere.</p></div>
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"><div className="text-sm font-semibold text-slate-900">Food and evenings</div><p className="mt-1 text-xs leading-5 text-slate-500">Great food and lively entertainment after golf.</p></div>
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200"><div className="text-sm font-semibold text-slate-900">Groups and families</div><p className="mt-1 text-xs leading-5 text-slate-500">Suited to golf trips and family getaways alike.</p></div>
            </div>
          </section>

          <GolfTripPlannerAside
            heading="Build your Portugal golf trip"
            description="Choose your Portugal base, explore courses on a map and build a shared shortlist with your group."
            steps={[
              'Choose your base anywhere in Portugal.',
              'Filter and add courses from the country-wide list.',
              'Invite your group to add courses, vote and choose where to play.',
            ]}
            footer="The planner covers Portugal as a country; it is not restricted to the Algarve."
            plannerHref="/portugal/planner"
            buttonLabel="Start Portugal Golf Trip Planner"
          />
        </div>

        <section id="courses" className="mt-6 scroll-mt-24">
          {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Error loading Algarve golf courses.</div>}
          <CountyCourseExplorer
            courses={courses}
            countyName="the Algarve"
            source="portugal/algarve"
            initialCenter={algarveCenter}
            townExample="Vilamoura"
            countryName="Portugal"
            countryQuery="portugal"
            regionLabel="Area"
            pricingNotice="Bands use the latest published adult visitor information available. Where a normal 2026 tariff was not published, the course notes identify the preserved 2025 tariff or other published fallback used. Confirm the live total before booking."
          />
        </section>
      </section>
    </main>
  )
}
