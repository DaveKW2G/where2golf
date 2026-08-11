import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

const siteUrl = "https://guestplaygolf.com";

const corkLat = 51.8985;
const corkLng = -8.4756;
const corkRadiusKm = 70;

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

const getCorkCourses = cache(async () => {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type",
    )
    .eq("country", "Ireland")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .limit(300);

  const coursesWithDistance =
    courses
      ?.map((course) => ({
        ...course,
        distance: getDistanceKm(
          corkLat,
          corkLng,
          course.latitude,
          course.longitude,
        ),
      }))
      .filter((course) => course.distance <= corkRadiusKm)
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)) || [];

  return { coursesWithDistance, error };
});

export async function generateMetadata(): Promise<Metadata> {
  const { coursesWithDistance } = await getCorkCourses();
  const courseCount = coursesWithDistance.length;
  const title = `${courseCount} Golf Courses Near Cork | Access & Prices`;
  const description = `Explore ${courseCount} visitor-friendly golf courses within ${corkRadiusKm} km of Cork. Compare visitor access and prices, then build and share a free golf trip itinerary.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: "/golf-near-cork",
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/golf-near-cork`,
      siteName: "GuestPlayGolf",
      type: "website",
    },
  };
}

function RegionalGolfLinks() {
  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
        Continue planning your Ireland golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare other regional golf hubs and specialist guides, then add more
        courses to your free GuestPlayGolf itinerary.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/golf-near-galway"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          Golf Near Galway →
        </Link>

        <Link
          href="/golf-near-dublin"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Dublin →
        </Link>

        <Link
          href="/golf-near-belfast"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Belfast →
        </Link>

        <Link
          href="/links-golf-near-dublin"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Best Links Golf Near Dublin →
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

export default async function GolfNearCorkPage() {
  const { coursesWithDistance, error } = await getCorkCourses();

  const courseCount = coursesWithDistance.length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <div className="mt-6 lg:max-w-[780px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Golf near Cork
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Near Cork: Find Courses and Plan Your Trip
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[720px] lg:text-[17px] lg:leading-7">
              Explore <strong>{courseCount} visitor-friendly golf courses</strong>{" "}
              within {corkRadiusKm} km of Cork, with clear visitor access and
              pricing information.
            </p>

            <p className="mt-3 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[720px] lg:text-[17px] lg:leading-7">
              Compare your options, add courses to a free golf-trip itinerary,
              then share it with your group and vote on where to play.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {courseCount} courses within {corkRadiusKm} km
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Coastal, links and parkland golf
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Cork golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Where to play golf near Cork
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Cork is one of Ireland&apos;s strongest golf bases, combining city
              access with some of the best coastal golf in the country. A 70 km
              radius keeps the focus on realistic day-trip golf while still
              covering strong visitor options across southern Ireland.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Golf near Cork offers a varied mix of course styles. The coast
              delivers dramatic seaside golf, while inland areas provide
              parkland courses, resort layouts and more accessible local clubs.
              This makes Cork useful for golfers who want variety rather than a
              trip built around only one style of golf.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Cork Airport, the regional road network and access towards
              Kinsale, Fota, Kerry and Waterford make the city a practical base
              for a southern Ireland itinerary.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Coastal golf
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Seaside courses and coastal settings across Cork and the south.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Parkland variety
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Strong inland and resort options within practical driving
                  range.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Southern base
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Useful access towards Kinsale, Fota, Kerry and Waterford.
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
                Build your Cork golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose courses, build a day-by-day itinerary and organise your
                Cork golf trip in one place. Share the plan and let your group
                vote on where to play.
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
                  Browse the courses below and add your preferred options as you
                  go.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading golf courses near Cork.
            </div>
          )}

          {coursesWithDistance.length === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No golf courses found within {corkRadiusKm} km of Cork.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {coursesWithDistance.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  userLat={corkLat}
                  userLng={corkLng}
                  searchParams={{
                    country: "ireland",
                    source: "cork",
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
