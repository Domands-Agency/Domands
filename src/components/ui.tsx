import Link from 'next/link'
import React from 'react'
import type { SiteSetting } from '@/payload-types'
import { resolveButton, type ButtonData } from '@/lib/links'
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Plus } from 'lucide-react'
import { Inline, Prose } from './Prose'

import { WhatsAppIcon } from './WhatsAppIcon'
import { EnquiryButton } from './Enquiry'
export { WhatsAppIcon }

export function Button({
  data,
  settings,
  size,
}: {
  data: ButtonData
  settings: SiteSetting
  size?: 'sm' | 'lg'
}) {
  const b = resolveButton(data, settings)
  const className = ['btn', `btn-${b.kind}`, size && `btn-${size}`].filter(Boolean).join(' ')
  // Typed arrows in CMS labels ("See our work →") become Lucide icons.
  const label = b.label.replace(/\s*[→↗↓]\s*$/, '')
  // Every WhatsApp button goes through "Get in touch" first, so each chat starts as a saved lead.
  if (data.action === 'whatsapp') {
    return (
      <EnquiryButton
        className={className}
        label={label}
        waUrl={b.href}
        message={data.message}
        interest={data.interest}
        consent={settings.consentLine}
      />
    )
  }
  const Trailing =
    data.action === 'anchor' ? ArrowDown : b.external && data.action === 'link' ? ArrowUpRight : data.action === 'link' || data.action === 'quiz' ? ArrowRight : null
  const content = (
    <>
      {data.action === 'call' && <CalendarDays aria-hidden="true" size={18} />}
      <span>{label}</span>
      {Trailing && <Trailing aria-hidden="true" size={18} />}
    </>
  )
  const track = data.action === 'call' ? 'call' : undefined
  if (b.external) {
    return (
      <a className={className} href={b.href} target="_blank" rel="noopener noreferrer" data-track={track}>
        {content}
      </a>
    )
  }
  return (
    <Link className={className} href={b.href} data-track={track}>
      {content}
    </Link>
  )
}

export function Buttons({
  buttons,
  settings,
  size,
}: {
  buttons?: ButtonData[] | null
  settings: SiteSetting
  size?: 'sm' | 'lg'
}) {
  if (!buttons?.length) return null
  return (
    <div className="btn-row">
      {buttons.map((b, i) => (
        <Button key={b.id || i} data={b} settings={settings} size={size} />
      ))}
    </div>
  )
}

export function SectionHead({ heading, intro, as = 'h2' }: { heading?: string | null; intro?: string | null; as?: 'h1' | 'h2' }) {
  if (!heading && !intro) return null
  const H = as
  return (
    <div className="section-head">
      {heading && (
        <H>
          <Inline text={heading} />
        </H>
      )}
      {intro && <Prose text={intro} className="lead" />}
    </div>
  )
}

/**
 * Hero headline with the brand's red full stop, drawn as a true circle.
 * A closing "." becomes the dot; questions, exclamations and headlines ending in
 * a [placeholder] get no dot (the brand keeps the dot for finished statements).
 */
export function Headline({ text }: { text: string }) {
  const t = text.trim()
  const statement = /[.\p{L}\p{N}]$/u.test(t)
  const body = t.endsWith('.') ? t.slice(0, -1) : t
  return (
    <>
      <Inline text={body} />
      {statement && <span className="h-dot" aria-hidden="true" />}
      {statement && t.endsWith('.') && <span className="sr-only">.</span>}
    </>
  )
}

export function Faqs({ items }: { items?: { question: string; answer: string; id?: string | null }[] | null }) {
  if (!items?.length) return null
  return (
    <div className="faqs">
      {items.map((f, i) => (
        <details key={f.id || i} className="faq">
          <summary>
            <Inline text={f.question} />
            <Plus className="faq-icon" aria-hidden="true" size={24} strokeWidth={1.75} />
          </summary>
          <Prose text={f.answer} />
        </details>
      ))}
    </div>
  )
}

type TableData = {
  columns?: { label?: string | null; id?: string | null }[] | null
  rows?: { highlight?: boolean | null; cells?: { value?: string | null; id?: string | null }[] | null; id?: string | null }[] | null
}

export function DataTable({ table }: { table?: TableData | null }) {
  if (!table?.rows?.length) return null
  return (
    <div className="table-wrap">
      <table>
        {table.columns?.length ? (
          <thead>
            <tr>
              {table.columns.map((c, i) => (
                <th key={c.id || i} scope="col">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={r.id || i} className={r.highlight ? 'row-strong' : undefined}>
              {r.cells?.map((c, j) =>
                j === 0 ? (
                  <th key={c.id || j} scope="row">
                    <Inline text={c.value || ''} />
                  </th>
                ) : (
                  <td key={c.id || j}>
                    <Inline text={c.value || ''} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Steps({ steps }: { steps?: { title: string; text?: string | null; id?: string | null }[] | null }) {
  if (!steps?.length) return null
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s.id || i} className="step">
          <span className="step-num" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3>
              <Inline text={s.title} />
            </h3>
            {s.text && <Prose text={s.text} />}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Proof({ text }: { text?: string | null }) {
  if (!text) return null
  return (
    <aside className="proof" aria-label="Proof">
      <Prose text={text} />
    </aside>
  )
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function themeStyle(theme?: { main?: string | null; surface?: string | null; ink?: string | null } | null) {
  if (!theme) return undefined
  return {
    ...(theme.main ? { '--main': theme.main } : {}),
    ...(theme.surface ? { '--surface': theme.surface } : {}),
    ...(theme.ink ? { '--ink': theme.ink } : {}),
  } as React.CSSProperties
}
