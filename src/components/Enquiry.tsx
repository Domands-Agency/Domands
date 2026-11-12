'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { enquiryFields } from '@/lib/forms'
import { LeadForm, leadDone } from './LeadForm'
import { WhatsAppIcon } from './WhatsAppIcon'

/**
 * Replaces every direct "Chat on WhatsApp" link. The visitor leaves a name and
 * WhatsApp number first (saved as a lead, emailed to the team), then can carry on
 * in WhatsApp. Once they have sent any form in this session, it opens WhatsApp directly.
 */
export function EnquiryButton({
  label = 'Get in touch',
  className = 'btn btn-whatsapp',
  waUrl,
  message,
  interest,
  consent,
  children,
}: {
  label?: string
  className?: string
  /** Direct WhatsApp link, used only after the visitor has already left their details. */
  waUrl: string
  /** Pre-filled WhatsApp text (e.g. the package they asked about). */
  message?: string | null
  interest?: string | null
  consent?: string | null
  children?: React.ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [known, setKnown] = useState(false)
  const [page, setPage] = useState('')
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    setKnown(leadDone())
    setPage(window.location.pathname)
    // Any form sent elsewhere on the page switches every button to "Continue on WhatsApp".
    const onLead = () => setKnown(true)
    window.addEventListener('dm-lead-done', onLead)
    return () => window.removeEventListener('dm-lead-done', onLead)
  }, [])

  const open = () => {
    if (leadDone()) {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setFormKey((k) => k + 1)
    dialog.current?.showModal()
  }

  return (
    <>
      <button type="button" className={className} onClick={open} data-track={known ? 'whatsapp' : 'enquiry'}>
        {children ?? (
          <>
            {known ? <WhatsAppIcon /> : <MessageSquare aria-hidden="true" size={18} />}
            <span>{known ? 'Continue on WhatsApp' : label}</span>
          </>
        )}
      </button>
      <dialog
        ref={dialog}
        className="enquiry-dialog"
        aria-labelledby={`enq-title-${formKey}`}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close()
        }}
      >
        <div className="enquiry-panel">
          <button type="button" className="enquiry-close" aria-label="Close" onClick={() => dialog.current?.close()}>
            <X aria-hidden="true" size={20} />
          </button>
          <h2 id={`enq-title-${formKey}`}>Get in touch</h2>
          <p className="enquiry-intro">
            Leave your name and WhatsApp number so we can reply. Then carry on in WhatsApp straight away if you like.
          </p>
          <LeadForm
            key={formKey}
            source="whatsapp"
            fields={enquiryFields}
            submitLabel="Send enquiry"
            consent={consent}
            page={page}
            compact
            extraHidden={{
              ...(interest ? { interest } : {}),
              ...(message ? { wa_message: message } : {}),
            }}
            onDone={() => setKnown(true)}
          />
        </div>
      </dialog>
    </>
  )
}
