import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Search | Domands Creative', robots: { index: false } }

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const term = q.trim().slice(0, 80)
  const payload = await getPayloadClient()
  const results: { href: string; title: string; kind: string }[] = []
  if (term) {
    const [services, pages, posts, industries] = await Promise.all([
      payload.find({ collection: 'services', where: { or: [{ title: { like: term } }, { cardLine: { like: term } }] }, limit: 12, depth: 0 }),
      payload.find({ collection: 'pages', where: { title: { like: term } }, limit: 12, depth: 0 }),
      payload.find({ collection: 'posts', where: { and: [{ title: { like: term } }, { _status: { equals: 'published' } }] }, limit: 12, depth: 0 }),
      payload.find({ collection: 'industries', where: { title: { like: term } }, limit: 12, depth: 0 }),
    ])
    services.docs.forEach((d) => results.push({ href: `/${d.slug}/`, title: d.title, kind: 'Service' }))
    industries.docs.forEach((d) => results.push({ href: `/industries/${d.slug}/`, title: d.title, kind: 'Industry' }))
    pages.docs.forEach((d) => results.push({ href: d.slug === 'home' ? '/' : `/${d.slug}/`, title: d.title, kind: 'Page' }))
    posts.docs.forEach((d) => results.push({ href: `/insights/${d.slug}/`, title: d.title, kind: 'Article' }))
  }
  return (
    <section className="hero">
      <div className="container narrow hero-inner">
        <h1>Search</h1>
        <form action="/search/" method="get" className="search-404" role="search">
          <label htmlFor="q" className="sr-only">Search services and articles</label>
          <input id="q" name="q" type="search" defaultValue={term} placeholder="Search services and articles" />
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
        {term && (
          <>
            <p>{results.length ? `${results.length} result${results.length > 1 ? 's' : ''} for “${term}”` : `Nothing found for “${term}”. Try “website”, “WhatsApp” or “SEO”.`}</p>
            <ul className="link-list">
              {results.map((r) => (
                <li key={r.href}>
                  <Link href={r.href}>{r.title}</Link> <small>· {r.kind}</small>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}
