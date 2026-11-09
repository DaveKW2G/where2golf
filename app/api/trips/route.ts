import { NextResponse } from 'next/server'
import { createHash, randomBytes } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'

function generateTripId() {
  const randomPart = randomBytes(16).toString('hex').toUpperCase()
  return `GPG-${randomPart}`
}

function generateTripCode() {
  const randomPart = randomBytes(8).toString('hex').toUpperCase()
  return randomPart
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
    const tripCode = generateTripCode()
    const country = ['Ireland', 'Switzerland', 'Portugal'].includes(body.country)
      ? body.country
      : 'Ireland'
    const ownerToken = typeof body.owner_token === 'string' ? body.owner_token : ''
    const ownerTokenHash = ownerToken
      ? createHash('sha256').update(ownerToken).digest('hex')
      : null

    if (!ownerTokenHash || !body.planner_user_id || String(body.planner_user_id).length > 160 || !body.base_location || !Number.isFinite(Number(body.base_latitude)) || !Number.isFinite(Number(body.base_longitude))) {
      return NextResponse.json({ error: 'A valid trip base and organiser token are required' }, { status: 400 })
    }

    const { error } = await supabase.rpc('planner_v2_create_trip', {
      p_trip_id: tripId,
      p_trip_code: tripCode,
      p_trip_name: String(body.trip_name || `${body.base_location} Golf Trip`).slice(0, 100),
      p_base_location: String(body.base_location).slice(0, 120),
      p_base_latitude: Number(body.base_latitude),
      p_base_longitude: Number(body.base_longitude),
      p_country: country,
      p_courses_wanted: Number.isInteger(body.courses_wanted) && body.courses_wanted > 0 ? Math.min(body.courses_wanted, 14) : null,
      p_owner_token_hash: ownerTokenHash,
      p_planner_user_id: String(body.planner_user_id || '').slice(0, 160),
    })

    if (error) {
      return NextResponse.json(
        { error: 'Unable to create trip', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      trip_id: tripId,
      trip_code: tripCode,
      country,
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to create trip' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.trip_id) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 })
    }

    const token = typeof body.owner_token === 'string' ? body.owner_token : ''
    if (!token || (typeof body.trip_name !== 'string' && !('number_of_golfers' in body))) {
      return NextResponse.json({ error: 'Organiser token and trip details are required' }, { status: 400 })
    }
    const ownerHash = createHash('sha256').update(token).digest('hex')
    const { data, error } = await supabase.rpc('planner_v2_update_trip', {
      p_trip_id: body.trip_id,
      p_trip_name: typeof body.trip_name === 'string' ? body.trip_name.trim().slice(0, 100) : null,
      p_number_of_golfers: Number.isInteger(body.number_of_golfers) ? body.number_of_golfers : null,
      p_owner_token_hash: ownerHash,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Unable to update trip', details: error.message },
        { status: 500 }
      )
    }

    if (!data) return NextResponse.json({ error: 'Only the organiser can update trip details' }, { status: 403 })
    return NextResponse.json({ success: true, trip_id: body.trip_id })
  } catch {
    return NextResponse.json(
      { error: 'Unable to update trip' },
      { status: 500 }
    )
  }
}
