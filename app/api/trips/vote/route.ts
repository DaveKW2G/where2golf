import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type VoteValue = 'must_play' | 'happy_to_play' | 'not_for_me'

type VoteRow = {
  course_id: number
  vote: string
  participant_id: string
}

const allowedVotes: VoteValue[] = ['must_play', 'happy_to_play', 'not_for_me']

function decodeParticipantName(participantId: string) {
  const encodedName = participantId.split('.').at(-1)

  if (!participantId.startsWith('GPG-P-') || !encodedName) return null

  try {
    return Buffer.from(encodedName, 'base64url').toString('utf8').trim().slice(0, 30) || null
  } catch {
    return null
  }
}

function summariseVotes(votes: VoteRow[]) {
  const summary: Record<
    number,
    {
      must_play: number
      happy_to_play: number
      not_for_me: number
      score: number
    }
  > = {}

  votes.forEach((voteRow) => {
    const courseId = voteRow.course_id

    if (!summary[courseId]) {
      summary[courseId] = {
        must_play: 0,
        happy_to_play: 0,
        not_for_me: 0,
        score: 0,
      }
    }

    if (voteRow.vote === 'must_play') {
      summary[courseId].must_play += 1
      summary[courseId].score += 2
    }

    if (voteRow.vote === 'happy_to_play') {
      summary[courseId].happy_to_play += 1
      summary[courseId].score += 1
    }

    if (voteRow.vote === 'not_for_me') {
      summary[courseId].not_for_me += 1
      summary[courseId].score -= 1
    }
  })

  return summary
}

function buildVoteResponse(votes: VoteRow[], activeParticipantId?: string | null) {
  const participantRows = new Map<string, number>()

  votes.forEach((vote) => {
    participantRows.set(
      vote.participant_id,
      (participantRows.get(vote.participant_id) || 0) + 1,
    )
  })

  const participants = [...participantRows.entries()]
    .map(([participantId, voteCount]) => ({
      name: decodeParticipantName(participantId),
      vote_count: voteCount,
    }))
    .filter((participant) => Boolean(participant.name))

  const participantVotes = activeParticipantId
    ? Object.fromEntries(
        votes
          .filter((vote) => vote.participant_id === activeParticipantId)
          .map((vote) => [vote.course_id, vote.vote]),
      )
    : {}

  return {
    summary: summariseVotes(votes),
    participant_count: participantRows.size,
    participants,
    participant_votes: participantVotes,
  }
}

async function loadVotes(tripId: string) {
  const supabase = await createClient()
  return supabase
    .from('trip_votes')
    .select('course_id, vote, participant_id')
    .eq('trip_id', tripId)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tripId = searchParams.get('tripId')?.trim()
    const participantId = searchParams.get('participantId')?.trim()

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 },
      )
    }

    const { data, error } = await loadVotes(tripId)

    if (error) {
      return NextResponse.json(
        { error: 'Unable to load votes', details: error.message },
        { status: 500 },
      )
    }

    const votes = (data || []) as VoteRow[]

    return NextResponse.json({
      votes: votes.map(({ course_id, vote }) => ({ course_id, vote })),
      ...buildVoteResponse(votes, participantId),
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to load votes' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const tripId = String(body.trip_id || '').trim()
    const participantId = String(body.participant_id || '').trim()
    const submittedVotes = Array.isArray(body.votes)
      ? body.votes
      : [{ course_id: body.course_id, vote: body.vote }]

    if (!tripId || !participantId || participantId.length > 400) {
      return NextResponse.json(
        { error: 'Trip ID and participant are required' },
        { status: 400 },
      )
    }

    const votes = submittedVotes.map((voteRow: { course_id?: unknown; vote?: unknown }) => ({
      course_id: Number(voteRow.course_id),
      vote: String(voteRow.vote || '') as VoteValue,
    }))

    if (
      votes.some(
        (voteRow: { course_id: number; vote: VoteValue }) =>
          !Number.isInteger(voteRow.course_id) ||
          voteRow.course_id <= 0 ||
          !allowedVotes.includes(voteRow.vote),
      )
    ) {
      return NextResponse.json(
        { error: 'One or more votes are invalid' },
        { status: 400 },
      )
    }

    const { data: tripRows, error: tripError } = await supabase
      .from('trips')
      .select('selected_courses')
      .eq('trip_id', tripId)
      .limit(1)

    if (tripError || !tripRows?.[0]) {
      return NextResponse.json(
        { error: 'Unable to load the trip', details: tripError?.message },
        { status: tripError ? 500 : 404 },
      )
    }

    const selectedCourses = Array.isArray(tripRows[0].selected_courses)
      ? tripRows[0].selected_courses
      : []
    const selectedCourseIds = new Set(
      selectedCourses.map((course: { id?: unknown }) => Number(course.id)),
    )

    if (votes.some((voteRow: { course_id: number }) => !selectedCourseIds.has(voteRow.course_id))) {
      return NextResponse.json(
        { error: 'Votes can only be submitted for courses on this trip' },
        { status: 400 },
      )
    }

    if (Array.isArray(body.votes)) {
      const { data: existingVotes, error: existingVotesError } = await supabase
        .from('trip_votes')
        .select('course_id')
        .eq('trip_id', tripId)
        .eq('participant_id', participantId)

      if (existingVotesError) {
        return NextResponse.json(
          { error: 'Unable to update this ballot', details: existingVotesError.message },
          { status: 500 },
        )
      }

      const submittedCourseIds = new Set(votes.map((voteRow: { course_id: number }) => voteRow.course_id))
      const removedCourseIds = (existingVotes || [])
        .map((voteRow: { course_id: number }) => voteRow.course_id)
        .filter((courseId: number) => !submittedCourseIds.has(courseId))

      if (removedCourseIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('trip_votes')
          .delete()
          .eq('trip_id', tripId)
          .eq('participant_id', participantId)
          .in('course_id', removedCourseIds)

        if (deleteError) {
          return NextResponse.json(
            { error: 'Unable to update this ballot', details: deleteError.message },
            { status: 500 },
          )
        }
      }
    }

    if (votes.length > 0) {
      const { error: upsertError } = await supabase
        .from('trip_votes')
        .upsert(
          votes.map((voteRow: { course_id: number; vote: VoteValue }) => ({
            trip_id: tripId,
            course_id: voteRow.course_id,
            participant_id: participantId,
            vote: voteRow.vote,
          })),
          {
            onConflict: 'trip_id,course_id,participant_id',
          },
        )

      if (upsertError) {
        return NextResponse.json(
          { error: 'Unable to save votes', details: upsertError.message },
          { status: 500 },
        )
      }
    }

    const { data, error: readError } = await supabase
      .from('trip_votes')
      .select('course_id, vote, participant_id')
      .eq('trip_id', tripId)

    if (readError) {
      return NextResponse.json(
        {
          error: 'Votes saved, but unable to reload totals',
          details: readError.message,
        },
        { status: 500 },
      )
    }

    const allVotes = (data || []) as VoteRow[]

    return NextResponse.json({
      success: true,
      votes: allVotes.map(({ course_id, vote }) => ({ course_id, vote })),
      ...buildVoteResponse(allVotes, participantId),
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to save votes' },
      { status: 500 },
    )
  }
}
