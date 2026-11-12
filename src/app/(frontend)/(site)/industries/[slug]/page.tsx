import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Industry } from '@/payload-types'
import { allSlugs, findBySlug, getSettings } from '@/lib/payload'
import { metaFrom } from '@/components/CmsPage'
import { Inline, Prose } from '@/components/Prose'
import { Button, Buttons, Faqs, Headline, JsonLd, Proof } from '@/components/ui'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => allSlugs('industries')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ind = await findBySlug<Industry>('industries', slug)
  return ind ? metaFrom(ind.seo, ind.title, `/industries/${slug}/`) : {}
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params
  const [ind, settings] = await Promise.all([findBySlug<Industry>('industries', slug), getSettings()])
  if (!ind) notFound()
  const buttons = [{ action: 'whatsapp' as const }, { action: 'call' as const }]

  return (
    <div className="themed industry-page">
      {ind.faqs?.length ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: ind.faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
          }}
        />
      ) : null}
      <section className="hero">
        <div className="container hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/industries/">Industries</Link> / <span>{ind.title}</span>
          </nav>
          <h1>
            <Headline text={ind.hero.h1} />
          </h1>
          <Prose text={ind.hero.sub} className="hero-sub" />
          <Buttons buttons={buttons} settings={settings} size="lg" />
        </div>
      </section>

      {ind.problems?.length ? (
        <section className="section">
          <div className="container">
            <h2 className="section-title">The problems we solve</h2>
            <ul className="problem-list">
              {ind.problems.map((p, i) => (
                <li key={p.id || i}>{p.text}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {ind.services?.length ? (
        <section className="section tinted">
          <div className="container">
            <h2 className="section-title">{ind.servicesHeading || `Services for ${ind.title}`}</h2>
            <div className="card-grid cols-2">
              {ind.services.map((row, i) => {
                const svc = typeof row.service === 'object' ? row.service : null
                if (!svc) return null
                return (
                  <Link
                    key={row.id || i}
                    href={`/${svc.slug}/`}
                    className="card service-card"
                   
                  >
                    <span className="service-chip" aria-hidden="true" />
                    <h3>{svc.title}</h3>
                    <p>{row.text}</p>
                    <p className="card-meta">From {svc.fromPrice}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {ind.firstProject?.title && (
        <section className="section">
          <div className="container narrow">
            <div className="first-project">
              <p className="eyebrow">Typical first project</p>
              <h2>{ind.firstProject.title}</h2>
              <Prose text={ind.firstProject.text} />
              <Button data={{ action: 'whatsapp', label: 'Ask about this project', message: `Hi Domands, I'm interested in the ${ind.firstProject.title.replace(/[.,]?\s*from KES.*$/i, '')} for my business. Can we talk?` }} settings={settings} />
            </div>
          </div>
        </section>
      )}

      {ind.rules?.text && (
        <section className="section">
          <div className="container narrow">
            <h2>{ind.rules.heading || 'Rules we work within'}</h2>
            <Prose text={ind.rules.text} />
          </div>
        </section>
      )}

      {ind.proof && (
        <section className="section">
          <div className="container">
            <Proof text={ind.proof} />
          </div>
        </section>
      )}

      {ind.insights && (
        <section className="section tinted">
          <div className="container narrow">
            <h2>{ind.insightsHeading || `Insights for ${ind.title}`}</h2>
            <Prose text={ind.insights} />
            <p>
              Not sure where to start? <Link href="/quiz/">Take the 3-minute Digital Health Check</Link>.
            </p>
          </div>
        </section>
      )}

      {ind.faqs?.length ? (
        <section className="section">
          <div className="container narrow">
            <h2>FAQs</h2>
            <Faqs items={ind.faqs} />
          </div>
        </section>
      ) : null}

      <section className="section cta-band">
        <div className="container">
          <h2>
            <Inline text={ind.closing?.heading || "Let's talk about your business."} />
          </h2>
          {ind.closing?.line && <p className="lead">{ind.closing.line}</p>}
          <Buttons buttons={buttons} settings={settings} size="lg" />
        </div>
      </section>
    </div>
  )
}
