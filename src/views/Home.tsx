'use client'

import { useEffect, useMemo, useRef } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BuildInPublic from '../components/BuildInPublic'
import CasesSection from '../components/CasesSection'
import YhteysSection from '../components/YhteysSection'
import { sectionsHtml } from '../site/markup'
import { wireHover, runKoneisto, runStackFlow } from '../site/effects'
import type { Lang, Post } from '../lib/parsePost'

export default function Home({ lang = 'fi', latestPosts }: { lang?: Lang; latestPosts: Post[] }) {
  const ref = useRef<HTMLDivElement>(null)

  // The static "Projektit", "Build in Public" and "Yhteys" sections are
  // replaced by live React components; render the markup before/between them.
  const { beforeProjects, betweenProjectsAndBuild, betweenBuildAndYhteys } = useMemo(() => {
    const html = sectionsHtml(lang)
    const projectsStart = html.indexOf('<!-- PROJEKTIT -->')
    const buildStart = html.indexOf('<!-- BUILD IN PUBLIC -->')
    const yhteysStart = html.indexOf('<!-- YHTEYS -->')
    return {
      beforeProjects: html.slice(0, projectsStart),
      betweenProjectsAndBuild: html.slice(projectsStart, buildStart),
      betweenBuildAndYhteys: html.slice(html.indexOf('<!-- TARINA -->'), yhteysStart),
    }
  }, [lang])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const disposers = [wireHover(root), runKoneisto(), runStackFlow()]

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
      <Nav lang={lang} />
      <div dangerouslySetInnerHTML={{ __html: beforeProjects }} />
      <CasesSection lang={lang} />
      <div dangerouslySetInnerHTML={{ __html: betweenProjectsAndBuild }} />
      <BuildInPublic lang={lang} latestPosts={latestPosts} />
      <div dangerouslySetInnerHTML={{ __html: betweenBuildAndYhteys }} />
      <YhteysSection lang={lang} />
      <Footer />
    </div>
  )
}
