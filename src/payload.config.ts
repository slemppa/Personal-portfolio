import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './cms/collections/Users'
import { Media } from './cms/collections/Media'
import { Posts } from './cms/collections/Posts'
import { editorFeatures } from './cms/editor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Posts, Media, Users],
  editor: lexicalEditor({ features: editorFeatures }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Same Neon database as the portfolio's offers/leads, but Payload's tables
  // live in their own schema so they never collide with `portfolio_*`.
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    schemaName: 'payload',
    // Schema changes ship as migrations (src/migrations), run by `pnpm build`
    // before `next build`. Dev still auto-pushes the schema.
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Vercel's filesystem is read-only, so uploads go to Vercel Blob when a
    // token is configured; locally they fall back to cms/media/.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Keep the plugin's fields in the schema even without a token, so
      // migrations generated locally match production.
      alwaysInsertFields: true,
      // Serve files straight from the Blob CDN so post covers are plain URLs.
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
