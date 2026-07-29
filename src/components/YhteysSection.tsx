import type { Lang } from '../lib/parsePost'
import { homeCopy } from '../site/copy'
import ContactForm from './ContactForm'

// The "05 — Ota yhteyttä" section. This used to be static markup (see
// site/markup.ts) with a mailto CTA as its primary action; it's now a real
// React island so the lead-capture form can live inside the same two-column
// grid as the "follow / companies" column. Kept as its own component
// (mirroring CasesSection / BuildInPublic) because dangerouslySetInnerHTML
// chunks can't share a DOM parent with a React-rendered sibling like
// <ContactForm>, so the grid + column markup has to be authored as JSX.

const mono = "'JetBrains Mono', monospace"

const sectionStyle: React.CSSProperties = {
  position: 'relative',
  background: '#0c0d10',
  borderTop: '1px solid rgba(255,255,255,.06)',
  overflow: 'hidden',
}
const glowStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-40%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '80vw',
  height: '70vh',
  background: 'radial-gradient(ellipse at center,rgba(255,255,255,.05),transparent 60%)',
  pointerEvents: 'none',
}
const containerStyle: React.CSSProperties = {
  position: 'relative',
  maxWidth: 1280,
  margin: '0 auto',
  padding: 'clamp(90px,12vh,150px) clamp(20px,5vw,56px)',
}
const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.1fr .9fr',
  gap: 'clamp(32px,5vw,72px)',
  alignItems: 'start',
}
const eyebrowStyle: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 12.5,
  letterSpacing: '.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,.4)',
  marginBottom: 18,
}
const labelStyle: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 11,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,.36)',
  marginBottom: 16,
}
const linkRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,.09)',
  borderRadius: 11,
  padding: '16px 18px',
  background: 'rgba(255,255,255,.015)',
  transition: 'border-color .25s,background .25s',
}

function CompanyRow({ name, desc, role, last }: { name: string; desc: string; role: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        paddingBottom: last ? undefined : 14,
        borderBottom: last ? undefined : '1px solid rgba(255,255,255,.07)',
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5 }}>{name}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.48)', marginTop: 2 }}>{desc}</div>
      </div>
      <span style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,.4)', whiteSpace: 'nowrap' }}>{role}</span>
    </div>
  )
}

export default function YhteysSection({ lang }: { lang: Lang }) {
  const c = homeCopy[lang]
  return (
    <section id="yhteys" style={sectionStyle}>
      <div style={glowStyle} />
      <div style={containerStyle}>
        <div style={gridStyle}>
          <div data-reveal>
            <div style={eyebrowStyle}>{c.contactEyebrow}</div>
            <h2 style={{ margin: '0 0 22px', fontWeight: 600, fontSize: 'clamp(2.2rem,4.6vw,3.8rem)', letterSpacing: '-.03em', lineHeight: 1.02 }}>
              {c.contactTitleA}
              <br />
              {c.contactTitleB}
            </h2>
            <p style={{ margin: '0 0 34px', maxWidth: 480, fontSize: 16.5, lineHeight: 1.62, color: 'rgba(255,255,255,.56)' }}>{c.contactBody}</p>

            <div style={{ maxWidth: 560, marginBottom: 28 }}>
              <ContactForm source={lang === 'fi' ? 'home' : 'home-en'} lang={lang} />
            </div>

            <p style={{ margin: '0 0 6px', fontFamily: mono, fontSize: 12.5, color: 'rgba(255,255,255,.45)' }}>
              <a href="mailto:sami@mak8r.fi" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,.25)' }}>
                sami@mak8r.fi
              </a>
            </p>
            <p style={{ margin: 0, fontFamily: mono, fontSize: 12.5, color: 'rgba(255,255,255,.4)' }}>{c.contactReply}</p>
          </div>

          <div data-reveal data-delay="80">
            <div style={labelStyle}>{c.contactFollow}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30 }}>
              <a href="#" style={linkRowStyle} data-hover="border-color:rgba(255,255,255,.24);background:rgba(255,255,255,.03);">
                <span style={{ color: '#e9eaec', fontWeight: 500, fontSize: 14.5 }}>{c.contactLi}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{c.contactLiCta}</span>
              </a>
              <a href="#" style={linkRowStyle} data-hover="border-color:rgba(255,255,255,.24);background:rgba(255,255,255,.03);">
                <span style={{ color: '#e9eaec', fontWeight: 500, fontSize: 14.5 }}>{c.contactYt}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{c.contactYtCta}</span>
              </a>
              <a href="#" style={linkRowStyle} data-hover="border-color:rgba(255,255,255,.24);background:rgba(255,255,255,.03);">
                <span style={{ color: '#e9eaec', fontWeight: 500, fontSize: 14.5 }}>{c.contactGh}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{c.contactGhCta}</span>
              </a>
            </div>
            <div style={labelStyle}>{c.contactCompanies}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <CompanyRow name={c.contactC1n} desc={c.contactC1d} role={c.contactC1r} />
              <CompanyRow name={c.contactC2n} desc={c.contactC2d} role={c.contactC2r} />
              <CompanyRow name={c.contactC3n} desc={c.contactC3d} role={c.contactC3r} last />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
