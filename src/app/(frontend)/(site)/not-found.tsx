import Link from 'next/link'
import { getSettings } from '@/lib/payload'
import { Button } from '@/components/ui'

export default async function NotFound() {
  const settings = await getSettings()
  return (
    <section className="hero">
      <div className="container narrow hero-inner">
        <p className="eyebrow">404</p>
        <h1>
          This page has moved, or never existed<span className="h-dot" aria-hidden="true" />
        </h1>
        <p className="hero-sub">The link may be old or mistyped. Here&apos;s where most people were heading:</p>
        <ul className="link-list inline">
          <li><Link href="/website-design/">Website Design</Link></li>
          <li><Link href="/pricing/">Pricing</Link></li>
          <li><Link href="/services/">All services</Link></li>
          <li><Link href="/quiz/">Digital Health Check</Link></li>
        </ul>
        <form action="/search/" method="get" className="search-404" role="search">
          <label htmlFor="q" className="sr-only">Search services and articles</label>
          <input id="q" name="q" type="search" placeholder="Search services and articles" />
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
        <div className="btn-row">
          <Button data={{ action: 'whatsapp' }} settings={settings} size="lg" />
        </div>
      </div>
    </section>
  )
}
