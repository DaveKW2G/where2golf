export type TripEmailVoteSummary = {
  must_play: number;
  happy_to_play: number;
  not_for_me: number;
};

export type TripEmailCourse = {
  id: number;
  course_name: string;
  town?: string | null;
  region?: string | null;
  price_range?: string | null;
  assigned_day?: number | null;
  assigned_slot?: "Morning" | "Afternoon" | null;
  website?: string | null;
  phone_number?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  votes?: TripEmailVoteSummary;
};

export type TripEmailPack = {
  tripId: string;
  tripCode?: string | null;
  tripName: string;
  baseLocation: string;
  baseLatitude?: number | null;
  baseLongitude?: number | null;
  monthOfTravel?: string | null;
  numberOfGolfers: number;
  numberOfGolfDays: number;
  participantCount: number;
  courses: TripEmailCourse[];
  siteUrl: string;
};

const priceRanges: Record<string, { low: number; high: number }> = {
  "€": { low: 0, high: 50 },
  "€€": { low: 50, high: 100 },
  "€€€": { low: 100, high: 200 },
  "€€€€": { low: 200, high: 300 },
  "€€€€€": { low: 300, high: 450 },
};

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanPriceBand(value?: string | null) {
  return value?.replace(/Â/g, "").trim() || "";
}

function normaliseWebsite(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) return null;

  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
    );

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function formatEuro(value: number) {
  return `€${Math.round(value).toLocaleString("en-IE")}`;
}

function getGreenFeeEstimate(courses: TripEmailCourse[]) {
  const ranges = courses
    .map((course) => priceRanges[cleanPriceBand(course.price_range)])
    .filter((range): range is { low: number; high: number } => Boolean(range));

  if (ranges.length === 0) return null;

  return {
    pricedCourses: ranges.length,
    perGolferLow: ranges.reduce((total, range) => total + range.low, 0),
    perGolferHigh: ranges.reduce((total, range) => total + range.high, 0),
  };
}

function getCourseLocation(course: TripEmailCourse) {
  return [course.town, course.region].filter(Boolean).join(", ");
}

function getDirectionsUrl(course: TripEmailCourse) {
  const destination =
    typeof course.latitude === "number" &&
    typeof course.longitude === "number"
      ? `${course.latitude},${course.longitude}`
      : [course.course_name, course.town, course.region, "Ireland"]
          .filter(Boolean)
          .join(", ");

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function getDayRouteUrl(
  pack: TripEmailPack,
  courses: TripEmailCourse[],
) {
  if (courses.length === 0) return null;

  const locations = courses.map((course) => {
    if (
      typeof course.latitude === "number" &&
      typeof course.longitude === "number"
    ) {
      return `${course.latitude},${course.longitude}`;
    }

    return [course.course_name, course.town, course.region, "Ireland"]
      .filter(Boolean)
      .join(", ");
  });
  const origin =
    typeof pack.baseLatitude === "number" &&
    typeof pack.baseLongitude === "number"
      ? `${pack.baseLatitude},${pack.baseLongitude}`
      : `${pack.baseLocation}, Ireland`;
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination: locations.at(-1) || origin,
    travelmode: "driving",
  });

  if (locations.length > 1) {
    params.set("waypoints", locations.slice(0, -1).join("|"));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function getVoteLabel(votes?: TripEmailVoteSummary) {
  if (!votes) return "No votes yet";

  const total = votes.must_play + votes.happy_to_play + votes.not_for_me;

  if (total === 0) return "No votes yet";

  return `🔥 ${votes.must_play} must play · 👍 ${votes.happy_to_play} happy to play · 👎 ${votes.not_for_me} not for me`;
}

function renderCourseHtml(course: TripEmailCourse) {
  const website = normaliseWebsite(course.website);
  const location = getCourseLocation(course);
  const priceBand = cleanPriceBand(course.price_range) || "Price not listed";
  const contactLinks = [
    website
      ? `<a href="${escapeHtml(website)}" style="color:#047857;font-weight:700;text-decoration:none;">Course website</a>`
      : "",
    course.phone_number
      ? `<a href="tel:${escapeHtml(course.phone_number)}" style="color:#047857;font-weight:700;text-decoration:none;">${escapeHtml(course.phone_number)}</a>`
      : "",
    `<a href="${escapeHtml(getDirectionsUrl(course))}" style="color:#047857;font-weight:700;text-decoration:none;">Directions</a>`,
  ].filter(Boolean);

  return `
    <div style="margin-top:12px;padding:16px;border:1px solid #dbe3df;border-radius:14px;background:#ffffff;">
      <div style="font-size:16px;font-weight:800;color:#17211d;">${escapeHtml(course.course_name)}</div>
      <div style="margin-top:4px;font-size:13px;line-height:20px;color:#5f6f67;">${escapeHtml(location || "Ireland")} · ${escapeHtml(priceBand)}</div>
      <div style="margin-top:8px;font-size:13px;line-height:20px;color:#5f6f67;">${escapeHtml(getVoteLabel(course.votes))}</div>
      <div style="margin-top:10px;font-size:13px;line-height:22px;">${contactLinks.join(" &nbsp;·&nbsp; ")}</div>
    </div>`;
}

function renderDayHtml(pack: TripEmailPack, dayNumber: number) {
  const courses = pack.courses
    .filter((course) => course.assigned_day === dayNumber)
    .sort((left, right) =>
      left.assigned_slot === right.assigned_slot
        ? left.course_name.localeCompare(right.course_name)
        : left.assigned_slot === "Morning"
          ? -1
          : 1,
    );
  const routeUrl = getDayRouteUrl(pack, courses);

  return `
    <div style="margin-top:20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <h2 style="margin:0;font-size:19px;color:#17211d;">Day ${dayNumber}</h2>
        ${routeUrl ? `<a href="${escapeHtml(routeUrl)}" style="font-size:13px;color:#047857;font-weight:700;text-decoration:none;">Open day route →</a>` : ""}
      </div>
      ${courses.length > 0 ? courses.map(renderCourseHtml).join("") : '<p style="margin:8px 0 0;color:#5f6f67;font-size:14px;">No course assigned yet.</p>'}
    </div>`;
}

function renderTextCourse(course: TripEmailCourse) {
  const details = [
    getCourseLocation(course),
    cleanPriceBand(course.price_range),
    getVoteLabel(course.votes),
    normaliseWebsite(course.website),
    course.phone_number,
    getDirectionsUrl(course),
  ].filter(Boolean);

  return `${course.assigned_slot ? `${course.assigned_slot}: ` : ""}${course.course_name}\n${details.join(" · ")}`;
}

export function createTripPackEmail(pack: TripEmailPack) {
  const greenFeeEstimate = getGreenFeeEstimate(pack.courses);
  const editUrl = `${pack.siteUrl.replace(/\/$/, "")}/ireland/planner?tripId=${encodeURIComponent(pack.tripId)}`;
  const unassignedCourses = pack.courses.filter(
    (course) => !course.assigned_day,
  );
  const feeHtml = greenFeeEstimate
    ? `<strong>${formatEuro(greenFeeEstimate.perGolferLow)}–${formatEuro(greenFeeEstimate.perGolferHigh)} per golfer</strong>${pack.numberOfGolfers > 1 ? `<br><span style="font-size:13px;color:#5f6f67;">Approximately ${formatEuro(greenFeeEstimate.perGolferLow * pack.numberOfGolfers)}–${formatEuro(greenFeeEstimate.perGolferHigh * pack.numberOfGolfers)} for ${pack.numberOfGolfers} golfers</span>` : ""}`
    : "Add course price bands to calculate an estimate.";
  const feeText = greenFeeEstimate
    ? `${formatEuro(greenFeeEstimate.perGolferLow)}–${formatEuro(greenFeeEstimate.perGolferHigh)} per golfer`
    : "Not available";

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4f5f2;font-family:Arial,Helvetica,sans-serif;color:#17211d;">
    <div style="display:none;max-height:0;overflow:hidden;">Your ${escapeHtml(pack.numberOfGolfDays)}-day Ireland golf itinerary, routes and green-fee guide.</div>
    <div style="margin:0 auto;max-width:680px;padding:24px 12px;">
      <div style="padding:28px 24px;border-radius:20px 20px 0 0;background:#064e3b;color:#ffffff;">
        <div style="font-size:12px;font-weight:800;letter-spacing:3px;">GUESTPLAYGOLF</div>
        <h1 style="margin:14px 0 0;font-size:28px;line-height:35px;">${escapeHtml(pack.tripName)}</h1>
        <p style="margin:10px 0 0;font-size:15px;line-height:23px;color:#d1fae5;">${escapeHtml(pack.baseLocation)}${pack.monthOfTravel ? ` · ${escapeHtml(pack.monthOfTravel)}` : ""} · ${escapeHtml(pack.numberOfGolfers)} golfer${pack.numberOfGolfers === 1 ? "" : "s"}</p>
      </div>
      <div style="padding:24px;background:#ffffff;">
        <div style="padding:16px;border-radius:14px;background:#ecfdf5;border:1px solid #d1fae5;">
          <div style="font-size:12px;font-weight:800;letter-spacing:1px;color:#047857;">GREEN-FEE GUIDE</div>
          <div style="margin-top:7px;font-size:18px;line-height:25px;">${feeHtml}</div>
          <div style="margin-top:7px;font-size:12px;line-height:18px;color:#5f6f67;">Guide only. Actual fees vary by date, tee time and booking conditions.</div>
        </div>
        ${Array.from({ length: pack.numberOfGolfDays }, (_, index) => renderDayHtml(pack, index + 1)).join("")}
        ${unassignedCourses.length > 0 ? `<div style="margin-top:24px;"><h2 style="margin:0;font-size:19px;">Still being considered</h2>${unassignedCourses.map(renderCourseHtml).join("")}</div>` : ""}
        <div style="margin-top:28px;padding-top:24px;border-top:1px solid #dbe3df;text-align:center;">
          <a href="${escapeHtml(editUrl)}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#047857;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;">Open and edit this trip</a>
          <p style="margin:14px 0 0;font-size:12px;line-height:18px;color:#718078;">${pack.tripCode ? `Trip code: ${escapeHtml(pack.tripCode)} · ` : ""}${pack.participantCount} group voter${pack.participantCount === 1 ? "" : "s"}</p>
        </div>
      </div>
      <div style="padding:18px 24px;text-align:center;font-size:12px;line-height:18px;color:#718078;">
        You requested this transactional trip email from GuestPlayGolf. This address has not been added to a marketing list.
      </div>
    </div>
  </body>
</html>`;

  const textDays = Array.from(
    { length: pack.numberOfGolfDays },
    (_, index) => {
      const dayNumber = index + 1;
      const courses = pack.courses.filter(
        (course) => course.assigned_day === dayNumber,
      );
      const routeUrl = getDayRouteUrl(pack, courses);

      return [
        `DAY ${dayNumber}`,
        courses.length > 0
          ? courses.map(renderTextCourse).join("\n\n")
          : "No course assigned yet.",
        routeUrl ? `Day route: ${routeUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    },
  ).join("\n\n");
  const text = [
    "GUESTPLAYGOLF",
    pack.tripName,
    `${pack.baseLocation}${pack.monthOfTravel ? ` · ${pack.monthOfTravel}` : ""} · ${pack.numberOfGolfers} golfer${pack.numberOfGolfers === 1 ? "" : "s"}`,
    `Green-fee guide: ${feeText}`,
    textDays,
    unassignedCourses.length > 0
      ? `STILL BEING CONSIDERED\n${unassignedCourses.map(renderTextCourse).join("\n\n")}`
      : "",
    `Open and edit this trip: ${editUrl}`,
    pack.tripCode ? `Trip code: ${pack.tripCode}` : "",
    "You requested this transactional trip email from GuestPlayGolf. This address has not been added to a marketing list.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    subject: `${pack.tripName} – your GuestPlayGolf trip pack`,
    html,
    text,
  };
}
