'use client'

import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { homePath } from '../lib/i18n'
import type { Lang } from '../lib/parsePost'

const COPY = {
  fi: { title: 'Sivua ei löytynyt', body: 'Tarkista osoite tai palaa etusivulle.', home: '← Etusivulle' },
  en: { title: 'Page not found', body: 'Check the URL or head back home.', home: '← Back home' },
} as const

export default function NotFound({ lang = 'fi' }: { lang?: Lang }) {
  const c = COPY[lang]
  return (
    <>
      <Nav lang={lang} />
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-24 min-h-screen">
        <Link href={homePath(lang)} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          {c.home}
        </Link>
        <h1 className="mt-12 text-3xl font-bold text-text-primary">{c.title}</h1>
        <p className="mt-2 text-text-secondary">{c.body}</p>
      </main>
      <Footer />
    </>
  )
}
