import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 3600

/** Every indexable page. Ad pages (/go/), Thank you and noindex pages are left out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const payload = await getPayload({ config })
  const q = { limit: 1000, depth: 0, pagination: false } as const
  const [pages, services, industries, founders, posts, cases] = await Promise.all([
    payload.find({ collection: 'pages', ...q }),
    payload.find({ collection: 'services', ...q }),
    payload.find({ collection: 'industries', ...q }),
    payload.find({ collection: 'founders', ...q }),
    payload.find({ collection: 'posts', ...q, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'case-studies', ...q, where: { _status: { equals: 'published' } } }),
  ])
  const entry = (path: string, updatedAt?: string, priority = 0.6) => ({
    url: base + path,
    lastModified: updatedAt ? new Date(updatedAt) : undefined,
    priority,
  })
  return [
    ...pages.docs.filter((p) => !p.seo?.noindex).map((p) => entry(p.slug === 'home' ? '/' : `/${p.slug}/`, p.updatedAt, p.slug === 'home' ? 1 : 0.7)),
    ...services.docs.map((s) => entry(`/${s.slug}/`, s.updatedAt, 0.9)),
    ...industries.docs.map((s) => entry(`/industries/${s.slug}/`, s.updatedAt, 0.7)),
    ...founders.docs.map((s) => entry(`/about/${s.slug}/`, s.updatedAt, 0.5)),
    ...posts.docs.map((s) => entry(`/insights/${s.slug}/`, s.updatedAt, 0.6)),
    ...cases.docs.map((s) => entry(`/work/${s.slug}/`, s.updatedAt, 0.6)),
    entry('/quiz/', undefined, 0.7),
  ]
}
