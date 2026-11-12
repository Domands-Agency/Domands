import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allSlugs, getPage, getService, getSettings } from '@/lib/payload'
import { CmsPage, metaFrom, siteUrl } from '@/components/CmsPage'
import { ServicePage } from '@/components/ServicePage'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const [services, pages] = await Promise.all([allSlugs('services'), allSlugs('pages')])
  return [...services, ...pages.filter((p) => p.slug !== 'home')]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (service) return metaFrom(service.seo, service.title, `/${slug}/`)
  const page = await getPage(slug)
  if (page) return metaFrom(page.seo, page.title, `/${slug}/`)
  return {}
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  if (slug === 'home') notFound()
  const service = await getService(slug)
  if (service) {
    const settings = await getSettings()
    return <ServicePage service={service} settings={settings} siteUrl={siteUrl()} />
  }
  const page = await getPage(slug)
  if (!page) notFound()
  return <CmsPage slug={slug} page={page} />
}
