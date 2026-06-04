# Obsidian Markdown Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a markdown blog to the existing Vite/React portfolio where posts are authored in Obsidian (`.md` files in the repo) and rendered nicely on `/blog` and `/blog/:slug`.

**Architecture:** `react-router` splits the SPA into `/` (existing portfolio, moved to a `Home` page) and blog routes. Markdown files in `src/content/blog/*.md` are loaded at build time via `import.meta.glob`, parsed with a pure `parsePost` function (frontmatter via `js-yaml`), and rendered with `react-markdown` + plugins inside a Tailwind `prose` container. Drafts are filtered in production. Vercel auto-builds on push with an SPA rewrite.

**Tech Stack:** Vite 7, React 19, TypeScript, Tailwind CSS 4, react-router, react-markdown, remark-gfm, rehype-slug, rehype-highlight, js-yaml, @tailwindcss/typography, vitest.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/lib/parsePost.ts` | Pure: parse raw md → `Post`; `selectPosts` filter/sort. Types. |
| `src/lib/parsePost.test.ts` | Vitest unit tests for parsing/filtering/sorting. |
| `src/lib/posts.ts` | `import.meta.glob` loader → `getAllPosts`/`getPost`. |
| `src/lib/format.ts` | `formatDate` (shared by list + post). |
| `src/components/Markdown.tsx` | Wraps react-markdown + plugins + prose styling. |
| `src/components/Nav.tsx` | Modified: router links + Blog link. |
| `src/pages/Home.tsx` | Existing portfolio body (moved from `App.tsx`). |
| `src/pages/BlogList.tsx` | Post cards list. |
| `src/pages/BlogPost.tsx` | Single post + 404 view. |
| `src/main.tsx` | Modified: BrowserRouter + routes. |
| `src/content/blog/tervetuloa.md` | Sample post. |
| `docs/obsidian-blog-setup.md` | Obsidian authoring guide. |
| `vite.config.ts` | Modified: vitest config. |
| `vercel.json` | SPA rewrite. |
| `package.json` | Modified: deps + test script. |
| `src/index.css` | Modified: typography plugin. |
| `src/App.tsx` | Deleted (replaced by Home page). |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install runtime + dev dependencies**

Run:
```bash
npm install react-router react-markdown remark-gfm rehype-slug rehype-highlight js-yaml @tailwindcss/typography
npm install -D vitest @types/js-yaml
```
Expected: installs succeed, `package.json` dependencies updated.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add blog dependencies"
```

---

## Task 2: Configure vitest

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Switch vite config to vitest/config and add test block**

Replace the entire contents of `vite.config.ts` with:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 2: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run"
```

- [ ] **Step 3: Verify vitest runs (no tests yet)**

Run: `npm test`
Expected: vitest reports "No test files found" (exit may be non-zero; that's fine — it proves vitest is wired).

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts package.json
git commit -m "chore: configure vitest"
```

---

## Task 3: parsePost — frontmatter parsing (TDD)

**Files:**
- Create: `src/lib/parsePost.ts`
- Test: `src/lib/parsePost.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/parsePost.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { parsePost } from './parsePost'

const RAW = `---
title: "Tervetuloa"
date: 2026-06-04
description: "Kuvaus"
tags: [react, obsidian]
cover: /blog/x.png
draft: false
---

Sisältö **tähän**.
`

describe('parsePost', () => {
  it('parses all frontmatter fields and body', () => {
    const post = parsePost(RAW, 'tervetuloa.md')
    expect(post).not.toBeNull()
    expect(post!.slug).toBe('tervetuloa')
    expect(post!.title).toBe('Tervetuloa')
    expect(post!.date).toBe('2026-06-04')
    expect(post!.description).toBe('Kuvaus')
    expect(post!.tags).toEqual(['react', 'obsidian'])
    expect(post!.cover).toBe('/blog/x.png')
    expect(post!.draft).toBe(false)
    expect(post!.content).toBe('Sisältö **tähän**.')
  })

  it('defaults tags to [] and draft to false when omitted', () => {
    const raw = `---\ntitle: A\ndate: 2026-01-01\n---\nBody`
    const post = parsePost(raw, 'a.md')
    expect(post!.tags).toEqual([])
    expect(post!.draft).toBe(false)
    expect(post!.description).toBeUndefined()
  })

  it('returns null when frontmatter is missing', () => {
    expect(parsePost('No frontmatter here', 'b.md')).toBeNull()
  })

  it('returns null when title or date is missing', () => {
    expect(parsePost('---\ntitle: Only\n---\nx', 'c.md')).toBeNull()
    expect(parsePost('---\ndate: 2026-01-01\n---\nx', 'd.md')).toBeNull()
  })

  it('returns null on invalid yaml', () => {
    expect(parsePost('---\ntitle: "unterminated\n---\nx', 'e.md')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — "Cannot find module './parsePost'".

- [ ] **Step 3: Implement parsePost**

Create `src/lib/parsePost.ts`:
```ts
import yaml from 'js-yaml'

export type Post = {
  slug: string
  title: string
  date: string
  description?: string
  tags: string[]
  cover?: string
  draft: boolean
  content: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value
  return ''
}

export function parsePost(raw: string, filename: string): Post | null {
  const slug = filename.replace(/\.md$/, '')
  const match = raw.match(FRONTMATTER_RE)
  if (!match) {
    console.warn(`[blog] ${filename}: ei frontmatteria, skipataan`)
    return null
  }

  let data: Record<string, unknown>
  try {
    data = (yaml.load(match[1]) ?? {}) as Record<string, unknown>
  } catch (e) {
    console.warn(`[blog] ${filename}: virheellinen frontmatter, skipataan`, e)
    return null
  }

  const title = typeof data.title === 'string' ? data.title : ''
  const date = normalizeDate(data.date)
  if (!title || !date) {
    console.warn(`[blog] ${filename}: title tai date puuttuu, skipataan`)
    return null
  }

  return {
    slug,
    title,
    date,
    description: typeof data.description === 'string' ? data.description : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: typeof data.cover === 'string' ? data.cover : undefined,
    draft: data.draft === true,
    content: match[2].trim(),
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (5 tests). Note: the "invalid yaml" and "missing" cases print expected `console.warn` lines — that is correct behavior.

- [ ] **Step 5: Commit**

```bash
git add src/lib/parsePost.ts src/lib/parsePost.test.ts
git commit -m "feat: add parsePost frontmatter parser with tests"
```

---

## Task 4: selectPosts — filter & sort (TDD)

**Files:**
- Modify: `src/lib/parsePost.ts`
- Modify: `src/lib/parsePost.test.ts`

- [ ] **Step 1: Add failing tests**

Append to `src/lib/parsePost.test.ts`:
```ts
import { selectPosts } from './parsePost'

const make = (slug: string, date: string, draft = false): import('./parsePost').Post => ({
  slug, title: slug, date, tags: [], draft, content: '',
})

describe('selectPosts', () => {
  it('sorts by date descending', () => {
    const out = selectPosts([make('a', '2026-01-01'), make('b', '2026-03-01'), make('c', '2026-02-01')], true)
    expect(out.map(p => p.slug)).toEqual(['b', 'c', 'a'])
  })

  it('excludes drafts when includeDrafts is false', () => {
    const out = selectPosts([make('pub', '2026-01-01'), make('hid', '2026-02-01', true)], false)
    expect(out.map(p => p.slug)).toEqual(['pub'])
  })

  it('includes drafts when includeDrafts is true', () => {
    const out = selectPosts([make('pub', '2026-01-01'), make('hid', '2026-02-01', true)], true)
    expect(out.map(p => p.slug)).toEqual(['hid', 'pub'])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `selectPosts` is not exported.

- [ ] **Step 3: Implement selectPosts**

Append to `src/lib/parsePost.ts`:
```ts
export function selectPosts(posts: Post[], includeDrafts: boolean): Post[] {
  return posts
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (8 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/lib/parsePost.ts src/lib/parsePost.test.ts
git commit -m "feat: add selectPosts filter and sort with tests"
```

---

## Task 5: posts.ts — glob loader

**Files:**
- Create: `src/lib/posts.ts`

- [ ] **Step 1: Implement the loader**

Create `src/lib/posts.ts`:
```ts
import { parsePost, selectPosts, type Post } from './parsePost'

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const allParsed: Post[] = Object.entries(modules)
  .map(([path, raw]) => parsePost(raw, path.split('/').pop()!))
  .filter((p): p is Post => p !== null)

export function getAllPosts(): Post[] {
  return selectPosts(allParsed, !import.meta.env.PROD)
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export type { Post }
```

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc -b`
Expected: no errors (the glob dir is empty until Task 11; an empty glob is valid).

- [ ] **Step 3: Commit**

```bash
git add src/lib/posts.ts
git commit -m "feat: add posts glob loader"
```

---

## Task 6: format.ts — date helper

**Files:**
- Create: `src/lib/format.ts`

- [ ] **Step 1: Implement formatDate**

Create `src/lib/format.ts`:
```ts
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fi-FI', { year: 'numeric', month: 'long', day: 'numeric' })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/format.ts
git commit -m "feat: add formatDate helper"
```

---

## Task 7: Markdown component

**Files:**
- Create: `src/components/Markdown.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add the typography plugin to Tailwind**

In `src/index.css`, change the first line from:
```css
@import "tailwindcss";
```
to:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

- [ ] **Step 2: Implement the Markdown component**

Create `src/components/Markdown.tsx`:
```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-text-primary prose-a:text-accent hover:prose-a:text-accent-hover prose-code:text-text-primary prose-strong:text-text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 3: Verify it typechecks**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Markdown.tsx src/index.css
git commit -m "feat: add Markdown renderer with prose styling"
```

---

## Task 8: Home page (extract from App)

**Files:**
- Create: `src/pages/Home.tsx`
- Delete: `src/App.tsx`

- [ ] **Step 1: Create Home page with the existing portfolio body**

Create `src/pages/Home.tsx`:
```tsx
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Cases from '../components/Cases'
import TechStack from '../components/TechStack'
import YouTube from '../components/YouTube'
import Story from '../components/Story'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Cases />
        <TechStack />
        <YouTube />
        <Story />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Delete the old App.tsx**

Run: `git rm src/App.tsx`
Expected: file removed (main.tsx is updated in Task 10, so the build is intentionally broken between here and Task 10 — that's expected).

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "refactor: move portfolio body into Home page"
```

---

## Task 9: BlogList page

**Files:**
- Create: `src/pages/BlogList.tsx`

- [ ] **Step 1: Implement BlogList**

Create `src/pages/BlogList.tsx`:
```tsx
import { Link } from 'react-router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { getAllPosts } from '../lib/posts'
import { formatDate } from '../lib/format'

export default function BlogList() {
  const posts = getAllPosts()
  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-24 min-h-screen">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Blogi</h1>
        <p className="text-text-secondary mb-12">Ajatuksia ja muistiinpanoja.</p>
        {posts.length === 0 ? (
          <p className="text-text-muted">Ei vielä postauksia.</p>
        ) : (
          <ul className="flex flex-col gap-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-border hover:border-border-hover bg-bg-secondary p-6 transition-colors"
                >
                  {post.cover && (
                    <img src={post.cover} alt="" className="mb-4 aspect-video w-full rounded-xl object-cover" />
                  )}
                  <time className="text-xs uppercase tracking-wide text-text-muted">
                    {formatDate(post.date)}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/BlogList.tsx
git commit -m "feat: add BlogList page"
```

---

## Task 10: BlogPost page + router wiring

**Files:**
- Create: `src/pages/BlogPost.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Implement BlogPost**

Create `src/pages/BlogPost.tsx`:
```tsx
import { Link, useParams } from 'react-router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Markdown from '../components/Markdown'
import { getPost } from '../lib/posts'
import { formatDate } from '../lib/format'

export default function BlogPost() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-8 pt-32 pb-24 min-h-screen">
        <Link to="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          ← Takaisin blogiin
        </Link>
        {!post ? (
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-text-primary">Postausta ei löytynyt</h1>
            <p className="mt-2 text-text-secondary">Tarkista osoite tai palaa blogiin.</p>
          </div>
        ) : (
          <article className="mt-8">
            <header className="mb-10">
              <time className="text-xs uppercase tracking-wide text-text-muted">{formatDate(post.date)}</time>
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
        )}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Wire the router in main.tsx**

Replace the entire contents of `src/main.tsx` with:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import BlogList from './pages/BlogList.tsx'
import BlogPost from './pages/BlogPost.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 3: Verify it typechecks and builds**

Run: `npx tsc -b && npm run build`
Expected: build succeeds, `dist/` produced.

- [ ] **Step 4: Commit**

```bash
git add src/pages/BlogPost.tsx src/main.tsx
git commit -m "feat: add BlogPost page and wire router"
```

---

## Task 11: Nav routing update

**Files:**
- Modify: `src/components/Nav.tsx`

- [ ] **Step 1: Update Nav to use router links and add Blog link**

Replace the entire contents of `src/components/Nav.tsx` with:
```tsx
import { Link } from 'react-router'

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SK</span>
          </div>
          <span className="hidden sm:block text-text-primary font-semibold">Sami Kiias</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#cases" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Projektit
          </a>
          <a href="/#tech" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Tech
          </a>
          <a href="/#story" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Tarina
          </a>
          <Link to="/blog" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Blog
          </Link>
          <a
            href="/#contact"
            className="px-4 py-2 bg-gradient-to-r from-accent to-purple-500 text-white text-sm font-medium rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 transition-all"
          >
            Ota yhteyttä
          </a>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: add Blog nav link and router-aware navigation"
```

---

## Task 12: Sample post + content folder

**Files:**
- Create: `src/content/blog/tervetuloa.md`

- [ ] **Step 1: Create the sample post**

Create `src/content/blog/tervetuloa.md` (note: the body contains a fenced code block):
```markdown
---
title: "Tervetuloa blogiin"
date: 2026-06-04
description: "Ensimmäinen postaus — näin tämä blogi toimii."
tags: [obsidian, blogi]
draft: false
---

Tämä on ensimmäinen postaus. Kirjoitan nämä **Obsidianissa** ja ne renderöityvät
suoraan tähän sivustoon.

## Mitä toimii

- Listat
- Taulukot ja tehtävälistat (GitHub-markdown)
- Koodin syntaksikorostus

Linkit kirjoitetaan tavallisina markdown-linkkeinä, esim. [Obsidian](https://obsidian.md).
```

- [ ] **Step 2: Verify the post loads in dev**

Run: `npm run dev` then open `http://localhost:5173/blog` in a browser.
Expected: the list shows "Tervetuloa blogiin"; clicking it opens `/blog/tervetuloa` with rendered markdown. Stop the dev server (Ctrl+C) when confirmed.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/tervetuloa.md
git commit -m "feat: add sample blog post"
```

---

## Task 13: Vercel SPA rewrite

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
(Vercel checks the built filesystem before applying rewrites, so static assets are still served; only unmatched routes fall back to `index.html`, fixing direct loads of `/blog/:slug`.)

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: add Vercel SPA rewrite"
```

---

## Task 14: Obsidian authoring guide

**Files:**
- Create: `docs/obsidian-blog-setup.md`

- [ ] **Step 1: Write the guide**

Create `docs/obsidian-blog-setup.md`:
```markdown
# Blogin kirjoittaminen Obsidianissa

Blogipostaukset ovat tavallisia markdown-tiedostoja kansiossa
`src/content/blog/`. Tiedoston nimi määrää URL-slugin:
`oma-postaus.md` → `/blog/oma-postaus`.

## Kertasetup

1. **Avaa repo vaultiksi.** Obsidian → "Open folder as vault" → valitse repon
   juuri (tai suoraan `src/content/blog`).
2. **Asenna Obsidian Git** (Community plugins). Aseta auto-commit + auto-push
   esim. 10 minuutin välein, niin julkaisu hoituu ilman terminaalia.
3. **Aseta liitekansio.** Settings → Files and links → "Default location for new
   attachments" → "In the folder specified below" → `public/blog`. Näin kuvapolut
   (`/blog/...`) täsmäävät sekä Obsidianissa että tuotannossa.

## Uusi postaus

Luo uusi tiedosto `src/content/blog/`-kansioon ja liitä alkuun frontmatter:

\`\`\`yaml
---
title: "Otsikko"
date: 2026-06-04
description: "Lyhyt kuvaus listaan"
tags: [react, obsidian]
cover: /blog/kuva.png   # valinnainen
draft: false
---
\`\`\`

- `draft: true` pitää postauksen piilossa tuotannosta (näkyy vain dev-tilassa).
- `draft: false` julkaisee sen seuraavassa Vercel-buildissa pushin jälkeen.
- Kuvat: pudota ne `public/blog/`-kansioon ja viittaa `/blog/tiedosto.png`.
- Linkit: käytä tavallisia markdown-linkkejä; Obsidianin `[[wikilinkit]]` eivät
  renderöidy.

## Julkaisu

Tallenna → Obsidian Git commitoi ja pushaa → Vercel buildaa ja julkaisee
automaattisesti (n. 1–2 min).
```

- [ ] **Step 2: Commit**

```bash
git add docs/obsidian-blog-setup.md
git commit -m "docs: add Obsidian blog authoring guide"
```

---

## Task 15: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS (8 tests).

- [ ] **Step 2: Typecheck and production build**

Run: `npx tsc -b && npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 3: Preview the production build**

Run: `npm run preview` then visit `/`, `/blog`, `/blog/tervetuloa`, and a bad slug like `/blog/ei-ole`.
Expected:
- `/` shows the portfolio unchanged.
- `/blog` lists the sample post.
- `/blog/tervetuloa` renders the markdown with prose styling and code highlighting.
- `/blog/ei-ole` shows "Postausta ei löytynyt".
Stop the preview server when confirmed.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors (fix any that appear in new files).

---

## Self-Review Notes

- **Spec coverage:** routing (T10), Vercel (T13), comprehensive frontmatter (T3), stable markdown set — GFM/highlight/slug (T7), draft filtering (T4/T5), error handling for bad frontmatter (T3) and unknown slug (T10), tests (T3/T4), Obsidian guide (T14). All covered.
- **Deviation from spec:** the Obsidian guide lives at `docs/obsidian-blog-setup.md` instead of `src/content/blog/README.md`, so the `*.md` glob does not pick it up and warn. Intentional.
- **Type consistency:** `Post`, `parsePost`, `selectPosts`, `getAllPosts`, `getPost`, `formatDate`, `Markdown` used consistently across tasks.
```
