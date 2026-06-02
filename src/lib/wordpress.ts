import http from 'node:http';

const WP_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL || 'https://cms.buildingapprovals.ae/graphql';
const CMS_REVALIDATE_SECONDS = 60;
const CMS_HOST = 'cms.buildingapprovals.ae';
const HOSTINGER_INTERNAL_IP = '145.79.210.138';

const shouldUseHostingerInternalGraphql =
  WP_GRAPHQL_URL.includes(CMS_HOST) &&
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

  if (shouldUseHostingerInternalGraphql) {
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
  if (!WP_GRAPHQL_URL) return null;

  try {
    const data = await wpFetch<{ post: WPPost | null }>(POST_QUERY, { slug });
    return data.post ?? null;
  } catch (err) {
    console.error(`[WordPress] Failed to fetch post "${slug}":`, err);
    return null;
  }
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
