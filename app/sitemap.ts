import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://guestplaygolf.com'

  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('id, updated_at')

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/switzerland`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/golf-near-zurich`,
      lastModified: new Date(),
    },
  ]

  const regions = [
    'ag','ai','ar','be','bl','bs','fr','ge','gl','gr','ju',
    'lu','ne','nw','ow','sg','sh','so','sz','tg','ti','ur',
    'vd','vs','zg','zh'
  ]

  const regionPages = regions.map((region) => ({
    url: `${baseUrl}/switzerland/${region}`,
    lastModified: new Date(),
  }))

  const coursePages =
    courses?.map((course) => ({
      url: `${baseUrl}/courses/${course.id}`,
      lastModified: course.updated_at
        ? new Date(course.updated_at)
        : new Date(),
    })) || []

  return [
    ...staticPages,
    ...regionPages,
    ...coursePages,
  ]
}