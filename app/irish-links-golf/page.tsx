import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

const siteUrl = "https://guestplaygolf.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Irish Links Golf | Courses & Free Golf Trip Planner",
  description:
    "Explore Irish Links golf courses where visiting golfers can play. Compare guest access, price bands and course details, then build a free Ireland golf itinerary to share and vote on with your group.",
  alternates: {
    canonical: "/irish-links-golf",
  },
  openGraph: {
    title: "Irish Links Golf | Courses & Free Golf Trip Planner | GuestPlayGolf",
    description:
      "Compare visitor-friendly Irish Links golf courses, build a free itinerary, share your trip and vote on courses with your group.",
    url: `${siteUrl}/irish-links-golf`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

const featuredRegions = [
  "Dublin",
  "Louth",
  "Down",
  "Antrim",
  "Sligo",
  "Mayo",
  "Galway",
  "Clare",
  "Kerry",
  "Donegal",
];

function RegionalGolfLinks() {
  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
        Continue planning your Ireland golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare regional golf hubs and specialist guides, then add more courses
        to your free GuestPlayGolf itinerary.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/links-golf-near-dublin"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          Best Links Golf Near Dublin →
        </Link>

        <Link
          href="/golf-near-dublin"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Dublin →
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

      <Link
        href="/ireland/planner"
        className="mt-5 block text-center text-sm font-semibold text-emerald-700 no-underline"
      >
        Open your golf trip planner →
      </Link>
    </>
  );
}

export default async function IrishLinksGolfPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type",
    )
    .ilike("country", "Ireland")
    .ilike("course_type", "%Links%")
    .order("region", { ascending: true })
    .order("course_name", { ascending: true })
    .limit(300);

  const linksCourses = courses || [];
  const courseCount = linksCourses.length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <div className="mt-6 lg:max-w-[800px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Irish Links golf
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Irish Links Golf: Find Courses and Plan Your Trip
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Compare Irish Links golf courses where visiting golfers can play.
              Check guest access, price bands and course details, then add your
              preferred courses to a free itinerary, share the trip and vote
              with your group.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {courseCount} Irish Links courses listed
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Rare, coastal and trip-defining golf
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Ireland Links guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Why Links golf matters in Ireland
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Links golf is one of the main reasons golfers travel to Ireland.
              True Links courses are rare globally, with commonly cited
              estimates putting the worldwide total below 250. Ireland has
              roughly 50 Links courses across the island, giving it one of the
              strongest concentrations of Links golf anywhere in the world.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Irish Links golf is built around coastal terrain, natural dunes,
              firm ground, changing wind and a style of play that can feel very
              different from inland parkland golf. For many visiting golfers, a
              trip to Ireland is built around at least one Links round.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              GuestPlayGolf helps visiting golfers compare Irish Links courses
              currently listed on the site, check independent guest access,
              understand price bands and build a practical trip itinerary before
              contacting clubs.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Rare globally
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  True Links golf represents a small share of courses worldwide.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Strong Irish concentration
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Ireland has one of the strongest collections of Links golf.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Trip-defining golf
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Coastal courses often shape the route of an Irish golf trip.
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
                Build your Irish Links golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose Links courses, build a day-by-day itinerary and organise
                your Ireland golf trip in one place. Share the plan and let your
                group vote on where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Add Links courses to your shortlist.
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
                  Browse the Links courses below and add your preferred options
                  as you go.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play Links golf in Ireland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Irish Links golf is spread across several coastal regions. The
            famous east coast options near Dublin and Louth are only one part of
            the picture. The north coast, west coast and south-west all offer
            strong Links golf routes for visiting golfers.
          </p>

          <div className="mt-5 rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">
              Links golf regions covered on this page
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Courses are shown together in one national list rather than split
              into county filters. This keeps the page focused on Irish Links
              golf as a complete trip-planning category.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-700">
              {featuredRegions.join(", ")}
            </p>
          </div>
        </section>

        <section className="mt-6">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading Irish Links golf courses.
            </div>
          )}

          {linksCourses.length === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No Irish Links golf courses found.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {linksCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  searchParams={{
                    country: "ireland",
                    source: "irish-links-golf",
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <RegionalGolfLinks />
        </section>
      </section>
    </main>
  );
}
