# Website Setup Prompt

Use this prompt to recreate the same setup for a website like Building Approvals or Structural Designs.

```text
Set up this website with the same architecture:

1. Frontend website
- Use the existing Next.js project and preserve the exact current design.
- Deploy the frontend to Netlify or Vercel.
- Create/connect the GitHub repository under the same organization/account used for the related company sites.
- Configure the production domain and www domain on the deploy platform.
- Build command: use the project default, usually `npm run build`.
- Publish/output settings: use the framework defaults for Next.js on the selected platform.
- Verify deployment with:
  - homepage returns 200
  - /blog returns 200
  - at least one /blog/[slug] page returns 200

2. DNS
- Domain DNS is managed at Tasjeel or another DNS provider.
- If using Netlify DNS, set the domain nameservers at the registrar to the Netlify nameservers.
- If keeping DNS at the registrar/provider, add the deploy platform DNS records manually:
  - apex/root domain to Netlify/Vercel target
  - www domain to Netlify/Vercel target
  - keep existing email MX/TXT records intact
  - add cms subdomain for WordPress hosting
- Do not remove existing email records unless explicitly requested.
- Verify DNS with HTTPS checks for:
  - https://example.com
  - https://www.example.com
  - https://cms.example.com

3. WordPress CMS for blogs
- Host WordPress on Hostinger or equivalent hosting.
- Use a subdomain such as `cms.example.com`.
- WordPress is only for blogs/CMS, not for the main frontend design.
- Keep WordPress clean. Do not restore old full file backups if malware was suspected.
- If importing from an old backup, import only clean blog posts and media, not plugins, themes, PHP files, or full server archives.
- Enable the WordPress REST API.
- Install Rank Math SEO.
- Create an admin user and an application password for migration/API work.
- Add/import blog posts as published WordPress posts.
- Upload featured images into the WordPress media library.
- Verify:
  - https://cms.example.com/wp-json/wp/v2/posts returns JSON
  - posts have slugs, titles, content, and featured media
  - the frontend blog page reads from WordPress REST API

4. Frontend blog connection
- Configure the frontend to read posts from:
  `https://cms.example.com/wp-json/wp/v2`
- Use the same model as Structural Designs:
  - WordPress is the primary blog CMS
  - local/static blog data may remain only as fallback
  - when a WordPress post uses the same slug, it should replace the local fallback
- Keep the blog page and blog detail design exactly as the existing frontend design.
- Do not make WordPress render the public website design.

5. Migration safety
- Treat old backups as untrusted if malware was reported.
- Do not restore full `tar.gz` or full WordPress files into production.
- Safe migration path:
  - inspect database backup
  - identify published `post` records only
  - extract/upload only referenced media files
  - recreate posts through WordPress REST/XML-RPC/admin import
  - verify post count and slugs after import
- Delete demo/default posts such as "Hello world!" after migration.
- Revoke temporary application passwords after migration.

6. Final verification checklist
- Frontend production domain opens over HTTPS.
- www redirects/works correctly.
- CMS subdomain opens over HTTPS.
- WordPress REST API works.
- Rank Math is active.
- Blog list page shows WordPress posts.
- Blog detail pages work by slug.
- Featured images load from the CMS.
- DNS email records are preserved.
- Temporary migration credentials are revoked.
```

