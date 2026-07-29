import { useEffect, useMemo, useRef } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BuildInPublic from '../components/BuildInPublic'
import CasesSection from '../components/CasesSection'
import { sectionsHtml } from '../site/markup'
import { wireHover, runKoneisto } from '../site/effects'

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)

  // TODO(task8): thread lang prop instead of hardcoding 'fi'
  const lang = 'fi' as const

  // The static "Projektit" and "Build in Public" sections are replaced by
  // live React components; render the markup before/between/after them.
  const { beforeProjects, betweenProjectsAndBuild, afterBuild } = useMemo(() => {
    const html = sectionsHtml(lang)
    const projectsStart = html.indexOf('<!-- PROJEKTIT -->')
    const buildStart = html.indexOf('<!-- BUILD IN PUBLIC -->')
    return {
      beforeProjects: html.slice(0, projectsStart),
      betweenProjectsAndBuild: html.slice(projectsStart, buildStart),
      afterBuild: html.slice(html.indexOf('<!-- TARINA -->')),
    }
  }, [])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const disposers = [wireHover(root), runKoneisto()]

    return () => disposers.forEach((d) => d())
  }, [])

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
      <div dangerouslySetInnerHTML={{ __html: beforeProjects }} />
      <CasesSection lang={lang} />
      <div dangerouslySetInnerHTML={{ __html: betweenProjectsAndBuild }} />
      <BuildInPublic />
      <div dangerouslySetInnerHTML={{ __html: afterBuild }} />
      <Footer />
    </div>
  )
}
