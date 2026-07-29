import { useEffect, useRef } from 'react'
import { FOOTER_HTML } from '../site/markup'
import { wireHover } from '../site/effects'

// Wire the footer placeholder links to their real destinations. LinkedIn has
// no confirmed profile URL yet, so it keeps href="#" but is flagged with
// data-todo for whoever fills it in.
const html = FOOTER_HTML.replace(/href="#"([^>]*>Blog<\/a>)/, 'href="/blog"$1')
  .replace(/href="#"([^>]*>LinkedIn<\/a>)/, 'href="#" data-todo="linkedin-url"$1')
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
