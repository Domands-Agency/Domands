/**
 * Loads all copy from the Phase 1–4 copy decks into Payload.
 * Run with: npm run seed
 * Safe to re-run: it replaces Services, Industries, Pages, Ad pages, Founders and both globals.
 * It never touches Leads, Users, Media, Insights or Case studies.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { servicesA } from './services-a'
import { servicesB } from './services-b'
import { adPages, founders, healthCheck, industries, settings } from './other'
import { pages } from './pages'
import type { Doc } from './helpers'

const payload = await getPayload({ config })
const log = (m: string) => payload.logger.info(`[seed] ${m}`)

async function wipe(collection: 'pages' | 'services' | 'industries' | 'ad-pages' | 'founders') {
  await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true })
}

// Order matters: pages and industries reference services.
for (const c of ['pages', 'ad-pages', 'industries', 'founders', 'services'] as const) await wipe(c)
log('cleared old content')

const services = [...servicesA, ...servicesB]
const ids: Record<string, number | string> = {}
for (const s of services) {
  const { pairsWith: _p, ...data } = s
  const doc = await payload.create({ collection: 'services', data: data as never, overrideAccess: true })
  ids[s.slug] = doc.id
}
const sid = (slug: string) => {
  if (!ids[slug]) throw new Error(`Unknown service slug "${slug}"`)
  return ids[slug]
}
for (const s of services) {
  if (!s.pairsWith?.length) continue
  await payload.update({
    collection: 'services',
    id: ids[s.slug],
    data: { pairsWith: s.pairsWith.map(([slug, line]: [string, string]) => ({ service: sid(slug), line })) } as never,
    overrideAccess: true,
  })
}
log(`${services.length} services`)

for (const ind of industries) {
  await payload.create({
    collection: 'industries',
    data: { ...ind, problems: ind.problems.map((text: string) => ({ text })), services: ind.services.map(([slug, text]: [string, string]) => ({ service: sid(slug), text })) } as never,
    overrideAccess: true,
  })
}
log(`${industries.length} industries`)

for (const f of founders) {
  await payload.create({ collection: 'founders', data: { ...f, services: f.services.map(sid) } as never, overrideAccess: true })
}
log(`${founders.length} founders`)

for (const ad of adPages) {
  await payload.create({
    collection: 'ad-pages',
    data: { ...ad, backsUp: sid(ad.backsUp), whatYouGet: ad.whatYouGet.map((text: string) => ({ text })) } as never,
    overrideAccess: true,
  })
}
log(`${adPages.length} ad pages`)

const resolveBlocks = (layout: Doc[]) =>
  layout.map((b) =>
    b.blockType === 'priceTable'
      ? { ...b, groups: b.groups.map((g: Doc) => ({ ...g, rows: g.rows.map((r: Doc) => ({ ...r, service: r.service ? sid(r.service) : undefined })) })) }
      : b,
  )
for (const p of pages) {
  await payload.create({ collection: 'pages', data: { ...p, layout: resolveBlocks(p.layout) } as never, overrideAccess: true })
}
log(`${pages.length} pages`)

await payload.updateGlobal({ slug: 'site-settings', data: settings as never, overrideAccess: true })
await payload.updateGlobal({
  slug: 'health-check',
  data: { ...healthCheck, recommendations: healthCheck.recommendations.map((r: Doc) => ({ ...r, service: sid(r.service) })) } as never,
  overrideAccess: true,
})
log('site settings and Digital Health Check')

log('done. Fill in WhatsApp number, email and the [placeholders] in /admin.')
process.exit(0)
