import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { buildActivity } from './api/_lib/activity'
import { normalizeInput, offerToMarkdown, encodeOfferToken, decodeOfferToken } from './api/_lib/offer'
import { generateOffer } from './api/_lib/offerAI'

// Serves /api/activity during `vite dev`, mirroring the Vercel function so the
// build-in-public section works locally without `vercel dev`. Both paths call
// the same buildActivity(). `env` comes from loadEnv so .env (e.g.
// GITHUB_TOKEN) is picked up — Vite does not put non-VITE_ vars on process.env.
function devActivityApi(env: Record<string, string>): Plugin {
  return {
    name: 'dev-activity-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/activity', async (_req, res) => {
        try {
          const data = await buildActivity({
            GITHUB_TOKEN: env.GITHUB_TOKEN || process.env.GITHUB_TOKEN,
            GITHUB_USER: env.GITHUB_USER || process.env.GITHUB_USER,
            YT_HANDLE: env.YT_HANDLE || process.env.YT_HANDLE,
          })
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

// Serves /api/offers during `vite dev`, mirroring the Vercel function so the
// offer-sharing feature works locally. GET ?token= resolves a share token;
// POST generates an offer from CRM data (uses Claude when ANTHROPIC_API_KEY is
// set in .env, else the deterministic template).
function devOffersApi(env: Record<string, string>): Plugin {
  const json = (res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }, code: number, body: unknown) => {
    res.statusCode = code
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
  }
  return {
    name: 'dev-offers-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/offers', (req, res) => {
        const url = new URL(req.url ?? '', 'http://localhost')
        if (req.method === 'GET') {
          const offer = decodeOfferToken(url.searchParams.get('token') ?? '')
          if (!offer) return json(res, 400, { error: 'invalid_or_missing_token' })
          return json(res, 200, { offer, markdown: offerToMarkdown(offer) })
        }
        if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' })

        const chunks: Buffer[] = []
        req.on('data', (c: Buffer) => chunks.push(c))
        req.on('end', async () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf8')
            const body = raw ? JSON.parse(raw) : {}
            const offer = await generateOffer(normalizeInput(body), {
              ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
              OFFER_MODEL: env.OFFER_MODEL || process.env.OFFER_MODEL,
            })
            const token = encodeOfferToken(offer)
            json(res, 200, { offer, token, shareUrl: `${url.origin}/tarjous#${token}`, markdown: offerToMarkdown(offer) })
          } catch (err) {
            json(res, 500, { error: 'offer_generation_failed', detail: String(err) })
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), devActivityApi(env), devOffersApi(env)],
    build: {
      rollupOptions: {
        output: {
          // Split rarely-changing vendor code into its own cacheable chunks so
          // a content deploy doesn't invalidate them, and they download in
          // parallel with the app chunk.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router'],
            posthog: ['posthog-js', '@posthog/react'],
          },
        },
      },
    },
    test: {
      environment: 'node',
    },
  }
})
