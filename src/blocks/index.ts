import type { Block } from 'payload'
import { buttonsField, faqsField, proseDescription, stepsField, tableFields } from '../fields/shared'

const headingFields = [
  { name: 'heading', type: 'text' as const },
  { name: 'intro', type: 'textarea' as const, admin: { description: proseDescription } },
  { name: 'anchor', type: 'text' as const, admin: { description: 'Optional section id for jump links.' } },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true, admin: { description: 'The H1.' } },
    { name: 'sub', type: 'textarea', admin: { description: proseDescription } },
    { name: 'note', type: 'text', admin: { description: 'Small line under the buttons (proof, availability, status).' } },
    buttonsField(),
  ],
}

export const ContentBlock: Block = {
  slug: 'content',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [
    ...headingFields,
    { name: 'body', type: 'textarea', admin: { description: proseDescription } },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'plain',
      options: [
        { label: 'Plain', value: 'plain' },
        { label: 'Band (tinted background)', value: 'band' },
        { label: 'Narrow (legal / long reading)', value: 'narrow' },
      ],
    },
    buttonsField(),
  ],
}

export const CardsBlock: Block = {
  slug: 'cards',
  labels: { singular: 'Cards', plural: 'Cards' },
  fields: [
    ...headingFields,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'],
    },
    { name: 'numbered', type: 'checkbox', admin: { description: 'Show 1, 2, 3… on the cards.' } },
    {
      name: 'cards',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea', admin: { description: proseDescription } },
        { name: 'meta', type: 'text', admin: { description: 'Small line, e.g. a price.' } },
        buttonsField(),
      ],
    },
    buttonsField('footerButtons'),
  ],
}

export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: 'Steps', plural: 'Steps' },
  fields: [...headingFields, stepsField],
}

export const TableBlock: Block = {
  slug: 'table',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [...headingFields, ...tableFields, { name: 'after', type: 'textarea', admin: { description: proseDescription } }],
}

export const PriceTableBlock: Block = {
  slug: 'priceTable',
  labels: { singular: 'Price table', plural: 'Price tables' },
  fields: [
    ...headingFields,
    {
      name: 'groups',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'rows',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'price', type: 'text' },
                { name: 'time', type: 'text' },
              ],
            },
            { name: 'service', type: 'relationship', relationTo: 'services' },
          ],
        },
      ],
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQs', plural: 'FAQs' },
  fields: [...headingFields, faqsField],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'line', type: 'textarea', admin: { description: proseDescription } },
    buttonsField(),
  ],
}

export const FormBlock: Block = {
  slug: 'form',
  labels: { singular: 'Form', plural: 'Forms' },
  fields: [
    ...headingFields,
    {
      name: 'form',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Free strategy call booking', value: 'strategy-call' },
        { label: 'Launchpad application', value: 'launchpad' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
    },
    { name: 'submitLabel', type: 'text' },
    { name: 'after', type: 'textarea', admin: { description: 'Shown under the form. ' + proseDescription } },
  ],
}

/** Dynamic lists pulled from collections. */
export const CollectionListBlock: Block = {
  slug: 'list',
  labels: { singular: 'Collection list', plural: 'Collection lists' },
  fields: [
    ...headingFields,
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'Services (all 12 cards)', value: 'services' },
        { label: 'Services, grouped', value: 'services-grouped' },
        { label: 'Industries', value: 'industries' },
        { label: 'Latest insights', value: 'posts' },
        { label: 'Case studies', value: 'case-studies' },
        { label: 'Founders', value: 'founders' },
      ],
    },
    { name: 'limit', type: 'number', defaultValue: 12 },
    { name: 'empty', type: 'textarea', admin: { description: 'Shown when there is nothing to list yet. ' + proseDescription } },
    buttonsField('footerButtons'),
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  ContentBlock,
  CardsBlock,
  StepsBlock,
  TableBlock,
  PriceTableBlock,
  FaqBlock,
  CtaBlock,
  FormBlock,
  CollectionListBlock,
]
