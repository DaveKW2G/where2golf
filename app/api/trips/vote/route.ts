import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type VoteRow = { course_id: number; vote: string; participant_id: string };

function buildResponse(votes: VoteRow[], activeParticipantId?: string | null) {
  const summary: Record<number, { up: number; down: number; must_play: number; happy_to_play: number; not_for_me: number; score: number }> = {};
  const participants = new Set<string>();
  const participantVotes: Record<number, string> = {};
  for (const row of votes) {
    const id = Number(row.course_id);
    summary[id] ||= { up: 0, down: 0, must_play: 0, happy_to_play: 0, not_for_me: 0, score: 0 };
    participants.add(row.participant_id);
    if (row.vote === "up" || row.vote === "happy_to_play" || row.vote === "must_play") {
      summary[id].up += 1;
      summary[id].score += row.vote === "must_play" ? 2 : 1;
      if (row.vote === "must_play") summary[id].must_play += 1;
      if (row.vote === "happy_to_play") summary[id].happy_to_play += 1;
    } else if (row.vote === "down" || row.vote === "not_for_me") {
      summary[id].down += 1;
      summary[id].score -= 1;
      if (row.vote === "not_for_me") summary[id].not_for_me += 1;
    }
    if (row.participant_id === activeParticipantId) {
      participantVotes[id] = row.vote === "must_play" || row.vote === "happy_to_play" ? "up" : row.vote === "not_for_me" ? "down" : row.vote;
    }
  }
  return { summary, participant_count: participants.size, participants: [], participant_votes: participantVotes };
}

async function loadVotes(tripId: string) {
  const supabase = await createClient();
  return supabase.rpc("planner_v2_get_votes", { p_trip_id: tripId });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId")?.trim();
    const participantId = searchParams.get("participantId")?.trim();
    if (!tripId) return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
    const { data, error } = await loadVotes(tripId);
    if (error) return NextResponse.json({ error: "Unable to load votes", details: error.message }, { status: 500 });
    const votes = (data || []) as VoteRow[];
    return NextResponse.json({ votes: votes.map(({ course_id, vote }) => ({ course_id, vote })), ...buildResponse(votes, participantId) });
  } catch {
    return NextResponse.json({ error: "Unable to load votes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tripId = String(body.trip_id || "").trim();
    const participantId = String(body.participant_id || "").trim();
    const singleRemoval = !Array.isArray(body.votes) && body.vote === null;
    const submitted = Array.isArray(body.votes) ? body.votes : [{ course_id: body.course_id, vote: body.vote }];
    const choices = submitted.map((v: { course_id?: unknown; vote?: unknown }) => ({ course_id: Number(v.course_id), vote: v.vote == null ? null : String(v.vote) }));
    const allowed = new Set(["up", "down", "must_play", "happy_to_play", "not_for_me"]);
    if (!tripId || !participantId || participantId.length > 160 || !choices.length || choices.some((v: { course_id: number; vote: string | null }) => !Number.isInteger(v.course_id) || v.course_id <= 0 || (!singleRemoval && !allowed.has(v.vote || "")))) {
      return NextResponse.json({ error: "Trip, participant and valid votes are required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data: trip, error: tripError } = await supabase.rpc("planner_v2_get_trip", { p_trip_id: tripId });
    if (tripError || !trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    const selectedIds = new Set((Array.isArray(trip.selected_courses) ? trip.selected_courses : []).map((c: { id?: unknown }) => Number(c.id)));
    if (choices.some((v: { course_id: number }) => !selectedIds.has(v.course_id))) return NextResponse.json({ error: "Votes can only be submitted for shortlisted courses" }, { status: 400 });
    const { data: existingRows, error: existingError } = await loadVotes(tripId);
    if (existingError) return NextResponse.json({ error: "Unable to load current votes" }, { status: 500 });
    const current = (existingRows || []) as VoteRow[];
    const setVote = async (courseId: number, choice: string | null) => supabase.rpc("planner_v2_set_vote", { p_trip_id: tripId, p_course_id: courseId, p_participant_id: participantId, p_vote: choice });
    if (Array.isArray(body.votes)) {
      const sentIds = new Set(choices.map((v: { course_id: number }) => v.course_id));
      for (const row of current.filter((v) => v.participant_id === participantId && !sentIds.has(v.course_id))) {
        const removed = await setVote(row.course_id, null);
        if (removed.error) return NextResponse.json({ error: "Unable to update ballot", details: removed.error.message }, { status: 500 });
      }
    }
    for (const choice of choices) {
      const saved = await setVote(choice.course_id, choice.vote);
      if (saved.error) return NextResponse.json({ error: "Unable to save vote", details: saved.error.message }, { status: 500 });
    }
    const { data: all, error } = await loadVotes(tripId);
    if (error) return NextResponse.json({ error: "Vote saved, but totals could not be loaded" }, { status: 500 });
    const allVotes = (all || []) as VoteRow[];
    return NextResponse.json({ success: true, votes: allVotes.map(({ course_id, vote }) => ({ course_id, vote })), ...buildResponse(allVotes, participantId) });
  } catch {
    return NextResponse.json({ error: "Unable to save votes" }, { status: 500 });
  }
}
