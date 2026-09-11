import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";

const siteUrl = "https://guestplaygolf.com";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .ilike("country", "Ireland")
    .ilike("course_type", "%Links%");

  const courseCount = count ?? 0;

  const title = `${courseCount} Links Golf Courses in Ireland | Access & Prices`;

  const description = `Explore ${courseCount} links golf courses across the island of Ireland. Compare visitor access, price bands and course details by region, then build a free golf-trip itinerary to share and vote on with your group.`;

  return {
    metadataBase: new URL(siteUrl),

    title,

    description,

    alternates: {
      canonical: "/links-golf-ireland",
    },

    openGraph: {
      title: `${title} | GuestPlayGolf`,
      description,
      url: `${siteUrl}/links-golf-ireland`,
      siteName: "GuestPlayGolf",
      type: "website",
    },
  };
}

const linksRegions = [
  {
    key: "dublin-east",
    name: "Dublin & East Coast",
    counties: ["Dublin", "Louth", "Meath", "Wicklow", "Wexford"],
    description:
      "Combine Dublin's famous links with courses along Ireland's east coast, from Louth to Wexford.",
  },

  {
    key: "northern-ireland",
    name: "Northern Ireland",
    counties: ["Antrim", "Derry", "Down"],
    description:
      "Explore the celebrated links of the north coast and County Down, including some of Ireland's best-known championship courses.",
  },

  {
    key: "donegal-northwest",
    name: "Donegal & Northwest",
    counties: ["Donegal", "Sligo", "Mayo"],
    description:
      "Build a northwest route through Donegal, Sligo and Mayo, home to one of Ireland's strongest concentrations of coastal links.",
  },

  {
    key: "west",
    name: "West of Ireland",
    counties: ["Galway", "Clare"],
    description:
      "Pair the west coast scenery of Galway and Clare with established links such as Lahinch, Doonbeg and Connemara.",
  },

  {
    key: "southwest",
    name: "Southwest Ireland",
    counties: ["Kerry", "Cork"],
    description:
      "Plan a southwest trip around Kerry and Cork, with Ballybunion, Tralee, Waterville, Dooks, Dingle and Old Head among the options.",
  },
];

function RegionalGolfLinks() {
  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
        Continue planning your Ireland golf trip
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare regional golf hubs and specialist guides, then add more courses
        to your free GuestPlayGolf itinerary.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/links-golf-near-dublin"
          className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 no-underline ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          Links Golf Near Dublin →
        </Link>

        <Link
          href="/golf-near-dublin"
          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Golf Near Dublin →
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

export default async function LinksGolfIrelandPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type",
    )
    .ilike("country", "Ireland")
    .ilike("course_type", "%Links%")
    .order("region", { ascending: true })
    .order("course_name", { ascending: true })
    .limit(300);

  const linksCourses = courses || [];

  const courseCount = linksCourses.length;

  const groupedRegions = linksRegions.map((group) => ({
    ...group,

    courses: linksCourses.filter((course) =>
      group.counties.includes((course.region ?? "").trim()),
    ),
  }));

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-100 text-slate-800">
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 px-5 pb-9 pt-6 text-white lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
          <Link
            href="/ireland"
            className="text-sm text-white/90 no-underline"
          >
            ← Ireland
          </Link>

          <div className="mt-6 lg:max-w-[820px]">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Links Golf Ireland
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[42px] lg:leading-[1.08]">
              Links Golf Courses in Ireland
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[760px] lg:text-[17px] lg:leading-7">
              <strong>
                Explore {courseCount} links golf courses across the island of
                Ireland, organised into practical golf regions for visiting
                golfers.
              </strong>
            </p>

            <p className="mt-3 text-[15px] leading-6 text-emerald-50/95 lg:max-w-[760px] lg:text-[17px] lg:leading-7">
              Compare visitor access, price bands and course details, then add
              your preferred courses to a free itinerary and plan the trip with
              your group.
            </p>

            <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Plan. Share. Vote. Play.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                {courseCount} links courses listed
              </span>

              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:inline-block">
                Republic of Ireland & Northern Ireland
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] px-4 py-6 lg:max-w-[1120px] lg:px-5 lg:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="min-w-0 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:flex lg:h-full lg:flex-col lg:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Ireland links golf guide
            </p>

            <h2 className="mt-1 text-[21px] font-semibold text-slate-900 lg:text-[24px]">
              {courseCount} links golf courses across Ireland
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              GuestPlayGolf currently lists {courseCount} links courses across
              the Republic of Ireland and Northern Ireland that welcome
              independent visitors. Compare visitor access, price bands and
              locations to find courses that fit your trip.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Rather than treating Ireland as one long course list, the courses
              below are grouped into five practical golf regions. Use the
              regional guide to narrow your route, then compare individual
              courses before adding them to your itinerary.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Compare access
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  See how independent guest access differs from course to
                  course.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Compare prices
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Use price bands to understand the cost of each round.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Build your route
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Shortlist courses and turn them into a practical golf trip.
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
                Build your Irish links golf trip
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                Choose links courses, build a day-by-day itinerary and organise
                your Ireland golf trip in one place. Share the plan and let your
                group vote on where to play.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    1
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Choose the region or regions you want to play.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    2
                  </span>

                  <p className="pt-1 text-sm text-slate-700">
                    Add links courses to each golf day.
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
                  Browse by region below and add your preferred courses as you
                  go.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Explore links golf by region
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Ireland's links courses are spread around the coast. Choose a region
            below to jump directly to its courses and start shaping a practical
            route.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {groupedRegions.map((group) => (
              <a
                key={group.key}
                href={`#${group.key}`}
                className="rounded-2xl bg-stone-50 p-4 no-underline ring-1 ring-slate-200 transition hover:bg-stone-100"
              >
                <div className="text-sm font-semibold text-slate-900">
                  {group.name}
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {group.courses.length}{" "}
                  {group.courses.length === 1 ? "course" : "courses"}
                </p>

                <p className="mt-3 text-xs font-semibold text-emerald-700">
                  Explore courses ↓
                </p>
              </a>
            ))}
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading Ireland links golf courses.
          </div>
        )}

        {linksCourses.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
            No links golf courses found.
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {groupedRegions.map((group) => (
              <section
                key={group.key}
                id={group.key}
                className="scroll-mt-24"
              >
                <div className="mb-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                        {group.courses.length}{" "}
                        {group.courses.length === 1
                          ? "links course"
                          : "links courses"}
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-900 lg:text-2xl">
                        {group.name}
                      </h2>
                    </div>

                    <p className="text-xs font-medium text-slate-500">
                      {group.counties.join(" · ")}
                    </p>
                  </div>

                  <p className="mt-3 max-w-[820px] text-sm leading-6 text-slate-600">
                    {group.description}
                  </p>

                  {group.key === "dublin-east" && (
                    <Link
                      href="/links-golf-near-dublin"
                      className="mt-4 inline-block text-sm font-semibold text-emerald-700 no-underline"
                    >
                      Staying in Dublin? See Links Golf Near Dublin →
                    </Link>
                  )}
                </div>

                {group.courses.length > 0 ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {group.courses.map((course) => (
                      <CourseCard
                        key={course.id}
                        {...course}
                        searchParams={{
                          country: "ireland",
                          source: "links-golf-ireland",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/70">
                    No courses currently listed in this region.
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:p-6">
          <RegionalGolfLinks />
        </section>
      </section>
    </main>
  );
}