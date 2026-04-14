import { createClient } from '../../lib/supabase/server'
import CourseMap from '../../components/CourseMap'

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

async function geocodePlace(place: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        `${place}, Switzerland`
      )}`,
      {
        headers: {
          'User-Agent': 'GuestPlayGolf/1.0',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) return null

    const data = await response.json()

    if (!data || data.length === 0) return null

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    }
  } catch {
    return null
  }
}

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<any>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let userLat = params.lat ? Number(params.lat) : null
  let userLng = params.lng ? Number(params.lng) : null
  const radius = params.radius ? Number(params.radius) : null

  if ((userLat == null || userLng == null) && params.where) {
    const geocoded = await geocodePlace(params.where)
    if (geocoded) {
      userLat = geocoded.lat
      userLng = geocoded.lng
    }
  }

  const selectedHandicap =
    params.handicap && params.handicap !== 'N/A'
      ? Number(params.handicap)
      : null

  const zurichWeekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'Europe/Zurich',
  }).format(new Date())

  const isWeekendToday = zurichWeekday === 'Sat' || zurichWeekday === 'Sun'

  let query = supabase.from('courses').select('*')

  if (params.search) {
    query = query.ilike('search_text', `%${params.search.toLowerCase()}%`)
  }

  if (params.today === 'true') {
    query = query.in(
      'independent_guest_days',
      isWeekendToday ? ['Weekend', 'Everyday'] : ['Weekdays', 'Everyday']
    )
  }

  if (params.region) query = query.eq('region', params.region)

  if (params.guestPlay === 'Weekend') {
    query = query.in('independent_guest_days', ['Weekend', 'Everyday'])
  } else if (params.guestPlay === 'Weekdays') {
    query = query.in('independent_guest_days', ['Weekdays', 'Everyday'])
  } else if (params.guestPlay === 'Everyday') {
    query = query.eq('independent_guest_days', 'Everyday')
  }

  if (params.holes) query = query.eq('holes', Number(params.holes))
  if (params.season) query = query.eq('season', params.season)

  if (params.handicap === 'N/A') {
    query = query.eq('handicap_required', false)
  } else if (selectedHandicap != null && !Number.isNaN(selectedHandicap)) {
    query = query
      .not('max_handicap', 'is', null)
      .gte('max_handicap', selectedHandicap)
  }

  if (params.price) query = query.eq('price_range', params.price)

  const { data: courses } = await query

  let filteredCourses = courses || []

  if (params.handicap === 'N/A') {
    filteredCourses = filteredCourses.filter(
      (course: any) => course.handicap_required === false
    )
  }

  if (selectedHandicap != null && !Number.isNaN(selectedHandicap)) {
    filteredCourses = filteredCourses.filter((course: any) => {
      const maxHandicap =
        typeof course.max_handicap === 'number'
          ? course.max_handicap
          : Number(course.max_handicap)

      return !Number.isNaN(maxHandicap) && maxHandicap >= selectedHandicap
    })
  }

  if (filteredCourses.length > 0 && userLat != null && userLng != null) {
    filteredCourses = filteredCourses.map((course: any) => {
      let distance: number | undefined

      if (course.latitude != null && course.longitude != null) {
        distance = getDistanceKm(
          userLat,
          userLng,
          course.latitude,
          course.longitude
        )
      }

      return { ...course, distance }
    })

    if (radius && !Number.isNaN(radius)) {
      filteredCourses = filteredCourses.filter(
        (c: any) => c.distance != null && c.distance <= radius
      )
    }
  }

  return (
    <div className="w-full h-screen">
      <CourseMap courses={filteredCourses} />
    </div>
  )
}