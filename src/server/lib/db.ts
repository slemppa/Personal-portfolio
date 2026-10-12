// Thin Neon (serverless Postgres) accessor. The whole persistence layer is
// optional: without DATABASE_URL the site stays fully stateless (offers fall
// back to token links, the contact form still validates), so nothing breaks in
// dev or if the env var is missing. The Neon HTTP driver works in Vercel
// serverless functions without a TCP connection.

import { neon } from '@neondatabase/serverless'

type Sql = ReturnType<typeof neon>
let cached: Sql | null | undefined

/** Returns a tagged-template SQL function, or null when no DB is configured. */
export function getSql(): Sql | null {
  if (cached !== undefined) return cached
  const url = process.env.DATABASE_URL
  cached = url ? neon(url) : null
  return cached
}

/** True when a database is configured. */
export function hasDb(): boolean {
  return !!process.env.DATABASE_URL
}

// URL-safe short id (base62). 8 chars ≈ 218 trillion combinations — collisions
// are astronomically unlikely at this volume, and inserts guard with a PK.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export function shortId(len = 8): string {
  const bytes = new Uint8Array(len)
  globalThis.crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}
