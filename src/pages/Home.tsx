import { useEffect, useMemo, useRef } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BuildInPublic from '../components/BuildInPublic'
import CasesSection from '../components/CasesSection'
import YhteysSection from '../components/YhteysSection'
import { sectionsHtml } from '../site/markup'
import { wireHover, runKoneisto, runStackFlow } from '../site/effects'
import { applyHead } from '../lib/head'
import { homeCopy } from '../site/copy'
import { homePath } from '../lib/i18n'
import type { Lang } from '../lib/parsePost'

export default function Home({ lang = 'fi' }: { lang?: Lang }) {
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

  useEffect(() => {
    applyHead({
      lang,
      title: lang === 'fi' ? 'Sami Kiias — Fullstack-tuoterakentaja' : 'Sami Kiias — Fullstack product builder',
      description: homeCopy[lang].heroBody,
      canonical: homePath(lang),
      alternates: [
        { hreflang: 'fi', path: '/' },
        { hreflang: 'en', path: '/en' },
      ],
    })
  }, [lang])

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
      <BuildInPublic />
      <div dangerouslySetInnerHTML={{ __html: betweenBuildAndYhteys }} />
      <YhteysSection lang={lang} />
      <Footer />
    </div>
  )
}
