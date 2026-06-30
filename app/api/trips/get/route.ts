import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
      .from('trips')
      .select(
        'trip_id, trip_name, base_location, base_latitude, base_longitude, month_of_travel, golf_ireland_member, number_of_golfers, number_of_golf_days, selected_courses, itinerary'
      )
      .eq('trip_id', tripId)
      .limit(1)

    if (error) {
      return NextResponse.json(
        { error: 'Unable to load trip', details: error.message },
        { status: 500 }
      )
    }

    const trip = data?.[0]

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      trip,
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to load trip' },
      { status: 500 }
    )
  }
}