import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { importMarkdownPosts } from '../cms/importMarkdownPosts'

// Moves the old Obsidian markdown posts (seed/blog) into Payload once, as part
// of `payload migrate` in the deploy build.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await importMarkdownPosts(payload, req)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Imported posts are regular content from here on; nothing to undo.
}
