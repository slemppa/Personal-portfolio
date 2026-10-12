import type { ReactNode } from 'react'
import SiteDocument, { siteMetadata } from '@/components/SiteDocument'

export const metadata = siteMetadata

export default function Layout({ children }: { children: ReactNode }) {
  return <SiteDocument lang="fi">{children}</SiteDocument>
}
