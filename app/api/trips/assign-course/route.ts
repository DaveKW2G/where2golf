import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const tripId = body.trip_id
    const courseId = body.course_id
    const assignedDay = body.assigned_day
    const assignedSlot = body.assigned_slot

    if (!tripId || !courseId) {
      return NextResponse.json(
        { error: 'Trip ID and course ID are required' },
        { status: 400 }
      )
    }

    const { data: trips, error: readError } = await supabase
      .from('trips')
      .select('selected_courses')
      .eq('trip_id', tripId)
      .limit(1)

    if (readError) {
      return NextResponse.json(
        { error: 'Unable to read trip', details: readError.message },
        { status: 500 }
      )
    }

    const trip = trips?.[0]

    const existingCourses = Array.isArray(trip?.selected_courses)
      ? trip.selected_courses
      : []

    const updatedCourses = existingCourses.map((course: any) => {
      if (course.id !== courseId) return course

      return {
        ...course,
        assigned_day: assignedDay || null,
        assigned_slot: assignedSlot || null,
      }
    })

    const { error: updateError } = await supabase
      .from('trips')
      .update({
        selected_courses: updatedCourses,
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
      selected_courses: updatedCourses,
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to assign course' },
      { status: 500 }
    )
  }
}