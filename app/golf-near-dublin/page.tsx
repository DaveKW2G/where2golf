import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DublinDistanceFilteredCourses from "@/components/DublinDistanceFilteredCourses";

const siteUrl = "https://guestplaygolf.com";

const dublinLat = 53.3498;
const dublinLng = -6.2603;
const dublinRadiusKm = 100;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf Near Dublin | Courses & Free Golf Trip Planner",
  description:
    "Find the best golf near Dublin for visiting golfers. Compare links and parkland courses, then use our free golf trip planner to build, share and vote on your Dublin golf itinerary.",
  alternates: {
    canonical: "/golf-near-dublin",
  },
  openGraph: {
    title:
      "Golf Near Dublin | Courses & Free Golf Trip Planner | GuestPlayGolf",
    description:
      "Compare visitor-friendly golf near Dublin, build a free golf itinerary, share your trip and vote on courses with your group.",
    url: `${siteUrl}/golf-near-dublin`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
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
          href="/links-golf-near-dublin"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
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

      <Link
        href="/ireland/planner"
        className="mt-5 block text-center text-sm font-semibold text-emerald-700 no-underline"
      >
        Open your golf trip planner →
      </Link>
    </>
  );
}

export default async function GolfNearDublinPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type",
    )
    .ilike("country", "Ireland")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .limit(300);

  const coursesWithinDublinHub =
    courses
      ?.map((course) => {
        const distance = getDistanceKm(
          dublinLat,
          dublinLng,
          course.latitude,
          course.longitude,
        );

        return {
          ...course,
          distance,
        };
      })
      .filter((course) => course.distance <= dublinRadiusKm)
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999)) || [];

  const courseCount = coursesWithinDublinHub.length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <div className="mt-6 lg:max-w-[780px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Golf near Dublin
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Near Dublin: Find Courses and Plan Your Trip
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[720px] lg:text-[17px] lg:leading-7">
              Compare visitor-friendly golf near Dublin, from famous coastal
              links to accessible parkland courses. Add your preferred courses
              to a free itinerary, share the trip and vote with your group.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {courseCount} courses within {dublinRadiusKm} km
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Links, parkland and resort golf
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Dublin golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Where to play golf near Dublin
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Dublin is one of the best golf bases in Ireland for visiting
              golfers. Within easy reach of the city, you can play famous links
              courses, resort parkland layouts and strong inland options across
              Dublin, Kildare, Meath, Louth and Wicklow.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              The region offers a rare mix of world-class coastal golf and
              visitor-friendly inland courses. This makes Dublin ideal for
              golfers who want variety, flexibility and strong course choice
              without spending every day travelling long distances.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Dublin is also Ireland&apos;s main international gateway, with
              excellent flight connections and easy road access to many of the
              country&apos;s leading visitor golf options.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Coastal links
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Famous links courses along the Dublin and north-east coast.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Inland variety
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Parkland and resort options across the wider Dublin region.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Strong travel base
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Good flight access and a large choice within driving range.
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
                Choose courses, build a day-by-day itinerary and organise your
                Dublin golf trip in one place. Share the plan and let your group
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
              Error loading golf courses near Dublin.
            </div>
          )}

          <DublinDistanceFilteredCourses courses={coursesWithinDublinHub} />
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <RegionalGolfLinks />
        </section>
      </section>
    </main>
  );
}