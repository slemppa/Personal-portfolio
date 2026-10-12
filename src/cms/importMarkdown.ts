// Re-imports the markdown posts in seed/blog by hand (the seed migration
// already does this once on deploy). Usage: pnpm import:markdown
import config from '@payload-config'
import { getPayload } from 'payload'

import { importMarkdownPosts } from './importMarkdownPosts'

await importMarkdownPosts(await getPayload({ config }))
process.exit(0)
