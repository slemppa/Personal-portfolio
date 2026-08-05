import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { buildActivity } from './api/_lib/activity'
import { normalizeInput, offerToMarkdown, encodeOfferToken, decodeOfferToken } from './api/_lib/offer'
import { generateOffer } from './api/_lib/offerAI'
import { storeOffer, getStoredOffer, listOffers } from './api/_lib/offerStore'
import { parseLead, storeLead, notifyLead, listLeads } from './api/_lib/leads'
import { seoBuild } from './scripts/seoBuild'

type DevRes = { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }
const sendJson = (res: DevRes, code: number, body: unknown) => {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}
const readBody = (req: { on: (e: string, cb: (c?: Buffer) => void) => void }): Promise<unknown> =>
  new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => c && chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })
// Dev "auth": the middleware trusts the local machine, so list endpoints are
// open in dev regardless of OFFER_API_KEY (prod enforces it in the function).

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
// offer feature works locally. GET ?id= / ?token= resolve an offer, ?list=1
// lists stored ones; POST generates + stores an offer. Storage activates only
// when DATABASE_URL is present in .env, else it falls back to token links.
function devOffersApi(env: Record<string, string>): Plugin {
  return {
    name: 'dev-offers-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/offers', async (req, res) => {
        const url = new URL(req.url ?? '', 'http://localhost')
        if (req.method === 'GET') {
          if (url.searchParams.get('list') !== null) return sendJson(res, 200, { offers: await listOffers() })
          const id = url.searchParams.get('id')
          const token = url.searchParams.get('token')
          const offer = id ? await getStoredOffer(id) : token ? decodeOfferToken(token) : null
          if (!offer) return sendJson(res, 404, { error: 'not_found' })
          return sendJson(res, 200, { offer, markdown: offerToMarkdown(offer) })
        }
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' })
        try {
          const offer = await generateOffer(normalizeInput(await readBody(req)), {
            ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
            OFFER_MODEL: env.OFFER_MODEL || process.env.OFFER_MODEL,
          })
          const id = await storeOffer(offer)
          const token = encodeOfferToken(offer)
          const shareUrl = id ? `${url.origin}/tarjous/${id}` : `${url.origin}/tarjous#${token}`
          sendJson(res, 200, { offer, id, token, shareUrl, markdown: offerToMarkdown(offer) })
        } catch (err) {
          sendJson(res, 500, { error: 'offer_generation_failed', detail: String(err) })
        }
      })
    },
  }
}

// Serves /api/contact during `vite dev` — mirrors the lead-capture function.
function devContactApi(): Plugin {
  return {
    name: 'dev-contact-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        const url = new URL(req.url ?? '', 'http://localhost')
        if (req.method === 'GET') {
          if (url.searchParams.get('list') === null) return sendJson(res, 400, { error: 'bad_request' })
          return sendJson(res, 200, { leads: await listLeads() })
        }
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' })
        const body = (await readBody(req)) as Record<string, unknown>
        if (typeof body.website === 'string' && body.website.trim()) return sendJson(res, 200, { ok: true })
        const parsed = parseLead(body)
        if (!parsed.ok) return sendJson(res, 400, { error: parsed.error })
        const [id, emailed] = await Promise.all([storeLead(parsed.lead), notifyLead(parsed.lead)])
        if (id === null && !emailed) return sendJson(res, 503, { error: 'not_configured' })
        sendJson(res, 200, { ok: true, id, emailed })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Bridge server-only vars from .env onto process.env so the persistence layer
  // (Neon/email, read via process.env in api/_lib) works under `vite dev` too.
  for (const k of ['DATABASE_URL', 'OFFER_API_KEY', 'BREVO_API_KEY', 'RESEND_API_KEY', 'RESEND_FROM']) {
    if (env[k] && !process.env[k]) process.env[k] = env[k]
  }
  return {
    plugins: [react(), tailwindcss(), devActivityApi(env), devOffersApi(env), devContactApi(), seoBuild()],
    build: {
      // Modern baseline — avoids shipping legacy transforms/polyfills to the
      // evergreen browsers this site targets.
      target: 'es2022',
      rollupOptions: {
        output: {
          // Split rarely-changing react vendor into its own cacheable chunk so a
          // content deploy doesn't invalidate it. posthog-js is loaded via a
          // dynamic import (see main.tsx), so Rollup already gives it its own
          // async chunk off the critical path.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router'],
          },
        },
      },
    },
    test: {
      environment: 'node',
    },
  }
})
