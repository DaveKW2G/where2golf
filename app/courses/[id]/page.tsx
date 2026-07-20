import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/BackButton";
import CourseCTAButtons from "@/components/CourseCTAButtons";
import CourseAddToTripButton from "@/components/CourseAddToTripButton";

type CoursePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

type Course = {
  id: number;
  course_name: string;
  country?: string | null;
  town: string;
  region: string;
  full_address?: string | null;
  holes: number;
  independent_guest_days: string;
  season: string;
  price_range?: string | null;
  golf_ireland_discount?: string | null;
  course_type?: string | null;
  handicap_required?: boolean | null;
  max_handicap?: number | null;
  website?: string | null;
  phone_number?: string | null;
  notes?: string | null;
  course_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type NearbyCourse = {
  id: number;
  course_name: string;
  town: string;
  region: string;
  holes?: number | null;
  independent_guest_days: string;
  price_range?: string | null;
  course_type?: string | null;
  course_image?: string | null;
  handicap_required?: boolean | null;
  max_handicap?: number | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
};

type NearbyGuideLink = {
  title: string;
  href: string;
  description: string;
};

const siteUrl = "https://guestplaygolf.com";

const irelandGolfHubs = [
  {
    title: "Golf Near Dublin",
    href: "/golf-near-dublin",
    description:
      "Compare visitor-friendly golf within 100 km of Dublin and find more courses for your itinerary.",
    lat: 53.3498,
    lng: -6.2603,
    radiusKm: 100,
  },
  {
    title: "Golf Near Cork",
    href: "/golf-near-cork",
    description:
      "Compare visitor-friendly golf around Cork and the south coast for your golf trip.",
    lat: 51.8985,
    lng: -8.4756,
    radiusKm: 70,
  },
  {
    title: "Golf Near Galway",
    href: "/golf-near-galway",
    description:
      "Compare visitor-friendly golf around Galway and the west of Ireland for your itinerary.",
    lat: 53.2707,
    lng: -9.0568,
    radiusKm: 75,
  },
  {
    title: "Golf Near Belfast",
    href: "/golf-near-belfast",
    description:
      "Compare visitor-friendly golf around Belfast and Northern Ireland for your golf trip.",
    lat: 54.5973,
    lng: -5.9301,
    radiusKm: 100,
  },
  {
    title: "Golf Near Adare Manor",
    href: "/golf-near-adare-manor",
    description:
      "Compare visitor-friendly golf around Adare Manor and the Ryder Cup region.",
    lat: 52.5619,
    lng: -8.7957,
    radiusKm: 100,
  },
];

const switzerlandGolfHubs = [
  {
    title: "Golf Near Zurich",
    href: "/golf-near-zurich",
    description:
      "Compare guest-friendly golf around Zurich, Zug, Aargau and Schwyz.",
    lat: 47.3769,
    lng: 8.5417,
    radiusKm: 85,
  },
  {
    title: "Golf Near Lucerne",
    href: "/golf-near-lucerne",
    description:
      "Explore golf around Lucerne and central Switzerland for independent guests.",
    lat: 47.0502,
    lng: 8.3093,
    radiusKm: 75,
  },
  {
    title: "Golf Near Basel",
    href: "/golf-near-basel",
    description:
      "Compare golf courses around Basel and north-western Switzerland.",
    lat: 47.5596,
    lng: 7.5886,
    radiusKm: 80,
  },
  {
    title: "Golf Near Geneva",
    href: "/golf-near-geneva",
    description:
      "Explore guest golf around Geneva and the western end of Lake Geneva.",
    lat: 46.2044,
    lng: 6.1432,
    radiusKm: 75,
  },
  {
    title: "Golf Near Lausanne",
    href: "/golf-near-lausanne",
    description:
      "Compare golf around Lausanne, Vaud and the Lake Geneva region.",
    lat: 46.5197,
    lng: 6.6323,
    radiusKm: 75,
  },
  {
    title: "Golf in the Swiss Alps",
    href: "/golf-in-the-swiss-alps",
    description:
      "Discover alpine golf courses, mountain settings and shorter Swiss golf seasons.",
    lat: 46.8182,
    lng: 8.2275,
    radiusKm: 135,
  },
];

const regionNames: Record<string, string> = {
  AG: "Aargau",
  AI: "Appenzell Innerrhoden",
  AR: "Appenzell Ausserrhoden",
  BE: "Bern",
  BL: "Basel-Landschaft",
  BS: "Basel-Stadt",
  FR: "Fribourg",
  GE: "Geneva",
  GL: "Glarus",
  GR: "Graubünden",
  JU: "Jura",
  LU: "Lucerne",
  NE: "Neuchâtel",
  NW: "Nidwalden",
  OW: "Obwalden",
  SG: "St. Gallen",
  SH: "Schaffhausen",
  SO: "Solothurn",
  SZ: "Schwyz",
  TG: "Thurgau",
  TI: "Ticino",
  UR: "Uri",
  VD: "Vaud",
  VS: "Valais",
  ZG: "Zug",
  ZH: "Zurich",
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("courses")
    .select("id, course_name, country, town, region, course_image")
    .eq("id", Number(resolvedParams.id))
    .single();

  if (!data) {
    return {
      metadataBase: new URL(siteUrl),
      title: "Golf Course | GuestPlayGolf",
      description:
        "Find golf courses for independent guests on GuestPlayGolf.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const country = data.country || "Switzerland";
  const isIreland = country === "Ireland";
  const regionName = regionNames[data.region] || data.region;
  const canonicalUrl = `${siteUrl}/courses/${data.id}`;

  const title = isIreland
    ? `${data.course_name} | Visitor Access & Green Fees | GuestPlayGolf`
    : `${data.course_name} | Guest Play & Handicap | GuestPlayGolf`;

  const description = isIreland
    ? `Planning to play ${data.course_name}? Find visitor access, green fees, course information and nearby golf courses. Planning a golf trip? Use GuestPlayGolf's free trip planner to share and vote with friends.`
    : `Planning to play ${data.course_name}? Find guest play rules, handicap requirements, course information and nearby golf courses. Planning a golf trip? Use GuestPlayGolf's free trip planner to share and vote with friends.`;

  const openGraphDescription = description;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: openGraphDescription,
      url: canonicalUrl,
      siteName: "GuestPlayGolf",
      images: data.course_image
        ? [
            {
              url: data.course_image,
              alt: `${data.course_name} golf course in ${data.town}`,
            },
          ]
        : undefined,
      type: "website",
    },
  };
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value || "—"}
      </span>
    </div>
  );
}

function getSingleParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isValidTripId(value?: string) {
  return Boolean(value && value !== "undefined" && value !== "null");
}

function getCountryFromSearchParams(
  searchParams: {
    [key: string]: string | string[] | undefined;
  },
  defaultHref: string,
) {
  const countryParam = getSingleParam(searchParams.country)?.toLowerCase();

  if (countryParam === "switzerland") return "Switzerland";
  if (countryParam === "ireland") return "Ireland";

  if (defaultHref.startsWith("/switzerland")) return "Switzerland";
  if (defaultHref.startsWith("/ireland")) return "Ireland";

  return "Switzerland";
}

function getPlannerHrefFromSearchParams(
  searchParams: {
    [key: string]: string | string[] | undefined;
  },
  defaultHref: string,
) {
  const country = getCountryFromSearchParams(searchParams, defaultHref);
  const tripId = getSingleParam(searchParams.tripId);
  const basePath = country === "Ireland" ? "/ireland/planner" : "/switzerland/planner";

  if (isValidTripId(tripId)) {
    return `${basePath}?tripId=${encodeURIComponent(tripId as string)}`;
  }

  return basePath;
}

function isPlannerSearchContext(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  return (
    getSingleParam(searchParams.planner) === "true" ||
    getSingleParam(searchParams.source) === "planner" ||
    isValidTripId(getSingleParam(searchParams.tripId))
  );
}

function getFallbackHrefFromSource(source?: string) {
  if (!source) return null;

  const sourceFallbacks: Record<string, string> = {
    ireland: "/ireland",
    "irish-links-golf": "/irish-links-golf",
    "links-golf-near-dublin": "/links-golf-near-dublin",
    "golf-near-dublin": "/golf-near-dublin",
    "golf-near-cork": "/golf-near-cork",
    "golf-near-galway": "/golf-near-galway",
    "golf-near-belfast": "/golf-near-belfast",
    "golf-near-adare-manor": "/golf-near-adare-manor",
    switzerland: "/switzerland",
    "golf-near-zurich": "/golf-near-zurich",
    "golf-near-geneva": "/golf-near-geneva",
    "golf-near-basel": "/golf-near-basel",
    "golf-near-lausanne": "/golf-near-lausanne",
    "golf-near-lucerne": "/golf-near-lucerne",
    "golf-in-the-swiss-alps": "/golf-in-the-swiss-alps",
    "golf-near-st-gallen": "/golf-near-st-gallen",
    "golf-near-lugano": "/golf-near-lugano",
    "golf-near-winterthur": "/golf-near-winterthur",
  };

  return sourceFallbacks[source] || null;
}

function buildFallbackHref(
  searchParams: {
    [key: string]: string | string[] | undefined;
  },
  defaultHref: string,
) {
  if (isPlannerSearchContext(searchParams)) {
    return getPlannerHrefFromSearchParams(searchParams, defaultHref);
  }

  const returnTo = getSingleParam(searchParams.returnTo);

  if (returnTo && returnTo.startsWith("/")) {
    return returnTo;
  }

  const sourceFallbackHref = getFallbackHrefFromSource(
    getSingleParam(searchParams.source),
  );

  if (sourceFallbackHref) {
    return sourceFallbackHref;
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "returnTo") continue;

    if (typeof value === "string" && value.trim() !== "") {
      params.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item.trim() !== "") {
          params.append(key, item);
        }
      });
    }
  }

  const queryString = params.toString();

  return queryString ? `/results?${queryString}` : defaultHref;
}

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

function getNearbyIrelandGuideLinks(course: Course): NearbyGuideLink[] {
  if (course.latitude == null || course.longitude == null) {
    return [];
  }

  const nearbyLinks: NearbyGuideLink[] = [];

  irelandGolfHubs.forEach((hub) => {
    const distanceKm = getDistanceKm(
      hub.lat,
      hub.lng,
      course.latitude as number,
      course.longitude as number,
    );

    if (distanceKm <= hub.radiusKm) {
      nearbyLinks.push({
        title: hub.title,
        href: hub.href,
        description: hub.description,
      });
    }
  });

  const isLinksCourse =
    course.course_type?.toLowerCase().includes("links") || false;

  if (isLinksCourse) {
    nearbyLinks.unshift({
      title: "Irish Links Golf",
      href: "/irish-links-golf",
      description:
        "Compare Links golf courses across Ireland and add your preferred options to your itinerary.",
    });
  }

  const distanceToDublinKm = getDistanceKm(
    53.3498,
    -6.2603,
    course.latitude,
    course.longitude,
  );

  if (isLinksCourse && distanceToDublinKm <= 100) {
    nearbyLinks.splice(1, 0, {
      title: "Best Links Golf Near Dublin",
      href: "/links-golf-near-dublin",
      description:
        "Compare classic Links courses near Dublin and add your preferred options to your itinerary.",
    });
  }

  return nearbyLinks;
}

function getNearbySwitzerlandGuideLinks(course: Course): NearbyGuideLink[] {
  if (course.latitude == null || course.longitude == null) {
    return [];
  }

  return switzerlandGolfHubs
    .map((hub) => {
      const distanceKm = getDistanceKm(
        hub.lat,
        hub.lng,
        course.latitude as number,
        course.longitude as number,
      );

      if (distanceKm > hub.radiusKm) {
        return null;
      }

      return {
        title: hub.title,
        href: hub.href,
        description: hub.description,
        distanceKm,
      };
    })
    .filter(
      (
        link,
      ): link is NearbyGuideLink & {
        distanceKm: number;
      } => Boolean(link),
    )
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .map(({ title, href, description }) => ({
      title,
      href,
      description,
    }));
}

function getWebsiteUrl(website?: string | null) {
  if (!website) return null;

  const trimmed = website.trim();

  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getAccessLabel(access: string, country: string) {
  const cleanAccess = access.trim();

  if (cleanAccess === "Limited Access" || cleanAccess === "Limited") {
    return country === "Ireland"
      ? "Limited Visitor Access"
      : "Limited Guest Access";
  }

  if (cleanAccess === "Resort") {
    return "Resort Access";
  }

  if (country === "Ireland") {
    if (cleanAccess === "Everyday") return "Visitors Everyday";
    if (cleanAccess === "Weekdays") return "Visitors Weekdays";
    if (cleanAccess === "Weekend") return "Visitors Weekend";

    if (cleanAccess.startsWith("Guests ")) {
      return cleanAccess.replace("Guests", "Visitors");
    }

    return `Visitors ${cleanAccess}`;
  }

  if (cleanAccess === "Everyday") return "Guests Everyday";
  if (cleanAccess === "Weekdays") return "Guests Weekdays";
  if (cleanAccess === "Weekend") return "Guests Weekend";

  if (cleanAccess.startsWith("Guests ")) {
    return cleanAccess;
  }

  return `Guests ${cleanAccess}`;
}

function getNearbyCourseHandicapLabel(course: NearbyCourse) {
  if (course.max_handicap != null) {
    return `HCP ${course.max_handicap}`;
  }

  if (course.handicap_required) {
    return "HCP required";
  }

  return "HCP not specified";
}

function shouldShowIrelandHandicap(maxHandicap?: number | null) {
  if (maxHandicap === undefined || maxHandicap === null) return false;

  return maxHandicap > 0 && maxHandicap < 54;
}

export default async function CoursePage({
  params,
  searchParams,
}: CoursePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, course_name, country, town, region, full_address, holes, independent_guest_days, season, price_range, golf_ireland_discount, course_type, handicap_required, max_handicap, website, phone_number, notes, course_image, latitude, longitude",
    )
    .eq("id", Number(resolvedParams.id))
    .single();

  if (error || !data) {
    const fallbackHref = buildFallbackHref(
      resolvedSearchParams,
      "/switzerland",
    );

    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6">
        <div className="mx-auto max-w-[480px] rounded-[28px] bg-white p-6 shadow-sm lg:max-w-[1120px]">
          <BackButton
            fallbackHref={fallbackHref}
            className="inline-block text-slate-700"
          >
            ← Back
          </BackButton>

          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Course not found
          </h1>
        </div>
      </main>
    );
  }

  const course = data as Course;
  const country = course.country || "Switzerland";
  const isIreland = country === "Ireland";
  const regionName = regionNames[course.region] || course.region;

  const countryHref = isIreland ? "/ireland" : "/switzerland";
  const fallbackHref = buildFallbackHref(resolvedSearchParams, countryHref);

  const courseContextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string" && value.trim() !== "") {
      courseContextParams.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item.trim() !== "") {
          courseContextParams.append(key, item);
        }
      });
    }
  }

  if (!courseContextParams.get("country")) {
    courseContextParams.set("country", country);
  }

  const courseContextQueryString = courseContextParams.toString();

  function getCourseHref(courseId: number) {
    return courseContextQueryString
      ? `/courses/${courseId}?${courseContextQueryString}`
      : `/courses/${courseId}`;
  }

  const regionHref = isIreland
    ? "/ireland"
    : `/switzerland/${course.region.toLowerCase()}`;

  const priceGuideHref = isIreland
    ? "/ireland#pricing-guide"
    : "/switzerland#pricing-guide";

  const regionLinkText = isIreland
    ? "Explore more golf in Ireland"
    : `Explore more golf in ${regionName}`;

  const nearbyIrelandGuideLinks = isIreland
    ? getNearbyIrelandGuideLinks(course)
    : [];

  const nearbySwitzerlandGuideLinks = !isIreland
    ? getNearbySwitzerlandGuideLinks(course)
    : [];

  const nearbyGuideLinks = isIreland
    ? nearbyIrelandGuideLinks
    : nearbySwitzerlandGuideLinks;

  let nearbyCourses: NearbyCourse[] = [];

  if (course.latitude != null && course.longitude != null) {
    let nearbyCourseQuery = supabase
      .from("courses")
      .select(
        "id, course_name, country, town, region, holes, independent_guest_days, price_range, course_type, course_image, handicap_required, max_handicap, latitude, longitude",
      )
      .neq("id", course.id)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .limit(300);

    if (isIreland) {
      nearbyCourseQuery = nearbyCourseQuery.eq("country", "Ireland");
    } else {
      nearbyCourseQuery = nearbyCourseQuery.or(
        "country.eq.Switzerland,country.is.null",
      );
    }

    const { data: nearbyCourseData } = await nearbyCourseQuery;

    nearbyCourses = (nearbyCourseData || [])
      .map((nearbyCourse) => {
        const latitude = Number(nearbyCourse.latitude);
        const longitude = Number(nearbyCourse.longitude);

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
          return null;
        }

        return {
          ...nearbyCourse,
          latitude,
          longitude,
          distanceKm: getDistanceKm(
            course.latitude as number,
            course.longitude as number,
            latitude,
            longitude,
          ),
        } as NearbyCourse;
      })
      .filter((nearbyCourse): nearbyCourse is NearbyCourse =>
        Boolean(nearbyCourse),
      )
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 4);
  }

  const latParam = getSingleParam(resolvedSearchParams.lat);
  const lngParam = getSingleParam(resolvedSearchParams.lng);

  let distanceBadge: string | null = null;
  let distanceKmForPlanner: number | undefined;

  if (
    latParam &&
    lngParam &&
    course.latitude != null &&
    course.longitude != null
  ) {
    const userLat = Number(latParam);
    const userLng = Number(lngParam);

    if (!Number.isNaN(userLat) && !Number.isNaN(userLng)) {
      const distanceKm = getDistanceKm(
        userLat,
        userLng,
        course.latitude,
        course.longitude,
      );

      distanceKmForPlanner = distanceKm;
      distanceBadge = `📍 ${distanceKm.toFixed(1)} km`;
    }
  }

  const websiteUrl = getWebsiteUrl(course.website);

  const directionsQuery = encodeURIComponent(
    `${course.course_name}, ${course.town}, ${course.region}, ${country}`,
  );

  const directionsUrl =
    `https://www.google.com/maps/search/?api=1&query=${directionsQuery}`;

  const handicapText =
    course.max_handicap != null
      ? `Max Handicap ${course.max_handicap}`
      : course.handicap_required
        ? "Handicap Required"
        : "Handicap Not Specified";

  const accessLabel = getAccessLabel(
    course.independent_guest_days,
    country,
  );

  const golfIrelandDiscountText =
    course.golf_ireland_discount &&
    course.golf_ireland_discount.trim() !== ""
      ? course.golf_ireland_discount
      : "Not specified";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GolfCourse",
    name: course.course_name,
    url: `${siteUrl}/courses/${course.id}`,
    image: course.course_image || undefined,
    telephone: course.phone_number || undefined,
    description: isIreland
      ? `Visitor information for ${course.course_name} and free Irish golf trip planning tools from GuestPlayGolf.`
      : `Guest access, handicap information and nearby Swiss golf courses for ${course.course_name} on GuestPlayGolf.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: course.full_address || undefined,
      addressLocality: course.town,
      addressRegion: regionName,
      addressCountry: isIreland ? "IE" : "CH",
    },
    geo:
      course.latitude != null && course.longitude != null
        ? {
            "@type": "GeoCoordinates",
            latitude: course.latitude,
            longitude: course.longitude,
          }
        : undefined,
  };

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-4 pb-28 lg:px-5 lg:py-6">
      <Script id="course-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>

      <Script id="course-view-events" strategy="afterInteractive">
        {`
          if (window.gtag) {
            window.gtag('event', 'view_course_detail', {
              course_name: ${JSON.stringify(course.course_name)},
              course_id: ${JSON.stringify(String(course.id))},
              region: ${JSON.stringify(course.region)},
              country: ${JSON.stringify(country)}
            });

            window.gtag('event', 'course_view', {
              course_name: ${JSON.stringify(course.course_name)},
              course_id: ${JSON.stringify(String(course.id))},
              region: ${JSON.stringify(course.region)},
              country: ${JSON.stringify(country)}
            });
          }
        `}
      </Script>

      <div className="mx-auto max-w-[480px] lg:max-w-[1120px]">
        <article className="overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-slate-200/60">
          <div className="relative h-60 w-full overflow-hidden bg-slate-200 sm:h-72 lg:h-[420px]">
            {course.course_image ? (
              <img
                src={course.course_image}
                alt={`${course.course_name} golf course in ${course.town}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[15px] text-slate-500">
                No image available
              </div>
            )}

            <div className="absolute inset-x-0 top-0 p-4 lg:p-6">
              <BackButton
                fallbackHref={fallbackHref}
                className="rounded-full bg-white px-3 py-2 text-[14px] font-medium text-slate-800 shadow-sm"
              >
                ← Back
              </BackButton>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/25 to-transparent lg:h-56" />

            <div className="absolute inset-x-0 bottom-0 hidden px-8 pb-8 text-white lg:block">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/75">
                {isIreland ? "Irish golf course" : "Swiss golf course"}
              </p>

              <h1 className="mt-2 max-w-[760px] text-[38px] font-bold leading-tight">
                {course.course_name}
              </h1>

              <p className="mt-2 text-[16px] text-white/90">
                {course.town}, {regionName}
              </p>

              {distanceBadge && (
                <p className="mt-2 text-sm font-semibold text-white/90">
                  {distanceBadge}
                </p>
              )}
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="border-b border-slate-200 px-5 pb-5 pt-5 lg:col-span-2 lg:px-8 lg:py-6">
              <div className="lg:hidden">
                <h1 className="text-[22px] font-bold text-slate-900">
                  {course.course_name}
                </h1>

                <p className="mt-2 text-[14px] text-slate-500">
                  {course.town}, {regionName}
                </p>

                {distanceBadge && (
                  <p className="mt-2 text-sm text-slate-600">
                    {distanceBadge}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2 lg:pt-0">
                {isIreland ? (
                  <>
                    {course.course_type && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700">
                        {course.course_type}
                      </span>
                    )}

                    {course.price_range && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-[12px] font-bold text-yellow-800">
                        {course.price_range}
                      </span>
                    )}

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-800">
                      {accessLabel}
                    </span>

                    {shouldShowIrelandHandicap(course.max_handicap) && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-[12px] font-medium text-blue-800">
                        Max Handicap {course.max_handicap}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-800">
                      {accessLabel}
                    </span>

                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-800">
                      {handicapText}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-700">
                      {course.holes} Holes
                    </span>
                  </>
                )}
              </div>

              <Link
                href={priceGuideHref}
                className="mt-3 inline-block text-sm font-semibold text-emerald-700 no-underline hover:text-emerald-900"
              >
                Price guide →
              </Link>
            </div>

            <div className="border-b border-slate-200 lg:col-span-2">
              <div className="lg:grid lg:grid-cols-3">
                <DetailRow label="Season" value={course.season} />

                {isIreland ? (
                  <>
                    <DetailRow
                      label="Holes"
                      value={`${course.holes} holes`}
                    />

                    <DetailRow
                      label="Golf Ireland Discount"
                      value={golfIrelandDiscountText}
                    />
                  </>
                ) : (
                  <>
                    <DetailRow
                      label="Price"
                      value={course.price_range || "Not listed"}
                    />

                    <DetailRow
                      label="Location"
                      value={`${course.town}, ${regionName}`}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="grid min-w-0 lg:col-span-2 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <aside className="order-1 border-b border-slate-200 px-5 py-5 lg:col-start-2 lg:row-start-1 lg:border-b-0 lg:border-l lg:px-6 lg:py-6">
                <div className="lg:sticky lg:top-6">
                  {isIreland ? (
                    <CourseAddToTripButton
                      course={{
                        id: course.id,
                        course_name: course.course_name,
                        town: course.town,
                        region: course.region,
                        holes: course.holes,
                        independent_guest_days:
                          course.independent_guest_days,
                        price_range: course.price_range || undefined,
                        course_type: course.course_type || undefined,
                        course_image: course.course_image || undefined,
                        distance: distanceKmForPlanner,
                        latitude: course.latitude || undefined,
                        longitude: course.longitude || undefined,
                        max_handicap: course.max_handicap || undefined,
                      }}
                    />
                  ) : (
                    <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                        Independent guest golf
                      </p>

                      <h2 className="mt-2 text-[19px] font-bold text-slate-900">
                        Compare golf near {course.town}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        Review nearby Swiss courses, guest access and handicap
                        requirements before deciding where to play.
                      </p>

                      <Link
                        href={`/filters?country=Switzerland&where=${encodeURIComponent(
                          course.town,
                        )}`}
                        className="mt-5 block rounded-full bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white no-underline"
                      >
                        Search Swiss Golf Courses
                      </Link>
                    </div>
                  )}

                  {nearbyGuideLinks.length > 0 && (
                    <div className="mt-5 hidden rounded-3xl bg-white p-5 ring-1 ring-slate-200 lg:block">
                      <h2 className="text-[17px] font-semibold text-slate-900">
                        Explore nearby golf guides
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {isIreland
                          ? "Compare broader golf areas and continue building your itinerary."
                          : "Compare practical Swiss golf bases and discover more courses for independent guests."}
                      </p>

                      <div className="mt-4 grid gap-3">
                        {nearbyGuideLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block rounded-2xl bg-slate-50 px-4 py-4 no-underline ring-1 ring-slate-200 transition hover:bg-slate-100"
                          >
                            <div className="text-sm font-semibold text-slate-900">
                              {link.title} →
                            </div>

                            <p className="mt-1 text-sm leading-5 text-slate-600">
                              {link.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 hidden rounded-3xl bg-white p-5 ring-1 ring-slate-200 lg:block">
                    <h2 className="text-[17px] font-semibold text-slate-900">
                      {isIreland
                        ? "Explore golf across Ireland"
                        : `Golf in ${regionName}`}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {isIreland
                        ? "Browse more Irish courses, regional guides and trip-planning tools."
                        : `Browse more golf courses and guest information across ${regionName}.`}
                    </p>

                    <Link
                      href={regionHref}
                      className="mt-4 inline-block text-sm font-semibold text-emerald-700 no-underline"
                    >
                      {regionLinkText} →
                    </Link>
                  </div>
                </div>
              </aside>

              <div className="order-2 min-w-0 lg:col-start-1 lg:row-start-1">
                {course.notes && (
                  <section className="border-b border-slate-200 px-5 py-5 lg:px-8 lg:py-7">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                      Course overview
                    </p>

                    <h2 className="mt-1 text-[21px] font-semibold text-slate-900">
                      {isIreland
                        ? "Visitor information"
                        : "Independent guest information"}
                    </h2>

                    <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-slate-600">
                      {course.notes}
                    </p>
                  </section>
                )}

                {nearbyCourses.length > 0 && (
                  <section className="border-b border-slate-200 px-5 py-5 lg:px-8 lg:py-7">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                      {isIreland ? "Continue planning" : "Keep exploring"}
                    </p>

                    <h2 className="mt-1 text-[21px] font-semibold text-slate-900">
                      Golf courses near {course.course_name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {isIreland
                        ? "Compare nearby courses and add more options to your golf trip itinerary."
                        : "Compare nearby Swiss courses, guest access and handicap requirements before choosing where to play."}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {nearbyCourses.map((nearbyCourse) => (
                        <Link
                          key={nearbyCourse.id}
                          href={getCourseHref(nearbyCourse.id)}
                          className="group overflow-hidden rounded-3xl bg-slate-50 no-underline ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <div className="h-40 w-full bg-slate-200">
                            {nearbyCourse.course_image ? (
                              <img
                                src={nearbyCourse.course_image}
                                alt={`${nearbyCourse.course_name} golf course`}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-slate-500">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="text-[15px] font-semibold leading-5 text-slate-900">
                              {nearbyCourse.course_name}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {nearbyCourse.town} ·{" "}
                              {nearbyCourse.distanceKm.toFixed(1)} km away
                            </p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {isIreland ? (
                                <>
                                  {nearbyCourse.course_type && (
                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
                                      {nearbyCourse.course_type}
                                    </span>
                                  )}

                                  {nearbyCourse.price_range && (
                                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-[10px] font-bold text-yellow-800">
                                      {nearbyCourse.price_range}
                                    </span>
                                  )}

                                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-800">
                                    {getAccessLabel(
                                      nearbyCourse.independent_guest_days,
                                      "Ireland",
                                    )}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-800">
                                    {getAccessLabel(
                                      nearbyCourse.independent_guest_days,
                                      "Switzerland",
                                    )}
                                  </span>

                                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-800">
                                    {getNearbyCourseHandicapLabel(
                                      nearbyCourse,
                                    )}
                                  </span>

                                  {nearbyCourse.holes != null && (
                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
                                      {nearbyCourse.holes} holes
                                    </span>
                                  )}
                                </>
                              )}
                            </div>

                            <p className="mt-4 text-sm font-semibold text-emerald-700">
                              View course →
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {nearbyGuideLinks.length > 0 && (
                  <section className="border-b border-slate-200 px-5 py-5 lg:hidden">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                      Keep exploring
                    </p>

                    <h2 className="mt-1 text-[21px] font-semibold text-slate-900">
                      Explore nearby golf guides
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {isIreland
                        ? "Compare broader golf areas and continue building your itinerary."
                        : "Compare nearby Swiss golf hubs and discover more courses for independent guests."}
                    </p>

                    <div className="mt-4 grid gap-3">
                      {nearbyGuideLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block rounded-2xl bg-slate-50 px-4 py-4 no-underline ring-1 ring-slate-200"
                        >
                          <div className="text-sm font-semibold text-slate-900">
                            {link.title} →
                          </div>

                          <p className="mt-1 text-sm leading-5 text-slate-600">
                            {link.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                <section className="px-5 py-5 lg:hidden">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                    {isIreland ? "Across Ireland" : regionName}
                  </p>

                  <Link
                    href={regionHref}
                    className="mt-2 inline-block text-sm font-semibold text-emerald-700 no-underline"
                  >
                    {regionLinkText} →
                  </Link>
                </section>
              </div>
            </div>
          </div>
        </article>
      </div>

      <CourseCTAButtons
        websiteUrl={websiteUrl}
        phoneNumber={course.phone_number}
        directionsUrl={directionsUrl}
        courseName={course.course_name}
        region={course.region}
      />
    </main>
  );
}