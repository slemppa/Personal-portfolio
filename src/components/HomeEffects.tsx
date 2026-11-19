'use client'

import { useEffect } from 'react'
import { wireHover } from '../site/wire'
import { runKoneisto, runStackFlow } from '../site/effects'

/**
 * Client-only island that attaches the homepage's decorative behaviour
 * (hover styles, reveal-on-scroll, terminal, pipeline, canvases) to the
 * server-rendered markup. Renders nothing itself.
 */
export default function HomeEffects() {
  useEffect(() => {
    const root = document.getElementById('site-root')
    if (!root) return
    const disposers = [wireHover(root), runKoneisto(), runStackFlow()]
    return () => disposers.forEach((d) => d())
  }, [])
  return null
}
