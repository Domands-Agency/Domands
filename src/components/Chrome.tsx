import Link from 'next/link'
import type { Industry, Service, SiteSetting } from '@/payload-types'
import { ArrowUpRight, Clock, Mail, MapPin, Menu, MessageSquare, X } from 'lucide-react'
import { EnquiryButton } from './Enquiry'
import { waHref } from '@/lib/links'
import { SERVICE_GROUPS } from '@/collections/Services'
import { Button, Headline, WhatsAppIcon } from './ui'

/** The Domands wordmark (outlined brand file, never re-typed). `reverse` = white letters for black backgrounds; the dot stays red. */
export function Logo({ reverse = false }: { reverse?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="Domands, home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reverse ? '/brand/domands-wordmark-reverse.svg' : '/brand/domands-wordmark.svg'}
        alt="Domands"
        width={134}
        height={22}
      />
    </Link>
  )
}

const NAV = [
  { href: '/services/', label: 'Services' },
  { href: '/industries/', label: 'Industries' },
  { href: '/pricing/', label: 'Pricing' },
  { href: '/work/', label: 'Our work' },
  { href: '/insights/', label: 'Insights' },
]

export function Header({ settings, services }: { settings: SiteSetting; services: Service[] }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav aria-label="Main" className="nav-desktop">
          <div className="nav-item has-menu">
            <Link href="/services/">Services</Link>
            <div className="mega" role="menu">
              {services.map((s) => (
                <Link key={s.id} href={`/${s.slug}/`} role="menuitem">
                  <span>
                    <strong>{s.title}</strong>
                    <small>From {s.fromPrice}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {NAV.slice(1).map((n) => (
            <Link key={n.href} href={n.href} className="nav-item">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-cta">
          <Button data={{ action: 'whatsapp' }} settings={settings} size="sm" />
        </div>
        <details className="nav-mobile">
          <summary aria-label="Menu">
            <Menu className="menu-open" aria-hidden="true" size={18} />
            <X className="menu-close" aria-hidden="true" size={18} />
            <span className="menu-label" aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile" className="nav-mobile-panel">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
            <Link href="/quiz/">Digital Health Check</Link>
            <Link href="/contact/">Contact</Link>
          </nav>
        </details>
      </div>
    </header>
  )
}

export function Footer({
  settings,
  services,
  industries,
}: {
  settings: SiteSetting
  services: Service[]
  industries: Industry[]
}) {
  const year = new Date().getFullYear()
  // Statement = first sentence of the footer line from Site settings; the rest sits under it.
  const line = settings.footerLine || 'Websites, brands and marketing that bring in customers.'
  const cut = line.indexOf('. ')
  const statement = cut > 0 ? line.slice(0, cut + 1) : line
  const rest = cut > 0 ? line.slice(cut + 2) : ''
  const groups = SERVICE_GROUPS.map((g) => ({ ...g, items: services.filter((s) => s.group === g.value) })).filter((g) => g.items.length)

  return (
    <footer className="site-footer">
      <div className="container">
        {/* 1. Statement and the two main actions */}
        <div className="footer-hero">
          <p className="footer-statement">
            <Headline text={statement} />
          </p>
          {rest && <p className="footer-sub">{rest}</p>}
          <div className="btn-row">
            <EnquiryButton className="btn btn-lg btn-on-night" waUrl={waHref(settings)} consent={settings.consentLine} />
            <Link className="btn btn-lg btn-on-night-outline" href="/free-strategy-call/">
              Book a free strategy call
            </Link>
          </div>
          <ul className="footer-contact">
            <li>
              <span className="footer-contact-label"><WhatsAppIcon /> WhatsApp</span>
              <EnquiryButton className="link-button" waUrl={waHref(settings)} consent={settings.consentLine}>
                {settings.phoneDisplay || <span className="placeholder">[number]</span>}
              </EnquiryButton>
            </li>
            <li>
              <span className="footer-contact-label"><Mail aria-hidden="true" size={16} /> Email</span>
              {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : <span className="placeholder">[email address]</span>}
            </li>
            <li>
              <span className="footer-contact-label"><MapPin aria-hidden="true" size={16} /> Where</span>
              {settings.location || <span className="placeholder">[Location]</span>}
            </li>
            <li>
              <span className="footer-contact-label"><Clock aria-hidden="true" size={16} /> Open</span>
              {settings.hours || <span className="placeholder">[Opening hours]</span>}
            </li>
          </ul>
        </div>

        {/* 2. Two halves: Services | Navigation, each under a rule */}
        <nav className="footer-nav" aria-label="Footer">
          <div className="footer-half">
            <h2 className="footer-half-title">Services</h2>
            <div className="footer-groups">
              {groups.map((g) => (
                <div key={g.value} className="footer-group">
                  <h3>{g.label}</h3>
                  <ul>
                    {g.items.map((s) => (
                      <li key={s.id}>
                        <Link href={`/${s.slug}/`}>{s.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="footer-half">
            <h2 className="footer-half-title">Navigation</h2>
            <div className="footer-groups">
              <div className="footer-group">
                <h3>
                  <Link href="/industries/">
                    Industries <ArrowUpRight aria-hidden="true" size={18} />
                  </Link>
                </h3>
                <ul>
                  {industries.map((s) => (
                    <li key={s.id}>
                      <Link href={`/industries/${s.slug}/`}>{s.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer-group">
                <h3>Company</h3>
                <ul>
                  <li><Link href="/about/">About</Link></li>
                  <li><Link href="/work/">Our work</Link></li>
                  <li><Link href="/insights/">Insights</Link></li>
                  <li><Link href="/launchpad/">Launchpad</Link></li>
                  <li><Link href="/contact/">Contact</Link></li>
                </ul>
              </div>
              <div className="footer-group">
                <h3>Free tools</h3>
                <ul>
                  <li><Link href="/quiz/">Digital Health Check</Link></li>
                  <li><Link href="/free-strategy-call/">Free strategy call</Link></li>
                  <li><Link href="/pricing/">All prices</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* 3. Logo + copyright | legal | social + icon mark */}
        <div className="footer-bottom">
          <div className="footer-legal-brand">
            <Logo reverse />
            <p>© {year} Domands Creative. All rights reserved.</p>
          </div>
          <ul className="footer-legal">
            <li><Link href="/privacy/">Privacy notice</Link></li>
            <li><Link href="/terms/">Terms</Link></li>
            <li><Link href="/pricing/">Prices</Link></li>
          </ul>
          <div className="footer-social">
            {(settings.social || [])
              .filter((s) => s.url)
              .map((s, i) => (
                <a key={s.id || i} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label || 'Social profile'} className="social-dot">
                  {socialMark(s.label)}
                </a>
              ))}
          </div>
        </div>
        {settings.smallPrint && <p className="footer-smallprint">{settings.smallPrint}</p>}
      </div>
    </footer>
  )
}

/** Short wordmarks for social links (no third-party logos bundled). */
function socialMark(label?: string | null) {
  const l = (label || '').toLowerCase()
  if (l.includes('linkedin')) return 'in'
  if (l.includes('facebook')) return 'f'
  if (l.includes('instagram')) return 'ig'
  if (l.includes('tiktok')) return 'tt'
  if (l.includes('youtube')) return 'yt'
  if (l === 'x' || l.includes('twitter')) return 'x'
  return (label || '•').slice(0, 2).toLowerCase()
}

export function StickyWhatsApp({ settings }: { settings: SiteSetting }) {
  const text = settings.stickyBarText && !/whatsapp/i.test(settings.stickyBarText) ? settings.stickyBarText : 'Questions? Get in touch'
  return (
    <EnquiryButton className="sticky-wa" waUrl={waHref(settings)} consent={settings.consentLine}>
      <span>{text}</span>
      <span className="sticky-wa-icon">
        <MessageSquare aria-hidden="true" size={18} />
      </span>
    </EnquiryButton>
  )
}
