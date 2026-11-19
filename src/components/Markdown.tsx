import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

/**
 * `demoteH1`: the page already has its own <h1> (blog post title), so a `# `
 * heading inside the body renders as <h2>. Keeps exactly one H1 per page
 * without touching the CMS text.
 */
export default function Markdown({ children, demoteH1 = false }: { children: string; demoteH1?: boolean }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-text-primary prose-a:text-accent prose-a:hover:text-accent-hover prose-code:text-text-primary prose-strong:text-text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          ...(demoteH1 ? { h1: ({ children, id, className }) => <h2 id={id} className={className}>{children}</h2> } : {}),
          // Wide comparison tables must scroll inside their own box; without
          // this a 7-column table pushes the whole page sideways on mobile.
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
