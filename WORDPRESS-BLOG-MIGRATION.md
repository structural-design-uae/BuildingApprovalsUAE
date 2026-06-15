# WordPress Blog Migration

Building Approvals uses the same blog model as Structural Designs:

- Hostinger WordPress is the primary CMS.
- The website reads published posts through the WordPress REST API.
- Existing local TSX articles remain as a temporary fallback.
- A WordPress post automatically replaces its local fallback when both use the
  same slug.

## Required WordPress setup

1. Point `cms.buildingapprovals.ae` to the Hostinger WordPress installation.
2. Confirm this endpoint returns JSON:

   `https://cms.buildingapprovals.ae/wp-json/wp/v2/posts`

3. Enable XML-RPC during the one-time migration.
4. Create a WordPress application password for a user allowed to upload media
   and publish posts.

## Import the current articles

Run:

```bash
WP_USER="username" WP_PASSWORD="application-password" npm run blogs:migrate
```

Verify all 19 current slugs:

```bash
WP_USER="username" WP_PASSWORD="application-password" npm run blogs:verify
```

Do not remove `src/app/blog/blogData.ts` or the local content directory until
verification reports every slug as found and the public pages have been checked.
