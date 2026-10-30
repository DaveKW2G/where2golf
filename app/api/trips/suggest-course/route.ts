import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radiusKm = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2

  return 2 * radiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function cleanFirstName(value: unknown) {
  return String(value || '')
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 30)
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const tripId = String(body.trip_id || '').trim()
    const courseId = Number(body.course_id)
    const participantId = String(body.participant_id || '').trim().slice(0, 400)
    const participantName = cleanFirstName(body.participant_name)

    if (!tripId || !Number.isInteger(courseId) || !participantId || !participantName) {
      return NextResponse.json(
        { error: 'Trip, course and participant are required' },
        { status: 400 },
      )
    }

    const { data: tripRows, error: tripError } = await supabase
      .from('trips')
      .select('selected_courses, base_latitude, base_longitude')
      .eq('trip_id', tripId)
      .limit(1)

    if (tripError || !tripRows?.[0]) {
      return NextResponse.json(
        { error: 'Unable to load the trip', details: tripError?.message },
        { status: tripError ? 500 : 404 },
      )
    }

    const trip = tripRows[0]
    const existingCourses = Array.isArray(trip.selected_courses)
      ? trip.selected_courses
      : []
    const existingCourse = existingCourses.find(
      (course: { id?: unknown }) => Number(course.id) === courseId,
    )

    if (existingCourse) {
      return NextResponse.json({
        success: true,
        already_added: true,
        selected_courses: existingCourses,
        course: existingCourse,
      })
    }

    const { data: courseRows, error: courseError } = await supabase
      .from('courses')
      .select(
        'id, course_name, town, region, holes, independent_guest_days, price_range, course_type, course_image, latitude, longitude, max_handicap',
      )
      .eq('id', courseId)
      .limit(1)

    if (courseError || !courseRows?.[0]) {
      return NextResponse.json(
        { error: 'Unable to load the course', details: courseError?.message },
        { status: courseError ? 500 : 404 },
      )
    }

    const course = courseRows[0]
    const baseLatitude = Number(trip.base_latitude)
    const baseLongitude = Number(trip.base_longitude)
    const courseLatitude = Number(course.latitude)
    const courseLongitude = Number(course.longitude)
    const distance =
      !Number.isNaN(baseLatitude) &&
      !Number.isNaN(baseLongitude) &&
      !Number.isNaN(courseLatitude) &&
      !Number.isNaN(courseLongitude)
        ? getDistanceKm(
            baseLatitude,
            baseLongitude,
            courseLatitude,
            courseLongitude,
          )
        : null

    const suggestedCourse = {
      ...course,
      distance,
      assigned_day: null,
      assigned_slot: null,
      suggested_by_name: participantName,
      suggested_by_participant_id: participantId,
      suggested_at: new Date().toISOString(),
      suggestion_source: 'participant',
    }
    const nextCourses = [...existingCourses, suggestedCourse]

    const { error: updateError } = await supabase
      .from('trips')
      .update({ selected_courses: nextCourses })
      .eq('trip_id', tripId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Unable to add this suggestion', details: updateError.message },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      selected_courses: nextCourses,
      course: suggestedCourse,
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to suggest this course' },
      { status: 500 },
    )
  }
}
