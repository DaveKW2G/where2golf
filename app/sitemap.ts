import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://guestplaygolf.com'

  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('id, updated_at')

  const now = new Date()

  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/switzerland`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ireland`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },

    {
      url: `${baseUrl}/golf-near-zurich`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-geneva`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-basel`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-lausanne`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-lucerne`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-bern`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-st-gallen`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-lugano`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-winterthur`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-in-the-swiss-alps`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },

    {
      url: `${baseUrl}/golf-near-dublin`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-cork`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-galway`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/golf-near-belfast`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  const regions = [
    'ag','ai','ar','be','bl','bs','fr','ge','gl','gr','ju',
    'lu','ne','nw','ow','sg','sh','so','sz','tg','ti','ur',
    'vd','vs','zg','zh'
  ]

  const regionPages = regions.map((region) => ({
    url: `${baseUrl}/switzerland/${region}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const coursePages =
    courses?.map((course) => ({
      url: `${baseUrl}/courses/${course.id}`,
      lastModified: course.updated_at
        ? new Date(course.updated_at)
        : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []

  return [
    ...staticPages,
    ...regionPages,
    ...coursePages,
  ]
}