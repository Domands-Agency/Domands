import { CmsPage, cmsPageMetadata } from '@/components/CmsPage'

export const generateMetadata = () => cmsPageMetadata('work')

export default function Page() {
  return <CmsPage slug="work" />
}
