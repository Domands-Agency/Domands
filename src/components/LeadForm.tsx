'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { submitLead, type FormState } from '@/app/(frontend)/actions'
import type { FieldDef, FormSource } from '@/lib/forms'
import { WhatsAppIcon } from './WhatsAppIcon'

const LEAD_KEY = 'dm_lead_done'
/** Remember (this browser tab session) that the visitor already left their details. */
export function markLeadDone() {
  sessionStorageSet(LEAD_KEY, '1')
  window.dispatchEvent(new Event('dm-lead-done'))
}
export function leadDone() {
  return sessionStorageGet(LEAD_KEY) === '1'
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']

function ConsentText({ text }: { text: string }) {
  const parts = text.split(/(\[Privacy notice\])/)
  return (
    <>
      {parts.map((p, i) =>
        p === '[Privacy notice]' ? (
          <a key={i} href="/privacy/" target="_blank">
            Privacy notice
          </a>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  )
}

export function LeadForm({
  source,
  fields,
  submitLabel = 'Send message',
  consent,
  page,
  defaults,
  compact,
  extraHidden,
  onDone,
}: {
  source: FormSource
  fields: FieldDef[]
  submitLabel?: string
  consent?: string | null
  page: string
  defaults?: Record<string, string>
  compact?: boolean
  extraHidden?: Record<string, string>
  onDone?: () => void
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitLead, { ok: false })
  const [utm, setUtm] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const found: Record<string, string> = {}
    for (const k of UTM_KEYS) {
      const v = params.get(k) || sessionStorageGet(k)
      if (v) {
        found[k] = v
        sessionStorageSet(k, v)
      }
    }
    setUtm(found)
  }, [])

  useEffect(() => {
    if (state.ok) markLeadDone()
    if (state.ok && onDone) onDone()
  }, [state.ok, onDone])

  if (state.ok && state.message) {
    return (
      <div className="form-done">
        <p className="form-success" role="status">
          <CircleCheck aria-hidden="true" size={20} />
          <span>{state.message}</span>
        </p>
        {state.wa && (
          <a className="btn btn-whatsapp btn-lg" href={state.wa} target="_blank" rel="noopener noreferrer" data-track="whatsapp">
            <WhatsAppIcon />
            <span>Continue on WhatsApp</span>
          </a>
        )}
      </div>
    )
  }

  return (
    <form action={action} className={compact ? 'lead-form compact' : 'lead-form'} noValidate={false}>
      <input type="hidden" name="_source" value={source} />
      <input type="hidden" name="_page" value={page} />
      {Object.entries({ ...utm, ...extraHidden }).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <div className="hp" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="hp_x7q" tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" />
        </label>
      </div>
      <div className="form-grid">
        {fields.map((f) => {
          const id = `${source}-${f.name}`
          const common = {
            id,
            name: f.name,
            required: f.required,
            defaultValue: defaults?.[f.name],
            autoComplete: f.autoComplete,
            placeholder: f.placeholder,
          }
          return (
            <div key={f.name} className={f.full || f.type === 'textarea' ? 'field full' : 'field'}>
              <label htmlFor={id}>
                {f.label}
                {f.required && <span aria-hidden="true"> *</span>}
              </label>
              {f.type === 'select' ? (
                <select {...common} defaultValue={defaults?.[f.name] ?? ''}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea {...common} rows={4} />
              ) : (
                <input {...common} type={f.type} />
              )}
            </div>
          )
        })}
      </div>
      {consent && (
        <label className="consent">
          <input type="checkbox" name="consent" required />
          <span>
            <ConsentText text={consent} />
          </span>
        </label>
      )}
      {state.error && (
        <p className="form-error" role="alert">
          <CircleAlert aria-hidden="true" size={20} />
          <span>{state.error}</span>
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Sending…' : submitLabel}
      </button>
    </form>
  )
}

function sessionStorageGet(k: string) {
  try {
    return window.sessionStorage.getItem(k)
  } catch {
    return null
  }
}
function sessionStorageSet(k: string, v: string) {
  try {
    window.sessionStorage.setItem(k, v)
  } catch {
    /* ignore */
  }
}
