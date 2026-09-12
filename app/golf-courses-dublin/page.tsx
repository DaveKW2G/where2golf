import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

const siteUrl = "https://guestplaygolf.com";

const getDublinCountyCourses = cache(async () => {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type",
    )
    .eq("country", "Ireland")
    .eq("region", "Dublin")
    .order("town", { ascending: true })
    .order("course_name", { ascending: true })
    .limit(100);

  return {
    courses: courses || [],
    error,
  };
});

export async function generateMetadata(): Promise<Metadata> {
  const { courses } = await getDublinCountyCourses();
  const courseCount = courses.length;

  const title = `${courseCount} Golf Courses in Dublin | Access & Prices`;

  const description = `Explore ${courseCount} visitor-friendly golf courses in County Dublin, Ireland. Compare visitor access, prices and course types, then build and share a free Dublin golf trip itinerary.`;

  return {
    metadataBase: new URL(siteUrl),

    title,

    description,

    alternates: {
      canonical: "/golf-courses-dublin",
    },

    openGraph: {
      title,
      description,
      url: `${siteUrl}/golf-courses-dublin`,
      siteName: "GuestPlayGolf",
      type: "website",
    },
  };
}

function RelatedGolfLinks() {
  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
        Continue planning your Dublin golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Use Dublin as your base, explore nearby golf outside the county, or
        build a full Ireland golf itinerary with GuestPlayGolf.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          Links Golf Near Dublin →
        </Link>

        <Link
          href="/links-golf-ireland"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Links Golf in Ireland →
        </Link>

        <Link
          href="/golf-courses-cork"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Courses in Cork →
        </Link>

        <Link
          href="/golf-courses-donegal"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Courses in Donegal →
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

export default async function GolfCoursesDublinPage() {
  const { courses, error } = await getDublinCountyCourses();

  const courseCount = courses.length;

  const courseTypes = Array.from(
    new Set(
      courses
        .map((course) => course.course_type)
        .filter((courseType): courseType is string => Boolean(courseType)),
    ),
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
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
              Golf courses in Dublin
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Courses in Dublin, Ireland
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Explore{" "}
              <strong>{courseCount} visitor-friendly golf courses</strong> in
              County Dublin, with clear visitor access, pricing and course
              information.
            </p>

            <p className="mt-3 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Compare courses across Dublin, shortlist where you want to play
              and add your choices to a free golf-trip itinerary.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {courseCount} courses in County Dublin
              </span>

              {courseTypes.length > 0 && (
                <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                  Links, coastal & parkland golf
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
              County Dublin golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Golf in Dublin — Ireland&apos;s golf gateway
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Dublin is a natural starting point for an Irish golf trip. With
              Ireland&apos;s largest airport, a lively city centre and golf
              courses stretching from the city to the Irish Sea, it is an easy
              place to combine a few rounds of golf with a city break.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Away from the course, Dublin has no shortage of things to do.
              Pubs, restaurants, live music and some of Ireland&apos;s best-known
              sights are all within easy reach, while the coast gives you
              another side of Dublin beyond the city centre.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              County Dublin boasts {courseCount} visitor-friendly golf courses
              on GuestPlayGolf, ranging from established parkland clubs to
              coastal and links golf. Compare where you can play, what it costs
              and the type of course, then build the ones you like into your
              Dublin golf trip.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  County-wide list
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Every listed visitor-friendly course located in County
                  Dublin.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Compare access
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  See when independent guests can play each Dublin course.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Compare prices
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Use price bands to compare Dublin courses before planning.
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
                Build your Dublin golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose Dublin courses, build a day-by-day itinerary and
                organise your golf trip in one place. Share the plan and let
                your group vote on where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Compare the Dublin courses below.
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
                  Browse Dublin courses below and add your preferred options as
                  you go.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                County Dublin
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 lg:text-2xl">
                {courseCount} golf courses in Dublin
              </h2>
            </div>

            <Link
              href="/golf-near-dublin"
              className="text-sm font-semibold text-emerald-700 no-underline"
            >
              Looking beyond the county? See Golf Near Dublin →
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading golf courses in Dublin.
            </div>
          )}

          {courses.length === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No golf courses are currently listed in County Dublin.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  searchParams={{
                    country: "ireland",
                    source: "golf-courses-dublin",
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <RelatedGolfLinks />
        </section>
      </section>
    </main>
  );
}