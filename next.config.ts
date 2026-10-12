import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]

const nextConfig: NextConfig = {
  // Several root layouts ((fi), (en), (payload)) — unmatched URLs need a
  // global 404 page.
  experimental: { globalNotFound: true },
  // Vite exposed VITE_PUBLIC_*; accept the old names so existing Vercel env
  // vars keep working until they are renamed.
  env: {
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN:
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ?? '',
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? process.env.VITE_PUBLIC_POSTHOG_HOST ?? '',
  },
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  async redirects() {
    return [
      { source: '/projektit/superhuman', destination: '/projektit/altio', permanent: true },
      { source: '/en/projektit/superhuman', destination: '/en/projektit/altio', permanent: true },
    ]
  },
  async headers() {
    // Client-specific offer pages and the admin view stay out of search
    // indexes (pages also emit a robots meta tag; see lib/routes.ts).
    return [
      { source: '/hallinta', headers: noindex },
      { source: '/tarjous/:path*', headers: noindex },
      { source: '/offer/:path*', headers: noindex },
    ]
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
