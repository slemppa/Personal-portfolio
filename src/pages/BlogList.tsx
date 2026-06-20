import { Link } from 'react-router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import CTASection from '../components/CTASection'
import PageGlow from '../components/PageGlow'
import { getAllPosts } from '../lib/posts'
import { formatDate } from '../lib/format'
import { usePostHog } from '@posthog/react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BlogList() {
  const posthog = usePostHog()
  const posts = getAllPosts()
  useDocumentMeta({
    title: 'Blogi | Sami Kiias',
    description: 'Ajatuksia ja muistiinpanoja rakentamisesta, AI-järjestelmistä ja yrittäjyydestä.',
    path: '/blog',
  })
  return (
    <>
      <Nav />
      <PageGlow />
      <main className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 pt-36 pb-24 min-h-screen">
        <span className="eyebrow">Blogi</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text-primary mb-2">Ajatuksia &amp; muistiinpanoja</h1>
        <p className="text-text-secondary mb-12">Rakentamisesta, AI-järjestelmistä ja yrittäjyydestä.</p>
        {posts.length === 0 ? (
          <p className="text-text-muted">Ei vielä postauksia.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  onClick={() => posthog?.capture('blog_post_clicked', { post_slug: post.slug, post_title: post.title })}
                  className="group block rounded-2xl surface-card p-6 transition-all hover:border-border-hover hover:-translate-y-0.5"
                >
                  {post.cover && (
                    <img src={post.cover} alt="" className="mb-5 aspect-video w-full rounded-xl object-cover" />
                  )}
                  <time className="eyebrow">
                    {formatDate(post.date)}
                  </time>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  {post.description && <p className="mt-2 text-text-secondary leading-relaxed">{post.description}</p>}
                  {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-md border border-border bg-bg-tertiary/60 px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <CTASection
          source="blog_list"
          title={
            <>
              Mietitkö, mikä näistä toimisi <span className="text-gradient-accent">teillä?</span>
            </>
          }
          description="Lukemisesta tekoihin: kerro lyhyesti tilanteesta, niin katsotaan mikä kannattaisi automatisoida ensin."
          secondary={{ label: 'Katso projektit', to: '/#cases' }}
        />
      </main>
      <Footer />
    </>
  )
}
