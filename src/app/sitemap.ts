import type { MetadataRoute } from "next";
import { getAllPosts } from '@/lib/getAllPosts';
import { SITE_URL, serviceCanonicalPaths } from './services/serviceSlugs';

const siteUrl = SITE_URL;

const serviceIds = [
  "civil-defense",
  "dewa",
  "dubai-municipality",
  "emaar",
  "nakheel",
  "food-control",
  "jafza",
  "dha",
  "dso",
  "dda",
  "signage",
  "spa",
  "shisha",
  "smoking",
  "pool",
  "solar",
  "tent",
  "rta",
  "concordia",
  "tecom",
  "tpc",
  "trakhees",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Main pages with higher priority
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Service pages
  const servicePages: MetadataRoute.Sitemap = serviceIds.map((id) => ({
    url: `${siteUrl}${serviceCanonicalPaths[id] ?? `/services/${id}`}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog pages - all posts including WordPress
  const allPosts = await getAllPosts();
  const blogPages: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateModified || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...mainPages, ...servicePages, ...blogPages];
}
