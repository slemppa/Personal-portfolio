'use client'

import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Markdown from '../components/Markdown'
import NewsletterForm from '../components/NewsletterForm'
import { formatDate } from '../lib/format'
import { t, otherLang, blogListPath, blogPostPath } from '../lib/i18n'
import { ABOUT_PATH, AUTHOR_NAME, postModified } from '../lib/seo'
import type { Lang, Post } from '../lib/parsePost'

export default function BlogPost({
  lang,
  slug,
  post,
  hasTranslation,
}: {
  lang: Lang
  slug: string
  post?: Post
  hasTranslation: boolean
}) {
  // Switch to the same post in the other language if it's translated;
  // otherwise fall back to that language's blog index.
  const target = otherLang(lang)
  const switchTo = hasTranslation ? blogPostPath(target, slug) : blogListPath(target)

  return (
    <>
      <Nav lang={lang} />
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-24 min-h-screen">
        <div className="flex items-center justify-between gap-4">
          <Link href={blogListPath(lang)} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            {t(lang, 'back')}
          </Link>
          <Link href={switchTo} className="shrink-0 text-sm text-text-secondary hover:text-text-primary transition-colors">
            {t(lang, 'switchLabel')}
          </Link>
        </div>
        {!post ? (
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-text-primary">{t(lang, 'notFoundTitle')}</h1>
            <p className="mt-2 text-text-secondary">{t(lang, 'notFoundBody')}</p>
          </div>
        ) : (
          <>
            <article className="mt-8">
              <header className="mb-10">
                <h1 className="text-4xl font-bold text-text-primary">{post.title}</h1>
                <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
                  <span>
                    {t(lang, 'byline')}{' '}
                    <Link href={ABOUT_PATH} rel="author" className="font-medium text-text-secondary hover:text-text-primary">
                      {AUTHOR_NAME}
                    </Link>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {t(lang, 'published')} <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                  </span>
                  {postModified(post) !== post.date && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {t(lang, 'updated')} <time dateTime={postModified(post)}>{formatDate(postModified(post), lang)}</time>
                      </span>
                    </>
                  )}
                </p>
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {post.cover && (
                  <img src={post.cover} alt={post.coverAlt ?? post.title} className="mt-6 aspect-video w-full rounded-2xl object-cover" />
                )}
              </header>
              <Markdown demoteH1>{post.content}</Markdown>
            </article>
            {lang === 'fi' && (
              <aside className="mt-12 rounded-2xl border border-border bg-bg-secondary p-6">
                <p className="font-semibold text-text-primary">Tarvitsetko tekijän omaan projektiisi?</p>
                <p className="mt-2 text-sm text-text-secondary">
                  Rakennan MVP:t, AI-integraatiot ja n8n-automaatiot ideasta tuotantoon.{' '}
                  <Link href="/mvp-kehitys" className="text-accent underline underline-offset-4 hover:text-accent-hover">
                    MVP-kehitys
                  </Link>{' '}
                  ·{' '}
                  <Link href="/n8n-automaatiot" className="text-accent underline underline-offset-4 hover:text-accent-hover">
                    n8n-automaatiot
                  </Link>
                </p>
              </aside>
            )}
            <div className="mt-12">
              <NewsletterForm lang={lang} source={`newsletter:${slug}`} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
