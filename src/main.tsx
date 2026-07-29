import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import { initAnalytics } from './lib/analytics'

// Home is the landing/LCP route, so it ships in the initial bundle. Every other
// route is code-split: the blog and offer pages pull heavy deps (react-markdown,
// rehype-highlight, highlight.js) that mobile visitors to the home page should
// not have to download.
const BlogList = lazy(() => import('./pages/BlogList.tsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.tsx'))
const CaseStudy = lazy(() => import('./pages/CaseStudy.tsx'))
const OfferPage = lazy(() => import('./pages/Offer.tsx'))
const Contact = lazy(() => import('./pages/Contact.tsx'))
const Admin = lazy(() => import('./pages/Admin.tsx'))

// posthog-js is ~200 kB of pure analytics — load it (dynamically) once the
// browser is idle so it never blocks first render or interactivity.
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
}
const idleWindow = window as IdleWindow
if (idleWindow.requestIdleCallback) idleWindow.requestIdleCallback(initAnalytics, { timeout: 4000 })
else window.setTimeout(initAnalytics, 2000)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home lang="fi" />} />
          <Route path="/en" element={<Home lang="en" />} />
          <Route path="/projektit/:slug" element={<CaseStudy lang="fi" />} />
          <Route path="/en/projektit/:slug" element={<CaseStudy lang="en" />} />
          <Route path="/blog" element={<BlogList lang="fi" />} />
          <Route path="/blog/:slug" element={<BlogPost lang="fi" />} />
          <Route path="/en/blog" element={<BlogList lang="en" />} />
          <Route path="/en/blog/:slug" element={<BlogPost lang="en" />} />
          <Route path="/tarjous" element={<OfferPage />} />
          <Route path="/tarjous/:id" element={<OfferPage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/offer/:id" element={<OfferPage />} />
          <Route path="/yhteys" element={<Contact />} />
          <Route path="/hallinta" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
