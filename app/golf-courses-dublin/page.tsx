import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

const siteUrl = "https://guestplaygolf.com";

type Course = {
  id: number;
  country: string | null;
  course_name: string;
  town: string;
  region: string;
  holes: number;
  independent_guest_days: string;
  season: string;
  price_range: string | null;
  course_image: string | null;
  handicap_required: boolean | null;
  max_handicap: number | null;
  latitude: number | null;
  longitude: number | null;
  course_type: string | null;
};

const getDublinCourses = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type",
    )
    .eq("country", "Ireland")
    .ilike("region", "Dublin%")
    .order("town", { ascending: true })
    .order("course_name", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Error loading Dublin courses:", error);
    return [];
  }

  return (data || []) as Course[];
});

export async function generateMetadata(): Promise<Metadata> {
  const courses = await getDublinCourses();
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

export default async function GolfCoursesDublinPage() {
  const courses = await getDublinCourses();
  const courseCount = courses.length;

  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-5 py-10 text-white lg:py-14">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link
            href="/ireland"
            className="text-sm font-medium text-white/85 no-underline hover:text-white"
          >
            ← Ireland Golf
          </Link>

          <p className="mt-7 text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-100/80">
            County Dublin golf guide
          </p>

          <h1 className="mt-2 max-w-[800px] text-[32px] font-bold leading-tight lg:text-[46px]">
            Golf Courses in Dublin, Ireland
          </h1>

          <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-white/85 lg:text-[17px]">
            Explore {courseCount} visitor-friendly golf courses across County
            Dublin. Compare visitor access, prices and course types, then add
            your favourites to a free Irish golf trip itinerary.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/ireland/planner"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 no-underline transition hover:bg-emerald-50"
            >
              Start Free Golf Trip Planner
            </Link>

            <Link
              href="#dublin-courses"
              className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline ring-1 ring-white/25 transition hover:bg-white/15"
            >
              View Dublin Courses
            </Link>
          </div>

          <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.15em] text-emerald-100">
            Plan. Share. Vote. Golf.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Dublin golf
          </p>

          <h2 className="mt-1 text-[22px] font-semibold text-slate-900 lg:text-[26px]">
            Golf in Dublin — Ireland&apos;s easiest golf-trip gateway
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            Dublin is an obvious starting point for an Irish golf trip. Most
            international visitors can fly directly into the city, and within
            County Dublin you have everything from historic city clubs to
            coastal golf overlooking the Irish Sea.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            The city itself gives you plenty to do once the golf is finished.
            Dublin&apos;s pubs, restaurants, live music and compact city centre
            make it easy to combine several rounds of golf with a few nights in
            one of Ireland&apos;s liveliest destinations.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            County Dublin has {courseCount} visitor-friendly golf courses listed
            on GuestPlayGolf. Compare where you can play, what it costs and the
            type of course, then build the ones you like into your Dublin golf
            trip.
          </p>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <p className="text-sm leading-6 text-slate-700">
              Looking beyond the county?{" "}
              <Link
                href="/golf-near-dublin"
                className="font-semibold text-emerald-800 no-underline hover:text-emerald-900"
              >
                Golf Near Dublin
              </Link>{" "}
              includes courses within 100 km of the city, giving you a much
              wider choice for a Dublin-based golf trip.
            </p>
          </div>
        </div>

        <section
          id="dublin-courses"
          className="mt-6 scroll-mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
            County Dublin
          </p>

          <h2 className="mt-1 text-[22px] font-semibold text-slate-900 lg:text-[26px]">
            {courseCount} Golf Courses in Dublin
          </h2>

          <p className="mt-3 max-w-[760px] text-sm leading-6 text-slate-600">
            Compare visitor access, green-fee price bands and course styles
            across County Dublin.
          </p>

          {courses.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  source="golf-courses-dublin"
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-stone-50 p-5 text-sm text-slate-600 ring-1 ring-slate-200">
              No Dublin courses are currently available.
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Keep exploring
          </p>

          <h2 className="mt-1 text-[22px] font-semibold text-slate-900">
            Plan more of your Irish golf trip
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/golf-near-dublin"
              className="rounded-2xl bg-stone-50 p-4 no-underline ring-1 ring-slate-200 transition hover:bg-stone-100"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Golf Near Dublin →
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Compare courses within 100 km of Dublin for a wider golf-trip
                search.
              </p>
            </Link>

            <Link
              href="/links-golf-near-dublin"
              className="rounded-2xl bg-stone-50 p-4 no-underline ring-1 ring-slate-200 transition hover:bg-stone-100"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Links Golf Near Dublin →
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find links courses accessible from Dublin and build a coastal
                golf itinerary.
              </p>
            </Link>

            <Link
              href="/links-golf-ireland"
              className="rounded-2xl bg-stone-50 p-4 no-underline ring-1 ring-slate-200 transition hover:bg-stone-100"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Links Golf in Ireland →
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Explore links golf around Ireland by region.
              </p>
            </Link>

            <Link
              href="/golf-courses-cork"
              className="rounded-2xl bg-stone-50 p-4 no-underline ring-1 ring-slate-200 transition hover:bg-stone-100"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Golf Courses in Cork →
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Explore visitor-friendly golf throughout County Cork.
              </p>
            </Link>

            <Link
              href="/golf-courses-donegal"
              className="rounded-2xl bg-stone-50 p-4 no-underline ring-1 ring-slate-200 transition hover:bg-stone-100"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Golf Courses in Donegal →
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Discover golf across Ireland&apos;s spectacular northwest.
              </p>
            </Link>

            <Link
              href="/ireland/planner"
              className="rounded-2xl bg-emerald-800 p-4 text-white no-underline transition hover:bg-emerald-900"
            >
              <h3 className="text-sm font-semibold text-white">
                Build Your Golf Trip →
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/80">
                Add courses, organise golf days, share your itinerary and vote
                with your group.
              </p>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}