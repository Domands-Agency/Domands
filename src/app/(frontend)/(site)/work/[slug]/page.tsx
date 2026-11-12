import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CaseStudy } from '@/payload-types'
import { allSlugs, findBySlug, getSettings } from '@/lib/payload'
import { metaFrom } from '@/components/CmsPage'
import { Prose } from '@/components/Prose'
import { Buttons, Headline } from '@/components/ui'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => allSlugs('case-studies')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = await findBySlug<CaseStudy>('case-studies', slug)
  return c ? metaFrom(c.seo, `${c.headline} | Domands Creative`, `/work/${slug}/`) : {}
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const [c, settings] = await Promise.all([findBySlug<CaseStudy>('case-studies', slug), getSettings()])
  if (!c || c._status !== 'published') notFound()
  const services = (c.services || []).filter((s) => typeof s === 'object')
  const img = typeof c.image === 'object' ? c.image : null

  return (
    <div className="themed">
      <section className="hero">
        <div className="container hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/work/">Our work</Link> / <span>{c.client}</span>
          </nav>
          <h1>
            <Headline text={c.headline} />
          </h1>
        </div>
      </section>
      {img?.url && (
        <div className="container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="case-image" src={img.url} alt={img.alt} />
        </div>
      )}
      <section className="section">
        <div className="container narrow article">
          <h2>The client</h2>
          <Prose text={c.about} />
          <h2>The problem</h2>
          <Prose text={c.problem} />
          <h2>What we did</h2>
          <Prose text={c.whatWeDid} />
          {services.length > 0 && (
            <p className="chips">
              {services.map((s) =>
                typeof s === 'object' ? (
                  <Link key={s.id} href={`/${s.slug}/`} className="tag">
                    {s.title}
                  </Link>
                ) : null,
              )}
            </p>
          )}
          <h2>The result</h2>
          <Prose text={c.result} />
          {c.quote?.text && (
            <blockquote className="quote">
              <p>“{c.quote.text}”</p>
              {c.quote.name && <cite>— {c.quote.name}</cite>}
            </blockquote>
          )}
        </div>
      </section>
      <section className="section cta-band">
        <div className="container">
          <h2>Want a result like this?</h2>
          <Buttons buttons={[{ action: 'whatsapp' }, { action: 'call' }]} settings={settings} size="lg" />
        </div>
      </section>
    </div>
  )
}
