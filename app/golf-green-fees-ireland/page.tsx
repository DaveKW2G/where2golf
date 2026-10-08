import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from 'next'
import Link from 'next/link'
import CountyCourseExplorer from '@/components/CountyCourseExplorer'
import { getIrelandCourses } from '@/lib/ireland-courses'
import { priceBands } from '@/lib/course-explorer'
export const metadata: Metadata = {
  title: 'Golf Green Fees Ireland | Compare Courses by Price',
  description: 'Compare Irish golf courses across five visitor green-fee bands. Filter by county, visitor days, course type, holes and distance, with map and list views.',
  alternates: { canonical: '/golf-green-fees-ireland' },
  openGraph: { title: 'Golf Green Fees Ireland | Compare Courses by Price', description: 'Find golf that fits your budget and plan your Irish golf trip.', url: 'https://guestplaygolf.com/golf-green-fees-ireland', type: 'website' },
}
export default async function GreenFeesIrelandPage() {
  const { courses, error } = await getIrelandCourses()
  return <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <Breadcrumbs page="/golf-green-fees-ireland" />
    <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8"><div className="mx-auto max-w-[480px] lg:max-w-[1120px]"><Link href="/ireland" className="text-sm text-emerald-100">← Explore golf in Ireland</Link><p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Visitor green-fee guide</p><h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">Golf Green Fees Ireland</h1><p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">Compare courses by price and find golf that fits your budget. Explore five visitor price bands, choose when you can play and switch between a list and a map.</p><div className="mt-6 flex flex-wrap gap-3"><a href="#compare-courses" className="rounded-full bg-white px-5 py-3 font-semibold text-emerald-900">Compare courses by price</a><Link href="/ireland/planner" className="rounded-full border border-white/30 px-5 py-3 font-semibold">Start your free golf trip planner</Link></div></div></section>
    <div className="mx-auto w-full max-w-[480px] space-y-6 px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7"><h2 className="text-[21px] font-semibold text-slate-900 lg:text-[24px]">How our five price bands work</h2><p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">The bands help you compare ordinary independent visitor green fees. Use them as a guide when budgeting for popular or peak playing periods. Some listings use dated published tariffs or sampled booking prices rather than a confirmed peak-season maximum; check the course notes and current club tariff before booking.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{priceBands.map(b=><div key={b.value} className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100"><h3 className="text-xl font-bold text-emerald-950">{b.name}</h3><p className="mt-2 text-2xl font-bold text-emerald-800">{b.value}</p><p className="mt-2 text-sm font-semibold">{b.range}</p><p className="mt-2 text-xs leading-5 text-slate-600">{b.description}</p></div>)}</div><p className="mt-4 text-sm leading-7 text-slate-600">Weekday, off-peak, winter or twilight tee times may cost less. Eligible Golf Ireland members may also receive a reduced rate, depending on the club&apos;s conditions. The bands here show visitor pricing; member discounts are not calculated.</p><p className="mt-2 text-sm leading-7 text-slate-600">Check the number of holes and course notes: a nine-hole course or tariff is not directly comparable with an eighteen-hole round. Northern Ireland courses are included, with sterling tariffs represented in euro bands for comparison. Courses within each band are listed alphabetically, rather than ranked by an exact fee.</p></section>
          <aside className="min-w-0">
            <div className="flex h-full flex-col rounded-3xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100 lg:p-6">
              <span className="inline-block w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
                Free online tool
              </span>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Build your Irish golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose Irish courses, build a day-by-day
                itinerary and organise your golf trip in one
                place. Share the plan and let your group vote on
                where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Compare the courses below by price and visitor access.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    2
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Add your preferred courses to each golf day.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    3
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Share the trip and vote as a group.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-5">
                <Link
                  href="/ireland/planner"
                  className="block w-full rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline transition hover:bg-emerald-900"
                >
                  Start Free Golf Trip Planner
                </Link>

                <p className="mt-3 text-center text-xs leading-5 text-slate-600">
                  Browse Irish courses below and add your
                  preferred options as you go.
                </p>
              </div>
            </div>
          </aside>
      </div>
      <section id="compare-courses" className="scroll-mt-6"><div className="mb-4"><h2 className="text-2xl font-bold">Compare visitor green fees across Ireland</h2><p className="mt-2 text-sm text-slate-600">For great value golf, select €50 or less. Combine a price band with any of the other filters below.</p></div>{error ? <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-800">Unable to load courses. Please refresh the page to try again.</div> : <CountyCourseExplorer courses={courses} countyName="Ireland" source="golf-green-fees-ireland" initialCenter={[53.4,-8]} showCounty pricingFocus />}</section>
      <section aria-labelledby="related-guides-heading" className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
        <h2 id="related-guides-heading" className="text-2xl font-bold">Continue planning your Irish golf trip</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">Explore county guides, compare links courses or choose a base for your trip.</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <nav aria-label="Ireland golf and planner"><h3 className="font-bold text-slate-900">Explore and plan</h3><div className="mt-3 grid gap-3">{[
            ['Ireland golf courses', '/ireland'], ['Free Ireland golf trip planner', '/ireland/planner'], ['Links Golf in Ireland', '/links-golf-ireland'], ['Links Golf Near Dublin', '/links-golf-near-dublin']
          ].map(([label,href])=><Link key={href} href={href} className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{label} →</Link>)}</div></nav>
          <nav aria-label="County golf guides"><h3 className="font-bold text-slate-900">Browse by county</h3><div className="mt-3 grid gap-3">{[
            ['Dublin','dublin'],['Cork','cork'],['Kerry','kerry'],['Clare','clare'],['Galway','galway'],['Donegal','donegal'],['Down','down'],['Wicklow','wicklow'],['Kildare','kildare'],['Limerick','limerick']
          ].map(([name,slug])=><Link key={slug} href={`/golf-courses-${slug}`} className="rounded-xl bg-stone-50 px-4 py-3 text-sm font-semibold text-emerald-900">Golf Courses in {name} →</Link>)}</div></nav>
          <nav aria-label="Golf trip bases"><h3 className="font-bold text-slate-900">Choose a golf-trip base</h3><div className="mt-3 grid gap-3">{[
            ['Dublin','dublin'],['Cork','cork'],['Galway','galway'],['Belfast','belfast'],['Adare Manor','adare-manor']
          ].map(([name,slug])=><Link key={slug} href={`/golf-near-${slug}`} className="rounded-xl bg-stone-50 px-4 py-3 text-sm font-semibold text-emerald-900">Golf Near {name} →</Link>)}</div></nav>
        </div>
        <div className="mt-6 rounded-2xl bg-emerald-50 p-5"><h3 className="text-lg font-bold">Ready to turn your shortlist into an itinerary?</h3><p className="mt-2 text-sm leading-6 text-slate-600">Build your golf days, share the plan and gather your group&apos;s votes.</p><Link href="/ireland/planner" className="mt-4 inline-block rounded-full bg-emerald-800 px-5 py-3 text-sm font-bold text-white">Start Free Golf Trip Planner →</Link></div>
      </section>
    </div>
  </main>
}
