import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

/** Contact details and site-wide copy: change once, updates everywhere. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              name: 'whatsappNumber',
              type: 'text',
              admin: { description: 'International format, digits only, e.g. 254712345678. Empty = WhatsApp buttons go to /contact/.' },
            },
            { name: 'phoneDisplay', type: 'text', admin: { description: 'How the number is written, e.g. +254 712 345 678' } },
            { name: 'email', type: 'text' },
            { name: 'location', type: 'text', admin: { description: 'Office or area, city' } },
            { name: 'hours', type: 'text' },
            { name: 'replyTime', type: 'text', defaultValue: 'one working day' },
            { name: 'bookingUrl', type: 'text', admin: { description: 'Calendar link for a 20-minute call. Empty = /contact/.' } },
            { name: 'strategyCallUrl', type: 'text', admin: { description: 'Optional calendar link for the weekly free call.' } },
            { name: 'mapEmbedUrl', type: 'text', admin: { description: 'Google Maps embed URL for the Contact page.' } },
            {
              name: 'social',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text' },
                    { name: 'url', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Copy',
          fields: [
            { name: 'footerLine', type: 'textarea' },
            { name: 'smallPrint', type: 'text' },
            { name: 'stickyBarText', type: 'text' },
            { name: 'waGeneral', type: 'text', label: 'WhatsApp message: general' },
            {
              name: 'waPackage',
              type: 'text',
              label: 'WhatsApp message: package',
              admin: { description: 'Use {package} and {page}.' },
            },
            { name: 'waPricing', type: 'text', label: 'WhatsApp message: pricing page' },
            { name: 'consentLine', type: 'textarea', admin: { description: 'Consent text under forms. [Privacy notice] links to /privacy/.' } },
          ],
        },
        {
          label: 'Tracking',
          fields: [
            { name: 'gaMeasurementId', type: 'text', admin: { description: 'GA4 ID, e.g. G-XXXXXXX. Leave empty until the cookie banner is in place.' } },
            { name: 'organizationLogo', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}

const AREAS = [
  { label: 'Website', value: 'website' },
  { label: 'Online booking and payments', value: 'booking' },
  { label: 'Google visibility', value: 'google' },
  { label: 'Google reviews', value: 'reviews' },
  { label: 'Social media', value: 'social' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Paid ads', value: 'ads' },
  { label: 'Brand', value: 'brand' },
  { label: 'Tracking', value: 'tracking' },
]

/** The Digital Health Check quiz at /quiz/ */
export const HealthCheck: GlobalConfig = {
  slug: 'health-check',
  label: 'Digital Health Check',
  admin: { group: 'Settings' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Start & gate',
          fields: [
            { name: 'h1', type: 'text' },
            { name: 'line', type: 'textarea' },
            { name: 'reassurance', type: 'text' },
            { name: 'startLabel', type: 'text', defaultValue: 'Start the check' },
            { name: 'gateHeading', type: 'text' },
            { name: 'gateLine', type: 'textarea' },
            { name: 'gateConsent', type: 'textarea' },
            { name: 'gateButton', type: 'text', defaultValue: 'Send my report' },
            { name: 'resultFooter', type: 'textarea' },
          ],
        },
        {
          label: 'Questions',
          fields: [
            {
              name: 'questions',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                {
                  name: 'kind',
                  type: 'select',
                  required: true,
                  defaultValue: 'scored',
                  options: [
                    { label: 'Scored (0–3, answers in order)', value: 'scored' },
                    { label: 'Industry (not scored)', value: 'industry' },
                    { label: 'Goal (orders recommendations)', value: 'goal' },
                  ],
                },
                { name: 'area', type: 'select', options: AREAS, admin: { condition: (_, s) => s?.kind === 'scored' } },
                {
                  name: 'answers',
                  type: 'array',
                  admin: { description: 'Scored questions: first answer = 0 points, last = 3.' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true },
                        {
                          name: 'value',
                          type: 'text',
                          admin: { description: 'Industry: page slug. Goal: enquiries / sales / brand / time.' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Results',
          fields: [
            {
              name: 'bands',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'min', type: 'number', required: true },
                    { name: 'max', type: 'number', required: true },
                  ],
                },
                { name: 'text', type: 'textarea' },
              ],
            },
            {
              name: 'recommendations',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'area', type: 'select', options: AREAS, required: true },
                    { name: 'service', type: 'relationship', relationTo: 'services' },
                  ],
                },
                { name: 'freeFix', type: 'textarea' },
                { name: 'help', type: 'text', admin: { description: 'e.g. "Website Design from KES 35,000"' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
