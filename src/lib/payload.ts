import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Industry, Page, Service, SiteSetting } from '@/payload-types'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getServices = cache(async (): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', limit: 100, sort: 'order', depth: 0 })
  return res.docs
})

export const getIndustries = cache(async (): Promise<Industry[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'industries', limit: 100, sort: 'order', depth: 0 })
  return res.docs
})

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
})

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
})

export async function findBySlug<T>(collection: 'industries' | 'founders' | 'case-studies' | 'posts' | 'ad-pages', slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return (res.docs[0] as T) ?? null
}

export async function allSlugs(collection: 'pages' | 'services' | 'industries' | 'founders' | 'case-studies' | 'posts' | 'ad-pages') {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection, limit: 500, depth: 0, select: { slug: true } as never })
    return res.docs.map((d) => ({ slug: (d as { slug: string }).slug }))
  } catch {
    return []
  }
}
