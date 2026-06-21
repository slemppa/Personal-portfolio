import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BuildInPublic from '../components/BuildInPublic'
import { SECTIONS_HTML } from '../site/markup'
import { wireHover, runKoneisto } from '../site/effects'

// Project cards in source order map to existing /projektit/:slug case studies.
const PROJECT_SLUGS = ['rascal-ai', 'rascal-crm', 'superhuman', 'pesa']
const sectionsHtml = PROJECT_SLUGS.reduce(
  (html, slug) => html.replace('class="proj"', `class="proj" data-slug="${slug}"`),
  SECTIONS_HTML,
)

// The static "Build in Public" section is replaced by the live <BuildInPublic/>
// React component; render the markup before and after it around the component.
const buildStart = sectionsHtml.indexOf('<!-- BUILD IN PUBLIC -->')
const beforeBuild = sectionsHtml.slice(0, buildStart)
const afterBuild = sectionsHtml.slice(sectionsHtml.indexOf('<!-- TARINA -->'))

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const disposers = [wireHover(root), runKoneisto()]

    // Make project cards navigate to their case study.
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.proj[data-slug]'))
    cards.forEach((card) => {
      card.style.cursor = 'pointer'
      const onClick = () => navigate(`/projektit/${card.dataset.slug}`)
      card.addEventListener('click', onClick)
      disposers.push(() => card.removeEventListener('click', onClick))
    })

    return () => disposers.forEach((d) => d())
  }, [navigate])

  return (
    <div
      id="site-root"
      ref={ref}
      style={{
        position: 'relative',
        background: '#0a0b0d',
        color: '#e9eaec',
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        overflowX: 'hidden',
        minHeight: '100vh',
      }}
    >
      <div
        id="scrollbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          width: '0%',
          background: '#f2f3f4',
          zIndex: 120,
          transition: 'width .1s linear',
        }}
      />
      <Nav />
      <div dangerouslySetInnerHTML={{ __html: beforeBuild }} />
      <BuildInPublic />
      <div dangerouslySetInnerHTML={{ __html: afterBuild }} />
      <Footer />
    </div>
  )
}
