import { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/products?limit=1000`)
    const products = await res.json()

    const productUrls = products.map((p: { slug: string }) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...productUrls,
    ]
  } catch {
    return [{ url: SITE_URL, lastModified: new Date() }]
  }
}