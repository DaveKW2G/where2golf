import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import publicPages from './sitemap-pages.json'

// New course uploads appear on the next sitemap request.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://guestplaygolf.com'
  const supabase = await createClient()
  const entries: MetadataRoute.Sitemap = publicPages.map((route) => ({
    url: route === '/' ? baseUrl : `${baseUrl}${route}`,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : ['/ireland', '/switzerland'].includes(route) ? 0.9 : 0.7,
  }))
  // Paginate below the database limit; fail rather than serve incomplete results.
  const pageSize = 300
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from('courses')
      .select('id, updated_at')
      .order('id', { ascending: true })
      .range(offset, offset + pageSize - 1)
    if (error || !data) throw new Error('Unable to load courses for sitemap')
    for (const course of data) {
      const modified = course.updated_at ? new Date(course.updated_at) : undefined
      entries.push({
        url: `${baseUrl}/courses/${encodeURIComponent(String(course.id))}`,
        ...(modified && !Number.isNaN(modified.getTime()) ? { lastModified: modified } : {}),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
    if (data.length < pageSize) break
  }
  return entries
}
