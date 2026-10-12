import {
  convertLexicalToMarkdown,
  convertMarkdownToLexical,
  editorConfigFactory,
  type SanitizedServerEditorConfig,
} from '@payloadcms/richtext-lexical'
import type { SanitizedConfig } from 'payload'

import { editorFeatures } from './editor'

let cached: Promise<SanitizedServerEditorConfig> | null = null

function getEditorConfig(config: SanitizedConfig): Promise<SanitizedServerEditorConfig> {
  cached ??= editorConfigFactory.fromFeatures({ config, features: editorFeatures })
  return cached
}

// The portfolio renders posts with react-markdown, so the API exposes each
// post's Lexical content as markdown too (see the `markdown` field on Posts).
export async function lexicalToMarkdown(config: SanitizedConfig, data: unknown): Promise<string> {
  if (!data || typeof data !== 'object') return ''
  const editorConfig = await getEditorConfig(config)
  return convertLexicalToMarkdown({ data: data as never, editorConfig })
}

export async function markdownToLexical(config: SanitizedConfig, markdown: string) {
  const editorConfig = await getEditorConfig(config)
  return convertMarkdownToLexical({ editorConfig, markdown })
}
