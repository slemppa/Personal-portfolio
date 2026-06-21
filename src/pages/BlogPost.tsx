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
