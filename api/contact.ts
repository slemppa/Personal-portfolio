import { parseLead, storeLead, notifyLead, listLeads, syncToBrevo } from './_lib/leads.js'

// Vercel serverless function: contact / lead capture.
//
//   POST /api/contact          — submit the contact form (stores + notifies).
//   GET  /api/contact?list=1   — list captured leads (requires OFFER_API_KEY).
//
// A lead is stored in Neon (when DATABASE_URL is set) and an email notification
// is sent (when a Brevo/Resend key is set). Both are best-effort: the visitor
// gets a clean success as long as the submission is valid, even if storage or
// email isn't configured — but if neither is configured we report that so the
// message isn't silently dropped.

type Req = {
  method?: string
  headers?: Record<string, string | string[] | undefined>
  body?: unknown
  query?: Record<string, string | string[] | undefined>
}
type Res = {
  setHeader: (k: string, v: string) => void
  status: (n: number) => Res
  json: (b: unknown) => void
  end: (b?: string) => void
}

function header(req: Req, name: string): string | undefined {
  const v = req.headers?.[name.toLowerCase()]
  return Array.isArray(v) ? v[0] : v
}

function authorized(req: Req): boolean {
  const required = process.env.OFFER_API_KEY
  if (!required) return true
  const bearer = header(req, 'authorization')?.replace(/^Bearer\s+/i, '')
  return bearer === required || header(req, 'x-api-key') === required
}

function setCors(res: Res): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
}

function parseBody(body: unknown): unknown {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }
  return body ?? {}
}

export default async function handler(req: Req, res: Res): Promise<void> {
  setCors(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method === 'GET') {
    if (req.query?.list === undefined) {
      res.status(400).json({ error: 'bad_request' })
      return
    }
    if (!authorized(req)) {
      res.status(401).json({ error: 'unauthorized' })
      return
    }
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ leads: await listLeads() })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const body = parseBody(req.body) as Record<string, unknown>

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (typeof body.website === 'string' && body.website.trim()) {
    res.status(200).json({ ok: true })
    return
  }

  const parsed = parseLead(body)
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error })
    return
  }

  const [id, emailed] = await Promise.all([storeLead(parsed.lead), notifyLead(parsed.lead), syncToBrevo(parsed.lead)])

  res.setHeader('Cache-Control', 'no-store')
  if (id === null && !emailed) {
    // Nothing captured the lead — surface it rather than losing the message.
    res.status(503).json({ error: 'not_configured' })
    return
  }
  res.status(200).json({ ok: true, id, emailed })
}
