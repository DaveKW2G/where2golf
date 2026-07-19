import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

const siteUrl = "https://guestplaygolf.com";

const genevaLat = 46.2044;
const genevaLng = 6.1432;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf Near Geneva | Courses & Free Golf Trip Planner",
  description:
    "Find golf courses near Geneva for visiting golfers. Compare guest access, handicap requirements and distance, then use our free golf trip planner to build, share and vote on your Swiss golf itinerary.",
  alternates: {
    canonical: "/golf-near-geneva",
  },
  openGraph: {
    title: "Golf Near Geneva | Courses & Free Golf Trip Planner | GuestPlayGolf",
    description:
      "Compare visitor-friendly golf near Geneva, build a free Swiss golf itinerary, share your trip and vote on courses with your group.",
    url: `${siteUrl}/golf-near-geneva`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

const genevaRegions = ["GE", "VD", "FR"];

const regionNames: Record<string, string> = {
  GE: "Geneva",
  VD: "Vaud",
  FR: "Fribourg",
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
        Compare other Swiss golf hubs, regional guides and courses available to
        independent guests, then add more options to your free GuestPlayGolf
        itinerary.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/switzerland/ge"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          Golf in Geneva →
        </Link>

        <Link
          href="/golf-near-lausanne"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Lausanne →
        </Link>

        <Link
          href="/golf-near-zurich"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Zurich →
        </Link>

        <Link
          href="/golf-near-basel"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Basel →
        </Link>

        <Link
          href="/golf-near-lucerne"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Lucerne →
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

export default async function GolfNearGenevaPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude",
    )
    .in("region", genevaRegions);

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(
                genevaLat,
                genevaLng,
                course.latitude,
                course.longitude,
              )
            : undefined;

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
              Golf near Geneva
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Near Geneva: Find Courses and Plan Your Trip
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Compare visitor-friendly golf near Geneva, from premium Lake
              Geneva clubs to practical courses across Vaud and Fribourg. Add
              your preferred courses to a free Swiss itinerary, share the trip
              and vote with your group.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Golf.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <span className="text-[18px]">{courseCount}</span>
                <span>courses around Geneva</span>
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Geneva, Vaud and Fribourg
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Geneva golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Where to play golf near Geneva
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Geneva offers one of the most distinctive golf settings in
              Switzerland, with high-quality courses around the city, Lake
              Geneva and western Switzerland. Compared with Zurich, the golf
              landscape can feel more selective, so understanding visitor access
              before travelling matters more here.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Golf near Geneva combines lakeside scenery, traditional club
              environments and access into neighbouring Vaud and Fribourg. The
              region can suit golfers looking for a premium day out, but it
              rewards better planning than more open golf areas.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Geneva Airport, the city rail network and road links along Lake
              Geneva make the area a practical base for visiting golfers,
              business travellers and groups planning a longer Swiss golf trip.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Lake Geneva golf
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Scenic golf around Geneva, Vaud and the wider lake region.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Premium access
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Guest play can be selective, so rules and timing matter.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Strong travel base
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Airport, rail and road links make Geneva a practical base.
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
                Build your Geneva golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose courses, build a day-by-day Swiss itinerary and organise
                your Geneva golf trip in one place. Share the plan and let your
                group vote on where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Add Geneva-area courses to your shortlist.
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

        <section className="mt-6">
          <div className="flex flex-wrap gap-2">
            {genevaRegions.map((region, index) => (
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

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error loading golf courses near Geneva.
            </div>
          )}

          {coursesWithDistance.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No golf courses found near Geneva.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {coursesWithDistance.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  userLat={genevaLat}
                  userLng={genevaLng}
                  searchParams={{
                    country: "switzerland",
                    source: "geneva",
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <SwissGolfLinks />
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Independent guest golf
          </p>

          <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
            Playing as an independent guest near Geneva
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Many golf courses around Geneva operate with stricter access
            policies than more open visitor golf destinations. A recognised
            handicap, valid club membership, advance booking and flexible timing
            are often required for independent guest play.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Weekend and public-holiday access may be more limited, while some
            clubs are easier to access on weekdays or outside peak tee times.
            Use GuestPlayGolf to compare the likely options, then confirm
            current access, green fees and booking requirements directly with
            the club.
          </p>
        </section>
      </section>
    </main>
  );
}
