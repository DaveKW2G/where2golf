import type { Metadata } from "next";
import Link from "next/link";
import IrelandPageClient from "@/components/IrelandPageClient";

const siteUrl = "https://guestplaygolf.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ireland Golf Trip Planner | Courses, Itineraries & Group Voting",
  description:
    "Plan your Irish golf trip for free. Compare visitor-friendly golf courses, build a day-by-day itinerary, share plans and vote on where to play in Ireland.",
  alternates: {
    canonical: "/ireland",
  },
  openGraph: {
    title: "Ireland Golf Trip Planner | GuestPlayGolf",
    description:
      "Compare Irish golf courses, build a free itinerary, share your trip and vote on where to play with your group.",
    url: `${siteUrl}/ireland`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

const popularDestinations = [
  {
    title: "Golf Near Dublin",
    href: "/golf-near-dublin",
    description:
      "Compare top links, parkland and resort courses within easy reach of Ireland’s main international gateway.",
  },
  {
    title: "Best Links Golf Near Dublin",
    href: "/links-golf-near-dublin",
    description:
      "Explore classic Irish links golf near Dublin, including accessible coastal courses and bucket-list venues.",
  },
  {
    title: "Golf Near Adare Manor",
    href: "/golf-near-adare-manor",
    description:
      "Plan golf around Adare Manor and the Ryder Cup region, with access to Clare, Kerry and the west coast.",
  },
  {
    title: "Golf Near Cork",
    href: "/golf-near-cork",
    description:
      "Discover coastal, links and parkland golf across Cork and the south of Ireland.",
  },
  {
    title: "Golf Near Galway",
    href: "/golf-near-galway",
    description:
      "Use Galway as a base for dramatic west-coast golf and some of Ireland’s best-known links courses.",
  },
  {
    title: "Golf Near Belfast",
    href: "/golf-near-belfast",
    description:
      "Explore Northern Ireland golf, including world-famous links and strong visitor options around Belfast.",
  },
];

const priceCategories = [
  {
    label: "€",
    range: "Value · Up to €100",
    description:
      "Accessible green fees and excellent local golf experiences across many visitor-friendly courses.",
  },
  {
    label: "€€",
    range: "Mid Range · €101–200",
    description:
      "Established clubs, championship venues and strong regional golf destinations.",
  },
  {
    label: "€€€",
    range: "Premium · €201–300",
    description:
      "High-end golf resorts and premium visitor golf experiences.",
  },
  {
    label: "€€€€",
    range: "Bucket List · €300+",
    description:
      "Ireland’s most iconic, prestigious and sought-after golf experiences.",
  },
];

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
        Build your Irish golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-white/85">
        Compare courses, organise each golf day, estimate green fees and keep
        your complete itinerary together in one place.
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
        href="/ireland/planner"
        className="mt-6 block rounded-full bg-white px-5 py-3.5 text-center text-sm font-semibold text-emerald-900 no-underline transition hover:bg-emerald-50"
      >
        Start Free Golf Trip Planner
      </Link>

      <p className="mt-3 text-center text-xs text-white/70">
        No travel agent required.
      </p>
    </div>
  );
}

export default function IrelandPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden px-5 pb-10 pt-5 text-white lg:pb-14 lg:pt-7">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1505842465776-3d90f6163108?q=80&w=1800&auto=format&fit=crop')",
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
              Free Ireland golf trip planner
            </p>

            <h1 className="mt-3 text-[30px] font-bold leading-[1.08] sm:text-[34px] lg:text-[48px]">
              Plan Your Irish Golf Trip
            </h1>

            <p className="mt-5 max-w-[760px] text-[15px] leading-6 text-white/90 lg:text-[18px] lg:leading-8">
              Compare Ireland&apos;s visitor-friendly golf courses, build a
              day-by-day itinerary, share plans with your group and vote on
              where to play.
            </p>

            <p className="mt-5 text-[14px] font-bold uppercase tracking-[0.15em] text-emerald-100">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ireland/planner"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 no-underline transition hover:bg-emerald-50"
              >
                Start Free Golf Trip Planner
              </Link>

              <Link
                href="#find-courses"
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline ring-1 ring-white/25 backdrop-blur transition hover:bg-white/15"
              >
                Find Irish Golf Courses
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
          <IrelandPageClient />
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
          <div className="min-w-0">
            <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Irish golf planning
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                How to plan an Irish golf trip
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                Ireland is one of the world&apos;s richest golf destinations.
                The challenge is not whether there are enough courses—it is
                choosing the right courses for your trip, budget, location and
                preferred style of golf.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                GuestPlayGolf combines course information with a free online
                planning tool. Compare links, parkland and heathland courses,
                understand visitor access, review price categories and add your
                preferred options directly to a day-by-day itinerary.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                Ireland is generally visitor-friendly, but access still varies
                by course. Some clubs welcome visitors throughout the week,
                some prioritise weekdays and certain premium venues offer more
                limited access.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Choose a base
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Start from Dublin, Cork, Galway, Belfast, Lahinch, Adare or
                    another Irish destination.
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">
                    Compare courses
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review distance, style, visitor access and price before
                    choosing where to play.
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
                Golf near major Irish destinations
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Compare the strongest golf regions, major airports and popular
                travel bases before adding courses to your itinerary.
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
                Course styles
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                Types of golf courses in Ireland
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Understanding Ireland&apos;s main course styles makes it easier
                to build a varied itinerary.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-stone-50 p-5 ring-1 ring-slate-200">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Links courses
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Coastal courses built on sandy natural terrain, often with
                    firm fairways, dunes, uneven lies and exposed wind
                    conditions.
                  </p>
                </div>

                <div className="rounded-3xl bg-stone-50 p-5 ring-1 ring-slate-200">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Parkland courses
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Inland courses shaped through trees, softer ground, lakes,
                    rivers and more sheltered surroundings.
                  </p>
                </div>

                <div className="rounded-3xl bg-stone-50 p-5 ring-1 ring-slate-200">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Heathland courses
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Open inland layouts with firm turf, strategic bunkering,
                    wind influence and links-style characteristics.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Green-fee guide
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                Understanding price categories
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
                Why GuestPlayGolf
              </p>

              <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
                More than an Irish golf course directory
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                Ireland has an incredible number of courses, but choosing where
                to play can be overwhelming. Options vary by location, course
                type, price, visitor access and availability.
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
                  href="/ireland/planner"
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
                  Popular golf-trip bases
                </h2>

                <div className="mt-4 grid gap-3">
                  <Link
                    href="/golf-near-dublin"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Dublin →
                  </Link>

                  <Link
                    href="/golf-near-cork"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Cork →
                  </Link>

                  <Link
                    href="/golf-near-galway"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Galway →
                  </Link>

                  <Link
                    href="/golf-near-belfast"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Belfast →
                  </Link>

                  <Link
                    href="/golf-near-adare-manor"
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
                  >
                    Adare Manor →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}