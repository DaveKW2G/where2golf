import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type SearchCourse = {
  id: number
  course_name: string
  town?: string | null
  region?: string | null
  holes?: number | null
  independent_guest_days?: string | null
  price_range?: string | null
  course_type?: string | null
  course_image?: string | null
  latitude?: number | null
  longitude?: number | null
  max_handicap?: number | string | null
}

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

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const tripId = searchParams.get('tripId')?.trim()
    const query = searchParams.get('q')?.trim().toLowerCase().slice(0, 80) || ''

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 })
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

    const { data, error } = await supabase
      .from('courses')
      .select(
        'id, course_name, town, region, holes, independent_guest_days, price_range, course_type, course_image, latitude, longitude, max_handicap',
      )
      .order('course_name', { ascending: true })
      .range(0, 499)

    if (error) {
      return NextResponse.json(
        { error: 'Unable to search courses', details: error.message },
        { status: 500 },
      )
    }

    const trip = tripRows[0]
    const selectedIds = new Set(
      (Array.isArray(trip.selected_courses) ? trip.selected_courses : []).map(
        (course: { id?: unknown }) => Number(course.id),
      ),
    )
    const baseLatitude = Number(trip.base_latitude)
    const baseLongitude = Number(trip.base_longitude)
    const hasBase = !Number.isNaN(baseLatitude) && !Number.isNaN(baseLongitude)

    const courses = ((data || []) as SearchCourse[])
      .filter((course) => !selectedIds.has(Number(course.id)))
      .map((course) => {
        const courseLatitude = Number(course.latitude)
        const courseLongitude = Number(course.longitude)
        const distance =
          hasBase &&
          !Number.isNaN(courseLatitude) &&
          !Number.isNaN(courseLongitude)
            ? getDistanceKm(
                baseLatitude,
                baseLongitude,
                courseLatitude,
                courseLongitude,
              )
            : null
        const searchText = [course.course_name, course.town, course.region]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return {
          ...course,
          distance,
          matches: !query || searchText.includes(query),
          nameStartsWith: Boolean(
            query && course.course_name?.toLowerCase().startsWith(query),
          ),
        }
      })
      .filter((course) => course.matches)
      .sort((left, right) => {
        if (left.nameStartsWith !== right.nameStartsWith) {
          return left.nameStartsWith ? -1 : 1
        }

        if (left.distance !== null && right.distance !== null) {
          return left.distance - right.distance
        }

        if (left.distance !== null) return -1
        if (right.distance !== null) return 1
        return left.course_name.localeCompare(right.course_name)
      })
      .slice(0, 12)
      .map(({ matches, nameStartsWith, ...course }) => {
        void matches
        void nameStartsWith
        return course
      })

    return NextResponse.json({ courses })
  } catch {
    return NextResponse.json(
      { error: 'Unable to search courses' },
      { status: 500 },
    )
  }
}
