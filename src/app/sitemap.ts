import states from '@/data/states.json'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const statePages = states.map((s) => ({
    url: `https://dmv-prep.com/dmv-practice-test/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://dmv-prep.com',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: 'https://dmv-prep.com/dmv-practice-test',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    ...statePages,
  ]
}