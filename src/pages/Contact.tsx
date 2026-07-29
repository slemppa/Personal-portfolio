import { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ContactForm from '../components/ContactForm'
import { applyHead } from '../lib/head'

export default function Contact() {
  useEffect(() => {
    applyHead({
      lang: 'fi',
      title: 'Yhteydenotto · Sami Kiias',
      description: 'Ota yhteyttä – rakennan AI- ja automaatioratkaisuja, jotka tekevät oikeasti töitä.',
      canonical: '/yhteys',
      alternates: [],
    })
  }, [])

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-2xl px-8 pb-24 pt-32">
        <h1 className="text-4xl font-bold text-text-primary">Otetaan yhteyttä</h1>
        <p className="mt-3 text-lg text-text-secondary">
          Kerro lyhyesti mitä olette tekemässä, niin palaan sinulle. Voit myös laittaa suoraan sähköpostia
          osoitteeseen{' '}
          <a href="mailto:sami@mak8r.fi" className="text-accent hover:text-accent-hover">
            sami@mak8r.fi
          </a>
          .
        </p>
        <div className="mt-10">
          <ContactForm source="yhteys" />
        </div>
      </main>
      <Footer />
    </>
  )
}
