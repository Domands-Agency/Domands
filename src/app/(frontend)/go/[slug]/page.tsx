import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { AdPage, Service } from '@/payload-types'
import { allSlugs, findBySlug, getSettings } from '@/lib/payload'
import { adFields } from '@/lib/forms'
import { waHref } from '@/lib/links'
import { ArrowRight, Check, MessageSquare, Plus } from 'lucide-react'
import { EnquiryButton } from '@/components/Enquiry'
import { LeadForm } from '@/components/LeadForm'
import { Logo } from '@/components/Chrome'
import { Prose } from '@/components/Prose'
import { Button, Headline, WhatsAppIcon } from '@/components/ui'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => allSlugs('ad-pages')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ad = await findBySlug<AdPage>('ad-pages', slug)
  if (!ad) return {}
  return { title: `${ad.title} | Domands Creative`, description: ad.sub || undefined, robots: { index: false, follow: false } }
}

/** Single-offer ad landing page: no menu, one form, one WhatsApp button. */
export default async function AdLandingPage({ params }: Props) {
  const { slug } = await params
  const [ad, settings] = await Promise.all([findBySlug<AdPage>('ad-pages', slug), getSettings()])
  if (!ad) notFound()
  const service = typeof ad.backsUp === 'object' ? (ad.backsUp as Service) : null
  const wa = { action: 'whatsapp' as const, message: ad.whatsappMessage, interest: ad.title }

  return (
    <div className="themed ad-page">
      <header className="ad-header">
        <div className="container">
          <Logo />
        </div>
      </header>
      <main id="main" className="frame">
        <section className="hero">
          <div className="container hero-inner">
            <h1>
              <Headline text={ad.h1} />
            </h1>
            {ad.sub && <p className="hero-sub">{ad.sub}</p>}
            <div className="btn-row">
              <Button data={{ action: 'anchor', href: '#quote', label: 'Get my quote' }} settings={settings} size="lg" />
              <Button data={wa} settings={settings} size="lg" />
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container narrow">
            <h2>{ad.whatYouGetHeading || 'What you get'}</h2>
            <ul className="checklist">
              {ad.whatYouGet?.map((w, i) => (
                <li key={w.id || i}>
                  <Check className="check-icon" aria-hidden="true" size={16} strokeWidth={3} />
                  {w.text}
                </li>
              ))}
            </ul>
            {ad.proof && (
              <aside className="proof">
                <Prose text={ad.proof} />
              </aside>
            )}
          </div>
        </section>
        {ad.faqs?.length ? (
          <section className="section tinted">
            <div className="container narrow">
              <h2>FAQs</h2>
              <div className="faqs">
                {ad.faqs.map((f, i) => (
                  <details key={f.id || i} className="faq" open={i === 0}>
                    <summary>
                      {f.question}
                      <Plus className="faq-icon" aria-hidden="true" size={24} strokeWidth={1.75} />
                    </summary>
                    <Prose text={f.answer} />
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}
        <section className="section closing" id="quote">
          <div className="container narrow">
            <h2>Get your quote</h2>
            {ad.closingLine && <Prose text={ad.closingLine.replace('[one working day]', settings.replyTime || '[one working day]')} className="lead" />}
            <div className="form-card">
              <LeadForm
                source="ad"
                fields={adFields}
                submitLabel="Get my quote"
                consent={settings.consentLine}
                page={`/go/${ad.slug}/`}
                extraHidden={{ interest: ad.title }}
                compact
              />
            </div>
            <p className="or-wa">
              <EnquiryButton
                className="link-button"
                waUrl={waHref(settings, ad.whatsappMessage)}
                message={ad.whatsappMessage}
                interest={ad.title}
                consent={settings.consentLine}
              >
                <MessageSquare aria-hidden="true" size={16} /> Prefer WhatsApp? Leave your number first <ArrowRight aria-hidden="true" size={16} />
              </EnquiryButton>
            </p>
          </div>
        </section>
      </main>
      <footer className="ad-footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()} Domands Creative · <Link href="/">Visit our website</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
