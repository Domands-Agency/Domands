import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { faqsField, proseDescription, seoField, slugField, stepsField, tableFields } from '../fields/shared'

export const SERVICE_GROUPS = [
  { label: 'Get online', value: 'get-online' },
  { label: 'Get found', value: 'get-found' },
  { label: 'Get noticed', value: 'get-noticed' },
  { label: 'Get closer to customers', value: 'get-closer' },
  { label: 'Get a plan', value: 'get-plan' },
]

/** The 12 service pages. Each is served at a flat URL: /<slug>/ */
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'fromPrice', 'group', 'order'],
    group: 'Site',
  },
  defaultSort: 'order',
  access: { read: () => true },
  hooks: revalidateHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Card & theme',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'group', type: 'select', options: SERVICE_GROUPS, required: true },
                { name: 'order', type: 'number', defaultValue: 0 },
              ],
            },
            { name: 'cardLine', type: 'text', required: true, admin: { description: 'One line for service cards.' } },
            { name: 'fromPrice', type: 'text', required: true, admin: { description: 'e.g. "KES 35,000" or "KES 20,000/month"' } },
            {
              name: 'theme',
              type: 'group',
              admin: {
                description:
                  'Three tokens the design system swaps in. Check WCAG AA: white text on "main" and "ink" text on "surface" must reach 4.5:1.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'main', type: 'text', defaultValue: '#1D4ED8' },
                    { name: 'surface', type: 'text', defaultValue: '#EFF4FF' },
                    { name: 'ink', type: 'text', defaultValue: '#0B1B4D' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Hero & packages',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'h1', type: 'text', required: true },
                { name: 'sub', type: 'textarea' },
                { name: 'priceLine', type: 'text' },
                { name: 'proofLine', type: 'text' },
                { name: 'packagesButton', type: 'text', defaultValue: 'See packages' },
              ],
            },
            { name: 'packagesHeading', type: 'text' },
            {
              name: 'packages',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'popular', type: 'checkbox', label: 'Most popular' },
                    { name: 'popularLabel', type: 'text', admin: { description: 'Badge text; default "Most popular"' } },
                  ],
                },
                { name: 'for', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'price', type: 'text' },
                    { name: 'delivery', type: 'text' },
                  ],
                },
                {
                  name: 'details',
                  type: 'array',
                  admin: { description: 'Extra rows, e.g. "Setup (once)" or "Content".' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text' },
                        { name: 'value', type: 'text' },
                      ],
                    },
                  ],
                },
                { name: 'includes', type: 'textarea', admin: { description: 'What you get. ' + proseDescription } },
                { name: 'buttonLabel', type: 'text', defaultValue: 'Get a quote' },
              ],
            },
            { name: 'packagesNote', type: 'textarea', admin: { description: proseDescription } },
            { name: 'notQuite', type: 'textarea', admin: { description: '"Not quite what you need?" ' + proseDescription } },
            { name: 'proof', type: 'textarea', admin: { description: proseDescription } },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'sections',
              type: 'array',
              admin: { description: 'One H2 per bundled service. These rank for the narrower search phrases.' },
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'anchor', type: 'text', admin: { description: 'Optional id for links like /branding/#logo' } },
                { name: 'body', type: 'textarea', admin: { description: proseDescription } },
                { name: 'table', type: 'group', fields: tableFields },
              ],
            },
            { name: 'howItWorksHeading', type: 'text', defaultValue: 'How it works' },
            stepsField,
            { name: 'needs', type: 'textarea', label: 'What we need from you', admin: { description: proseDescription } },
            { name: 'notIncluded', type: 'textarea', admin: { description: proseDescription } },
            {
              name: 'addons',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'item', type: 'text' },
                    { name: 'price', type: 'text' },
                  ],
                },
              ],
            },
            faqsField,
          ],
        },
        {
          label: 'Links & closing',
          fields: [
            { name: 'learnMore', type: 'textarea', admin: { description: 'Planned article titles until articles are linked below. ' + proseDescription } },
            { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
            {
              name: 'pairsWith',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'service', type: 'relationship', relationTo: 'services' },
                    { name: 'line', type: 'text' },
                  ],
                },
              ],
            },
            { name: 'pairsWithNote', type: 'text' },
            {
              name: 'closing',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'line', type: 'text' },
                {
                  name: 'packageOptions',
                  type: 'text',
                  admin: { description: 'Options for "Which package?", separated by " / ". Empty = no form.' },
                },
                { name: 'packageQuestion', type: 'text', defaultValue: 'Which package?' },
                { name: 'extraField', type: 'text', admin: { description: 'Optional extra form question, e.g. "Number of products".' } },
              ],
            },
          ],
        },
      ],
    },
    slugField,
    seoField,
  ],
}
