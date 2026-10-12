// Server-side page bodies shared by the fi and en route files: each language's
// page.tsx is a one-liner that calls these with its `lang`. Data comes from
// Payload (posts) and src/lib (cases, copy); SEO metadata from lib/routes.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '../components/JsonLd'
import Home from '../views/Home'
import BlogList from '../views/BlogList'
import BlogPost from '../views/BlogPost'
import CaseStudy from '../views/CaseStudy'
import { getAllPosts, getEveryPost, getPost } from '../lib/posts'
import { getCaseStudy, getCases } from '../lib/cases'
import { blogListPath, blogPostPath, casePath, homePath, otherLang } from '../lib/i18n'
import { collectRoutes, findRoute, routeMetadata } from '../lib/routes'
import type { Lang, Post } from '../lib/parsePost'

type SlugProps = { params: Promise<{ slug: string }> }

async function metadataFor(path: string): Promise<Metadata> {
  const route = findRoute(collectRoutes(await getEveryPost()), path)
  return route ? routeMetadata(route) : {}
}

async function jsonLdFor(path: string) {
  return findRoute(collectRoutes(await getEveryPost()), path)?.jsonLd ?? []
}

/** List views only need the teaser fields, not every post's full body. */
const teaser = (p: Post): Post => ({ ...p, content: '' })

// --- Home

export const homeMetadata = (lang: Lang) => () => metadataFor(homePath(lang))

export function homePage(lang: Lang) {
  return async function Page() {
    const latest = (await getAllPosts(lang)).slice(0, 3).map(teaser)
    return (
      <>
        <JsonLd blocks={await jsonLdFor(homePath(lang))} />
        <Home lang={lang} latestPosts={latest} />
      </>
    )
  }
}

// --- Blog

export const blogListMetadata = (lang: Lang) => () => metadataFor(blogListPath(lang))

export function blogListPage(lang: Lang) {
  return async function Page() {
    return <BlogList lang={lang} posts={(await getAllPosts(lang)).map(teaser)} />
  }
}

export function blogPostParams(lang: Lang) {
  return async () => (await getAllPosts(lang)).map((p) => ({ slug: p.slug }))
}

export function blogPostMetadata(lang: Lang) {
  return async ({ params }: SlugProps) => metadataFor(blogPostPath(lang, (await params).slug))
}

export function blogPostPage(lang: Lang) {
  return async function Page({ params }: SlugProps) {
    const { slug } = await params
    const post = await getPost(slug, lang)
    if (!post) notFound()
    const translation = await getPost(slug, otherLang(lang))
    return (
      <>
        <JsonLd blocks={await jsonLdFor(blogPostPath(lang, slug))} />
        <BlogPost lang={lang} slug={slug} post={post} hasTranslation={!!translation} />
      </>
    )
  }
}

// --- Case studies

export function caseParams(lang: Lang) {
  return () => getCases(lang).map((c) => ({ slug: c.slug }))
}

export function caseMetadata(lang: Lang) {
  return async ({ params }: SlugProps) => metadataFor(casePath(lang, (await params).slug))
}

export function casePage(lang: Lang) {
  return async function Page({ params }: SlugProps) {
    const { slug } = await params
    if (!getCaseStudy(slug, lang)) notFound()
    return <CaseStudy lang={lang} slug={slug} />
  }
}
