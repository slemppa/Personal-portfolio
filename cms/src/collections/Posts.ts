import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

import { lexicalToMarkdown } from '../lib/markdown'

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// The portfolio is a static build, so a published change has to trigger a
// redeploy. PORTFOLIO_DEPLOY_HOOK_URL is a Vercel deploy hook of the site.
async function triggerDeploy(reason: string) {
  const url = process.env.PORTFOLIO_DEPLOY_HOOK_URL
  if (!url) return
  try {
    await fetch(url, { method: 'POST' })
  } catch (err) {
    console.error(`[posts] deploy hook failed (${reason})`, err)
  }
}

const deployAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, context }) => {
  if (context.skipDeploy) return doc
  if (doc._status === 'published' || previousDoc?._status === 'published') {
    await triggerDeploy(`change ${doc.slug}`)
  }
  return doc
}

const deployAfterDelete: CollectionAfterDeleteHook = async ({ doc, context }) => {
  if (context.skipDeploy) return doc
  if (doc._status === 'published') await triggerDeploy(`delete ${doc.slug}`)
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
    // Anonymous readers (the portfolio build) only ever see published posts.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  versions: { drafts: true },
  defaultSort: '-date',
  // fi and en variants of a post share a slug.
  indexes: [{ fields: ['slug', 'lang'], unique: true }],
  hooks: {
    afterChange: [deployAfterChange],
    afterDelete: [deployAfterDelete],
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
