import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const tripId = body.trip_id
    const course = body.course

    if (!tripId || !course?.id) {
      return NextResponse.json(
        { error: 'Trip ID and course are required' },
        { status: 400 }
      )
    }

    const { data: trips, error: tripError } = await supabase
      .from('trips')
      .select('selected_courses, base_latitude, base_longitude')
      .eq('trip_id', tripId)
      .limit(1)

    if (tripError) {
      return NextResponse.json(
        { error: 'Unable to read trip', details: tripError.message },
        { status: 500 }
      )
    }

    const trip = trips?.[0]

    const { data: fullCourse, error: courseError } = await supabase
      .from('courses')
      .select(
        'id, course_name, town, region, holes, independent_guest_days, price_range, course_type, course_image, latitude, longitude, max_handicap'
      )
      .eq('id', course.id)
      .limit(1)

    if (courseError) {
      return NextResponse.json(
        { error: 'Unable to read course', details: courseError.message },
        { status: 500 }
      )
    }

    const courseRecord = fullCourse?.[0]

    const baseLatitude = Number(trip?.base_latitude)
    const baseLongitude = Number(trip?.base_longitude)
    const courseLatitude = Number(courseRecord?.latitude)
    const courseLongitude = Number(courseRecord?.longitude)

    const distance =
      !Number.isNaN(baseLatitude) &&
      !Number.isNaN(baseLongitude) &&
      !Number.isNaN(courseLatitude) &&
      !Number.isNaN(courseLongitude)
        ? getDistanceKm(
            baseLatitude,
            baseLongitude,
            courseLatitude,
            courseLongitude
          )
        : course.distance

    const cleanCourse = {
      id: courseRecord?.id || course.id,
      course_name: courseRecord?.course_name?.trim() || course.course_name,
      town: courseRecord?.town?.trim() || course.town,
      region: courseRecord?.region?.trim() || course.region,
      holes: courseRecord?.holes || course.holes,
      independent_guest_days:
        courseRecord?.independent_guest_days?.trim() ||
        course.independent_guest_days,
      price_range: courseRecord?.price_range?.trim() || course.price_range,
      course_type: courseRecord?.course_type?.trim() || course.course_type,
      course_image: courseRecord?.course_image || course.course_image,
      latitude: courseRecord?.latitude || course.latitude,
      longitude: courseRecord?.longitude || course.longitude,
      distance,
      max_handicap: courseRecord?.max_handicap || course.max_handicap,
    }

    const existingCourses = Array.isArray(trip?.selected_courses)
      ? trip.selected_courses
      : []

    const filteredCourses = existingCourses.filter(
      (existingCourse: any) => existingCourse.id !== cleanCourse.id
    )

    const nextCourses = [...filteredCourses, cleanCourse]

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