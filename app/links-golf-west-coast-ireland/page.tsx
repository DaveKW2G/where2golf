import Breadcrumbs from "@/components/Breadcrumbs";
import CountyCourseExplorer from "@/components/CountyCourseExplorer";
import GolfTripPlannerAside from "@/components/GolfTripPlannerAside";
import { getIrelandCourses } from "@/lib/ireland-courses";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://guestplaygolf.com";
const westCoastCounties = ["Donegal", "Sligo", "Mayo", "Galway", "Clare", "Kerry", "Cork"];
const westCoastCountySet = new Set(westCoastCounties.map((county) => county.toLowerCase()));

const linksRegions = [
  {
    key: "northwest-coast",
    name: "Donegal & the North-West",
    counties: ["Donegal", "Sligo", "Mayo"],
    description:
      "Follow the Atlantic coast through Donegal, Sligo and Mayo, home to remote links, dramatic dunes and many outstanding-value courses.",
  },
  {
    key: "west-of-ireland",
    name: "Galway & Clare",
    counties: ["Galway", "Clare"],
    description:
      "Pair Connemara and the Burren with famous Clare links and practical bases around Galway, Lahinch and Doonbeg.",
  },
  {
    key: "southwest-coast",
    name: "Kerry & Cork",
    counties: ["Kerry", "Cork"],
    description:
      "Build a south-west route around Ballybunion, Tralee, Waterville, Dooks, Dingle and Old Head.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .ilike("country", "Ireland")
    .ilike("course_type", "%Links%")
    .in("region", westCoastCounties);

  const courseCount = count ?? 0;
  const title = `${courseCount} Links Golf Courses on Ireland's West Coast | Map & Prices`;
  const description = `Explore ${courseCount} links golf courses from Donegal to Cork along Ireland's Atlantic coast. Compare prices and access, map a Wild Atlantic Way golf route and plan your trip.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: "/links-golf-west-coast-ireland" },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/links-golf-west-coast-ireland`,
      siteName: "GuestPlayGolf",
      type: "website",
    },
  };
}

export default async function LinksGolfWestCoastIrelandPage() {
  const { courses, error } = await getIrelandCourses();
  const linksCourses = courses.filter(
    (course) =>
      course.course_type?.toLowerCase().includes("links") &&
      westCoastCountySet.has(course.region?.trim().toLowerCase() || ""),
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
      <Breadcrumbs page="/links-golf-west-coast-ireland" />

      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link href="/links-golf-ireland" className="text-sm text-white/90 no-underline">
            ← Links Golf in Ireland
          </Link>
          <div className="mt-6 lg:max-w-[850px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Atlantic links road trip
            </p>
            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Links Golf Courses on Ireland&apos;s West Coast
            </h1>
            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[790px] lg:text-[17px] lg:leading-7">
              <strong>
                Explore {courseCount} links courses from Donegal to Cork along
                the Wild Atlantic Way—widely regarded as one of the world&apos;s
                great coastal road trips.
              </strong>
            </p>
            <p className="mt-3 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[790px] lg:text-[17px] lg:leading-7">
              Compare remote hidden gems, famous championship links, visitor
              access and price bands, then turn the Atlantic coast into a golf itinerary.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                {courseCount} west-coast links courses
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                Donegal to Cork
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Ireland&apos;s Atlantic links route
            </p>
            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              Dunes, ocean views and golf-road-trip country
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The Wild Atlantic Way connects many of Ireland&apos;s most dramatic
              links landscapes. A golf journey can move from the remote dunes of
              Donegal through Sligo, Mayo, Galway and Clare before continuing to
              Kerry and Cork.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The route includes bucket-list courses, historic local clubs and
              value-for-money hidden gems. Compare the options below before
              choosing a manageable section of the coast for your trip.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Compare regions", "Choose the north-west, west or south-west coast."],
                ["Compare prices", "Mix premium rounds with value links and local gems."],
                ["Build a road trip", "Use the map and planner to shape a realistic route."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <GolfTripPlannerAside
            heading="Build your west-coast links road trip"
            description="Choose a section of the Atlantic coast, arrange links courses into golf days and share the itinerary with your group."
            steps={[
              "Choose the coastal region or regions you want to visit.",
              "Add premium links and hidden gems to each golf day.",
              "Share the route and vote as a group.",
            ]}
            footer="Browse the west-coast links below and add your preferred options as you go."
          />
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Explore the west coast by golf region</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The full Atlantic coast is a long journey. Choose a practical region
            below, then use the filters, map and distance tools to refine it.
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
            Error loading west-coast links golf courses.
          </div>
        )}

        {linksCourses.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
            No west-coast links golf courses found.
          </div>
        ) : (
          <div className="mt-6">
            <CountyCourseExplorer
              hideCourseType
              courses={linksCourses}
              countyName="Ireland's West Coast"
              source="links-golf-west-coast-ireland"
              initialCenter={[53.3, -9.3]}
              townExample="Galway"
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
              ["Links Golf in Northern Ireland", "/links-golf-northern-ireland"],
              ["Golf Near Galway", "/golf-near-galway"],
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
