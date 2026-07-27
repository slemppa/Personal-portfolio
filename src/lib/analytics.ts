// Off-critical-path analytics. posthog-js is ~200 kB of pure analytics, so it
// is loaded via a dynamic import only when the browser is idle (see main.tsx).
// capture() is a safe no-op until then, so call sites don't need to care
// whether posthog has finished loading. Using the singleton directly (instead
// of @posthog/react) keeps posthog-js off the initial bundle entirely — the
// React provider statically imports it, which would defeat the deferral.

import type { PostHog } from 'posthog-js'

let client: PostHog | null = null
let loading: Promise<void> | null = null

/** Load + initialise posthog once. Safe to call repeatedly. */
export function initAnalytics(): void {
  if (client || loading) return
  loading = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        defaults: '2026-01-30',
      })
      client = posthog
    })
    .catch(() => {
      // Analytics is best-effort — never let it break the app.
    })
}

/** Capture an event. No-op until analytics has finished loading. */
export function capture(event: string, props?: Record<string, unknown>): void {
  client?.capture(event, props)
}
