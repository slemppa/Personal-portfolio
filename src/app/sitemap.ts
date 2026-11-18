import type { MetadataRoute } from 'next'
import { getEveryPost } from '@/lib/posts'
import { collectRoutes, sitemapEntries } from '@/lib/routes'

// Rendered on every request. sitemap.xml is a metadata route outside every
// layout, and neither the Posts hook's revalidatePath('/', 'layout') nor
// revalidatePath('/sitemap.xml') refreshed its ISR cache in production: newly
// published posts stayed missing (seen 17.–18.11.2026). It is one small query
// and crawlers fetch it rarely, so freshness wins over caching.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapEntries(collectRoutes(await getEveryPost()))
}
