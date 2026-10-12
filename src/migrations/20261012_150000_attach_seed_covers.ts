import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { attachSeedCovers } from '../cms/importMarkdownPosts'

// The seed migration skipped covers because Blob storage wasn't connected
// yet; now that it is, attach them to the posts that still lack one.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await attachSeedCovers(payload, req)
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
