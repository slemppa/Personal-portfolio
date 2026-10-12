'use client'

import { useEffect } from 'react'
import { initAnalytics } from '../lib/analytics'

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
}

// posthog-js is ~200 kB of pure analytics — load it (dynamically) once the
// browser is idle so it never blocks first render or interactivity.
export default function Analytics() {
  useEffect(() => {
    const w = window as IdleWindow
    if (w.requestIdleCallback) w.requestIdleCallback(initAnalytics, { timeout: 4000 })
    else window.setTimeout(initAnalytics, 2000)
  }, [])
  return null
}
