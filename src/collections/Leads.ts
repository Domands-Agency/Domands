import type { CollectionConfig } from 'payload'
import { emailNewLead } from '../hooks/leadEmail'

/** Every enquiry from the site: contact, service and ad forms, quiz, strategy call, Launchpad, newsletter. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'source', 'business', 'phone', 'interest', 'createdAt', 'status'],
    group: 'Enquiries',
  },
  access: {
    // Public forms write through a server action using the Local API, so nothing is public here.
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  hooks: { afterChange: [emailNewLead] },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          required: true,
          options: [
            { label: 'Contact form', value: 'contact' },
            { label: 'Service page form', value: 'service' },
            { label: 'Ad page (/go/)', value: 'ad' },
            { label: 'Digital Health Check', value: 'quiz' },
            { label: 'Free strategy call', value: 'strategy-call' },
            { label: 'Launchpad application', value: 'launchpad' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'WhatsApp enquiry', value: 'whatsapp' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          options: ['new', 'contacted', 'qualified', 'won', 'lost', 'spam'].map((v) => ({ label: v, value: v })),
          admin: { description: '"spam" = the hidden anti-bot field was filled. Usually a bot, sometimes browser autofill: glance before deleting.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'business', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: 'Phone / WhatsApp' },
        { name: 'email', type: 'email' },
      ],
    },
    { name: 'interest', type: 'text', admin: { description: 'Service or package they asked about.' } },
    { name: 'message', type: 'textarea' },
    { name: 'page', type: 'text', admin: { description: 'Page the form was sent from.' } },
    { name: 'consent', type: 'checkbox' },
    { name: 'answers', type: 'json', admin: { description: 'All form answers, quiz scores, UTM tags.' } },
  ],
}
