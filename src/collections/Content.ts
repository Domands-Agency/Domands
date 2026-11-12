import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { proseDescription, seoField, slugField } from '../fields/shared'

const published = {
  read: ({ req }: { req: { user?: unknown } }) =>
    req.user ? true : { _status: { equals: 'published' } },
}

/** Insights articles at /insights/<slug>/ */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Insights' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'author', 'service', 'publishedAt', '_status'], group: 'Content' },
  versions: { drafts: true },
  access: published,
  hooks: revalidateHooks,
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'answer',
      type: 'textarea',
      admin: { description: 'The direct answer to the target question, in the first two sentences.' },
    },
    { name: 'body', type: 'richText' },
    slugField,
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'author', type: 'relationship', relationTo: 'founders', admin: { position: 'sidebar' } },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      admin: { position: 'sidebar', description: 'The one service page this article sends readers to.' },
    },
    { name: 'industry', type: 'relationship', relationTo: 'industries', admin: { position: 'sidebar' } },
    { name: 'related', type: 'relationship', relationTo: 'posts', hasMany: true, admin: { position: 'sidebar' } },
    seoField,
  ],
}

/** Case studies at /work/<slug>/ */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case study', plural: 'Case studies' },
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'resultLine', '_status'],
    group: 'Content',
    description: 'Only publish once the client has agreed to be named.',
  },
  versions: { drafts: true },
  access: published,
  hooks: revalidateHooks,
  fields: [
    { name: 'client', type: 'text', required: true },
    { name: 'headline', type: 'text', required: true, admin: { description: 'The result in one line.' } },
    { name: 'resultLine', type: 'text', admin: { description: 'Short result for cards.' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'about', type: 'textarea', label: 'The client', admin: { description: proseDescription } },
    { name: 'problem', type: 'textarea', admin: { description: proseDescription } },
    { name: 'whatWeDid', type: 'textarea', admin: { description: proseDescription } },
    { name: 'result', type: 'textarea', admin: { description: 'Numbers first. ' + proseDescription } },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'text', type: 'textarea' },
        { name: 'name', type: 'text', admin: { description: 'Name, role, business' } },
      ],
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    slugField,
    { name: 'industry', type: 'relationship', relationTo: 'industries', admin: { position: 'sidebar' } },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, admin: { position: 'sidebar' } },
    seoField,
  ],
}

/** Founder (author) pages at /about/<slug>/ */
export const Founders: CollectionConfig = {
  slug: 'founders',
  admin: { useAsTitle: 'name', group: 'Content' },
  access: { read: () => true },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'leadsLine', type: 'text', admin: { description: 'One line on what they lead (for cards).' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'intro', type: 'textarea', admin: { description: 'First person, 3–4 sentences. ' + proseDescription } },
    { name: 'experience', type: 'textarea', admin: { description: proseDescription } },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, label: 'What I lead' },
    { name: 'linkedin', type: 'text' },
    { name: 'bookingUrl', type: 'text', admin: { description: 'Optional personal calendar link.' } },
    slugField,
    seoField,
  ],
}

/** Single-offer ad landing pages at /go/<slug>/ — no menu, noindex. */
export const AdPages: CollectionConfig = {
  slug: 'ad-pages',
  labels: { singular: 'Ad page', plural: 'Ad pages (/go/)' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'backsUp'], group: 'Site' },
  access: { read: () => true },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'Internal name, e.g. "Launch Website".' } },
    { name: 'h1', type: 'text', required: true, admin: { description: 'Repeats the ad word for word.' } },
    { name: 'sub', type: 'textarea' },
    { name: 'whatYouGetHeading', type: 'text', defaultValue: 'What you get' },
    { name: 'whatYouGet', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'proof', type: 'textarea', admin: { description: proseDescription } },
    {
      name: 'faqs',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'closingLine', type: 'text' },
    { name: 'whatsappMessage', type: 'text', admin: { description: 'Pre-filled with the offer.' } },
    slugField,
    { name: 'backsUp', type: 'relationship', relationTo: 'services', admin: { position: 'sidebar' } },
    {
      name: 'adCopy',
      type: 'group',
      admin: { description: 'Reference only, not shown on the page: the matching ad copy.' },
      fields: [
        { name: 'googleHeadlines', type: 'textarea' },
        { name: 'googleDescriptions', type: 'textarea' },
        { name: 'metaPrimaryText', type: 'textarea' },
      ],
    },
  ],
}
