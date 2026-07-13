"use client";

import Link from "next/link";

export default function HomePageClient() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-10 pt-6 text-white lg:pb-14 lg:pt-8">
        <div className="relative z-10 mx-auto max-w-[480px] lg:max-w-[1120px]">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="text-white no-underline">
              <span className="text-[15px] font-semibold uppercase tracking-[0.28em] text-white/90">
                GuestPlayGolf
              </span>
            </Link>

            <div className="flex items-center gap-4 text-sm font-semibold text-white/90">
              <Link href="/ireland" className="hidden no-underline sm:inline">
                Ireland
              </Link>

              <Link
                href="/switzerland"
                className="hidden no-underline sm:inline"
              >
                Switzerland
              </Link>

              <Link href="/about" className="no-underline">
                About
              </Link>
            </div>
          </nav>

          <div className="mt-8 lg:max-w-[780px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-100/80">
              Golf for visiting golfers and independent guests
            </p>

            <h1 className="mt-4 text-[34px] font-bold leading-[1.06] text-white sm:text-[40px] lg:text-[56px] lg:leading-[1.02]">
              Find where to play.
              <br />
              Plan better golf trips.
            </h1>

            <p className="mt-5 text-[17px] font-semibold text-emerald-50 lg:text-[20px]">
              Golf isn&apos;t easy. Finding where to play should be.
            </p>

            <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-white/85 lg:text-[17px]">
              Discover golf courses you can play as a visiting golfer or
              independent guest. Compare access, course type, location and
              practical details, then use GuestPlayGolf to plan your next round
              or golf trip.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ireland"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-950 no-underline transition hover:bg-emerald-50"
              >
                Explore Ireland →
              </Link>

              <Link
                href="/switzerland"
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline ring-1 ring-white/20 transition hover:bg-white/15"
              >
                Explore Switzerland →
              </Link>

              <Link
                href="/about"
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-emerald-500"
              >
                About GuestPlayGolf →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 text-left lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <Link
            href="/ireland"
            className="flex h-full flex-col rounded-3xl bg-emerald-800 p-5 text-white no-underline shadow-sm ring-1 ring-emerald-900/20 transition hover:bg-emerald-900 lg:p-7"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
              Ireland
            </p>

            <h2 className="mt-2 text-[24px] font-bold leading-tight lg:text-[30px]">
              Golf in Ireland
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/85 lg:text-[15px]">
              Explore Irish links, parkland, heathland and championship courses
              near Dublin, Cork, Galway, Belfast and Adare Manor.
            </p>

            <div className="mt-5 grid gap-2 text-sm font-semibold text-white/95 sm:grid-cols-2">
              <span className="rounded-2xl bg-white/10 px-4 py-3">
                Golf Near Dublin
              </span>

              <span className="rounded-2xl bg-white/10 px-4 py-3">
                Links Near Dublin
              </span>

              <span className="rounded-2xl bg-white/10 px-4 py-3">
                Cork & Galway
              </span>

              <span className="rounded-2xl bg-white/10 px-4 py-3">
                Belfast & Adare
              </span>
            </div>

            <span className="mt-auto pt-5 text-sm font-semibold text-white">
              Explore Ireland golf →
            </span>
          </Link>

          <Link
            href="/switzerland"
            className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 no-underline shadow-sm transition hover:bg-slate-50 lg:p-7"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Switzerland
            </p>

            <h2 className="mt-2 text-[24px] font-bold leading-tight lg:text-[30px]">
              Golf in Switzerland
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-[15px]">
              Find Swiss courses where independent guests can play, with clear
              information on access, handicap requirements, regions and seasonal
              play.
            </p>

            <div className="mt-5 grid gap-2 text-sm font-semibold text-slate-800 sm:grid-cols-2">
              <span className="rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-slate-200">
                Guest access
              </span>

              <span className="rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-slate-200">
                Handicap rules
              </span>

              <span className="rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-slate-200">
                Seasonal play
              </span>

              <span className="rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-slate-200">
                Regional guides
              </span>
            </div>

            <span className="mt-auto pt-5 text-sm font-semibold text-emerald-800">
              Explore Switzerland golf →
            </span>
          </Link>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Free Ireland golf trip planner
              </p>

              <h2 className="mt-1 text-[24px] font-bold leading-tight text-slate-900 lg:text-[30px]">
                Plan. Share. Vote. Golf.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 lg:text-[15px]">
                Build a golf itinerary, add courses to each day, share the trip
                with your group and vote on where to play. The planner is built
                for golfers organising Ireland trips without needing another
                spreadsheet or group chat mess.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Build
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add courses and organise them by golf day.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Share
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Send your trip link to the rest of your group.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Vote
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Let everyone vote on the courses they prefer.
                  </p>
                </div>
              </div>
            </div>

            <aside className="flex h-full flex-col rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100 lg:p-6">
              <span className="inline-block w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
                Free online tool
              </span>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Start your golf trip planner
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Shortlist courses, organise your route and make group decisions
                easier before you book.
              </p>

              <div className="mt-auto pt-5">
                <Link
                  href="/ireland/planner"
                  className="block rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline transition hover:bg-emerald-900"
                >
                  Open Free Golf Trip Planner
                </Link>

                <p className="mt-3 text-center text-xs leading-5 text-slate-600">
                  GuestPlayGolf does not take bookings. It helps golfers plan
                  where to play.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <h2 className="text-[22px] font-semibold text-slate-900">
            Popular golf planning pages
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start with a regional guide, compare visitor-friendly courses, then
            add your preferred options to your itinerary.
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

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <h2 className="text-[22px] font-semibold text-slate-900">
                How GuestPlayGolf helps
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Simple tools and clear course information for golfers deciding
                where to play next.
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
              <div className="text-sm font-semibold text-slate-900">
                Find courses
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Discover golf courses by country, region, distance and course
                type.
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
              <div className="text-sm font-semibold text-slate-900">
                Compare access
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review guest access, handicap requirements, pricing, seasonality
                and practical details.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-emerald-900 p-6 text-white shadow-sm lg:p-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                About GuestPlayGolf
              </p>

              <h2 className="mt-2 text-[24px] font-bold leading-tight lg:text-[30px]">
                Built to make golf discovery clearer
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/90 lg:text-[15px]">
                GuestPlayGolf was created after planning many golf trips and
                wanting a clearer way to understand where visiting golfers can
                play.
              </p>
            </div>

            <Link
              href="/about"
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-emerald-950 no-underline transition hover:bg-emerald-50"
            >
              Learn more about GuestPlayGolf →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}