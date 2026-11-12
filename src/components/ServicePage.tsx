import Link from 'next/link'
import type { Service, SiteSetting } from '@/payload-types'
import { packageMessage } from '@/lib/links'
import { serviceFields } from '@/lib/forms'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { LeadForm } from './LeadForm'
import { Inline, Prose } from './Prose'
import { Button, Buttons, DataTable, Faqs, Headline, JsonLd, Proof, Steps } from './ui'

function priceToNumber(price?: string | null) {
  const m = price?.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/)
  return m ? Number(m[1]) : undefined
}

export function ServicePage({ service: s, settings, siteUrl }: { service: Service; settings: SiteSetting; siteUrl: string }) {
  const path = `/${s.slug}/`
  const packageOptions = (s.closing?.packageOptions || '')
    .split('/')
    .map((x) => x.trim())
    .filter(Boolean)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.title,
      description: s.seo?.description || s.cardLine,
      url: siteUrl + path,
      areaServed: { '@type': 'Country', name: 'Kenya' },
      provider: { '@type': 'Organization', name: 'Domands Creative', url: siteUrl },
      offers: (s.packages || []).map((p) => ({
        '@type': 'Offer',
        name: p.name,
        priceCurrency: 'KES',
        ...(priceToNumber(p.price) ? { price: priceToNumber(p.price) } : {}),
        description: p.for || undefined,
      })),
    },
    ...(s.faqs?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: s.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/\*\*|\[|\]/g, '') },
            })),
          },
        ]
      : []),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl + '/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: siteUrl + '/services/' },
        { '@type': 'ListItem', position: 3, name: s.title, item: siteUrl + path },
      ],
    },
  ]

  const jump = [
    s.packages?.length && { href: '#packages', label: s.hero.packagesButton?.replace(/^See /, '').replace(/^\w/, (c) => c.toUpperCase()) || 'Packages' },
    s.steps?.length && { href: '#how-it-works', label: 'How it works' },
    s.faqs?.length && { href: '#faqs', label: 'FAQs' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <div className="themed service-page">
      <JsonLd data={jsonLd} />
      <section className="hero service-hero">
        <div className="container hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/services/">Services</Link> / <span>{s.title}</span>
          </nav>
          <h1>
            <Headline text={s.hero.h1} />
          </h1>
          {s.hero.sub && <Prose text={s.hero.sub} className="hero-sub" />}
          {s.hero.priceLine && <p className="price-line">{s.hero.priceLine}</p>}
          <div className="btn-row">
            {s.packages?.length ? <Button data={{ action: 'anchor', href: '#packages', label: s.hero.packagesButton || 'See packages' }} settings={settings} size="lg" /> : null}
            <Button data={{ action: 'whatsapp' }} settings={settings} size="lg" />
          </div>
          {s.hero.proofLine && (
            <p className="hero-note">
              <Inline text={s.hero.proofLine} />
            </p>
          )}
          {jump.length > 0 && (
            <nav className="jump-links" aria-label="On this page">
              {jump.map((j) => (
                <a key={j.href} href={j.href}>
                  {j.label} <ArrowDown aria-hidden="true" size={16} />
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>

      {s.packages?.length ? (
        <section className="section" id="packages">
          <div className="container">
            {s.packagesHeading && <h2 className="section-title">{s.packagesHeading}</h2>}
            <div className={`packages count-${s.packages.length}`}>
              {s.packages.map((p, i) => (
                <article key={p.id || i} className={p.popular ? 'package popular' : 'package'}>
                  {p.popular && <span className="badge">{p.popularLabel || 'Most popular'}</span>}
                  <h3>{p.name}</h3>
                  {p.for && <p className="package-for">{p.for}</p>}
                  {p.price && <p className="package-price">{p.price}</p>}
                  {p.delivery && <p className="package-delivery">Delivery: {p.delivery}</p>}
                  {p.details?.map((d, j) => (
                    <p key={d.id || j} className="package-detail">
                      <span>{d.label}</span> {d.value}
                    </p>
                  ))}
                  <Prose text={p.includes} className="package-includes" />
                  <Button
                    data={{ action: 'whatsapp', label: p.buttonLabel || 'Get a quote', message: packageMessage(settings, p.name, s.title), interest: `${p.name} (${s.title})` }}
                    settings={settings}
                  />
                </article>
              ))}
            </div>
            {s.packagesNote && <Prose text={s.packagesNote} className="packages-note" />}
            {s.notQuite && (
              <div className="not-quite">
                <strong>Not quite what you need?</strong> <Inline text={s.notQuite} />
              </div>
            )}
            <Proof text={s.proof} />
          </div>
        </section>
      ) : null}

      {s.sections?.map((sec, i) => (
        <section key={sec.id || i} className={i % 2 === 0 ? 'section tinted' : 'section'} id={sec.anchor || undefined}>
          <div className="container narrow">
            <h2>{sec.heading}</h2>
            <Prose text={sec.body} />
            <DataTable table={sec.table} />
          </div>
        </section>
      ))}

      {s.steps?.length ? (
        <section className="section" id="how-it-works">
          <div className="container">
            <h2 className="section-title">{s.howItWorksHeading || 'How it works'}</h2>
            <Steps steps={s.steps} />
          </div>
        </section>
      ) : null}

      {(s.needs || s.notIncluded) && (
        <section className="section tinted">
          <div className="container two-col">
            {s.needs && (
              <div>
                <h2>What we need from you</h2>
                <Prose text={s.needs} />
              </div>
            )}
            {s.notIncluded && (
              <div className="not-included">
                <h2>Not included</h2>
                <Prose text={s.notIncluded} />
              </div>
            )}
          </div>
        </section>
      )}

      {s.addons?.length ? (
        <section className="section">
          <div className="container narrow">
            <h2>Add-ons</h2>
            <DataTable
              table={{
                columns: [{ label: 'Add-on' }, { label: 'Price (KES)' }],
                rows: s.addons.map((a) => ({ cells: [{ value: a.item }, { value: a.price }] })),
              }}
            />
          </div>
        </section>
      ) : null}

      <section className="section cta-inline">
        <div className="container">
          <p>Questions about which package fits?</p>
          <Buttons buttons={[{ action: 'whatsapp' }, { action: 'call' }]} settings={settings} />
        </div>
      </section>

      {s.faqs?.length ? (
        <section className="section" id="faqs">
          <div className="container narrow">
            <h2>FAQs</h2>
            <Faqs items={s.faqs} />
          </div>
        </section>
      ) : null}

      {(s.learnMore || (s.relatedPosts && s.relatedPosts.length > 0) || (s.pairsWith && s.pairsWith.length > 0)) && (
        <section className="section tinted">
          <div className="container two-col">
            {(s.learnMore || (s.relatedPosts && s.relatedPosts.length > 0)) && (
              <div>
                <h2>Learn more</h2>
                {s.relatedPosts && s.relatedPosts.length > 0 ? (
                  <ul className="link-list">
                    {s.relatedPosts.map((p) =>
                      typeof p === 'object' ? (
                        <li key={p.id}>
                          <Link href={`/insights/${p.slug}/`}>{p.title}</Link>
                        </li>
                      ) : null,
                    )}
                  </ul>
                ) : (
                  <Prose text={s.learnMore} />
                )}
                <p className="small">
                  <Link href="/pricing/" className="icon-link">See every price on one page <ArrowRight aria-hidden="true" size={16} /></Link>
                </p>
              </div>
            )}
            {s.pairsWith && s.pairsWith.length > 0 && (
              <div>
                <h2>Pairs well with</h2>
                <ul className="pairs">
                  {s.pairsWith.map((p, i) => {
                    const svc = typeof p.service === 'object' ? p.service : null
                    if (!svc) return null
                    return (
                      <li key={p.id || i}>
                        <Link href={`/${svc.slug}/`}>

                          <strong>{svc.title}</strong>
                        </Link>
                        {p.line && <span> — {p.line}</span>}
                      </li>
                    )
                  })}
                </ul>
                {s.pairsWithNote && <p>{s.pairsWithNote}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section closing" id="quote">
        <div className="container closing-inner">
          <div>
            <h2>{s.closing?.heading || 'Ready to talk?'}</h2>
            {s.closing?.line && <p className="price-line">{s.closing.line}</p>}
            <Buttons buttons={[{ action: 'whatsapp' }, { action: 'call' }]} settings={settings} size="lg" />
          </div>
          {packageOptions.length > 0 && (
            <div className="form-card">
              <LeadForm
                source="service"
                fields={serviceFields(s.closing?.packageQuestion || 'Which package?', packageOptions, s.closing?.extraField)}
                submitLabel="Get my quote"
                consent={settings.consentLine}
                page={path}
                extraHidden={{ service: s.title }}
                compact
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
