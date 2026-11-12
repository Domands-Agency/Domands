import Link from 'next/link'
import React from 'react'

/**
 * Tiny formatter for the copy deck's plain-text fields:
 * blank line = paragraph, "- " bullets, "1. " numbered, "### " sub-heading,
 * **bold**, [text](url), and any other [square brackets] shown as a placeholder.
 */
const INLINE = /(\*\*.+?\*\*|\[[^\]]+\]\([^)\s]+\)|\[[^\]]+\])/g

export function Inline({ text }: { text: string }): React.ReactNode {
  const parts = text.split(INLINE)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i}>
          <Inline text={part.slice(2, -2)} />
        </strong>
      )
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link) {
      const [, label, href] = link
      if (/^https?:/.test(href)) {
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        )
      }
      return (
        <Link key={i} href={href}>
          {label}
        </Link>
      )
    }
    if (/^\[[^\]]+\]$/.test(part)) {
      return (
        <span key={i} className="placeholder" title="Placeholder: replace before launch">
          {part}
        </span>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

type Node =
  | { type: 'p'; lines: string[] }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'h3'; text: string }

function parse(text: string): Node[] {
  const nodes: Node[] = []
  let current = null as Node | null
  const flush = () => {
    if (current) nodes.push(current)
    current = null as Node | null
  }
  for (const raw of text.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flush()
      continue
    }
    const bullet = line.match(/^\s*[-•]\s+(.*)$/)
    const num = line.match(/^\s*\d+\.\s+(.*)$/)
    const h3 = line.match(/^###\s+(.*)$/)
    if (h3) {
      flush()
      nodes.push({ type: 'h3', text: h3[1] })
    } else if (bullet || num) {
      const type = bullet ? 'ul' : 'ol'
      const item = (bullet || num)![1]
      if (current?.type !== type) {
        flush()
        current = { type, items: [] }
      }
      ;(current as { items: string[] }).items.push(item)
    } else {
      if (current?.type !== 'p') {
        flush()
        current = { type: 'p', lines: [] }
      }
      ;(current as { lines: string[] }).lines.push(line)
    }
  }
  flush()
  return nodes
}

export function Prose({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null
  const nodes = parse(text)
  return (
    <div className={['prose', className].filter(Boolean).join(' ')}>
      {nodes.map((n, i) => {
        if (n.type === 'h3') return <h3 key={i}>{<Inline text={n.text} />}</h3>
        if (n.type === 'p')
          return (
            <p key={i}>
              {n.lines.map((l, j) => (
                <React.Fragment key={j}>
                  {j > 0 && <br />}
                  <Inline text={l} />
                </React.Fragment>
              ))}
            </p>
          )
        const Tag = n.type
        return (
          <Tag key={i}>
            {n.items.map((it, j) => (
              <li key={j}>
                <Inline text={it} />
              </li>
            ))}
          </Tag>
        )
      })}
    </div>
  )
}
