import type { MetadataRoute } from 'next'
import { getEveryPost } from '@/lib/posts'
import { collectRoutes, sitemapEntries } from '@/lib/routes'

// sitemap.xml is a metadata route outside every layout, so the Posts hook's
// revalidatePath('/', 'layout') never reached it and new posts went missing
// (e.g. /blog/ai-kehitys-yrityksessa-opas-turvalliseen-kayttoonottoon). The
// hook now revalidates it explicitly; this hourly window is the safety net.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapEntries(collectRoutes(await getEveryPost()))
}
