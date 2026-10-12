import type { Metadata } from 'next'
import Script from 'next/script'
import type { ReactNode } from 'react'
import Analytics from './Analytics'
import { SITE_URL } from '../lib/seo'
import type { Lang } from '../lib/parsePost'
import '../index.css'

const FONTS =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap'

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Sami Kiias | AI Systems Builder',
  description: 'Rakennan AI-järjestelmiä jotka tekevät oikeasti töitä. Full-stack kehitys, AI-automaatiot, RAG-järjestelmät.',
  icons: [
    { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', url: '/favicon.png' },
  ],
}

/**
 * The <html> shell shared by the fi and en root layouts. They are separate
 * root layouts only so `<html lang>` is correct in the server-rendered HTML.
 */
export default function SiteDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        {children}
        <Analytics />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-93LNVBX246" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-93LNVBX246');`}
        </Script>
      </body>
    </html>
  )
}
