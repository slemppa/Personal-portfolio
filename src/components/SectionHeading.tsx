import type { ReactNode } from 'react'

type SectionHeadingProps = {
  /** Two-digit section index, e.g. "01". */
  index?: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
}

/**
 * Consistent section header: a mono eyebrow (optionally numbered), a tight
 * title and a quiet description. Mirrors the Linear/Notion section rhythm.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = 'left'
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}>
      <div className={`flex items-center gap-2.5 mb-4 ${centered ? 'justify-center' : ''}`}>
        {index && <span className="eyebrow text-accent">{index}</span>}
        {index && <span className="w-6 h-px bg-border" aria-hidden="true" />}
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.1] font-semibold tracking-tight text-text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-text-secondary leading-relaxed">{description}</p>
      )}
    </div>
  )
}
