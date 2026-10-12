'use client'

import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import NewsletterForm from '../components/NewsletterForm'
import { formatDate } from '../lib/format'
import { t, otherLang, blogListPath, blogPostPath } from '../lib/i18n'
import type { Lang, Post } from '../lib/parsePost'
import { capture } from '../lib/analytics'

export default function BlogList({ lang, posts }: { lang: Lang; posts: Post[] }) {

  return (
    <>
      <Nav lang={lang} />
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-24 min-h-screen">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-4xl font-bold text-text-primary">{t(lang, 'blogTitle')}</h1>
          <Link
            href={blogListPath(otherLang(lang))}
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
                  href={blogPostPath(lang, post.slug)}
                  onClick={() => capture('blog_post_clicked', { post_slug: post.slug, post_title: post.title, lang })}
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
        <div className="mt-12">
          <NewsletterForm lang={lang} source="newsletter:blog" />
        </div>
      </main>
      <Footer />
    </>
  )
}
