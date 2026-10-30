import Breadcrumbs from "@/components/Breadcrumbs";
import CountyCourseExplorer from "@/components/CountyCourseExplorer";
import GolfTripPlannerAside from "@/components/GolfTripPlannerAside";
import { getIrelandCourses } from "@/lib/ireland-courses";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://guestplaygolf.com";
const northernCounties = ["Antrim", "Derry", "Down"];
const northernCountySet = new Set(northernCounties.map((county) => county.toLowerCase()));

const linksRegions = [
  {
    key: "antrim-causeway-coast",
    name: "Antrim & the Causeway Coast",
    counties: ["Antrim"],
    description:
      "Combine celebrated championship links around Portrush with accessible coastal courses along the Causeway Coast.",
  },
  {
    key: "derry-north-coast",
    name: "Derry & the North Coast",
    counties: ["Derry"],
    description:
      "Explore the links around Castlerock and Portstewart, from local-value options to major championship layouts.",
  },
  {
    key: "county-down",
    name: "County Down",
    counties: ["Down"],
    description:
      "Plan a route from Belfast towards Ardglass and Royal County Down, with contrasting visitor access and price bands.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .ilike("country", "Ireland")
    .ilike("course_type", "%Links%")
    .in("region", northernCounties);

  const courseCount = count ?? 0;
  const title = `${courseCount} Links Golf Courses in Northern Ireland | Access & Prices`;
  const description = `Explore ${courseCount} links golf courses across Antrim, Derry and Down. Compare visitor access, price bands and locations in one of the world's premier links destinations.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: "/links-golf-northern-ireland" },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/links-golf-northern-ireland`,
      siteName: "GuestPlayGolf",
      type: "website",
    },
  };
}

export default async function LinksGolfNorthernIrelandPage() {
  const { courses, error } = await getIrelandCourses();
  const linksCourses = courses.filter(
    (course) =>
      course.course_type?.toLowerCase().includes("links") &&
      northernCountySet.has(course.region?.trim().toLowerCase() || ""),
  );
  const courseCount = linksCourses.length;
  const groupedRegions = linksRegions.map((group) => ({
    ...group,
    courses: linksCourses.filter((course) =>
      group.counties.some(
        (county) => county.toLowerCase() === course.region?.trim().toLowerCase(),
      ),
    ),
  }));

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <Breadcrumbs page="/links-golf-northern-ireland" />

      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/links-golf-ireland" className="text-sm text-white/90 no-underline">
            ← Links Golf in Ireland
          </Link>
          <div className="mt-6 lg:max-w-[840px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Northern Ireland links golf
            </p>
            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Links Golf Courses in Northern Ireland
            </h1>
            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[780px] lg:text-[17px] lg:leading-7">
              <strong>
                Explore {courseCount} links courses in one of the world&apos;s
                premier golf destinations, with an exceptional concentration of
                championship and premium coastal layouts.
              </strong>
            </p>
            <p className="mt-3 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[780px] lg:text-[17px] lg:leading-7">
              Compare the famous names with local favourites, visitor access and
              value options across Antrim, Derry and Down.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                {courseCount} links courses listed
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                Antrim · Derry · Down
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              A premium links destination
            </p>
            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Championship icons and outstanding coastal golf
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Northern Ireland brings several globally recognised links into a
              remarkably compact region. Royal Portrush, Portstewart and Royal
              County Down sit alongside historic clubs and less expensive local
              courses that give a trip variety.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Use the guide to compare ordinary visitor access, sterling-based
              green-fee bands, course locations and the practical route between
              the north coast, Belfast and County Down.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Compare access", "See which links welcome independent visitors and when."],
                ["Compare prices", "Balance premium rounds with excellent-value local links."],
                ["Build your route", "Connect the Causeway Coast, Belfast and County Down."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <GolfTripPlannerAside
            heading="Build your Northern Ireland links trip"
            description="Choose north-coast and County Down links, arrange a day-by-day itinerary and share it with your group."
            steps={[
              "Choose the regions and links courses you want to play.",
              "Balance premium rounds with local-value alternatives.",
              "Share the trip and vote as a group.",
            ]}
            footer="Browse Northern Ireland links below and add your preferred options as you go."
          />
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Explore Northern Ireland links by region</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Choose a region to compare its courses, then use the filters and map
            to shape a practical route.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {groupedRegions.map((group) => (
              <a key={group.key} href={`#${group.key}`} className="rounded-2xl bg-stone-50 p-4 no-underline ring-1 ring-slate-200 transition hover:bg-stone-100">
                <h3 className="text-sm font-semibold text-slate-900">{group.name}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {group.courses.length} {group.courses.length === 1 ? "course" : "courses"}
                </p>
                <p className="mt-3 text-xs font-semibold text-emerald-700">Explore courses ↓</p>
              </a>
            ))}
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading Northern Ireland links golf courses.
          </div>
        )}

        {linksCourses.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
            No Northern Ireland links golf courses found.
          </div>
        ) : (
          <div className="mt-6">
            <CountyCourseExplorer
              hideCourseType
              courses={linksCourses}
              countyName="Northern Ireland"
              source="links-golf-northern-ireland"
              initialCenter={[54.75, -6.55]}
              townExample="Belfast"
              showCounty
              groups={linksRegions}
            />
          </div>
        )}

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Continue planning your Ireland links trip</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["All Links Golf in Ireland", "/links-golf-ireland"],
              ["Affordable Links Golf", "/affordable-links-golf-ireland"],
              ["West Coast Links Golf", "/links-golf-west-coast-ireland"],
              ["Golf Near Belfast", "/golf-near-belfast"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100">
                {label} →
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
