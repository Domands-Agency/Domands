import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { faqsField, proseDescription, seoField, slugField } from '../fields/shared'

/** Industry landing pages at /industries/<slug>/ */
export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'order'], group: 'Site' },
  defaultSort: 'order',
  access: { read: () => true },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'cardLine', type: 'text', required: true },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'h1', type: 'text', required: true },
        { name: 'sub', type: 'textarea' },
      ],
    },
    { name: 'problems', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'servicesHeading', type: 'text' },
    {
      name: 'services',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'service', type: 'relationship', relationTo: 'services', required: true },
            { name: 'text', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'firstProject',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'rules',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Rules we work within' },
        { name: 'text', type: 'textarea', admin: { description: proseDescription } },
      ],
    },
    { name: 'proof', type: 'textarea', admin: { description: proseDescription } },
    { name: 'insightsHeading', type: 'text' },
    { name: 'insights', type: 'textarea', admin: { description: 'Planned articles. ' + proseDescription } },
    faqsField,
    {
      name: 'closing',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'line', type: 'text' },
      ],
    },
    slugField,
    seoField,
  ],
}
