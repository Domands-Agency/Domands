import type { CollectionAfterChangeHook } from 'payload'

const SOURCE_LABELS: Record<string, string> = {
  contact: 'Contact form',
  service: 'Service page',
  ad: 'Ad page',
  quiz: 'Digital Health Check',
  'strategy-call': 'Free strategy call',
  launchpad: 'Launchpad application',
  newsletter: 'Newsletter sign-up',
  whatsapp: 'WhatsApp enquiry',
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** 0712 345 678 / +254 712… / 254712… → 254712345678 for a wa.me link. */
function waNumber(phone?: string | null) {
  const d = String(phone || '').replace(/\D/g, '')
  if (/^0[17]\d{8}$/.test(d)) return '254' + d.slice(1)
  if (/^254[17]\d{8}$/.test(d)) return d
  if (/^[17]\d{8}$/.test(d)) return '254' + d
  return d.length >= 10 ? d : ''
}

/**
 * Emails every new lead to the team. Recipient: LEAD_EMAIL_TO in .env, else the
 * email in Site settings. Never throws: a failed email must not lose the lead,
 * which is already saved by the time this runs.
 */
export const emailNewLead: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create' || doc.status === 'spam') return doc
  const { payload } = req
  try {
    const settings = (await payload.findGlobal({ slug: 'site-settings', req, depth: 0 })) as { email?: string | null }
    const to = process.env.LEAD_EMAIL_TO || settings.email
    if (!to) {
      payload.logger.warn('[leads] No LEAD_EMAIL_TO or Site settings email, so no lead email was sent.')
      return doc
    }

    const source = SOURCE_LABELS[doc.source] || doc.source
    const who = doc.name || doc.business || doc.phone || doc.email || 'Someone'
    const subject = `New lead: ${who}${doc.interest ? ` · ${doc.interest}` : ''} (${source})`
    const base = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')
    const adminUrl = `${base}/admin/collections/leads/${doc.id}`
    const wa = waNumber(doc.phone)

    const rows: [string, unknown][] = [
      ['Name', doc.name],
      ['Business', doc.business],
      ['Phone / WhatsApp', doc.phone],
      ['Email', doc.email],
      ['Interested in', doc.interest],
      ['Message', doc.message],
      ['From', source],
      ['Page', doc.page],
    ]
    const extras = Object.entries((doc.answers || {}) as Record<string, unknown>).filter(
      ([k]) => !k.startsWith('_') && !['name', 'business', 'phone', 'email', 'interest', 'message', 'contact'].includes(k),
    )
    const show = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2))

    const text = [
      `New lead from the website (${source}).`,
      '',
      ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
      ...(extras.length ? ['', 'Other answers:', ...extras.map(([k, v]) => `${k}: ${show(v)}`)] : []),
      '',
      wa ? `Reply on WhatsApp: https://wa.me/${wa}` : '',
      `Open in the CMS: ${adminUrl}`,
    ]
      .filter((l, i, a) => l !== '' || a[i - 1] !== '')
      .join('\n')

    const tr = (k: string, v: unknown) =>
      `<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;font-weight:600;white-space:nowrap">${esc(k)}</th><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`
    const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:22px;color:#000">
<p style="font-size:18px;font-weight:700;margin:0 0 12px">New lead from the website</p>
<table cellspacing="0" cellpadding="0" style="border-collapse:collapse">${rows.filter(([, v]) => v).map(([k, v]) => tr(k, v)).join('')}</table>
${extras.length ? `<p style="font-weight:700;margin:20px 0 6px">Other answers</p><table cellspacing="0" cellpadding="0">${extras.map(([k, v]) => tr(k, show(v))).join('')}</table>` : ''}
<p style="margin:24px 0 0">
${wa ? `<a href="https://wa.me/${wa}" style="display:inline-block;background:#000;color:#fff;padding:12px 20px;text-decoration:none;font-weight:600;margin-right:8px">Reply on WhatsApp</a>` : ''}
<a href="${esc(adminUrl)}" style="display:inline-block;border:2px solid #000;color:#000;padding:10px 18px;text-decoration:none;font-weight:600">Open in the CMS</a>
</p></div>`

    await payload.sendEmail({
      to,
      subject,
      text,
      html,
      ...(doc.email ? { replyTo: doc.email } : {}),
    })
    payload.logger.info(
      process.env.SMTP_HOST
        ? `[leads] Emailed lead ${doc.id} to ${to}`
        : `[leads] Lead ${doc.id} email NOT sent: set SMTP_HOST and SMTP_PASS in .env to send to ${to}`,
    )
  } catch (err) {
    payload.logger.error({ err, msg: `[leads] Lead ${doc.id} saved, but the email failed` })
  }
  return doc
}
