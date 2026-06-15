import { blogPosts, BlogPost } from '@/app/blog/blogData';
import { getWordPressPosts, getWordPressPost, stripHtmlTags, WPPost } from './wordpress';

/** Converts a WPPost to the shared BlogPost shape. */
function wpPostToBlogPost(wp: WPPost): BlogPost {
  const image = wp.featuredImage?.node.sourceUrl ?? '/images/BA OG Logo_imresizer (1).png';
  const category = wp.categories.nodes[0]?.name ?? 'General';
  const keywords = wp.tags.nodes.map(t => t.name);
  const rawExcerpt = stripHtmlTags(wp.excerpt ?? '');

  return {
    id: String(wp.databaseId),
    title: wp.title,
    slug: wp.slug,
    excerpt: rawExcerpt,
    date: wp.date.split('T')[0],
    dateModified: wp.modified.split('T')[0],
    author: 'Building Approvals Dubai',
    category,
    image,
    coverImage: image,
    metaTitle: wp.seo?.title || wp.title,
    metaDescription: wp.seo?.metaDesc || rawExcerpt,
    keywords,
    ogImage: wp.seo?.opengraphImage?.sourceUrl || image,
    source: 'wordpress',
  };
}

/**
 * Returns WordPress posts first, with local posts retained as a migration
 * fallback. Once a local slug exists in WordPress, the CMS version wins.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const wpRaw = await getWordPressPosts();
  const wpSlugs = new Set(wpRaw.map(post => post.slug));

  const wpPosts = wpRaw
    .map(wpPostToBlogPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const fallbackPosts = blogPosts.filter(post => !wpSlugs.has(post.slug));

  return [...wpPosts, ...fallbackPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Looks up WordPress first and uses the local TSX article only until that slug
 * has been migrated to the CMS.
 */
export async function getPostBySlug(slug: string): Promise<(BlogPost & { wpContent?: string }) | null> {
  const wp = await getWordPressPost(slug);
  if (wp) {
    return { ...wpPostToBlogPost(wp), wpContent: wp.content };
  }

  return blogPosts.find(post => post.slug === slug) ?? null;
}
