import type { Metadata } from 'next'
import Script from 'next/script'
import type { ReactNode } from 'react'
import Analytics from './Analytics'
import JsonLd from './JsonLd'
import { SITE_URL, siteGraph } from '../lib/seo'
import type { Lang } from '../lib/parsePost'
import '../index.css'

// Self-hosted fonts (see @font-face in index.css), preloaded so they arrive
// with the HTML instead of behind a render-blocking third-party stylesheet.
const FONTS = ['/fonts/space-grotesk-latin-v22.woff2', '/fonts/jetbrains-mono-latin-v24.woff2']

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Sami Kiias | AI Systems Builder',
  description: 'Rakennan AI-järjestelmiä jotka tekevät oikeasti töitä. Full-stack kehitys, AI-automaatiot, RAG-järjestelmät.',
  icons: [
    { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', url: '/favicon.png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
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
        {FONTS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="" />
        ))}
        {/* Person + WebSite on every page, so page-level JSON-LD can reference them by @id. */}
        <JsonLd blocks={[siteGraph(lang)]} />
      </head>
      <body>
        {children}
        <Analytics />
        <Script
          src="https://analytiikka.analytiikka.workers.dev/t.js"
          data-site="045c4ca3"
          strategy="afterInteractive"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-93LNVBX246" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-93LNVBX246');`}
        </Script>
      </body>
    </html>
  )
}
