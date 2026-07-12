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
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-[480px]">
          <Link href="/ireland" className="text-sm text-white/90 no-underline">
            ← Ireland
          </Link>

          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            Golf near Dublin
          </p>

          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            Golf Near Dublin: Find Courses and Plan Your Trip
          </h1>

          <p className="mt-4 text-[15px] leading-6 text-emerald-50/95">
            Compare visitor-friendly golf near Dublin, from famous coastal
            links to accessible parkland courses. Add your preferred courses to
            a free itinerary, share the trip and vote with your group.
          </p>

          <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
            Plan. Share. Vote. Golf.
          </p>

          <div className="mt-5">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {courseCount} courses within {dublinRadiusKm} km of Dublin
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Where to play golf near Dublin
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dublin is one of the best golf bases in Ireland for visiting
            golfers. Within easy reach of the city, you can play famous links
            courses, resort parkland layouts and strong inland options across
            Dublin, Kildare, Meath, Louth and Wicklow.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            The region offers a rare mix of world-class coastal golf and
            visitor-friendly inland courses. This makes Dublin ideal for
            golfers who want variety, flexibility and strong course choice
            without spending every day travelling long distances.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dublin is also Ireland&apos;s main international gateway, with
            excellent flight connections and easy road access to many of the
            country&apos;s leading visitor golf options.
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
            Free online tool
          </span>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Build your Dublin golf trip
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Use GuestPlayGolf to choose courses, build a day-by-day itinerary
            and organise your Dublin golf trip in one place. Share the plan with
            your golf partners and let the group vote on where to play.
          </p>

          <Link
            href="/ireland/planner"
            className="mt-5 block w-full rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline"
          >
            Start Free Golf Trip Planner
          </Link>

          <p className="mt-3 text-center text-xs text-slate-600">
            Browse the courses below and add your preferred options as you go.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading golf courses near Dublin.
          </div>
        )}

        <DublinDistanceFilteredCourses courses={coursesWithinDublinHub} />

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-lg font-semibold text-slate-900">
            Continue planning your Ireland golf trip
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Compare other regional golf hubs and specialist guides, then add
            more courses to your free GuestPlayGolf itinerary.
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href="/links-golf-near-dublin"
              className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100"
            >
              Best Links Golf Near Dublin →
            </Link>

            <Link
              href="/golf-near-cork"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Cork →
            </Link>

            <Link
              href="/golf-near-galway"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Galway →
            </Link>

            <Link
              href="/golf-near-belfast"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
            >
              Golf Near Belfast →
            </Link>

            <Link
              href="/golf-near-adare-manor"
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200"
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
        </div>
      </section>
    </main>
  );
}