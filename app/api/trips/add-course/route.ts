import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const tripId = body.trip_id
    const course = body.course

    if (!tripId || !course) {
      return NextResponse.json(
        { error: 'Trip ID and course are required' },
        { status: 400 }
      )
    }

    const { data: trip, error: readError } = await supabase
      .from('trips')
      .select('selected_courses')
      .eq('trip_id', tripId)
      .single()

    if (readError) {
      return NextResponse.json(
        { error: 'Unable to read trip', details: readError.message },
        { status: 500 }
      )
    }

    const existingCourses = Array.isArray(trip?.selected_courses)
      ? trip.selected_courses
      : []

    const filteredCourses = existingCourses.filter(
      (existingCourse: any) => existingCourse.id !== course.id
    )

    const nextCourses = [...filteredCourses, course]

    const { error: updateError } = await supabase
      .from('trips')
      .update({
        selected_courses: nextCourses,
      })
      .eq('trip_id', tripId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Unable to update trip', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      selected_courses: nextCourses,
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to add course to trip' },
      { status: 500 }
    )
  }
}