import { blogPosts } from '@/app/blog/blogData';

/** Legacy blog slugs → final canonical slug (single hop, no chains). */
export const blogSlugRedirects: Record<string, string> = {
  'dm-dubai-municipality-approval-2026-complete-guide': 'dubai-municipality-approval-step-by-step-guide',
  'dubai-municipality-approval-process-2026': 'dubai-municipality-approval-step-by-step-guide',
  'dubai-municipality-dm-approvals-compliance-guide': 'dubai-municipality-approval-step-by-step-guide',
  'dcd-approval-dubai-complete-process': 'civil-defense-approvals-dubai-permits-noc',
  'how-to-get-dewa-approvals-in-dubai-2026': 'dewa-approvals-dubai-permits-guide',
  'why-hire-a-consultant-for-dcd-approval': 'civil-defense-approvals-dubai-consultants',
  'dm-municipality-salon-approval-dubai': 'dm-municipality-approvals-salon-approval',
  'how-to-get-fitout-approvals-in-dubai': 'fitout-approvals-dubai-permits-noc-guide',
  'villa-modification-approval-dubai': 'modification-approval-villa-dubai',
  'dubai-municipality-approvals-dm-2026-updated-rules': 'dubai-municipality-approvals-latest-updates',
  'dubai-municipality-services-complete-guide-for-residents': 'dubai-municipality-approvals-guide-2026',
  '10-common-fit-out-approval-mistakes-in-dubai-2026': 'fitout-approvals-dubai-common-mistakes',
  'how-to-secure-a-nakheel-noc-in-dubai-2026': 'nakheel-noc-dubai-permits-guide',
  'how-to-get-dda-authority-approval-in-dubai': 'dda-approvals-dubai-complete-process',
  'fit-out-approval-dubai-simple-practical-guide-2026': 'fitout-approvals-dubai-permits-noc-guide',
  'dm-approval-common-fit-out-approval-violations-2026': 'dubai-municipality-approvals-common-violations',
};

const duplicatePostRedirects = Object.fromEntries(
  blogPosts
    .filter((post) => post.canonicalSlug)
    .map((post) => [post.slug, post.canonicalSlug!]),
);

/** All blog slugs that should 301 to a single canonical URL. */
export const blogCanonicalRedirects: Record<string, string> = {
  ...blogSlugRedirects,
  ...duplicatePostRedirects,
};

/** Slugs excluded from sitemap (legacy + duplicate sources). */
export const deprecatedBlogSlugs = new Set(Object.keys(blogCanonicalRedirects));

export function resolveBlogCanonicalSlug(slug: string): string {
  return blogCanonicalRedirects[slug] ?? slug;
}
