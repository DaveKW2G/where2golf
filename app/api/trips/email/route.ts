import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createTripPackEmail,
  type TripEmailCourse,
  type TripEmailVoteSummary,
} from "@/lib/trip-email";

type SelectedCourse = Omit<TripEmailCourse, "website" | "phone_number" | "votes">;

type CourseContact = {
  id: number;
  website?: string | null;
  phone_number?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type VoteRow = {
  course_id: number;
  vote: "must_play" | "happy_to_play" | "not_for_me";
  participant_id: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const rateLimitWindowMs = 60 * 60 * 1000;
const rateLimitMaximum = 5;

function getRateLimitKey(request: Request, email: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const ip = forwardedFor?.trim() || "unknown";

  return `${ip}:${email.toLowerCase()}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const existing = rateLimit.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  existing.count += 1;
  rateLimit.set(key, existing);

  return existing.count > rateLimitMaximum;
}

function summariseVotes(votes: VoteRow[]) {
  const summary: Record<number, TripEmailVoteSummary> = {};

  votes.forEach((vote) => {
    summary[vote.course_id] ||= {
      must_play: 0,
      happy_to_play: 0,
      not_for_me: 0,
    };

    if (vote.vote in summary[vote.course_id]) {
      summary[vote.course_id][vote.vote] += 1;
    }
  });

  return summary;
}

export async function GET() {
  return NextResponse.json(
    {
      available: Boolean(
        process.env.RESEND_API_KEY?.trim() &&
          process.env.GUESTPLAYGOLF_EMAIL_FROM?.trim(),
      ),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const tripId = String(body.trip_id || "").trim();
    const company = String(body.company || "").trim();

    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!email || email.length > 254 || !emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 },
      );
    }

    if (!tripId || tripId.length > 80) {
      return NextResponse.json(
        { error: "A valid trip is required" },
        { status: 400 },
      );
    }

    if (isRateLimited(getRateLimitKey(request, email))) {
      return NextResponse.json(
        { error: "Too many trip emails were requested. Try again later." },
        { status: 429 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const fromAddress = process.env.GUESTPLAYGOLF_EMAIL_FROM?.trim();

    if (!apiKey || !fromAddress) {
      return NextResponse.json(
        { error: "Trip email delivery is being activated. Please try again soon." },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const { data: tripRows, error: tripError } = await supabase
      .from("trips")
      .select(
        "trip_id, trip_code, trip_name, base_location, base_latitude, base_longitude, month_of_travel, number_of_golfers, number_of_golf_days, selected_courses",
      )
      .eq("trip_id", tripId)
      .limit(1);

    if (tripError || !tripRows?.[0]) {
      return NextResponse.json(
        { error: "We could not load that trip" },
        { status: tripError ? 500 : 404 },
      );
    }

    const trip = tripRows[0];
    const selectedCourses = Array.isArray(trip.selected_courses)
      ? (trip.selected_courses as SelectedCourse[])
      : [];

    if (selectedCourses.length === 0) {
      return NextResponse.json(
        { error: "Add at least one course before emailing the trip pack" },
        { status: 400 },
      );
    }

    const courseIds = selectedCourses
      .map((course) => Number(course.id))
      .filter((courseId) => Number.isInteger(courseId) && courseId > 0);
    const [{ data: contactRows, error: contactError }, { data: voteRows }] =
      await Promise.all([
        supabase
          .from("courses")
          .select("id, website, phone_number, latitude, longitude")
          .in("id", courseIds),
        supabase
          .from("trip_votes")
          .select("course_id, vote, participant_id")
          .eq("trip_id", tripId),
      ]);

    if (contactError) {
      return NextResponse.json(
        { error: "We could not prepare the course contact details" },
        { status: 500 },
      );
    }

    const contacts = new Map(
      ((contactRows || []) as CourseContact[]).map((course) => [
        Number(course.id),
        course,
      ]),
    );
    const votes = (voteRows || []) as VoteRow[];
    const voteSummary = summariseVotes(votes);
    const participantCount = new Set(votes.map((vote) => vote.participant_id))
      .size;
    const courses = selectedCourses.map((course) => {
      const contact = contacts.get(Number(course.id));

      return {
        ...course,
        website: contact?.website,
        phone_number: contact?.phone_number,
        latitude: Number(contact?.latitude ?? course.latitude) || null,
        longitude: Number(contact?.longitude ?? course.longitude) || null,
        votes: voteSummary[Number(course.id)],
      } satisfies TripEmailCourse;
    });
    const siteUrl =
      process.env.GUESTPLAYGOLF_SITE_URL?.trim() ||
      "https://guestplaygolf.com";
    const message = createTripPackEmail({
      tripId: trip.trip_id,
      tripCode: trip.trip_code,
      tripName: trip.trip_name || "My Ireland Golf Trip",
      baseLocation: trip.base_location || "Ireland",
      baseLatitude: Number(trip.base_latitude) || null,
      baseLongitude: Number(trip.base_longitude) || null,
      monthOfTravel: trip.month_of_travel,
      numberOfGolfers: Math.max(1, Number(trip.number_of_golfers) || 1),
      numberOfGolfDays: Math.min(
        10,
        Math.max(1, Number(trip.number_of_golf_days) || 1),
      ),
      participantCount,
      courses,
      siteUrl,
    });
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!resendResponse.ok) {
      console.error("Trip email provider error", resendResponse.status);

      return NextResponse.json(
        { error: "We could not send the trip pack. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "We could not send the trip pack. Please try again." },
      { status: 500 },
    );
  }
}
