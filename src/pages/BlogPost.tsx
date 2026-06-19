import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Markdown from '../components/Markdown'
import CTASection from '../components/CTASection'
import PageGlow from '../components/PageGlow'
import { getPost } from '../lib/posts'
import { formatDate } from '../lib/format'

export default function BlogPost() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined

  return (
    <>
      <Nav />
      <PageGlow />
      <main className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 pt-36 pb-24 min-h-screen">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Takaisin blogiin
        </Link>
        {!post ? (
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-text-primary">Postausta ei löytynyt</h1>
            <p className="mt-2 text-text-secondary">Tarkista osoite tai palaa blogiin.</p>
          </div>
        ) : (
          <article className="mt-8">
            <header className="mb-10">
              <time className="eyebrow">{formatDate(post.date)}</time>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text-primary leading-[1.1]">{post.title}</h1>
              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-border bg-bg-tertiary/60 px-2.5 py-1 text-[11px] font-medium text-text-secondary">
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

            <CTASection
              source="blog_post"
              title={
                <>
                  Tästä aiheesta <span className="text-gradient-accent">käytäntöön?</span>
                </>
              }
              description="Jos haluat saman ratkaisun omaan liiketoimintaasi, kerro tilanteesta — vastaan itse."
              secondary={{ label: 'Lue lisää kirjoituksia', to: '/blog' }}
            />
          </article>
        )}
      </main>
      <Footer />
    </>
  )
}
