'use client'

import dynamic from 'next/dynamic'

// These views read browser-only state while rendering (localStorage, the
// offer token in the URL hash), so they render in the browser only — as they
// did in the Vite SPA. Both routes are noindex, so no SEO is lost.
export const AdminView = dynamic(() => import('./Admin'), { ssr: false })
export const OfferView = dynamic(() => import('./Offer'), { ssr: false })
