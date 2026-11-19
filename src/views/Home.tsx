import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BuildInPublic from '../components/BuildInPublic'
import CasesSection from '../components/CasesSection'
import YhteysSection from '../components/YhteysSection'
import HomeEffects from '../components/HomeEffects'
import { ServicesSection } from '../components/ServiceCards'
import { sectionsHtml } from '../site/markup'
import type { Lang, Post } from '../lib/parsePost'

// Server component: the static homepage sections are rendered to HTML on the
// server and never shipped as JS. Interactive parts are client islands
// (Nav, BuildInPublic, ContactForm) and HomeEffects wires up the animations.

export default function Home({ lang = 'fi', latestPosts }: { lang?: Lang; latestPosts: Post[] }) {
  // The static "Projektit", "Build in Public" and "Yhteys" sections are
  // replaced by live React components; render the markup before/between them.
  const html = sectionsHtml(lang)
  const projectsStart = html.indexOf('<!-- PROJEKTIT -->')
  const buildStart = html.indexOf('<!-- BUILD IN PUBLIC -->')
  const yhteysStart = html.indexOf('<!-- YHTEYS -->')
  const beforeProjects = html.slice(0, projectsStart)
  const betweenProjectsAndBuild = html.slice(projectsStart, buildStart)
  const betweenBuildAndYhteys = html.slice(html.indexOf('<!-- TARINA -->'), yhteysStart)


  return (
    <div
      id="site-root"
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
      <ServicesSection lang={lang} />
      <div dangerouslySetInnerHTML={{ __html: betweenProjectsAndBuild }} />
      <BuildInPublic lang={lang} latestPosts={latestPosts} />
      <div dangerouslySetInnerHTML={{ __html: betweenBuildAndYhteys }} />
      <YhteysSection lang={lang} />
      <Footer />
      <HomeEffects />
    </div>
  )
}
