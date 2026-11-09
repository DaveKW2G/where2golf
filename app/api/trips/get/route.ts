import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function normaliseTripCode(value: string | null) {
  const cleanCode = value?.trim().toUpperCase().replace(/\s+/g, '')

  if (!cleanCode) return null

  if (cleanCode.startsWith('GPG-')) {
    return cleanCode
  }

  if (cleanCode.startsWith('GPG')) {
    return `GPG-${cleanCode.replace(/^GPG-?/, '')}`
  }

  return `GPG-${cleanCode}`
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const tripId = searchParams.get('tripId')?.trim()
    const tripCode = normaliseTripCode(searchParams.get('tripCode'))

    if (!tripId && !tripCode) {
      return NextResponse.json(
        { error: 'Trip ID or trip code is required' },
        { status: 400 },
      )
    }

    let resolvedTripId = tripId
    if (!resolvedTripId && tripCode) {
      const { data: tripIdFromCode, error: codeError } = await supabase.rpc('planner_v2_trip_id_from_code', { p_trip_code: tripCode })
      if (codeError) return NextResponse.json({ error: 'Unable to load trip', details: codeError.message }, { status: 500 })
      resolvedTripId = tripIdFromCode || null
    }

    const { data, error } = resolvedTripId
      ? await supabase.rpc('planner_v2_get_trip', { p_trip_id: resolvedTripId })
      : { data: null, error: null }

    if (error) {
      return NextResponse.json(
        { error: 'Unable to load trip', details: error.message },
        { status: 500 },
      )
    }

    const trip = data

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      trip,
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to load trip' },
      { status: 500 },
    )
  }
}
