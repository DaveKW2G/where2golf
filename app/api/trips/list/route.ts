import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const plannerUserId = new URL(request.url).searchParams.get("plannerUserId")?.trim();
    if (!plannerUserId || plannerUserId.length > 160) return NextResponse.json({ trips: [] });
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("planner_v2_list_trips", { p_planner_user_id: plannerUserId });
    if (error) return NextResponse.json({ error: "Unable to load saved trips", details: error.message }, { status: 500 });
    return NextResponse.json({ trips: data || [] });
  } catch {
    return NextResponse.json({ error: "Unable to load saved trips" }, { status: 500 });
  }
}
