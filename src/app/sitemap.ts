import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/getAllPosts';
import { deprecatedBlogSlugs, resolveBlogCanonicalSlug } from '@/lib/blogSlugRedirects';
import { blogPosts } from './blog/blogData';
import { SITE_URL, serviceCanonicalPaths } from './services/serviceSlugs';

const siteUrl = SITE_URL;

/** Only canonical non-www paths — derived from serviceSlugs, not legacy short URLs. */
const serviceIds = Object.keys(serviceCanonicalPaths);

export const revalidate = 3600;

function dedupeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const url = entry.url.replace(/\/$/, '') || siteUrl;
    if (!url.startsWith(siteUrl) || url.includes('www.')) return false;
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const mainPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/services`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const servicePages: MetadataRoute.Sitemap = serviceIds.map((id) => ({
    url: `${siteUrl}${serviceCanonicalPaths[id]}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  let allPosts = blogPosts;
  try {
    allPosts = await getAllPosts();
  } catch (error) {
    console.error('[sitemap] Falling back to local blog posts:', error);
  }

  const blogPages: MetadataRoute.Sitemap = allPosts
    .filter((post) => {
      const canonicalSlug = resolveBlogCanonicalSlug(post.slug);
      return post.slug === canonicalSlug && !deprecatedBlogSlugs.has(post.slug);
    })
    .map((post) => {
      const parsed = new Date(post.dateModified || post.date);
      return {
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: Number.isNaN(parsed.getTime()) ? lastModified : parsed,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    });

  return dedupeSitemap([...mainPages, ...servicePages, ...blogPages]);
}
