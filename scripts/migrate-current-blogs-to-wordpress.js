#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const SITE_URL = 'https://www.buildingapprovals.ae';
const WP_XMLRPC_URL = process.env.WP_XMLRPC_URL || 'https://cms.buildingapprovals.ae/xmlrpc.php';
const WP_REST_URL = process.env.WP_REST_URL || 'https://cms.buildingapprovals.ae/wp-json/wp/v2';
const WP_USER = process.env.WP_USER;
const WP_PASSWORD = process.env.WP_PASSWORD;
const BLOG_ID = 1;
const VERIFY_ONLY = process.argv.includes('--verify');

const root = path.resolve(__dirname, '..');
const uploadCache = new Map();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function xmlValue(value) {
  if (Array.isArray(value)) {
    return `<array><data>${value.map(item => `<value>${xmlValue(item)}</value>`).join('')}</data></array>`;
  }

  if (value && typeof value === 'object' && value.__base64) {
    return `<base64>${value.__base64}</base64>`;
  }

  if (value && typeof value === 'object' && value.__int !== undefined) {
    return `<int>${Number(value.__int)}</int>`;
  }

  if (value && typeof value === 'object') {
    return `<struct>${Object.entries(value).map(([key, item]) => (
      `<member><name>${escapeXml(key)}</name><value>${xmlValue(item)}</value></member>`
    )).join('')}</struct>`;
  }

  return `<string>${escapeXml(value)}</string>`;
}

async function xmlRpc(methodName, params) {
  const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>${methodName}</methodName>
  <params>${params.map(param => `<param><value>${xmlValue(param)}</value></param>`).join('')}</params>
</methodCall>`;

  let lastError;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const res = await fetch(WP_XMLRPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: xml,
      });

      const text = await res.text();

      if (!res.ok || text.includes('<fault>')) {
        throw new Error(`${methodName} failed: ${text.slice(0, 1000)}`);
      }

      return text;
    } catch (err) {
      lastError = err;
      if (attempt === 4) break;
      await sleep(1500 * attempt);
    }
  }

  throw lastError;
}

function extractMember(xml, name) {
  const pattern = new RegExp(`<member>\\s*<name>${name}</name>\\s*<value>([\\s\\S]*?)</value>\\s*</member>`);
  const match = xml.match(pattern);
  if (!match) return '';
  return match[1]
    .replace(/^<[^>]+>/, '')
    .replace(/<\/[^>]+>$/, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

function extractScalar(xml) {
  const match = xml.match(/<value>\s*(?:<string>|<int>|<i4>)?([\s\S]*?)(?:<\/string>|<\/int>|<\/i4>)?\s*<\/value>/);
  if (!match) return '';
  return match[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

function loadBlogPosts() {
  let source = fs.readFileSync(path.join(root, 'src/app/blog/blogData.ts'), 'utf8');
  source = source
    .replace(/^import[^\n]+\n/gm, '')
    .replace(/^export type[^\n]+\n/gm, '')
    .replace(/export interface/g, 'interface')
    .replace(/export const blogPosts:\s*BlogPost\[\]/g, 'exports.blogPosts');

  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;

  const sandbox = { exports: {} };
  vm.runInNewContext(js, sandbox);
  return sandbox.exports.blogPosts;
}

function contentToHtml(slug) {
  const file = path.join(root, `src/app/blog/[slug]/content/${slug}.tsx`);
  if (!fs.existsSync(file)) return '';

  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/return\s*\(([\s\S]*)\);\s*}\s*$/);
  if (!match) return '';

  return match[1]
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\sstyle=\{\{[\s\S]*?\}\}/g, '')
    .replace(/\bclassName=/g, 'class=')
    .replace(/\bhtmlFor=/g, 'for=')
    .replace(/&apos;/g, '&#39;')
    .trim();
}

function absoluteUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function mimeFromFilename(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.avif') return 'image/avif';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

async function readImage(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not download ${url}: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type')?.split(';')[0] || mimeFromFilename(url);
    return { buffer, contentType };
  }

  const localPath = path.join(root, 'public', url.replace(/^\/+/, ''));
  const buffer = fs.readFileSync(localPath);
  return { buffer, contentType: mimeFromFilename(localPath) };
}

function filenameFor(url, fallbackSlug) {
  const cleanUrl = url.split('?')[0];
  const basename = path.basename(cleanUrl).replace(/[^a-zA-Z0-9._-]/g, '-');
  if (basename && basename.includes('.')) return basename;
  return `${fallbackSlug}.jpg`;
}

async function uploadImage(url, fallbackSlug) {
  if (!url) return null;
  if (uploadCache.has(url)) return uploadCache.get(url);

  const { buffer, contentType } = await readImage(url);
  const filename = filenameFor(url, fallbackSlug);

  const xml = await xmlRpc('wp.uploadFile', [
    BLOG_ID,
    WP_USER,
    WP_PASSWORD,
    {
      name: filename,
      type: contentType,
      bits: { __base64: buffer.toString('base64') },
      overwrite: false,
    },
  ]);

  const media = {
    id: Number(extractMember(xml, 'id') || extractMember(xml, 'attachment_id')),
    url: extractMember(xml, 'url'),
  };

  uploadCache.set(url, media);
  return media;
}

async function replaceContentImages(html, slug) {
  const urls = [...new Set([...html.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map(match => match[1]))];
  let nextHtml = html;

  for (const url of urls) {
    try {
      const media = await uploadImage(url, `${slug}-content`);
      if (media?.url) {
        nextHtml = nextHtml.split(url).join(media.url);
      }
    } catch (err) {
      console.warn(`  image skipped: ${url} (${err.message})`);
    }
  }

  return nextHtml;
}

async function ensureCategory(name) {
  try {
    await xmlRpc('wp.newCategory', [BLOG_ID, WP_USER, WP_PASSWORD, { name }]);
  } catch {
    // WordPress returns a fault if the category already exists.
  }
}

async function findExistingPostId(slug) {
  const res = await fetch(`${WP_REST_URL}/posts?slug=${encodeURIComponent(slug)}&_fields=id,slug`);
  if (!res.ok) return null;
  const posts = await res.json();
  return posts[0]?.id ?? null;
}

function customFieldsFor(post, featuredUrl) {
  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || post.excerpt;
  const focusKeyword = (post.keywords || []).join(', ');
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = absoluteUrl(post.ogImage || featuredUrl || post.coverImage || post.image);

  return [
    ['rank_math_title', metaTitle],
    ['rank_math_description', metaDescription],
    ['rank_math_focus_keyword', focusKeyword],
    ['rank_math_canonical_url', canonical],
    ['rank_math_facebook_title', metaTitle],
    ['rank_math_facebook_description', metaDescription],
    ['rank_math_facebook_image', ogImage],
    ['rank_math_twitter_title', metaTitle],
    ['rank_math_twitter_description', metaDescription],
    ['rank_math_twitter_image', ogImage],
  ].map(([key, value]) => ({ key, value }));
}

async function upsertPost(post) {
  await ensureCategory(post.category || 'General');

  const rawContent = contentToHtml(post.slug) || `<p>${escapeXml(post.excerpt)}</p>`;
  const content = await replaceContentImages(rawContent, post.slug);
  const featuredSource = post.coverImage || post.image || post.ogImage;
  const featured = featuredSource ? await uploadImage(featuredSource, `${post.slug}-featured`) : null;

  const payload = {
    post_type: 'post',
    post_status: 'publish',
    post_title: post.title,
    post_name: post.slug,
    post_content: content,
    post_excerpt: post.excerpt,
    post_date: `${post.date} 12:00:00`,
    post_modified: `${post.dateModified || post.date} 12:00:00`,
    terms_names: {
      category: [post.category || 'General'],
      post_tag: post.keywords || [],
    },
    custom_fields: customFieldsFor(post, featured?.url),
  };

  if (featured?.id) {
    payload.post_thumbnail = { __int: featured.id };
  }

  const existingId = await findExistingPostId(post.slug);
  if (existingId) {
    await xmlRpc('wp.editPost', [BLOG_ID, WP_USER, WP_PASSWORD, existingId, payload]);
    return { id: existingId, action: 'updated' };
  }

  const xml = await xmlRpc('wp.newPost', [BLOG_ID, WP_USER, WP_PASSWORD, payload]);
  return { id: Number(extractScalar(xml)), action: 'created' };
}

async function main() {
  if (!WP_USER || !WP_PASSWORD) {
    throw new Error(
      'Set WP_USER and WP_PASSWORD to a WordPress user with media and post permissions.'
    );
  }

  const posts = loadBlogPosts();
  console.log(
    `${VERIFY_ONLY ? 'Verifying' : 'Migrating'} ${posts.length} posts in WordPress...`
  );

  for (const post of posts) {
    console.log(`- ${post.slug}`);
    const existingId = await findExistingPostId(post.slug);

    if (VERIFY_ONLY) {
      console.log(existingId ? `  found #${existingId}` : '  missing');
      continue;
    }

    const result = await upsertPost(post);
    console.log(`  ${result.action} #${result.id}`);
    await sleep(1000);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
