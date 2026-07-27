import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import posthog from 'posthog-js'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'

// Home is the landing/LCP route, so it ships in the initial bundle. Every other
// route is code-split: the blog and offer pages pull heavy deps (react-markdown,
// rehype-highlight, highlight.js) that mobile visitors to the home page should
// not have to download.
const BlogList = lazy(() => import('./pages/BlogList.tsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.tsx'))
const CaseStudy = lazy(() => import('./pages/CaseStudy.tsx'))
const OfferPage = lazy(() => import('./pages/Offer.tsx'))

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2026-01-30',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projektit/:slug" element={<CaseStudy />} />
              <Route path="/blog" element={<BlogList lang="fi" />} />
              <Route path="/blog/:slug" element={<BlogPost lang="fi" />} />
              <Route path="/en/blog" element={<BlogList lang="en" />} />
              <Route path="/en/blog/:slug" element={<BlogPost lang="en" />} />
              <Route path="/tarjous" element={<OfferPage />} />
              <Route path="/offer" element={<OfferPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
)
