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
