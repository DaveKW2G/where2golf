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

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<any>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const userLat = params.lat ? Number(params.lat) : null
  const userLng = params.lng ? Number(params.lng) : null
  const radius = params.radius ? Number(params.radius) : null

  let query = supabase.from('courses').select('*')

  if (params.region) query = query.eq('region', params.region)
  if (params.holes) query = query.eq('holes', Number(params.holes))
  if (params.guestPlay) query = query.eq('independent_guest_days', params.guestPlay)
  if (params.season) query = query.eq('season', params.season)
  if (params.handicap) query = query.lte('max_handicap', Number(params.handicap))
  if (params.price) query = query.eq('price_range', params.price)

  if (params.today === 'true') {
    query = query.in('independent_guest_days', [
      'Everyday',
      'Weekdays',
      'Weekend',
    ])
  }

  const { data: courses } = await query

  let filteredCourses = courses || []

  // ✅ ADD THIS — SAME AS RESULTS
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