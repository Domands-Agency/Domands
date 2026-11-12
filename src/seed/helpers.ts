/* eslint-disable @typescript-eslint/no-explicit-any */
export type Doc = Record<string, any>

export const table = (columns: string[], rows: (string[] | { strong: string[] })[]) => ({
  columns: columns.map((label) => ({ label })),
  rows: rows.map((r) =>
    Array.isArray(r)
      ? { cells: r.map((value) => ({ value })) }
      : { highlight: true, cells: r.strong.map((value) => ({ value })) },
  ),
})

export const wa = (label?: string, message?: string) => ({ action: 'whatsapp', ...(label ? { label } : {}), ...(message ? { message } : {}) })
export const call = (label?: string) => ({ action: 'call', ...(label ? { label } : {}) })
export const quiz = (label?: string) => ({ action: 'quiz', ...(label ? { label } : {}) })
export const link = (label: string, href: string) => ({ action: 'link', label, href })
export const both = () => [wa(), call()]

export const faqs = (pairs: [string, string][]) => pairs.map(([question, answer]) => ({ question, answer }))
export const steps = (pairs: [string, string][]) => pairs.map(([title, text]) => ({ title, text }))
export const addons = (pairs: [string, string][]) => pairs.map(([item, price]) => ({ item, price }))
