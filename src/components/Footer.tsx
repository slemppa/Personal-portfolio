'use client'

import { useEffect, useRef } from 'react'
import { FOOTER_HTML } from '../site/chrome'
import { wireHover } from '../site/wire'
import { PROFILES } from '../lib/seo'

// Wire the footer placeholder links to their real destinations.
const html = FOOTER_HTML.replace(/href="#"([^>]*>Blog<\/a>)/, 'href="/blog"$1')
  // Author page: the target of every byline and the ProfilePage for the Person entity.
  .replace(/(<a href="\/blog"[^>]*>Blog<\/a>)/, '<a href="/tietoa" style="text-decoration:none;font-family:\'JetBrains Mono\',monospace;font-size:12.5px;letter-spacing:.08em;color:rgba(255,255,255,.5);transition:color .2s;" data-hover="color:#f2f3f4;">Tietoa</a>\n        $1')
  .replace(/href="#"([^>]*>LinkedIn<\/a>)/, `href="${PROFILES.linkedin}" target="_blank" rel="noreferrer"$1`)
  .replace(/href="#"([^>]*>GitHub<\/a>)/, 'href="https://github.com/slemppa" target="_blank" rel="noreferrer"$1')
  .replace(/href="#"([^>]*>YouTube<\/a>)/, 'href="https://www.youtube.com/@samikiias" target="_blank" rel="noreferrer"$1')

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    return wireHover(ref.current)
  }, [])
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
}
