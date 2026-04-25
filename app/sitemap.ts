import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://guestplaygolf.com'

  const regions = [
    'ag','ai','ar','be','bl','bs','fr','ge','gl','gr','ju',
    'lu','ne','nw','ow','sg','sh','so','sz','tg','ti','ur',
    'vd','vs','zg','zh'
  ]

  const regionUrls = regions.map((region) => ({
    url: `${baseUrl}/switzerland/${region}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/switzerland`,
      lastModified: new Date(),
    },
    ...regionUrls,
  ]
}