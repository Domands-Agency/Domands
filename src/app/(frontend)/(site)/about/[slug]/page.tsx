import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Founder } from '@/payload-types'
import { allSlugs, findBySlug, getPayloadClient, getSettings } from '@/lib/payload'
import { metaFrom, siteUrl } from '@/components/CmsPage'
import { Inline, Prose } from '@/components/Prose'
import { Button, JsonLd } from '@/components/ui'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => allSlugs('founders')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const f = await findBySlug<Founder>('founders', slug)
  return f ? metaFrom(f.seo, `${f.name}, ${f.role || 'Founder'} at Domands Creative`, `/about/${slug}/`) : {}
}

export default async function FounderPage({ params }: Props) {
  const { slug } = await params
  const [f, settings] = await Promise.all([findBySlug<Founder>('founders', slug), getSettings()])
  if (!f) notFound()
  const payload = await getPayloadClient()
  const posts = await payload.find({ collection: 'posts', where: { author: { equals: f.id }, _status: { equals: 'published' } }, limit: 10, depth: 0 })

  return (
    <div className="themed">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: f.name,
          jobTitle: f.role,
          worksFor: { '@type': 'Organization', name: 'Domands Creative', url: siteUrl() },
          url: `${siteUrl()}/about/${f.slug}/`,
          ...(f.linkedin ? { sameAs: [f.linkedin] } : {}),
        }}
      />
      <section className="hero">
        <div className="container hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/about/">About</Link> / <span><Inline text={f.name} /></span>
          </nav>
          <h1>
            <Inline text={f.name} />, <Inline text={f.role || 'Founder'} /> at Domands Creative
          </h1>
          <Prose text={f.intro} className="hero-sub" />
        </div>
      </section>
      <section className="section">
        <div className="container two-col">
          <div>
            <h2>Experience</h2>
            <Prose text={f.experience} />
          </div>
          <div>
            <h2>What I lead</h2>
            <ul className="link-list">
              {(f.services || []).map((s) =>
                typeof s === 'object' ? (
                  <li key={s.id}>
                    <Link href={`/${s.slug}/`}>{s.title}</Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>
      </section>
      <section className="section tinted">
        <div className="container narrow">
          <h2>Articles by <Inline text={f.name} /></h2>
          {posts.docs.length ? (
            <ul className="link-list">
              {posts.docs.map((p) => (
                <li key={p.id}>
                  <Link href={`/insights/${p.slug}/`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">Articles will appear here as they are published.</p>
          )}
        </div>
      </section>
      <section className="section cta-band">
        <div className="container">
          <h2>Talk to <Inline text={f.name} /></h2>
          <div className="btn-row">
            {f.bookingUrl ? (
              <Button data={{ action: 'link', href: f.bookingUrl, label: 'Book a call' }} settings={settings} size="lg" />
            ) : (
              <Button data={{ action: 'call' }} settings={settings} size="lg" />
            )}
            {f.linkedin && <Button data={{ action: 'link', href: f.linkedin, label: 'LinkedIn' }} settings={settings} size="lg" />}
          </div>
        </div>
      </section>
    </div>
  )
}
