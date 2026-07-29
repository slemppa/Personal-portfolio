import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Markdown from '../components/Markdown'
import NewsletterForm from '../components/NewsletterForm'
import { getPost, getTranslation } from '../lib/posts'
import { formatDate } from '../lib/format'
import { t, otherLang, blogListPath, blogPostPath } from '../lib/i18n'
import { applyHead, type Alternate } from '../lib/head'
import type { Lang } from '../lib/parsePost'

export default function BlogPost({ lang }: { lang: Lang }) {
  const { slug } = useParams()
  const post = slug ? getPost(slug, lang) : undefined

  // Switch to the same post in the other language if it's translated;
  // otherwise fall back to that language's blog index.
  const target = otherLang(lang)
  const translation = slug ? getTranslation(slug, target) : undefined
  const switchTo = translation ? blogPostPath(target, slug!) : blogListPath(target)

  useEffect(() => {
    if (!slug) return
    const fiPost = getPost(slug, 'fi')
    const enPost = getPost(slug, 'en')
    const alternates: Alternate[] = []
    if (fiPost) alternates.push({ hreflang: 'fi', path: blogPostPath('fi', slug) })
    if (enPost) alternates.push({ hreflang: 'en', path: blogPostPath('en', slug) })
    // x-default points at the Finnish version when it exists, else this one.
    alternates.push({ hreflang: 'x-default', path: blogPostPath(fiPost ? 'fi' : lang, slug) })

    applyHead({
      lang,
      title: post ? `${post.title} · Sami Kiias` : `${t(lang, 'notFoundTitle')} · Sami Kiias`,
      description: post?.description,
      canonical: blogPostPath(lang, slug),
      alternates,
    })
  }, [lang, slug, post])

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-24 min-h-screen">
        <div className="flex items-center justify-between gap-4">
          <Link to={blogListPath(lang)} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            {t(lang, 'back')}
          </Link>
          <Link to={switchTo} className="shrink-0 text-sm text-text-secondary hover:text-text-primary transition-colors">
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
                <time className="text-xs uppercase tracking-wide text-text-muted">{formatDate(post.date, lang)}</time>
                <h1 className="mt-2 text-4xl font-bold text-text-primary">{post.title}</h1>
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
                  <img src={post.cover} alt="" className="mt-6 aspect-video w-full rounded-2xl object-cover" />
                )}
              </header>
              <Markdown>{post.content}</Markdown>
            </article>
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
