import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  // API keys let the portfolio's dev server fetch draft posts.
  auth: { useAPIKey: true },
  fields: [],
}
