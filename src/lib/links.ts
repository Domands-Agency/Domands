import type { SiteSetting } from '@/payload-types'

export type ButtonData = {
  action: 'whatsapp' | 'call' | 'quiz' | 'anchor' | 'link'
  label?: string | null
  href?: string | null
  message?: string | null
  /** What the lead is about, saved with a "Get in touch" enquiry (e.g. a package name). */
  interest?: string | null
  id?: string | null
}

export const DEFAULT_LABELS: Record<ButtonData['action'], string> = {
  whatsapp: 'Get in touch',
  call: 'Book a call',
  quiz: 'Check your digital health',
  anchor: 'See more',
  link: 'Learn more',
}

export function waHref(settings: SiteSetting, message?: string | null) {
  const number = settings.whatsappNumber?.replace(/\D/g, '')
  const text = message || settings.waGeneral || 'Hi Domands, I found you on your website.'
  if (!number) return '/contact/'
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function packageMessage(settings: SiteSetting, pkg: string, page: string) {
  const template = settings.waPackage || "Hi Domands, I'm interested in the {package} ({page}). Can we talk?"
  return template.replace('{package}', pkg).replace('{page}', page)
}

export function callHref(settings: SiteSetting) {
  return settings.bookingUrl || '/contact/#form'
}

export function resolveButton(b: ButtonData, settings: SiteSetting) {
  // WhatsApp buttons now open "Get in touch" first, so old "Chat on WhatsApp" labels from the CMS become the new wording.
  const label = b.action === 'whatsapp' && (!b.label || /whatsapp/i.test(b.label)) ? DEFAULT_LABELS.whatsapp : b.label || DEFAULT_LABELS[b.action]
  switch (b.action) {
    case 'whatsapp':
      return { label, href: waHref(settings, b.message), kind: 'whatsapp' as const, external: Boolean(settings.whatsappNumber) }
    case 'call':
      return { label, href: callHref(settings), kind: 'primary' as const, external: Boolean(settings.bookingUrl) }
    case 'quiz':
      return { label, href: '/quiz/', kind: 'secondary' as const, external: false }
    case 'anchor':
      return { label, href: b.href || '#', kind: 'secondary' as const, external: false }
    default: {
      const href = b.href || '/'
      return { label, href, kind: 'secondary' as const, external: /^https?:/.test(href) }
    }
  }
}
