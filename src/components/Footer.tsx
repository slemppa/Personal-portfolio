import { useEffect, useRef } from 'react'
import { FOOTER_HTML } from '../site/markup'
import { wireHover } from '../site/effects'

// Wire the footer "Blog" placeholder link to the real /blog route.
const html = FOOTER_HTML.replace(/href="#"([^>]*>Blog<\/a>)/, 'href="/blog"$1')

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    return wireHover(ref.current)
  }, [])
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
}
