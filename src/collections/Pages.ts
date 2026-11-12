import type { CollectionConfig } from 'payload'
import { pageBlocks } from '../blocks'
import { revalidateHooks } from '../hooks/revalidate'
import { seoField, slugField } from '../fields/shared'

/**
 * Block-built pages: Home (slug "home"), Services hub, Industries hub, Pricing,
 * Contact, Thank you, About, Our work, Insights, free offers and legal pages.
 * Served at /<slug>/ (Home at /).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'], group: 'Site' },
  access: { read: () => true },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'default',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Domands default', value: 'default' },
        { label: 'Use a service colour', value: 'service' },
      ],
    },
    {
      name: 'themeService',
      type: 'relationship',
      relationTo: 'services',
      admin: { position: 'sidebar', condition: (d) => d?.theme === 'service' },
    },
    { name: 'layout', type: 'blocks', blocks: pageBlocks },
    slugField,
    seoField,
  ],
}
