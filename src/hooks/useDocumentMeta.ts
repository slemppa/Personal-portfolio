import { useEffect } from 'react'

/**
 * Lightweight, dependency-free per-route document metadata.
 *
 * This is a client-rendered SPA, so social-preview crawlers (which don't run
 * JS) still rely on the static tags in index.html. But Google *does* render JS,
 * and browsers show the tab title — so updating title/description/canonical per
 * route is a real SEO and UX win. Values are restored on unmount, keeping
 * navigation between routes consistent.
 */

const SITE_URL = 'https://samikiias.fi'

type DocumentMeta = {
  title?: string
  description?: string
  /** Path beginning with "/", turned into an absolute canonical + og:url. */
  path?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, value: string, cleanup: Array<() => void>) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  const prev = el.getAttribute('content')
  el.setAttribute('content', value)
  cleanup.push(() => {
    if (prev === null) el!.remove()
    else el!.setAttribute('content', prev)
  })
}

function upsertCanonical(href: string, cleanup: Array<() => void>) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  const prev = el.getAttribute('href')
  el.setAttribute('href', href)
  cleanup.push(() => {
    if (prev === null) el!.remove()
    else el!.setAttribute('href', prev)
  })
}

export function useDocumentMeta({ title, description, path }: DocumentMeta) {
  useEffect(() => {
    const cleanup: Array<() => void> = []

    if (title) {
      const prevTitle = document.title
      document.title = title
      cleanup.push(() => {
        document.title = prevTitle
      })
      upsertMeta('property', 'og:title', title, cleanup)
      upsertMeta('name', 'twitter:title', title, cleanup)
    }

    if (description) {
      upsertMeta('name', 'description', description, cleanup)
      upsertMeta('property', 'og:description', description, cleanup)
      upsertMeta('name', 'twitter:description', description, cleanup)
    }

    if (path) {
      const url = `${SITE_URL}${path}`
      upsertCanonical(url, cleanup)
      upsertMeta('property', 'og:url', url, cleanup)
    }

    return () => {
      // Restore in reverse so overlapping tags land back on their originals.
      for (let i = cleanup.length - 1; i >= 0; i--) cleanup[i]()
    }
  }, [title, description, path])
}
