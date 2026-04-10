import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/AdminDashboard/',
          '/Participants/',
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
    ],
    sitemap: 'https://aakar.live/sitemap.xml',
  }
}
