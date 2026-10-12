import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

import { lexicalToMarkdown } from '../markdown'

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Blog pages are statically rendered; a change to a published post marks every
// page stale so the next visit re-renders it (home lists the latest posts,
// the sitemap lists them all). Skipped outside Next (e.g. the import script).
function revalidateSite(context: Record<string, unknown>) {
  if (context.skipRevalidate) return
  try {
    revalidatePath('/', 'layout')
  } catch (err) {
    console.warn('[posts] revalidatePath failed', err)
  }
}

const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, previousDoc, context }) => {
  if (doc._status === 'published' || previousDoc?._status === 'published') revalidateSite(context)
  return doc
}

const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
  if (doc._status === 'published') revalidateSite(context)
  return doc
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blogipostaus', plural: 'Blogipostaukset' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'lang', 'date', '_status'],
  },
  access: {
    // Anonymous REST/GraphQL readers only ever see published posts.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  versions: { drafts: true },
  defaultSort: '-date',
  // fi and en variants of a post share a slug.
  indexes: [{ fields: ['slug', 'lang'], unique: true }],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', label: 'Otsikko', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL: /blog/<slug>. Täyttyy otsikosta, jos jätät tyhjäksi.',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) =>
            slugify(typeof value === 'string' && value ? value : String(siblingData?.title ?? '')),
        ],
      },
    },
    {
      name: 'lang',
      label: 'Kieli',
      type: 'select',
      required: true,
      defaultValue: 'fi',
      options: [
        { label: 'Suomi', value: 'fi' },
        { label: 'English', value: 'en' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      label: 'Päivämäärä',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } },
    },
    { name: 'description', label: 'Kuvaus', type: 'textarea' },
    { name: 'tags', label: 'Tagit', type: 'text', hasMany: true },
    { name: 'cover', label: 'Kansikuva', type: 'upload', relationTo: 'media' },
    { name: 'content', label: 'Sisältö', type: 'richText', required: true },
    {
      name: 'markdown',
      type: 'textarea',
      virtual: true,
      admin: { hidden: true },
      hooks: {
        afterRead: [({ siblingData, req }) => lexicalToMarkdown(req.payload.config, siblingData?.content)],
      },
    },
  ],
}
