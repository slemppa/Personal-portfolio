/** Structured data for a page. `<` is escaped so content can never close the tag. */
export default function JsonLd({ blocks }: { blocks: Record<string, unknown>[] }) {
  return blocks.map((block, i) => (
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, '\\u003c') }}
    />
  ))
}
