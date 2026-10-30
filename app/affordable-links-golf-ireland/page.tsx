import Breadcrumbs from "@/components/Breadcrumbs";
import CountyCourseExplorer from "@/components/CountyCourseExplorer";
import GolfTripPlannerAside from "@/components/GolfTripPlannerAside";
import { priceBands } from "@/lib/course-explorer";
import { getIrelandCourses } from "@/lib/ireland-courses";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://guestplaygolf.com";
const affordablePriceValues = ["€", "€€"];
const affordablePriceBands = priceBands.filter((band) =>
  affordablePriceValues.includes(band.value),
);

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .ilike("country", "Ireland")
    .ilike("course_type", "%Links%")
    .in("price_range", affordablePriceValues);

  const courseCount = count ?? 0;
  const title = `${courseCount} Affordable Links Golf Courses in Ireland | Under €100`;
  const description = `Discover ${courseCount} value-for-money links golf courses across Ireland in the €50-or-less and €50-to-€100 visitor price bands. Compare access, locations and prices, then plan your trip.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: "/affordable-links-golf-ireland" },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/affordable-links-golf-ireland`,
      siteName: "GuestPlayGolf",
      type: "website",
    },
  };
}

export default async function AffordableLinksGolfIrelandPage() {
  const { courses, error } = await getIrelandCourses();
  const affordableLinksCourses = courses.filter(
    (course) =>
      course.course_type?.toLowerCase().includes("links") &&
      affordablePriceValues.includes(course.price_range?.trim() || ""),
  );
  const courseCount = affordableLinksCourses.length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <Breadcrumbs page="/affordable-links-golf-ireland" />

      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/links-golf-ireland" className="text-sm text-emerald-100">
            ← Links Golf in Ireland
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            Value links golf guide
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
            Affordable Links Golf Courses in Ireland
          </h1>
          <p className="mt-4 max-w-[780px] text-[15px] leading-6 text-emerald-50/95 lg:text-[17px] lg:leading-7">
            Ireland has far more value-for-money links golf than the famous
            headline green fees suggest. Discover {courseCount} coastal hidden
            gems and visitor-friendly links in our two lowest price bands.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#compare-courses" className="rounded-full bg-white px-5 py-3 font-semibold text-emerald-900">
              Compare affordable links
            </a>
            <Link href="/ireland/planner" className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white">
              Start your free golf trip planner
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[480px] space-y-6 px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Great-value coastal golf
            </p>
            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Hidden gems, local favourites and classic links for less
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Premium names are only one part of Ireland&apos;s links story. Many
              independent visitors can still play characterful dune courses,
              community clubs and spectacular coastal layouts without paying a
              bucket-list price.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {affordablePriceBands.map((band) => (
                <div key={band.value} className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                  <h3 className="text-xl font-bold text-emerald-950">{band.name}</h3>
                  <p className="mt-2 text-2xl font-bold text-emerald-800">{band.value}</p>
                  <p className="mt-2 text-sm font-semibold">{band.range}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{band.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The bands are a comparison guide rather than a guaranteed live
              quote. Check current visitor tariffs before booking; Northern
              Ireland sterling prices are represented in comparable euro bands.
            </p>
          </section>

          <GolfTripPlannerAside
            heading="Build an affordable Irish links trip"
            description="Shortlist value links courses, arrange them into golf days and share the plan with your group."
            steps={[
              "Compare courses in the € and €€ price bands.",
              "Add your favourite hidden gems to each golf day.",
              "Share the itinerary and vote as a group.",
            ]}
            footer="Browse the affordable links below and add your preferred options as you go."
          />
        </div>

        <section id="compare-courses" className="scroll-mt-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Compare affordable links golf across Ireland</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Search {courseCount} value links courses, filter by the two
              qualifying price bands, county, visitor access, holes or distance,
              and switch between list and map views.
            </p>
          </div>
          {error ? (
            <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-800">
              Unable to load affordable links courses. Please refresh the page to try again.
            </div>
          ) : (
            <CountyCourseExplorer
              courses={affordableLinksCourses}
              countyName="Ireland"
              source="affordable-links-golf-ireland"
              initialCenter={[53.4, -8]}
              showCounty
              pricingFocus
              hideCourseType
              allowedPriceBands={affordablePriceValues}
              townExample="Galway"
            />
          )}
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-7">
          <h2 className="text-xl font-bold text-slate-900">Continue planning your links golf trip</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Compare every Irish links course, explore the west coast or focus on Northern Ireland.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["All Links Golf in Ireland", "/links-golf-ireland"],
              ["Links Golf in Northern Ireland", "/links-golf-northern-ireland"],
              ["West Coast Links Golf", "/links-golf-west-coast-ireland"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-100">
                {label} →
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
