import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type VoteValue = 'must_play' | 'happy_to_play' | 'not_for_me'

const allowedVotes: VoteValue[] = ['must_play', 'happy_to_play', 'not_for_me']

function summariseVotes(votes: { course_id: number; vote: string }[]) {
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
    }
  })

  return summary
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const tripId = searchParams.get('tripId')

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('trip_votes')
      .select('course_id, vote')
      .eq('trip_id', tripId)

    if (error) {
      return NextResponse.json(
        { error: 'Unable to load votes', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      votes: data || [],
      summary: summariseVotes(data || []),
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to load votes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const tripId = body.trip_id
    const courseId = body.course_id
    const participantId = body.participant_id
    const vote = body.vote

    if (!tripId || !courseId || !participantId || !vote) {
      return NextResponse.json(
        { error: 'Trip ID, course ID, participant ID and vote are required' },
        { status: 400 }
      )
    }

    if (!allowedVotes.includes(vote)) {
      return NextResponse.json(
        { error: 'Invalid vote value' },
        { status: 400 }
      )
    }

    const { error: upsertError } = await supabase
      .from('trip_votes')
      .upsert(
        {
          trip_id: tripId,
          course_id: courseId,
          participant_id: participantId,
          vote,
        },
        {
          onConflict: 'trip_id,course_id,participant_id',
        }
      )

    if (upsertError) {
      return NextResponse.json(
        { error: 'Unable to save vote', details: upsertError.message },
        { status: 500 }
      )
    }

    const { data, error: readError } = await supabase
      .from('trip_votes')
      .select('course_id, vote')
      .eq('trip_id', tripId)

    if (readError) {
      return NextResponse.json(
        {
          error: 'Vote saved, but unable to reload totals',
          details: readError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      votes: data || [],
      summary: summariseVotes(data || []),
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to save vote' },
      { status: 500 }
    )
  }
}
