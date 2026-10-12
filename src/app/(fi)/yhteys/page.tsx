import type { Metadata } from 'next'
import Contact from '@/views/Contact'

export const metadata: Metadata = {
  title: 'Yhteydenotto · Sami Kiias',
  description: 'Ota yhteyttä – rakennan AI- ja automaatioratkaisuja, jotka tekevät oikeasti töitä.',
  alternates: { canonical: '/yhteys' },
}

export default function Page() {
  return <Contact />
}
