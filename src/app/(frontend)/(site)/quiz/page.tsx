import type { Metadata } from 'next'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { waHref } from '@/lib/links'
import { Quiz, type QuizData } from '@/components/Quiz'

export const metadata: Metadata = {
  title: 'Free Digital Health Check for Kenyan Businesses | 3-Minute Quiz | Domands',
  description:
    'Answer 11 quick questions and see how your website, Google listing, social media, WhatsApp and ads are working, and what to fix first. Free.',
  alternates: { canonical: '/quiz/' },
}

const AREA_LABELS: Record<string, string> = {
  website: 'Website',
  booking: 'Online booking and payments',
  google: 'Google visibility',
  reviews: 'Google reviews',
  social: 'Social media',
  whatsapp: 'WhatsApp',
  ads: 'Paid ads',
  brand: 'Brand',
  tracking: 'Tracking',
}

export default async function QuizPage() {
  const payload = await getPayloadClient()
  const [hc, settings] = await Promise.all([payload.findGlobal({ slug: 'health-check', depth: 1 }), getSettings()])

  const data: QuizData = {
    h1: hc.h1 || 'How healthy is your business online?',
    line: hc.line || '',
    reassurance: hc.reassurance || '',
    startLabel: hc.startLabel || 'Start the check',
    gateHeading: hc.gateHeading || 'Get your full report',
    gateLine: hc.gateLine || '',
    gateConsent: hc.gateConsent || settings.consentLine || '',
    gateButton: hc.gateButton || 'Send my report',
    resultFooter: hc.resultFooter || '',
    waHref: waHref(settings, 'Hi Domands, I just took the Digital Health Check and would like help with my top three fixes.'),
    waMessage: 'Hi Domands, I just took the Digital Health Check and would like help with my top three fixes.',
    callHref: settings.bookingUrl || '/contact/',
    questions: (hc.questions || []).map((q) => ({
      question: q.question,
      kind: q.kind,
      area: q.area,
      answers: (q.answers || []).map((a) => ({ label: a.label, value: a.value })),
    })),
    bands: (hc.bands || []).map((b) => ({ name: b.name, min: b.min, max: b.max, text: b.text })),
    recommendations: (hc.recommendations || []).map((r) => {
      const svc = typeof r.service === 'object' ? r.service : null
      return {
        area: r.area,
        areaLabel: AREA_LABELS[r.area] || r.area,
        freeFix: r.freeFix || '',
        help: r.help || svc?.title || 'See the service',
        href: svc ? `/${svc.slug}/` : '/services/',
      }
    }),
  }

  return (
    <section className="section quiz-section">
      <div className="container narrow">
        <Quiz data={data} />
      </div>
    </section>
  )
}
