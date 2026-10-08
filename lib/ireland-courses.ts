import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Course } from '@/lib/course-explorer'

export const getIrelandCourses = cache(async () => {
  const supabase = await createClient()
  const courses: Course[] = []
  for (let offset = 0; ; offset += 300) {
    const { data, error } = await supabase.from('courses').select('id, country, course_name, town, region, holes, independent_guest_days, season, price_range, course_image, handicap_required, max_handicap, latitude, longitude, course_type').eq('country', 'Ireland').order('id', { ascending: true }).range(offset, offset + 299)
    if (error || !data) return { courses: [] as Course[], error: true }
    courses.push(...data)
    if (data.length < 300) break
  }
  return { courses, error: false }
})
