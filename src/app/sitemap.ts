import type { MetadataRoute } from 'next'
import { getEveryPost } from '@/lib/posts'
import { collectRoutes, sitemapEntries } from '@/lib/routes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapEntries(collectRoutes(await getEveryPost()))
}
