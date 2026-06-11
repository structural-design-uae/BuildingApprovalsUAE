import http from 'node:http';

const DEFAULT_CMS_URL = 'https://cms.buildingapprovals.ae';
const WP_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL?.trim() || '';
const WP_REST_BASE_URL = (
  process.env.WORDPRESS_REST_URL?.trim() ||
  new URL('/wp-json/wp/v2', WP_GRAPHQL_URL || DEFAULT_CMS_URL).toString()
).replace(/\/$/, '');
const CMS_REVALIDATE_SECONDS = 60;
const CMS_HOST = new URL(WP_REST_BASE_URL).hostname;
const HOSTINGER_INTERNAL_IP = process.env.WORDPRESS_INTERNAL_IP?.trim() || '';

const shouldUseHostingerInternalCms =
  Boolean(HOSTINGER_INTERNAL_IP) &&
  (process.env.HOME?.includes('/home/u750490608') || process.env.USER === 'u750490608');

export interface WPPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
  categories: { nodes: Array<{ name: string }> };
  tags: { nodes: Array<{ name: string }> };
  seo?: {
    title?: string;
    metaDesc?: string;
    opengraphImage?: { sourceUrl: string } | null;
  };
}

interface WPRestPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      alt_text?: string;
    }>;
    'wp:term'?: Array<Array<{
      taxonomy: string;
      name: string;
    }>>;
  };
}

const POSTS_QUERY = `
  query GetAllPosts($after: String) {
    posts(first: 100, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        slug
        excerpt(format: RENDERED)
        date
        modified
        categories { nodes { name } }
        tags { nodes { name } }
        featuredImage { node { sourceUrl altText } }
        seo { title metaDesc opengraphImage { sourceUrl } }
      }
    }
  }
`;

const POST_QUERY = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      slug
      excerpt(format: RENDERED)
      content(format: RENDERED)
      date
      modified
      categories { nodes { name } }
      tags { nodes { name } }
      featuredImage { node { sourceUrl altText } }
      seo { title metaDesc opengraphImage { sourceUrl } }
    }
  }
`;

async function wpFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!WP_GRAPHQL_URL) {
    throw new Error('WORDPRESS_GRAPHQL_URL is not set');
  }

  if (shouldUseHostingerInternalCms) {
    return wpInternalHttpFetch<T>(query, variables);
  }

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { tags: ['wordpress'], revalidate: CMS_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`WordPress GraphQL request failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`WordPress GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

async function wpInternalHttpFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const body = JSON.stringify({ query, variables });

  const json = await new Promise<{ data?: T; errors?: unknown }>((resolve, reject) => {
    const req = http.request({
      hostname: HOSTINGER_INTERNAL_IP,
      port: 80,
      path: '/graphql',
      method: 'POST',
      headers: {
        Host: CMS_HOST,
        'X-Forwarded-Proto': 'https',
        HTTPS: 'on',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let responseBody = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        responseBody += chunk;
      });
      res.on('end', () => {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`WordPress internal GraphQL request failed: ${res.statusCode} ${responseBody.slice(0, 300)}`));
          return;
        }

        try {
          resolve(JSON.parse(responseBody));
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });

  if (json.errors) {
    throw new Error(`WordPress GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

export async function getWordPressPosts(): Promise<WPPost[]> {
  const restPosts = await getWordPressPostsFromRest();
  if (restPosts.length > 0) return restPosts;

  // REST is built into WordPress and is the low-overhead default. Only make
  // the additional GraphQL request when an endpoint was explicitly configured.
  if (!WP_GRAPHQL_URL) return [];

  const posts: WPPost[] = [];
  let after: string | null = null;

  type PostsPage = {
    posts: {
      pageInfo: { hasNextPage: boolean; endCursor: string };
      nodes: WPPost[];
    };
  };

  try {
    do {
      const data: PostsPage = await wpFetch<PostsPage>(POSTS_QUERY, { after });

      posts.push(...data.posts.nodes);
      after = data.posts.pageInfo.hasNextPage ? data.posts.pageInfo.endCursor : null;
    } while (after);
  } catch (err) {
    console.error('[WordPress] Failed to fetch posts:', err);
    return [];
  }

  return posts;
}

export async function getWordPressPost(slug: string): Promise<WPPost | null> {
  const restPost = await getWordPressPostFromRest(slug);
  if (restPost) return restPost;

  if (!WP_GRAPHQL_URL) return null;

  try {
    const data = await wpFetch<{ post: WPPost | null }>(POST_QUERY, { slug });
    return data.post ?? null;
  } catch (err) {
    console.error(`[WordPress] Failed to fetch post "${slug}":`, err);
    return null;
  }
}

async function getWordPressPostsFromRest(): Promise<WPPost[]> {
  try {
    const restPosts = await wpRestFetch<WPRestPost[]>('/posts?status=publish&per_page=100&_embed=wp:featuredmedia,wp:term');
    return restPosts.map(restPostToWpPost);
  } catch (err) {
    console.error('[WordPress] Failed to fetch REST posts:', err);
    return [];
  }
}

async function getWordPressPostFromRest(slug: string): Promise<WPPost | null> {
  try {
    const restPosts = await wpRestFetch<WPRestPost[]>(
      `/posts?slug=${encodeURIComponent(slug)}&status=publish&_embed=wp:featuredmedia,wp:term`
    );

    return restPosts[0] ? restPostToWpPost(restPosts[0]) : null;
  } catch (err) {
    console.error(`[WordPress] Failed to fetch REST post "${slug}":`, err);
    return null;
  }
}

async function wpRestFetch<T>(path: string): Promise<T> {
  if (shouldUseHostingerInternalCms) {
    return wpInternalRestFetch<T>(path);
  }

  const res = await fetch(`${WP_REST_BASE_URL}${path}`, {
    signal: AbortSignal.timeout(5000),
    next: { tags: ['wordpress'], revalidate: CMS_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`WordPress REST request failed: ${res.status}`);
  }

  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new Error(`WordPress REST returned ${contentType || 'an unknown content type'}`);
  }

  return res.json() as Promise<T>;
}

async function wpInternalRestFetch<T>(path: string): Promise<T> {
  const responseBody = await new Promise<string>((resolve, reject) => {
    const req = http.request({
      hostname: HOSTINGER_INTERNAL_IP,
      port: 80,
      path: `/wp-json/wp/v2${path}`,
      method: 'GET',
      headers: {
        Host: CMS_HOST,
        'X-Forwarded-Proto': 'https',
        HTTPS: 'on',
      },
    }, (res) => {
      let body = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`WordPress internal REST request failed: ${res.statusCode} ${body.slice(0, 300)}`));
          return;
        }

        resolve(body);
      });
    });

    req.on('error', reject);
    req.end();
  });

  return JSON.parse(responseBody) as T;
}

function restPostToWpPost(post: WPRestPost): WPPost {
  const terms = (post._embedded?.['wp:term'] ?? []).flat();
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];

  return {
    id: String(post.id),
    databaseId: post.id,
    title: stripHtmlTags(post.title.rendered),
    slug: post.slug,
    excerpt: post.excerpt.rendered,
    content: post.content?.rendered ?? '',
    date: post.date,
    modified: post.modified,
    featuredImage: featuredImage?.source_url
      ? { node: { sourceUrl: featuredImage.source_url, altText: featuredImage.alt_text ?? '' } }
      : null,
    categories: {
      nodes: terms
        .filter(term => term.taxonomy === 'category')
        .map(term => ({ name: term.name })),
    },
    tags: {
      nodes: terms
        .filter(term => term.taxonomy === 'post_tag')
        .map(term => ({ name: term.name })),
    },
  };
}

export function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .trim();
}
