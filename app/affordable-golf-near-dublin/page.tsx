import Breadcrumbs from "@/components/Breadcrumbs";
import CountyCourseExplorer from "@/components/CountyCourseExplorer";
import { distanceKm, hasCoordinates, type Course } from "@/lib/course-explorer";
import { getIrelandCourses } from "@/lib/ireland-courses";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

const siteUrl = "https://guestplaygolf.com";
const dublinBase: [number, number] = [53.3498, -6.2603];
const dublinRadiusKm = 100;
const affordablePriceValues = ["€", "€€"];

const getAffordableDublinCourses = cache(async () => {
  const { courses: allCourses, error } = await getIrelandCourses();
  const courses = allCourses
    .filter(
      (course) =>
        hasCoordinates(course) &&
        affordablePriceValues.includes(course.price_range?.trim() || ""),
    )
    .map((course) => ({
      ...course,
      distance: distanceKm(course, dublinBase),
    }))
    .sort((a, b) => a.distance - b.distance);

  const coursesWithinRadius = courses.filter(
    (course) => course.distance <= dublinRadiusKm,
  );

  return { courses, coursesWithinRadius, error };
});

export async function generateMetadata(): Promise<Metadata> {
  const { coursesWithinRadius } = await getAffordableDublinCourses();
  const courseCount = coursesWithinRadius.length;
  const title = `Affordable Golf Near Dublin | ${courseCount} Courses Up to €100`;
  const description = `Compare ${courseCount} golf courses within ${dublinRadiusKm} km of Dublin in GPG’s two lowest published visitor price bands, up to €100. Check access, location and course details before booking.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: "/affordable-golf-near-dublin" },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/affordable-golf-near-dublin`,
      siteName: "GuestPlayGolf",
      type: "website",
    },
  };
}

export default async function AffordableGolfNearDublinPage() {
  const { courses, coursesWithinRadius, error } = await getAffordableDublinCourses();

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <Breadcrumbs page="/affordable-golf-near-dublin" />

      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/golf-near-dublin" className="text-sm text-emerald-100">
            ← Golf Near Dublin
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            Dublin value golf guide
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
            Affordable Golf Near Dublin
          </h1>
          <p className="mt-4 max-w-[780px] text-[15px] leading-6 text-emerald-50/95 lg:text-[17px] lg:leading-7">
            Compare {coursesWithinRadius.length} golf courses within {dublinRadiusKm} km of
            Dublin that fall in GPG&apos;s two lowest published visitor price
            bands, up to €100. Explore course locations, access and practical
            details before choosing where to play.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#compare-courses"
              className="rounded-full bg-white px-5 py-3 font-semibold text-emerald-900"
            >
              Compare affordable courses
            </a>
            <Link
              href="/golf-near-dublin"
              className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white"
            >
              Explore all golf near Dublin
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[480px] space-y-6 px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
            Compare by budget and location
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 lg:text-2xl">
            Good-value golf around Dublin
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            The list starts with courses within {dublinRadiusKm} km of central
            Dublin that appear in the € or €€ visitor price bands in GPG&apos;s
            published course information. These bands are a guide, not a live
            quote: green fees can vary by date, tee time, season and round
            length. Adjust the distance filter to explore farther, and confirm
            the current price with the club before booking.
          </p>
        </section>

        <section id="compare-courses" className="scroll-mt-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Affordable golf courses near Dublin
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Filter by price band, course type, holes, visitor access or
              distance from Dublin. Show the map when it helps, with course
              tiles kept below the map.
            </p>
          </div>
          {error ? (
            <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-800">
              Unable to load affordable golf courses near Dublin. Please refresh
              the page to try again.
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
              No courses currently match these price and distance criteria.
            </div>
          ) : (
            <CountyCourseExplorer
              courses={courses as Course[]}
              countyName="the Dublin area"
              source="affordable-golf-near-dublin"
              initialCenter={dublinBase}
              initialOrigin={dublinBase}
              initialRadiusKm={dublinRadiusKm}
              originName="Dublin"
              townExample="Dublin"
              showCounty
              pricingFocus
              hideCourseType={false}
              allowedPriceBands={affordablePriceValues}
            />
          )}
        </section>

        <nav
          aria-label="Related Dublin golf guides"
          className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7"
        >
          <h2 className="text-xl font-bold text-slate-900">
            Explore more Dublin golf
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Golf Near Dublin", "/golf-near-dublin"],
              ["Golf Courses in Dublin", "/golf-courses-dublin"],
              ["Links Golf Near Dublin", "/links-golf-near-dublin"],
              ["Affordable Links Golf in Ireland", "/affordable-links-golf-ireland"],
              ["Compare Ireland Golf Green Fees", "/golf-green-fees-ireland"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
              >
                {label} →
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}
