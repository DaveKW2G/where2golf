import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tripId = String(body.trip_id || "").trim();
    const courseId = Number(body.course_id);
    const ownerToken = String(body.owner_token || "");
    const legacyOwnerId = String(body.legacy_owner_id || "");
    if (!tripId || !Number.isInteger(courseId) || courseId <= 0 || (!ownerToken && !legacyOwnerId)) {
      return NextResponse.json({ error: "Trip, course and organiser details are required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("planner_v2_remove_course", {
      p_trip_id: tripId,
      p_course_id: courseId,
      p_owner_token_hash: ownerToken ? createHash("sha256").update(ownerToken).digest("hex") : null,
      p_legacy_owner_id: legacyOwnerId || null,
    });
    if (error) return NextResponse.json({ error: error.message.includes("organiser") ? error.message : "Course could not be removed" }, { status: error.message.includes("organiser") ? 403 : 404 });
    return NextResponse.json({ success: true, selected_courses: data || [] });
  } catch {
    return NextResponse.json({ error: "Unable to remove course from trip" }, { status: 500 });
  }
}
