import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Post } from '@/payload-types'
import { allSlugs, findBySlug, getSettings } from '@/lib/payload'
import { metaFrom, siteUrl } from '@/components/CmsPage'
import { Buttons, JsonLd } from '@/components/ui'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => allSlugs('posts')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await findBySlug<Post>('posts', slug)
  return p ? metaFrom(p.seo, `${p.title} | Domands Creative`, `/insights/${slug}/`) : {}
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [p, settings] = await Promise.all([findBySlug<Post>('posts', slug), getSettings()])
  if (!p || p._status !== 'published') notFound()
  const author = typeof p.author === 'object' ? p.author : null
  const service = typeof p.service === 'object' ? p.service : null

  return (
    <div className="themed" style={service?.theme ? ({ ['--main' as string]: service.theme.main, ['--surface' as string]: service.theme.surface } as React.CSSProperties) : undefined}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: p.title,
          datePublished: p.publishedAt,
          dateModified: p.updatedAt,
          ...(author ? { author: { '@type': 'Person', name: author.name, url: `${siteUrl()}/about/${author.slug}/` } } : {}),
          publisher: { '@type': 'Organization', name: 'Domands Creative' },
        }}
      />
      <article>
        <section className="hero">
          <div className="container narrow hero-inner">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link> / <Link href="/insights/">Insights</Link>
            </nav>
            {service && (
              <Link href={`/${service.slug}/`} className="tag">
                {service.title}
              </Link>
            )}
            <h1>{p.title}</h1>
            {p.answer && <p className="hero-sub">{p.answer}</p>}
            {author && (
              <p className="byline">
                By <Link href={`/about/${author.slug}/`}>{author.name}</Link>
                {p.publishedAt && <> · {new Date(p.publishedAt).toLocaleDateString('en-KE', { dateStyle: 'medium' })}</>}
              </p>
            )}
          </div>
        </section>
        <section className="section">
          <div className="container narrow prose article">{p.body && <RichText data={p.body} />}</div>
        </section>
      </article>
      {service && (
        <section className="section tinted">
          <div className="container narrow">
            <h2>Need help with this?</h2>
            <p>
              See our <Link href={`/${service.slug}/`}>{service.title.toLowerCase()} packages and prices</Link>, from {service.fromPrice}.
            </p>
          </div>
        </section>
      )}
      <section className="section cta-band">
        <div className="container">
          <h2>Not sure what to fix first?</h2>
          <p className="lead">Take the 3-minute Digital Health Check, or chat with us on WhatsApp.</p>
          <Buttons buttons={[{ action: 'quiz', label: 'Take the 3-minute check' }, { action: 'whatsapp' }]} settings={settings} size="lg" />
        </div>
      </section>
    </div>
  )
}
