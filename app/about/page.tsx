import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://guestplaygolf.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "About GuestPlayGolf | Find Courses & Plan Golf Trips",
  description:
    "Learn more about GuestPlayGolf, built to help visiting golfers find where they can play, compare courses and plan golf trips more easily.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About GuestPlayGolf | Find Courses & Plan Golf Trips",
    description:
      "GuestPlayGolf helps visiting golfers discover where they can play next, compare courses and use free tools to plan better golf trips.",
    url: `${siteUrl}/about`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-10 pt-6 text-white lg:pb-14 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white no-underline">
              ← Home
            </Link>

            <div className="text-[13px] uppercase tracking-wide text-white/80">
              GuestPlayGolf
            </div>

            <div className="w-10" />
          </div>

          <div className="mt-8 lg:max-w-[780px]">
            <p className="text-[12px] uppercase tracking-[0.18em] text-emerald-200">
              About GuestPlayGolf
            </p>

            <h1 className="mt-3 text-[32px] font-bold leading-tight sm:text-[38px] lg:text-[52px] lg:leading-[1.05]">
              Helping golfers find where to play next
            </h1>

            <p className="mt-5 text-[17px] leading-7 text-emerald-50/95 lg:max-w-[720px] lg:text-[19px]">
              Golf isn&apos;t easy. Finding where to play should be.
            </p>

            <p className="mt-4 text-[15px] leading-7 text-white/85 lg:max-w-[720px] lg:text-[16px]">
              GuestPlayGolf helps visiting golfers and independent guests find
              courses they can play, compare practical access information and
              plan better golf trips.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ireland/planner"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-950 no-underline transition hover:bg-emerald-50"
              >
                Open Free Golf Trip Planner →
              </Link>

              <Link
                href="/ireland"
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline ring-1 ring-white/20 transition hover:bg-white/15"
              >
                Explore Ireland →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Why it exists
            </p>

            <h2 className="mt-1 text-[22px] font-semibold text-slate-900 lg:text-[26px]">
              Built from the frustration of planning golf trips
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              GuestPlayGolf was thought up after planning many golf trips and
              repeatedly running into the same problem: there was no simple tool
              that clearly showed where visiting golfers could actually play.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              Finding golf courses online is easy. Understanding visitor access,
              course type, location, handicap rules, seasonality and whether a
              course fits into a realistic trip is much harder.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              The goal is to make golf discovery simpler and more accessible,
              especially for golfers who are not members of a local club, are
              travelling to a new region, or are trying to organise a trip with a
              group.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Find courses
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Discover where visiting golfers and independent guests can
                  play.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Compare access
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Review guest access, course style, distance and practical
                  details.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Plan trips
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Build, share and vote on golf itineraries with your group.
                </p>
              </div>
            </div>
          </section>

          <aside className="min-w-0">
            <div className="flex h-full flex-col rounded-3xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100 lg:p-6">
              <span className="inline-block w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
                Free online tool
              </span>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Plan. Share. Vote. Golf.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                The Ireland golf trip planner helps golfers shortlist courses,
                build a day-by-day itinerary, share the trip and vote as a
                group.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Add courses to your shortlist.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    2
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Assign courses to each golf day.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    3
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Share the trip and vote with your group.
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
                  GuestPlayGolf does not take bookings. It helps golfers plan
                  where to play.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
            <h2 className="text-[22px] font-semibold text-slate-900">
              Making golf more accessible
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              Golf can feel difficult to access, especially when you are
              travelling, not connected to a local club, or unsure which courses
              welcome visitors. GuestPlayGolf is built around the idea that
              golfers should be able to understand their options quickly.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              That does not mean every course is open every day, or that every
              course can be booked online. It means the information should be
              clearer, easier to compare and easier to use when planning where
              to play.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              The aim is to support golfers before they book: helping them build
              a shortlist, compare regions and decide which courses best fit
              their trip.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
            <h2 className="text-[22px] font-semibold text-slate-900">
              What GuestPlayGolf focuses on
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>
                • Helping golfers identify where they can play as visitors or
                independent guests
              </li>

              <li>
                • Making golf discovery faster and easier on mobile
              </li>

              <li>
                • Comparing course types including links, parkland, heathland
                and resort golf
              </li>

              <li>
                • Showing practical information such as handicap requirements,
                guest access, location and seasonality
              </li>

              <li>
                • Helping golfers plan golf around major regions, cities and
                golf destinations
              </li>

              <li>
                • Supporting group trip planning through free itinerary,
                sharing and voting tools
              </li>
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Current coverage
              </p>

              <h2 className="mt-1 text-[22px] font-semibold text-slate-900">
                Switzerland and Ireland
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                GuestPlayGolf is currently focused on Switzerland and Ireland,
                with regional golf guides and destination pages designed for
                visiting golfers.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                Switzerland and Ireland offer very different golfing
                experiences, but both highlight the same challenge: golfers need
                clearer information before deciding where to play.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/ireland"
                className="rounded-2xl bg-emerald-800 px-5 py-4 text-white no-underline shadow-sm transition hover:bg-emerald-900"
              >
                <div className="text-[17px] font-semibold">
                  Golf in Ireland
                </div>

                <p className="mt-2 text-sm leading-5 text-white/85">
                  Explore links, parkland and championship golf across Ireland,
                  including regional guides and the free trip planner.
                </p>
              </Link>

              <Link
                href="/switzerland"
                className="rounded-2xl bg-emerald-800 px-5 py-4 text-white no-underline shadow-sm transition hover:bg-emerald-900"
              >
                <div className="text-[17px] font-semibold">
                  Golf in Switzerland
                </div>

                <p className="mt-2 text-sm leading-5 text-white/85">
                  Discover golf across Switzerland with clear information on
                  guest access, regions and seasonal play.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <h2 className="text-[22px] font-semibold text-slate-900">
            Popular golf planning pages
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start with a country, city guide or specialist page, then use the
            planner to build your own golf trip.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/golf-near-dublin"
              className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
            >
              Golf Near Dublin →
            </Link>

            <Link
              href="/links-golf-near-dublin"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              Best Links Golf Near Dublin →
            </Link>

            <Link
              href="/golf-near-cork"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              Golf Near Cork →
            </Link>

            <Link
              href="/golf-near-galway"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              Golf Near Galway →
            </Link>

            <Link
              href="/golf-near-belfast"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              Golf Near Belfast →
            </Link>

            <Link
              href="/golf-near-adare-manor"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              Golf Near Adare Manor →
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-emerald-900 p-6 text-white shadow-sm lg:p-8">
          <h2 className="text-[26px] font-bold leading-tight lg:text-[32px]">
            Golf isn&apos;t easy.
            <br />
            Finding where to play should be.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-50/90 lg:text-[15px]">
            GuestPlayGolf was built to make golf discovery simpler, clearer and
            more useful for golfers planning their next round or their next golf
            trip.
          </p>
        </section>
      </section>
    </main>
  );
}