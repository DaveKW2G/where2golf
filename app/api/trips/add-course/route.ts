import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tripId = String(body.trip_id || "").trim();
    const courseId = Number(body.course?.id);
    if (!tripId || !Number.isInteger(courseId) || courseId <= 0) {
      return NextResponse.json({ error: "Trip ID and course are required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("planner_v2_add_course", { p_trip_id: tripId, p_course_id: courseId });
    if (error) return NextResponse.json({ error: "Unable to add course", details: error.message }, { status: 500 });
    return NextResponse.json({ success: true, selected_courses: data || [] });
  } catch {
    return NextResponse.json({ error: "Unable to add course to trip" }, { status: 500 });
  }
}
