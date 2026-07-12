import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

const siteUrl = "https://guestplaygolf.com";

const zurichLat = 47.3769;
const zurichLng = 8.5417;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf Near Zurich | Guest Access, Handicaps & Courses",
  description:
    "Find golf courses near Zurich where independent guests can play. Compare distance, guest access, handicap requirements, season and course details.",
  alternates: {
    canonical: "/golf-near-zurich",
  },
  openGraph: {
    title:
      "Golf Near Zurich | Guest Access, Handicaps & Courses | GuestPlayGolf",
    description:
      "Compare golf courses near Zurich with clear information on guest access, handicap requirements, distance and playing conditions.",
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
        Explore more golf in Switzerland
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare other Swiss golf hubs, regional guides and courses available to
        independent guests.
      </p>

      <div className="mt-4 grid gap-3">
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
        href="/switzerland"
        className="mt-5 block rounded-full bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white no-underline"
      >
        Browse All Swiss Golf
      </Link>
    </>
  );
}

export default async function GolfNearZurichPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, max_handicap, latitude, longitude",
    )
    .in("region", zurichAreaRegions);

  const coursesWithDistance =
    courses
      ?.map((course) => {
        const distance =
          course.latitude != null && course.longitude != null
            ? getDistanceKm(
                zurichLat,
                zurichLng,
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
              Golf near Zurich
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Golf Near Zurich for Independent Guests
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[740px] lg:text-[17px] lg:leading-7">
              Find and compare golf courses near Zurich where independent guests
              can play. Review distance, guest access, handicap requirements,
              season and course details before contacting the club.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Discover. Compare. Play.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <span className="text-[18px]">{courseCount}</span>
                <span>courses around Zurich</span>
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Zurich, Zug, Aargau and Schwyz
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <section className="order-1 min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:col-start-1 lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Zurich golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Where to play golf near Zurich
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Zurich is one of the most practical golf bases in Switzerland,
              with a strong concentration of courses within easy reach of the
              city. The surrounding regions of Zug, Aargau and Schwyz provide a
              broad mix of layouts and playing conditions.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Golf around Zurich is generally defined by accessible parkland
              settings, gently rolling terrain and reliable transport links.
              Compared with remote alpine golf, the region is particularly
              suitable for regular rounds, business trips and shorter golf
              breaks.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Zurich Airport, the city&apos;s rail network and strong road
              connections make it easier to reach golf across several cantons.
              Many courses are within approximately 30 to 60 minutes of central
              Zurich.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Strong course choice
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Compare courses across Zurich and several neighbouring
                  cantons.
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
                  Practical golf base
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Suitable for short breaks, business travel and regular play.
                </p>
              </div>
            </div>
          </section>

          <aside className="order-2 min-w-0 lg:col-start-2 lg:row-span-3 lg:row-start-1">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-3xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-100 lg:p-6">
                <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
                  Independent guest golf
                </span>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Compare golf near Zurich
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Use GuestPlayGolf to understand where independent guests can
                  play and what each course may require before booking.
                </p>

                <div className="mt-4 grid gap-3">
                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                      1
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Check guest access
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        See whether guests are accepted every day, weekdays or
                        under limited conditions.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                      2
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Review handicap rules
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Compare maximum handicap requirements before contacting
                        the club.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                      3
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Compare distance
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Courses are ordered by distance from central Zurich.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/filters?country=Switzerland&where=Zurich"
                  className="mt-5 block w-full rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline transition hover:bg-emerald-900"
                >
                  Search Swiss Golf Courses
                </Link>
              </div>

              <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
                <h2 className="text-base font-semibold text-slate-900">
                  Playing as an independent guest
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Many Swiss courses require a recognised handicap, valid golf
                  membership or proof of playing ability. Access may also differ
                  between weekdays and weekends.
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Always confirm current access, green fees and booking
                  requirements directly with the golf club.
                </p>
              </div>

              <div className="mt-6 hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:block">
                <SwissGolfLinks />
              </div>
            </div>
          </aside>

          <section className="order-3 min-w-0 lg:col-start-1">
            <div className="flex flex-wrap gap-2">
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

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Error loading golf courses near Zurich.
              </div>
            )}

            {coursesWithDistance.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
                No golf courses found near Zurich.
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
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

          <section className="order-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:hidden">
            <SwissGolfLinks />
          </section>
        </div>
      </section>
    </main>
  );
}