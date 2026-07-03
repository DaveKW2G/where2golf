import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const plannerUserId = searchParams.get('plannerUserId')

    if (!plannerUserId) {
      return NextResponse.json({ trips: [] })
    }

    const { data, error } = await supabase
      .from('trips')
      .select(
        'trip_id, trip_name, base_location, month_of_travel, number_of_golfers, number_of_golf_days, selected_courses, created_at'
      )
      .eq('planner_user_id', plannerUserId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json(
        { error: 'Unable to load trips', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      trips: data || [],
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to load trips' },
      { status: 500 }
    )
  }
}
