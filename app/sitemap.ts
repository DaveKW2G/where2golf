import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://guestplaygolf.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/switzerland`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/region?region=ZH`,
      lastModified: new Date(),
    },
  ]
}