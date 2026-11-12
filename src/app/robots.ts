import type { MetadataRoute } from 'next'

/** AI search crawlers are allowed on purpose (AEO). Ad pages and the CMS are kept out. */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/go/', '/thank-you/', '/search/'] }],
    sitemap: `${base}/sitemap.xml`,
  }
}
