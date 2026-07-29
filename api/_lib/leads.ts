// Lead capture: validate a contact-form submission, store it in Neon, and
// (optionally) fire an email notification. Storing and emailing are both
// best-effort and independent — a missing DB or email key never fails the
// request, so the visitor always gets a clean "thanks".

import { getSql } from './db.js'

/** Where lead notifications are sent. */
const NOTIFY_TO = 'sami@mak8r.fi'

export type LeadInput = {
  name: string
  email: string
  company?: string
  message: string
  source?: string
}

export type LeadSummary = LeadInput & { id: number; createdAt: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validate + trim a raw contact payload. Returns the lead or an error key. */
export function parseLead(raw: unknown): { ok: true; lead: LeadInput } | { ok: false; error: string } {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const name = str(r.name)
  const email = str(r.email)
  const message = str(r.message)
  const company = str(r.company) || undefined
  const source = str(r.source) || undefined
  if (name.length < 1 || name.length > 200) return { ok: false, error: 'invalid_name' }
  if (!EMAIL_RE.test(email) || email.length > 320) return { ok: false, error: 'invalid_email' }
  if (message.length < 1 || message.length > 5000) return { ok: false, error: 'invalid_message' }
  return { ok: true, lead: { name, email, message, company, source } }
}

/** Store a lead. Returns its id, or null if no DB / on error. */
export async function storeLead(lead: LeadInput): Promise<number | null> {
  const sql = getSql()
  if (!sql) return null
  try {
    const rows = (await sql`
      insert into portfolio_leads (name, email, company, message, source)
      values (${lead.name}, ${lead.email}, ${lead.company ?? null}, ${lead.message}, ${lead.source ?? null})
      returning id
    `) as { id: number }[]
    return rows[0]?.id ?? null
  } catch {
    return null
  }
}

/** List recent leads for an admin view. */
export async function listLeads(limit = 200): Promise<LeadSummary[]> {
  const sql = getSql()
  if (!sql) return []
  try {
    const rows = (await sql`
      select id, name, email, company, message, source, created_at
      from portfolio_leads order by created_at desc limit ${limit}
    `) as Array<{ id: number; name: string; email: string; company: string | null; message: string; source: string | null; created_at: string }>
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      company: r.company ?? undefined,
      message: r.message,
      source: r.source ?? undefined,
      createdAt: r.created_at,
    }))
  } catch {
    return []
  }
}

/**
 * Best-effort email notification. Uses Brevo (BREVO_API_KEY) or Resend
 * (RESEND_API_KEY) if configured; otherwise a no-op. Never throws.
 */
export async function notifyLead(lead: LeadInput): Promise<boolean> {
  const subject = `Uusi yhteydenotto: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`
  const text = [
    `Nimi: ${lead.name}`,
    `Sähköposti: ${lead.email}`,
    lead.company ? `Yritys: ${lead.company}` : null,
    lead.source ? `Lähde: ${lead.source}` : null,
    '',
    lead.message,
  ]
    .filter((l) => l !== null)
    .join('\n')

  try {
    const brevo = process.env.BREVO_API_KEY
    if (brevo) {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': brevo, 'content-type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'Portfolio', email: NOTIFY_TO },
          to: [{ email: NOTIFY_TO }],
          replyTo: { email: lead.email, name: lead.name },
          subject,
          textContent: text,
        }),
      })
      return res.ok
    }
    const resend = process.env.RESEND_API_KEY
    if (resend) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${resend}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Portfolio <onboarding@resend.dev>',
          to: [NOTIFY_TO],
          reply_to: lead.email,
          subject,
          text,
        }),
      })
      return res.ok
    }
    return false
  } catch {
    return false
  }
}
