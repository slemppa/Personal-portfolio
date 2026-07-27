import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import BlogList from './pages/BlogList.tsx'
import BlogPost from './pages/BlogPost.tsx'
import CaseStudy from './pages/CaseStudy.tsx'
import OfferPage from './pages/Offer.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import posthog from 'posthog-js'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'

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
        </BrowserRouter>
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
)
