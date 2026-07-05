import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const tripId = searchParams.get('tripId')
    const tripCode = searchParams.get('tripCode')?.trim().toUpperCase()

    if (!tripId && !tripCode) {
      return NextResponse.json(
        { error: 'Trip ID or trip code is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('trips')
      .select(
        'trip_id, trip_code, trip_name, base_location, base_latitude, base_longitude, month_of_travel, golf_ireland_member, number_of_golfers, number_of_golf_days, selected_courses, itinerary'
      )
      .limit(1)

    if (tripCode) {
      query = query.eq('trip_code', tripCode)
    } else if (tripId) {
      query = query.eq('trip_id', tripId)
    }

    const { data, error } = await query

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