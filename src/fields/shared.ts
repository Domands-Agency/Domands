import type { Field } from 'payload'

/** SEO title + meta description, used by every public page. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'title', type: 'text', admin: { description: 'About 60 characters: phrase + price + brand.' } },
    { name: 'description', type: 'textarea', admin: { description: 'About 150 characters.' } },
    { name: 'noindex', type: 'checkbox', defaultValue: false },
  ],
}

export const proseDescription =
  'Plain text. Blank line = new paragraph. Lines starting "- " = bullets, "1. " = numbered. **bold**, [link text](/url). Anything else in [square brackets] shows as a placeholder to fill in.'

/** The standard buttons from the copy deck. "whatsapp" and "call" read their targets from Site settings. */
export const buttonsField = (name = 'buttons'): Field => ({
  name,
  type: 'array',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'action',
          type: 'select',
          required: true,
          defaultValue: 'whatsapp',
          options: [
            { label: 'Chat on WhatsApp', value: 'whatsapp' },
            { label: 'Book a call', value: 'call' },
            { label: 'Digital Health Check (/quiz/)', value: 'quiz' },
            { label: 'Jump to section', value: 'anchor' },
            { label: 'Link', value: 'link' },
          ],
        },
        { name: 'label', type: 'text', admin: { description: 'Leave empty for the standard wording.' } },
        {
          name: 'href',
          type: 'text',
          admin: { condition: (_, s) => s?.action === 'link' || s?.action === 'anchor' },
        },
      ],
    },
    {
      name: 'message',
      type: 'text',
      admin: {
        condition: (_, s) => s?.action === 'whatsapp',
        description: 'Pre-filled WhatsApp message. Empty = the general message from Site settings.',
      },
    },
  ],
})

export const faqsField: Field = {
  name: 'faqs',
  type: 'array',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { initCollapsed: true },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true, admin: { description: proseDescription } },
  ],
}

/** A simple editable table: column headers + rows of cells. */
export const tableFields: Field[] = [
  {
    name: 'columns',
    type: 'array',
    admin: { initCollapsed: true },
    fields: [{ name: 'label', type: 'text' }],
  },
  {
    name: 'rows',
    type: 'array',
    admin: { initCollapsed: true },
    fields: [
      { name: 'highlight', type: 'checkbox', admin: { description: 'Bold row (e.g. a group header or total).' } },
      {
        name: 'cells',
        type: 'array',
        fields: [{ name: 'value', type: 'text' }],
      },
    ],
  },
]

export const stepsField: Field = {
  name: 'steps',
  type: 'array',
  admin: { initCollapsed: true },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Call (week 0)"' } },
    { name: 'text', type: 'textarea' },
  ],
}

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'The URL part, e.g. "website-design".' },
}
