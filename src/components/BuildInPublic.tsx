import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { fetchActivity, type Activity } from '../lib/activity'
import { getAllPosts } from '../lib/posts'
import ContributionHeatmap from './ContributionHeatmap'

const mono = "'JetBrains Mono', monospace"

function fmtDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fi-FI', { day: 'numeric', month: 'short', year: 'numeric' })
}

function relTime(iso: string): string {
  const d = new Date(iso).getTime()
  if (isNaN(d)) return ''
  const s = Math.round((Date.now() - d) / 1000)
  if (s < 60) return 'juuri nyt'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min sitten`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h sitten`
  const days = Math.round(h / 24)
  if (days < 30) return `${days} pv sitten`
  const mo = Math.round(days / 30)
  return `${mo} kk sitten`
}

/** Count up to a target once when it first becomes available. */
function useCountUp(target: number | null): number {
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [n, setN] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (target == null || reduced || done.current) return
    done.current = true
    const dur = 1400
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setN(Math.round(target * e))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, reduced])
  if (target == null) return 0
  return reduced ? target : n
}

const sectionStyle: React.CSSProperties = {
  position: 'relative',
  background: '#0c0d10',
  borderTop: '1px solid rgba(255,255,255,.06)',
}
const containerStyle: React.CSSProperties = {
  maxWidth: 1280,
  margin: '0 auto',
  padding: 'clamp(90px,12vh,150px) clamp(20px,5vw,56px)',
}
const labelStyle: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 12.5,
  letterSpacing: '.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,.4)',
}
const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 14,
  background: 'rgba(255,255,255,.015)',
}
const tileStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,.09)',
  borderRadius: 13,
  padding: 20,
  background: 'rgba(255,255,255,.015)',
}

function Shell({ children, updated }: { children: React.ReactNode; updated?: string }) {
  return (
    <section id="build" style={sectionStyle}>
      <div style={containerStyle}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: 'clamp(28px,5vw,64px)',
            alignItems: 'start',
          }}
          className="bip-grid"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <span style={labelStyle}>03 — Build in Public</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#f2f3f4', animation: 'ping 2.2s cubic-bezier(0,0,.2,1) infinite' }} />
                  <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#f2f3f4' }} />
                </span>
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>
                  Live{updated ? ` · päivitetty ${updated}` : ''}
                </span>
              </span>
            </div>
            <h2 style={{ margin: '0 0 22px', fontWeight: 600, fontSize: 'clamp(2rem,4vw,3.4rem)', letterSpacing: '-.025em' }}>
              Build in Public
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: 16.5, lineHeight: 1.62, color: 'rgba(255,255,255,.56)', maxWidth: 460 }}>
              Dokumentoin matkaa AI-järjestelmien rakentajana — oikeaa dataa,
              ei kuvituskuvaa. Videot, koodi ja kirjoitukset päivittyvät tähän
              automaattisesti kun julkaisen.
            </p>
            {children && Array.isArray(children) ? children[0] : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {children && Array.isArray(children) ? children[1] : children}
          </div>
        </div>
      </div>
    </section>
  )
}

function SkeletonBox({ h }: { h: number }) {
  return <div style={{ ...tileStyle, height: h, animation: 'glowPulse 1.6s ease-in-out infinite' }} />
}

export default function BuildInPublic() {
  const [data, setData] = useState<Activity | null>(null)
  const [failed, setFailed] = useState(false)
  const contributions = useCountUp(data?.github.totalContributions ?? null)
  const latestPost = getAllPosts()[0]

  useEffect(() => {
    const ctrl = new AbortController()
    fetchActivity(ctrl.signal)
      .then(setData)
      .catch((e) => {
        if (e?.name !== 'AbortError') setFailed(true)
      })
    return () => ctrl.abort()
  }, [])

  // Loading skeleton.
  if (!data && !failed) {
    return (
      <Shell>
        <div style={{ ...cardStyle, padding: 24, maxWidth: 420, marginTop: 4 }}>
          <SkeletonBox h={180} />
        </div>
        <>
          <SkeletonBox h={150} />
          <SkeletonBox h={96} />
        </>
      </Shell>
    )
  }

  const yt = data?.youtube
  const gh = data?.github
  const video = yt?.videos[0]
  const updated = data ? new Date(data.generatedAt).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }) : undefined

  return (
    <Shell updated={updated}>
      {/* LEFT: latest YouTube video */}
      <a
        href={video?.url || yt?.channelUrl || 'https://www.youtube.com/@samikiias'}
        target="_blank"
        rel="noreferrer"
        style={{ ...cardStyle, display: 'block', overflow: 'hidden', maxWidth: 440, marginTop: 4, textDecoration: 'none', color: '#e9eaec' }}
      >
        {video ? (
          <>
            <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#0a0b0d' }}>
              <img src={video.thumbnail} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.92 }} />
              <span style={{ position: 'absolute', left: 12, top: 12, fontFamily: mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#0a0b0d', background: '#f2f3f4', padding: '4px 8px', borderRadius: 5, fontWeight: 600 }}>
                Uusin video
              </span>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, marginBottom: 8 }}>{video.title}</div>
              <div style={{ fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,.45)' }}>
                @samikiias{video.durationText ? ` · ${video.durationText}` : ''} · katso →
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>@samikiias YouTubessa</div>
            <div style={{ fontFamily: mono, fontSize: 13, color: 'rgba(255,255,255,.5)' }}>AI &amp; automaatio · tilaa kanava →</div>
          </div>
        )}
      </a>

      {/* RIGHT: GitHub panel + latest blog */}
      <>
        <a href={gh?.profileUrl || 'https://github.com/slemppa'} target="_blank" rel="noreferrer" style={{ ...tileStyle, display: 'block', textDecoration: 'none', color: '#e9eaec' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <div>
              <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 'clamp(1.6rem,2.6vw,2.3rem)', color: '#f7f8f9' }}>
                {gh?.totalContributions != null ? contributions.toLocaleString('fi-FI') : '—'}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.42)', marginLeft: 10 }}>
                contributionia / vuosi
              </span>
            </div>
            <span style={{ fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>github →</span>
          </div>
          {gh?.weeks ? <ContributionHeatmap weeks={gh.weeks} /> : null}
          {gh?.recent?.length ? (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gh.recent.slice(0, 3).map((c, i) => (
                <div key={i} style={{ fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ color: 'rgba(255,255,255,.35)' }}>{c.repo.split('/')[1] || c.repo}</span> · {c.message}
                  {c.at ? <span style={{ color: 'rgba(255,255,255,.3)' }}> · {relTime(c.at)}</span> : null}
                </div>
              ))}
            </div>
          ) : null}
        </a>

        {latestPost ? (
          <Link to={`/blog/${latestPost.slug}`} style={{ ...tileStyle, display: 'block', textDecoration: 'none', color: '#e9eaec' }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.36)', marginBottom: 10 }}>
              Uusin kirjoitus · {fmtDate(latestPost.date)}
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, marginBottom: latestPost.description ? 8 : 0 }}>{latestPost.title}</div>
            {latestPost.description ? (
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: 'rgba(255,255,255,.52)' }}>{latestPost.description}</p>
            ) : null}
          </Link>
        ) : null}
      </>
    </Shell>
  )
}
