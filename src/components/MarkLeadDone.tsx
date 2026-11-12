'use client'

import { useEffect } from 'react'
import { markLeadDone } from './LeadForm'

/** On /thank-you/: the visitor has just sent a form, so WhatsApp buttons open WhatsApp directly. */
export function MarkLeadDone() {
  useEffect(() => markLeadDone(), [])
  return null
}
