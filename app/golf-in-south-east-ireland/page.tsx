import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { getIrelandCourses } from "@/lib/ireland-courses";
import CountyCourseExplorer from "@/components/CountyCourseExplorer";

const siteUrl = "https://guestplaygolf.com";

const southEastCounties = new Set(["Carlow", "Kilkenny", "Tipperary", "Waterford", "Wexford"]);
const getSouthEastCourses = cache(async () => {
  const { courses, error } = await getIrelandCourses();
  return {
    courses: courses.filter(course => southEastCounties.has(course.region?.trim() || "")),
    error,
  };
});

export async function generateMetadata(): Promise<Metadata> {
  const { courses } = await getSouthEastCourses();
  const courseCount = courses.length;

  const title = `Golf in Ireland’s South East | ${courseCount} Courses & Green Fees`;

  const description = `Explore ${courseCount} golf courses across Ireland’s South East. Compare green fees, visitor days and maps across five counties, then build a free golf trip itinerary.`;

  return {
    metadataBase: new URL(siteUrl),

    title,

    description,
    twitter: { card: "summary", title, description },

    alternates: {
      canonical: "/golf-in-south-east-ireland",
    },

    openGraph: {
      title,
      description,
      url: `${siteUrl}/golf-in-south-east-ireland`,
      siteName: "GuestPlayGolf",
      type: "website",
    },
  };
}

function RelatedGolfLinks() {
  return <>
    <h2 className="text-lg font-semibold text-slate-900">Continue planning your Ireland’s South East golf trip</h2>
    <p className="mt-3 text-sm leading-6 text-slate-600">Explore nearby courses, compare green fees or build a complete golf itinerary.</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[
      ["Golf Near Dublin", "/golf-near-dublin"],
      ["Golf Courses in Wicklow", "/golf-courses-wicklow"],
      ["Golf Near Cork", "/golf-near-cork"],
      ["Links Golf in Ireland", "/links-golf-ireland"],
      ["Ireland Golf Prices", "/golf-green-fees-ireland"],
      ["Explore Golf in Ireland", "/ireland"],
    ].map(([label,href]) => <Link key={href} href={href} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100">{label} →</Link>)}</div>
    <Link href="/ireland/planner" className="mt-5 block text-center text-sm font-semibold text-emerald-700 no-underline">Open your golf trip planner →</Link>
  </>;
}

export default async function GolfSouthEastIrelandPage() {
  const { courses, error } =
    await getSouthEastCourses();

  const courseCount = courses.length;

  const courseTypes = Array.from(
    new Set(
      courses
        .map((course) => course.course_type)
        .filter(
          (courseType): courseType is string =>
            Boolean(courseType),
        ),
    ),
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <Breadcrumbs page="/golf-in-south-east-ireland" />
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link
            href="/ireland"
            className="text-sm text-white/90 no-underline"
          >
            ← Ireland
          </Link>

          <div className="mt-6 lg:max-w-[800px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Golf courses in Ireland’s South East
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf in Ireland’s South East
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Explore{" "}
              <strong>
                {courseCount} visitor-friendly golf courses
              </strong>{" "}
              across five counties, with clear visitor access,
              pricing and course information.
            </p>

            <p className="mt-3 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Filter courses by county, price, visitor days, course type or holes,
              view them on a map and add your preferred rounds
              to a free golf-trip itinerary.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Play.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {courseCount} courses in Ireland’s South East
              </span>

              {courseTypes.length > 0 && (
                <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                  Compare course types & prices
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Ireland’s South East golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Golf in Ireland’s South East
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Welcome to Ireland&apos;s Sunny South East, where a golf trip can become a seaside escape, a wander through historic streets or a few unhurried days exploring somewhere new. From the beaches and coastal villages of Wexford and Waterford to Kilkenny&apos;s medieval charm and the countryside of Carlow and Tipperary, there is plenty to enjoy between rounds. Discover welcoming parkland courses, coastal golf and resort stays, then settle in, explore and make a trip of it.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Use the county filter to focus your search or view courses across the whole region. The map helps you plan your route, while visitor-day filters show where everyday, weekday or weekend play is available.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              GuestPlayGolf lists {courseCount} visitor-friendly
              golf courses in Ireland’s South East. Compare where you
              can play, price bands, course type and holes, then
              add the courses you like to your Ireland’s South East golf
              trip.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">This guide covers Carlow, Kilkenny, Tipperary, Waterford and Wexford. Compare the five visitor price bands and check each club&apos;s current green fee before booking; weekday, off-peak and eligible member rates may be lower.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Five-county guide
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Explore visitor-friendly golf courses located
                  across Ireland’s South East.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Filter courses
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Narrow the list by price, visitor days, course type and
                  number of holes.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  View on map
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  See where each course sits before planning
                  your route.
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
                Build your Ireland’s South East golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose Ireland’s South East courses, build a day-by-day
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
                    Compare the South East courses below.
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
                  Browse Ireland’s South East courses below and add your
                  preferred options as you go.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Ireland’s South East
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 lg:text-2xl">
                {courseCount} golf courses in Ireland’s South East
              </h2>
            </div>

            <Link
              href="/golf-green-fees-ireland"
              className="text-sm font-semibold text-emerald-700 no-underline"
            >
              Comparing your budget? See Ireland Golf Prices →
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading golf courses in Ireland’s South East.
            </div>
          )}

          {courses.length === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No golf courses are currently listed in County
              Ireland’s South East.
            </div>
          ) : (
            <CountyCourseExplorer
              courses={courses}
              countyName="Ireland’s South East"
              source="golf-in-south-east-ireland"
              initialCenter={[52.45, -7.2]}
              showCounty
              townExample="Waterford"
            />
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <RelatedGolfLinks />
        </section>
      </section>
    </main>
  );
}