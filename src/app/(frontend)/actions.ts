'use server'

import { redirect } from 'next/navigation'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { waHref } from '@/lib/links'
import type { FormSource } from '@/lib/forms'

/** `wa`: a WhatsApp link offered after a "Get in touch" enquiry is saved. */
export type FormState = { ok: boolean; error?: string; message?: string; wa?: string }

const SOURCES: FormSource[] = ['contact', 'service', 'ad', 'quiz', 'strategy-call', 'launchpad', 'newsletter', 'whatsapp']
const COLUMNS = ['name', 'business', 'phone', 'email', 'interest', 'message'] as const
/** Honeypot field name: deliberately meaningless so browser autofill leaves it alone. */
const HONEYPOT = 'hp_x7q'

function clean(v: FormDataEntryValue | null, max = 2000) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

/** Every rejected submission is logged with its reason (no personal data), so a lost lead is never silent. */
function reject(source: string, page: string, reason: string, error: string): FormState {
  console.warn(`[leads] Form rejected (${source || 'unknown'} on ${page || '?'}): ${reason}`)
  return { ok: false, error }
}

/** Saves any site form to the Leads collection, then sends the visitor to /thank-you/. */
export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const source = clean(formData.get('_source')) as FormSource
  const page = clean(formData.get('_page'), 300)
  if (!SOURCES.includes(source)) return reject(source, page, 'unknown form source', 'Something went wrong. Please chat with us on WhatsApp.')

  // Honeypot. Browser autofill can fill hidden fields too, so a filled honeypot
  // is saved as "spam" (no email) instead of being dropped: nothing real is lost.
  const spam = Boolean(clean(formData.get(HONEYPOT)))

  const needsConsent = source !== 'newsletter'
  const consent = formData.get('consent') === 'on'
  if (needsConsent && !consent) return reject(source, page, 'consent not ticked', 'Please tick the consent box so we can reply to you.')

  const answers: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$ACTION') || key === HONEYPOT || key === 'consent') continue
    if (typeof value === 'string' && value.trim()) answers[key] = value.trim().slice(0, 4000)
  }
  if (typeof answers.quiz === 'string') {
    try {
      answers.quiz = JSON.parse(answers.quiz as string)
    } catch {
      /* keep as text */
    }
  }

  const data: Record<string, unknown> = {
    source,
    consent,
    page,
    answers,
    ...(spam ? { status: 'spam' } : {}),
  }
  for (const col of COLUMNS) {
    const v = clean(formData.get(col))
    if (v) data[col] = v
  }
  // The quiz gate takes "WhatsApp number or email" in one field.
  const contact = clean(formData.get('contact'))
  if (contact) {
    if (contact.includes('@')) data.email = contact
    else data.phone = contact
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    if (source === 'quiz') {
      delete data.email
    } else {
      return reject(source, page, 'invalid email', 'Please check your email address, like name@company.co.ke.')
    }
  }
  if (!data.phone && !data.email) return reject(source, page, 'no phone or email', 'Please add a phone number or email so we can reply.')

  let leadId: string | number = ''
  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({ collection: 'leads', data: data as never, overrideAccess: true })
    leadId = doc.id
    console.info(`[leads] Saved ${spam ? 'SPAM-flagged ' : ''}lead from ${source} on ${page}`)
  } catch (err) {
    console.error('[leads] Lead save failed', err)
    return { ok: false, error: 'We could not send that. Please try again in a moment.' }
  }

  // "Get in touch": the lead is saved first, then the visitor may carry on in WhatsApp.
  // The pre-filled message carries their name and the lead number so the chat matches the lead.
  if (source === 'whatsapp') {
    const settings = await getSettings()
    const first = String(data.name || '').split(/\s+/)[0]
    const base = clean(formData.get('wa_message'), 600) || settings.waGeneral || "Hi Domands, I'd like to talk about my business."
    const wa = waHref(settings, `${base}\n\n${data.name ? `${data.name}, ` : ''}enquiry #${leadId}`)
    return {
      ok: true,
      message: `Thanks${first ? `, ${first}` : ''}. We have your enquiry and will reply within ${settings.replyTime || 'one working day'}. Want to talk now? Carry on in WhatsApp.`,
      wa,
    }
  }

  if (source === 'newsletter') return { ok: true, message: "You're subscribed. One useful idea a month, no spam." }
  if (source === 'quiz') return { ok: true }
  redirect(`/thank-you/?from=${source}`)
}
