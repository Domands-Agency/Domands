import { CmsPage, cmsPageMetadata } from '@/components/CmsPage'

export const generateMetadata = () => cmsPageMetadata('insights')

export default function Page() {
  return <CmsPage slug="insights" />
}
