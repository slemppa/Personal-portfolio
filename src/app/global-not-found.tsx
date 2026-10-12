import type { Metadata } from 'next'
import SiteDocument from '@/components/SiteDocument'
import NotFound from '@/views/NotFound'

export const metadata: Metadata = { title: 'Sivua ei löytynyt · Sami Kiias', robots: { index: false } }

// URLs that match no route at all (the app has several root layouts).
export default function GlobalNotFound() {
  return (
    <SiteDocument lang="fi">
      <NotFound lang="fi" />
    </SiteDocument>
  )
}
