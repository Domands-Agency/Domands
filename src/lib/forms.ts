export type FieldDef = {
  name: string
  label: string
  type: 'text' | 'tel' | 'email' | 'select' | 'textarea' | 'url'
  required?: boolean
  options?: string[]
  placeholder?: string
  autoComplete?: string
  full?: boolean
}

export type FormSource = 'contact' | 'service' | 'ad' | 'quiz' | 'strategy-call' | 'launchpad' | 'newsletter' | 'whatsapp'

const name: FieldDef = { name: 'name', label: 'Name', type: 'text', required: true, autoComplete: 'name' }
const phone: FieldDef = { name: 'phone', label: 'Phone (WhatsApp)', type: 'tel', required: true, autoComplete: 'tel' }
const business: FieldDef = { name: 'business', label: 'Business name', type: 'text', required: true, autoComplete: 'organization' }

export function contactFields(services: string[]): FieldDef[] {
  return [
    name,
    phone,
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    business,
    { name: 'interest', label: 'What do you need help with?', type: 'select', options: [...services, 'Not sure'], required: true },
    {
      name: 'budget',
      label: 'Budget range',
      type: 'select',
      options: ['Under KES 50,000', 'KES 50,000–150,000', 'Over KES 150,000', 'Not sure'],
    },
    { name: 'message', label: 'Tell us more', type: 'textarea', full: true },
  ]
}

export function serviceFields(packageQuestion: string, options: string[], extra?: string | null): FieldDef[] {
  const fields: FieldDef[] = [name, { ...phone, label: 'Phone' }, { ...business, label: 'Business' }]
  if (extra) fields.push({ name: 'extra', label: extra, type: 'text' })
  if (options.length) fields.push({ name: 'interest', label: packageQuestion, type: 'select', options, required: true })
  return fields
}

export const adFields: FieldDef[] = [name, phone, business]

export const strategyCallFields: FieldDef[] = [
  name,
  business,
  { name: 'website', label: 'Website or social page', type: 'text' },
  { ...phone, label: 'WhatsApp number' },
  {
    name: 'interest',
    label: 'Your main goal this year',
    type: 'select',
    required: true,
    options: ['More enquiries', 'More online sales', 'A stronger brand', 'Less time on marketing'],
  },
  { name: 'tried', label: 'What have you tried so far?', type: 'textarea', full: true },
  {
    name: 'budget',
    label: 'Rough monthly marketing budget',
    type: 'select',
    options: ['None yet', 'Under KES 20,000', 'KES 20,000–50,000', 'Over KES 50,000'],
  },
]

export const launchpadFields: FieldDef[] = [
  { ...name, label: 'Founder name' },
  business,
  { ...phone, label: 'WhatsApp number' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  {
    name: 'interest',
    label: 'Industry',
    type: 'select',
    options: ['Technology', 'Financial services', 'Professional services', 'Healthcare', 'Education', 'Other'],
  },
  { name: 'started', label: 'When did you start trading?', type: 'text', placeholder: 'Month and year' },
  { name: 'message', label: 'What does your business do? (2–3 sentences)', type: 'textarea', full: true, required: true },
  { name: 'customers', label: 'Who are your customers?', type: 'textarea', full: true },
  { name: 'change', label: 'What would a website and online presence change for you?', type: 'textarea', full: true },
  { name: 'links', label: 'Links to any social pages', type: 'text', full: true },
]

export const newsletterFields: FieldDef[] = [
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
]

/** "Get in touch": the short form every WhatsApp button opens, so each chat starts as a saved lead. */
export const enquiryFields: FieldDef[] = [
  { ...name, full: true },
  { ...phone, label: 'WhatsApp number', placeholder: '07xx xxx xxx', full: true },
]
