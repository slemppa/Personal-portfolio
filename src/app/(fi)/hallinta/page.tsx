import type { Metadata } from 'next'
import { AdminView as Admin } from '@/views/clientOnly'

export const metadata: Metadata = { title: 'Hallinta · Sami Kiias', robots: { index: false, follow: false } }

export default function Page() {
  return <Admin />
}
