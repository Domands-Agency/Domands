import React from 'react'
import { getIndustries, getServices, getSettings } from '@/lib/payload'
import { Footer, Header, StickyWhatsApp } from '@/components/Chrome'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, industries] = await Promise.all([getSettings(), getServices(), getIndustries()])
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header settings={settings} services={services} />
      <main id="main" className="frame">
        {children}
      </main>
      <Footer settings={settings} services={services} industries={industries} />
      <StickyWhatsApp settings={settings} />
    </>
  )
}
