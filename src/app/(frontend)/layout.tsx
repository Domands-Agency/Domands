import React from 'react'
import type { Metadata } from 'next'
import { Instrument_Sans } from 'next/font/google'
import Script from 'next/script'
import { getSettings } from '@/lib/payload'
import { JsonLd } from '@/components/ui'
import './styles.css'

// Brand typeface: Instrument Sans for all text (Domands design system v2).
const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Domands Creative | Websites, Branding & Digital Marketing in Kenya',
    template: '%s',
  },
  description:
    'Websites from KES 35,000, brands, WhatsApp and social media marketing for Kenyan businesses. Clear prices, real timelines. Chat with us on WhatsApp.',
  openGraph: { siteName: 'Domands Creative', locale: 'en_KE', type: 'website' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="en-KE" className={instrument.variable}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Domands Creative',
            url: siteUrl,
            ...(settings.email ? { email: settings.email } : {}),
            ...(settings.phoneDisplay ? { telephone: settings.phoneDisplay } : {}),
            sameAs: (settings.social || []).map((s) => s.url).filter(Boolean),
          }}
        />
        {children}
        {settings.gaMeasurementId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${settings.gaMeasurementId}');
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-track]');if(a)gtag('event','generate_lead',{method:a.getAttribute('data-track'),page_path:location.pathname});});`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
