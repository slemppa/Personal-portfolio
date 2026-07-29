import { useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BuildInPublic from '../components/BuildInPublic'
import CasesSection from '../components/CasesSection'
import { SECTIONS_HTML } from '../site/markup'
import { wireHover, runKoneisto } from '../site/effects'

// The static "Projektit" and "Build in Public" sections are replaced by live
// React components; render the markup before/between/after them.
const projectsStart = SECTIONS_HTML.indexOf('<!-- PROJEKTIT -->')
const buildStart = SECTIONS_HTML.indexOf('<!-- BUILD IN PUBLIC -->')
const beforeProjects = SECTIONS_HTML.slice(0, projectsStart)
const betweenProjectsAndBuild = SECTIONS_HTML.slice(projectsStart, buildStart)
const afterBuild = SECTIONS_HTML.slice(SECTIONS_HTML.indexOf('<!-- TARINA -->'))

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)

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
      {/* TODO(task8): thread lang prop instead of hardcoding 'fi' */}
      <CasesSection lang="fi" />
      <div dangerouslySetInnerHTML={{ __html: betweenProjectsAndBuild }} />
      <BuildInPublic />
      <div dangerouslySetInnerHTML={{ __html: afterBuild }} />
      <Footer />
    </div>
  )
}
