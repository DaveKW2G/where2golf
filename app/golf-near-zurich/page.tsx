import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

const siteUrl = "https://guestplaygolf.com";

const zurichLat = 47.3769;
const zurichLng = 8.5417;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf Near Zurich | Courses & Free Golf Trip Planner",
  description:
    "Find the best golf near Zurich for visiting golfers. Compare Swiss courses, guest access, handicap rules and seasonality, then use our free golf trip planner to build, share and vote on your Zurich golf itinerary.",
  alternates: {
    canonical: "/golf-near-zurich",
  },
  openGraph: {
    title: "Golf Near Zurich | Courses & Free Golf Trip Planner | GuestPlayGolf",
    description:
      "Compare visitor-friendly golf near Zurich, build a free Swiss golf itinerary, share your trip and vote on courses with your group.",
    url: `${siteUrl}/golf-near-zurich`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

const zurichAreaRegions = ["ZH", "ZG", "AG", "SZ"];

const regionNames: Record<string, string> = {
  ZH: "Zurich",
  ZG: "Zug",
  AG: "Aargau",
  SZ: "Schwyz",
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function SwissGolfLinks() {
  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
        Continue planning your Switzerland golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare other Swiss golf hubs and regional guides, then add more
        courses to your free GuestPlayGolf itinerary.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/switzerland/zh"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          Golf in Zurich →
        </Link>

        <Link
          href="/golf-near-lucerne"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Lucerne →
        </Link>

        <Link
          href="/golf-near-basel"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Basel →
        </Link>

        <Link
          href="/golf-near-geneva"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Geneva →
        </Link>

        <Link
          href="/golf-near-lausanne"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Lausanne →
        </Link>

        <Link
          href="/golf-in-the-swiss-alps"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf in the Swiss Alps →
        </Link>
      </div>

      <Link
        href="/switzerland/planner"
        className="mt-5 block text-center text-sm font-semibold text-emerald-700 no-underline"
      >
        Open your Swiss golf trip planner →
      </Link>
    </>
  );
}

export default async function GolfNearZurichPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type",
    )
    .in("region", zurichAreaRegions)
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance = getDistanceKm(
          zurichLat,
          zurichLng,
          course.latitude,
          course.longitude,
        );

        return {
          ...course,
          distance,
        };
      })
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)) || [];

  const courseCount = coursesWithDistance.length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link
            href="/switzerland"
            className="text-sm text-white/90 no-underline"
          >
            ← Switzerland
          </Link>

          <div className="mt-6 lg:max-w-[800px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Golf near Zurich
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Near Zurich: Find Courses and Plan Your Trip
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Compare visitor-friendly golf near Zurich across Zurich, Zug,
              Aargau and Schwyz. Add your preferred courses to a free Swiss golf
              itinerary, share the trip and vote with your group.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {courseCount} courses around Zurich
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Zurich, Zug, Aargau and Schwyz
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Zurich golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Where to play golf near Zurich
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Zurich is one of the best golf bases in Switzerland for visiting
              golfers. Within easy reach of the city, you can compare courses
              across Zurich, Zug, Aargau and Schwyz, with a strong mix of
              accessible parkland, lake-region golf and scenic Swiss layouts.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Golf around Zurich is practical because the city has strong road,
              rail and airport connections. It works well for short golf breaks,
              business trips and regular rounds, while still giving access to
              several cantons without long travel days.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              The main planning challenge is not distance alone. Swiss courses
              can vary significantly by guest access, handicap requirements,
              booking rules, weekend availability and playing season, so it is
              worth comparing the options before deciding where to play.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Strong course choice
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Compare courses across Zurich and neighbouring cantons.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Good transport
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  International airport access and strong road and rail links.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Easy to plan
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Add courses to a shared itinerary and vote with your group.
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
                Build your Zurich golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose courses, build a day-by-day itinerary and organise your
                Zurich golf trip in one place. Share the plan and let your group
                vote on where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Add Zurich-area courses to your shortlist.
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
                  href="/switzerland/planner"
                  className="block w-full rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline transition hover:bg-emerald-900"
                >
                  Start Free Golf Trip Planner
                </Link>

                <p className="mt-3 text-center text-xs leading-5 text-slate-600">
                  Browse the courses below and add your preferred options as you
                  go.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Zurich golf regions
          </p>

          <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
            Compare nearby Swiss regions
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Zurich is the main anchor, but many useful golf options sit across
            nearby cantons. Use these region links to compare more local course
            pages.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {zurichAreaRegions.map((region, index) => (
              <Link
                key={region}
                href={`/switzerland/${region.toLowerCase()}`}
                className={
                  index === 0
                    ? "rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white no-underline"
                    : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:border-emerald-700"
                }
              >
                {regionNames[region]}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading golf courses near Zurich.
            </div>
          )}

          {coursesWithDistance.length === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No golf courses found near Zurich.
            </div>
          ) : (
            <div className="grid gap-4">
              {coursesWithDistance.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  userLat={zurichLat}
                  userLng={zurichLng}
                  searchParams={{
                    country: "switzerland",
                    source: "zurich",
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <SwissGolfLinks />
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Swiss golf planning
          </p>

          <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
            What to check before playing golf near Zurich
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            Switzerland can be more structured than some golf destinations.
            Many clubs expect a recognised handicap, a valid golf club
            membership or proof of playing ability. Independent guests are often
            welcome, but the rules differ by club.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            Weekend and public holiday access can also be more restricted than
            weekday play. Some clubs are straightforward for visitors, while
            others are better suited to golfers with clear handicap credentials
            and flexible tee-time expectations.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            Use GuestPlayGolf to compare distance, visitor access, handicap
            rules, seasonality and course details before adding courses to your
            Zurich golf itinerary.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/switzerland/planner"
              className="rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white no-underline"
            >
              Start Planning
            </Link>

            <Link
              href="/switzerland"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline"
            >
              Browse Switzerland
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
