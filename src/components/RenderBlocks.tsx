import Link from 'next/link'
import React from 'react'
import type { Page, SiteSetting } from '@/payload-types'
import { getIndustries, getPayloadClient, getServices } from '@/lib/payload'
import { contactFields, launchpadFields, newsletterFields, strategyCallFields } from '@/lib/forms'
import { SERVICE_GROUPS } from '@/collections/Services'
import { ArrowRight } from 'lucide-react'
import { LeadForm } from './LeadForm'
import { Inline, Prose } from './Prose'
import { Buttons, DataTable, Faqs, Headline, SectionHead, Steps } from './ui'

type Block = NonNullable<Page['layout']>[number]
type Ctx = { settings: SiteSetting; path: string }

export async function RenderBlocks({ blocks, settings, path }: { blocks?: Page['layout']; settings: SiteSetting; path: string }) {
  if (!blocks?.length) return null
  const ctx = { settings, path }
  return (
    <>
      {blocks.map((b, i) => (
        <BlockSwitch key={b.id || i} block={b} ctx={ctx} first={i === 0} />
      ))}
    </>
  )
}

async function BlockSwitch({ block, ctx, first }: { block: Block; ctx: Ctx; first: boolean }) {
  const { settings } = ctx
  const id = ('anchor' in block && block.anchor) || undefined
  switch (block.blockType) {
    case 'hero':
      return (
        <section className="hero" id={id}>
          <div className="container hero-inner">
            {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
            <h1>
              <Headline text={block.heading} />
            </h1>
            {block.sub && <Prose text={block.sub} className="hero-sub" />}
            <Buttons buttons={block.buttons} settings={settings} size="lg" />
            {block.note && (
              <p className="hero-note">
                <Inline text={block.note} />
              </p>
            )}
          </div>
        </section>
      )
    case 'content':
      return (
        <section className={`section content-${block.style || 'plain'}`} id={id}>
          <div className={block.style === 'narrow' ? 'container narrow' : 'container'}>
            <SectionHead heading={block.heading} intro={block.intro} />
            <Prose text={block.body} />
            <Buttons buttons={block.buttons} settings={settings} />
          </div>
        </section>
      )
    case 'cards':
      return (
        <section className="section" id={id}>
          <div className="container">
            <SectionHead heading={block.heading} intro={block.intro} />
            <div className={`card-grid cols-${block.columns || 3}`}>
              {block.cards?.map((c, i) => (
                <div key={c.id || i} className="card">
                  {block.numbered && <span className="card-num">{i + 1}</span>}
                  {c.title && (
                    <h3>
                      <Inline text={c.title} />
                    </h3>
                  )}
                  <Prose text={c.text} />
                  {c.meta && <p className="card-meta">{c.meta}</p>}
                  <Buttons buttons={c.buttons} settings={settings} size="sm" />
                </div>
              ))}
            </div>
            <Buttons buttons={block.footerButtons} settings={settings} />
          </div>
        </section>
      )
    case 'steps':
      return (
        <section className="section" id={id}>
          <div className="container">
            <SectionHead heading={block.heading} intro={block.intro} />
            <Steps steps={block.steps} />
          </div>
        </section>
      )
    case 'table':
      return (
        <section className="section" id={id}>
          <div className="container">
            <SectionHead heading={block.heading} intro={block.intro} />
            <DataTable table={block} />
            <Prose text={block.after} />
          </div>
        </section>
      )
    case 'priceTable':
      return (
        <section className="section" id={id}>
          <div className="container">
            <SectionHead heading={block.heading} intro={block.intro} />
            <div className="table-wrap">
              <table className="price-table">
                <thead>
                  <tr>
                    <th scope="col">Service</th>
                    <th scope="col">Starting price (KES)</th>
                    <th scope="col">Typical time</th>
                  </tr>
                </thead>
                {block.groups?.map((g, gi) => (
                  <tbody key={g.id || gi}>
                    <tr className="group-row">
                      <th colSpan={3} scope="colgroup">
                        {g.title}
                      </th>
                    </tr>
                    {g.rows?.map((r, ri) => {
                      const svc = typeof r.service === 'object' ? r.service : null
                      return (
                        <tr key={r.id || ri}>
                          <th scope="row">
                            {svc ? (
                              <Link href={`/${svc.slug}/`}>

                                {r.label}
                              </Link>
                            ) : (
                              r.label
                            )}
                          </th>
                          <td>{r.price}</td>
                          <td>{r.time}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </section>
      )
    case 'faq':
      return (
        <section className="section" id={id}>
          <div className="container narrow">
            <SectionHead heading={block.heading} intro={block.intro} />
            <Faqs items={block.faqs} />
          </div>
        </section>
      )
    case 'cta':
      return (
        <section className="section cta-band" id={id}>
          <div className="container">
            <h2>
              <Inline text={block.heading} />
            </h2>
            <Prose text={block.line} className="lead" />
            <Buttons buttons={block.buttons} settings={settings} size="lg" />
          </div>
        </section>
      )
    case 'form':
      return <FormSection block={block} ctx={ctx} />
    case 'list':
      return <ListSection block={block} ctx={ctx} />
    default:
      return null
  }
}

async function FormSection({ block, ctx }: { block: Extract<Block, { blockType: 'form' }>; ctx: Ctx }) {
  const { settings } = ctx
  const services = await getServices()
  const preset = {
    contact: { fields: contactFields(services.map((s) => s.title)), source: 'contact' as const, label: 'Send message' },
    'strategy-call': { fields: strategyCallFields, source: 'strategy-call' as const, label: "Request this week's slot" },
    launchpad: { fields: launchpadFields, source: 'launchpad' as const, label: 'Submit my application' },
    newsletter: { fields: newsletterFields, source: 'newsletter' as const, label: 'Subscribe' },
  }[block.form]
  return (
    <section className={block.form === 'newsletter' ? 'section content-band' : 'section'} id={block.anchor || 'form'}>
      <div className="container narrow">
        <SectionHead heading={block.heading} intro={block.intro} />
        <div className={block.form === 'newsletter' ? '' : 'form-card'}>
          <LeadForm
            source={preset.source}
            fields={preset.fields}
            submitLabel={block.submitLabel || preset.label}
            consent={block.form === 'newsletter' ? null : settings.consentLine}
            page={ctx.path}
            compact={block.form === 'newsletter'}
          />
        </div>
        <Prose text={block.after} className="form-after" />
      </div>
    </section>
  )
}

async function ListSection({ block, ctx }: { block: Extract<Block, { blockType: 'list' }>; ctx: Ctx }) {
  const { settings } = ctx
  const payload = await getPayloadClient()
  let content: React.ReactNode = null

  if (block.source === 'services' || block.source === 'services-grouped') {
    const services = await getServices()
    const card = (s: (typeof services)[number]) => (
      <Link key={s.id} href={`/${s.slug}/`} className="card service-card">
        <span className="service-chip" aria-hidden="true" />
        <h3>{s.title}</h3>
        <p>{s.cardLine}</p>
        <p className="card-meta">From {s.fromPrice}</p>
        {block.source === 'services-grouped' && <span className="card-link">See details <ArrowRight aria-hidden="true" size={16} /></span>}
      </Link>
    )
    content =
      block.source === 'services' ? (
        <div className="card-grid cols-3">{services.slice(0, block.limit || 12).map(card)}</div>
      ) : (
        SERVICE_GROUPS.map((g) => {
          const items = services.filter((s) => s.group === g.value)
          if (!items.length) return null
          return (
            <div key={g.value} className="service-group">
              <h3 className="group-title">{g.label}</h3>
              <div className="card-grid cols-3">{items.map(card)}</div>
            </div>
          )
        })
      )
  } else if (block.source === 'industries') {
    const industries = await getIndustries()
    content = (
      <div className="card-grid cols-3">
        {industries.map((ind) => (
          <Link key={ind.id} href={`/industries/${ind.slug}/`} className="card industry-card">
            <h3>{ind.title}</h3>
            <p>{ind.cardLine}</p>
            <span className="card-link">See how we help <ArrowRight aria-hidden="true" size={16} /></span>
          </Link>
        ))}
      </div>
    )
  } else if (block.source === 'posts') {
    const res = await payload.find({ collection: 'posts', limit: block.limit || 3, sort: '-publishedAt', depth: 1, where: { _status: { equals: 'published' } } })
    content = res.docs.length ? (
      <div className="card-grid cols-3">
        {res.docs.map((p) => (
          <Link key={p.id} href={`/insights/${p.slug}/`} className="card post-card">
            {typeof p.service === 'object' && p.service && (
              <span className="tag">
                {p.service.title}
              </span>
            )}
            <h3>{p.title}</h3>
            {p.answer && <p>{p.answer}</p>}
            {typeof p.author === 'object' && p.author && <p className="card-meta">By {p.author.name}</p>}
          </Link>
        ))}
      </div>
    ) : null
  } else if (block.source === 'case-studies') {
    const res = await payload.find({ collection: 'case-studies', limit: block.limit || 12, depth: 1, where: { _status: { equals: 'published' } } })
    content = res.docs.length ? (
      <div className="card-grid cols-3">
        {res.docs.map((c) => (
          <Link key={c.id} href={`/work/${c.slug}/`} className="card">
            <p className="card-meta">{typeof c.industry === 'object' && c.industry ? c.industry.title : ''}</p>
            <h3>{c.client}</h3>
            <p>{c.resultLine || c.headline}</p>
            <p className="card-meta">
              {(c.services || [])
                .map((s) => (typeof s === 'object' ? s.title : ''))
                .filter(Boolean)
                .join(' · ')}
            </p>
            <span className="card-link">Read the story <ArrowRight aria-hidden="true" size={16} /></span>
          </Link>
        ))}
      </div>
    ) : null
  } else if (block.source === 'founders') {
    const res = await payload.find({ collection: 'founders', limit: 10, sort: 'order', depth: 1 })
    content = (
      <div className="card-grid cols-3">
        {res.docs.map((f) => (
          <Link key={f.id} href={`/about/${f.slug}/`} className="card founder-card">
            <div className="avatar" aria-hidden="true">
              {typeof f.photo === 'object' && f.photo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.photo.url} alt="" />
              ) : (
                <span>{f.name.replace(/[^A-Za-z ]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 2) || '?'}</span>
              )}
            </div>
            <h3>
              <Inline text={f.name} />
            </h3>
            {f.role && (
              <p className="card-meta">
                <Inline text={f.role} />
              </p>
            )}
            {f.leadsLine && (
              <p>
                <Inline text={f.leadsLine} />
              </p>
            )}
            <span className="card-link">Read more <ArrowRight aria-hidden="true" size={16} /></span>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <section className="section" id={block.anchor || undefined}>
      <div className="container">
        <SectionHead heading={block.heading} intro={block.intro} />
        {content ?? (block.empty ? <Prose text={block.empty} className="empty-state" /> : null)}
        <Buttons buttons={block.footerButtons} settings={settings} />
      </div>
    </section>
  )
}
