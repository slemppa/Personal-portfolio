import type { Metadata } from 'next'
import { OfferView as OfferPage } from '@/views/clientOnly'

export const metadata: Metadata = { title: 'Offer · Sami Kiias', robots: { index: false, follow: false } }

export default async function Page({ params }: { params: Promise<{ id?: string[] }> }) {
  const { id } = await params
  return <OfferPage id={id?.[0]} />
}
