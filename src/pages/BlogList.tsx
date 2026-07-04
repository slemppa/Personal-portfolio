import { useEffect } from 'react'
import { Link } from 'react-router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { getAllPosts } from '../lib/posts'
import { formatDate } from '../lib/format'
import { t, otherLang, blogListPath, blogPostPath } from '../lib/i18n'
import type { Lang } from '../lib/parsePost'
import { usePostHog } from '@posthog/react'

export default function BlogList({ lang }: { lang: Lang }) {
  const posthog = usePostHog()
  const posts = getAllPosts(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = `${t(lang, 'blogTitle')} · Sami Kiias`
  }, [lang])

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-24 min-h-screen">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-4xl font-bold text-text-primary">{t(lang, 'blogTitle')}</h1>
          <Link
            to={blogListPath(otherLang(lang))}
            className="mt-2 shrink-0 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {t(lang, 'switchLabel')}
          </Link>
        </div>
        <p className="text-text-secondary mb-12">{t(lang, 'blogSubtitle')}</p>
        {posts.length === 0 ? (
          <p className="text-text-muted">{t(lang, 'empty')}</p>
        ) : (
          <ul className="flex flex-col gap-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={blogPostPath(lang, post.slug)}
                  onClick={() => posthog?.capture('blog_post_clicked', { post_slug: post.slug, post_title: post.title, lang })}
                  className="group block rounded-2xl border border-border hover:border-border-hover bg-bg-secondary p-6 transition-colors"
                >
                  {post.cover && (
                    <img src={post.cover} alt="" className="mb-4 aspect-video w-full rounded-xl object-cover" />
                  )}
                  <time className="text-xs uppercase tracking-wide text-text-muted">
                    {formatDate(post.date, lang)}
                  </time>
                  <h2 className="mt-1 text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  {post.description && <p className="mt-2 text-text-secondary">{post.description}</p>}
                  {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">
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
      </main>
      <Footer />
    </>
  )
}
