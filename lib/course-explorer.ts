export const priceBands = [
  { value: '€', name: 'Great Value', range: '€50 or less', description: 'Value golf at the lowest visitor price band.' },
  { value: '€€', name: 'Value', range: 'From €50 to €100', description: 'More visitor options within a modest budget.' },
  { value: '€€€', name: 'Mid Range', range: 'From €100 to €200', description: 'Mid-range visitor green fees.' },
  { value: '€€€€', name: 'Premium', range: 'From €200 to €300', description: 'Premium visitor green fees.' },
  { value: '€€€€€', name: 'Bucket List', range: 'Over €300', description: 'The highest visitor price band.' },
]
export type Course = {
  id: number; country?: string | null; course_name: string; town?: string | null;
  region?: string | null; holes?: number | null; independent_guest_days?: string | null;
  season?: string | null; price_range?: string | null; course_image?: string | null;
  handicap_required?: string | boolean | null; max_handicap?: number | null;
  latitude?: number | null; longitude?: number | null; course_type?: string | null;
}
export type Filters = { price: string; courseType: string; holes: string; county: string; when: string; search: string; radius: string }
export function hasCoordinates(course: Course) {
  return course.latitude != null && course.longitude != null && Number.isFinite(Number(course.latitude)) && Number.isFinite(Number(course.longitude)) && Math.abs(Number(course.latitude)) <= 90 && Math.abs(Number(course.longitude)) <= 180
}
export function distanceKm(course: Course, origin: [number, number]) {
  if (!hasCoordinates(course)) return Infinity
  const rad = Math.PI / 180
  const a = Math.sin((Number(course.latitude) - origin[0]) * rad / 2) ** 2 + Math.cos(origin[0] * rad) * Math.cos(Number(course.latitude) * rad) * Math.sin((Number(course.longitude) - origin[1]) * rad / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)))
}
export function matchesWhen(access: string | null | undefined, when: string) {
  const value = access?.trim().toLowerCase() || ''
  if (!when) return true
  if (when === 'Limited Access') return ['limited','limited access'].includes(value)
  if (when === 'Weekdays') return ['everyday', 'weekdays'].includes(value)
  if (when === 'Weekend') return ['everyday', 'weekend', 'weekends'].includes(value)
  return value === when.toLowerCase()
}
export function filterCourses(courses: Course[], filters: Filters, origin: [number, number] | null, sort: string) {
  const same = (a: string | null | undefined, b: string) => !b || a?.trim().toLowerCase() === b.toLowerCase()
  const query = filters.search.trim().toLowerCase()
  const result = courses.filter(c => same(c.price_range, filters.price) && same(c.course_type, filters.courseType) && same(c.region, filters.county) && (!filters.holes || String(c.holes) === filters.holes) && matchesWhen(c.independent_guest_days, filters.when) && (!query || [c.course_name,c.town,c.region].join(' ').toLowerCase().includes(query)) && (!filters.radius || !origin || distanceKm(c, origin) <= Number(filters.radius)))
  const band = (c: Course) => priceBands.findIndex(b => b.value === c.price_range?.trim())
  return result.sort((a,b) => {
    if (sort === 'distance' && origin) { const difference = distanceKm(a,origin) - distanceKm(b,origin); if (!Number.isNaN(difference) && difference !== 0) return difference }
    if (sort === 'price') { const difference = (band(a) < 0 ? 99 : band(a)) - (band(b) < 0 ? 99 : band(b)); if (difference) return difference }
    return a.course_name.localeCompare(b.course_name)
  })
}
