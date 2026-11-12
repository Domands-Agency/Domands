import type { Metadata } from 'next'
import { CmsPage, cmsPageMetadata } from '@/components/CmsPage'

export const generateMetadata = async (): Promise<Metadata> => cmsPageMetadata('home')

export default function HomePage() {
  return <CmsPage slug="home" />
}
