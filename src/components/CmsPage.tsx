import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Page } from '@/payload-types'
import { getPage, getSettings } from '@/lib/payload'
import { RenderBlocks } from './RenderBlocks'
import { JsonLd } from './ui'
import { MarkLeadDone } from './MarkLeadDone'

export const siteUrl = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export function pathFor(slug: string) {
  return slug === 'home' ? '/' : `/${slug}/`
}

export function metaFrom(seo: { title?: string | null; description?: string | null; noindex?: boolean | null } | null | undefined, fallbackTitle: string, path: string): Metadata {
  return {
    title: seo?.title || `${fallbackTitle} | Domands Creative`,
    description: seo?.description || undefined,
    alternates: { canonical: path },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: { title: seo?.title || fallbackTitle, description: seo?.description || undefined, url: path },
  }
}

export async function cmsPageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug)
  if (!page) return {}
  return metaFrom(page.seo, page.title, pathFor(slug))
}

export async function CmsPage({ slug, page: given }: { slug: string; page?: Page | null }) {
  const [page, settings] = await Promise.all([given ?? getPage(slug), getSettings()])
  if (!page) notFound()
  const local = ['home', 'contact'].includes(slug)
  return (
    <div className={`themed page-${slug}`}>
      {slug === 'thank-you' && <MarkLeadDone />}
      {local && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Domands Creative',
            url: siteUrl(),
            areaServed: 'KE',
            priceRange: 'KES 4,000–165,000',
            ...(settings.phoneDisplay ? { telephone: settings.phoneDisplay } : {}),
            ...(settings.email ? { email: settings.email } : {}),
            // Fully remote: no street address, just the country. Hours in schema.org format.
            address: { '@type': 'PostalAddress', addressCountry: 'KE' },
            openingHoursSpecification: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '17:00',
            },
          }}
        />
      )}
      <RenderBlocks blocks={page.layout} settings={settings} path={pathFor(slug)} />
    </div>
  )
}
