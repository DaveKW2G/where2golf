import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function generateTripId() {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `GPG-${randomPart}`
}

export async function GET() {
  return NextResponse.json({
    status: 'Trip API is working',
  })
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const tripId = generateTripId()

    const { error } = await supabase.from('trips').insert({
      trip_id: tripId,
      trip_name: body.trip_name,
      base_location: body.base_location,
      base_latitude: body.base_latitude,
      base_longitude: body.base_longitude,
      month_of_travel: body.month_of_travel,
      golf_ireland_member: body.golf_ireland_member,
      number_of_golfers: body.number_of_golfers,
      number_of_golf_days: body.number_of_golf_days,
    })

    if (error) {
      console.error('Trip creation error:', error)

      return NextResponse.json(
        {
          error: 'Unable to create trip',
          details: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      trip_id: tripId,
    })
  } catch (error) {
    console.error('Trip creation unexpected error:', error)

    return NextResponse.json(
      { error: 'Unable to create trip' },
      { status: 500 }
    )
  }
}