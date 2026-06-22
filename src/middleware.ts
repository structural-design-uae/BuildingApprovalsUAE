import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { blogCanonicalRedirects } from '@/lib/blogSlugRedirects';

const CANONICAL_ORIGIN = 'https://buildingapprovals.ae';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const path = request.nextUrl.pathname.replace(/\/$/, '') || '/';

  const pageRedirects: Record<string, string> = {
    '/about-us': '/about',
    '/contact-us': '/contact',
  };

  const serviceRedirects: Record<string, string> = {
    '/services/civil-defense': '/services/civil-defence-approvals-dubai',
    '/services/dewa': '/services/dewa-approvals-dubai',
    '/services/dubai-municipality': '/services/dubai-municipality-approvals',
    '/services/emaar': '/services/emaar-noc-dubai',
    '/services/nakheel': '/services/nakheel-noc-dubai',
    '/services/food-control': '/food-control-department-approval-dubai',
    '/services/food-control-department-approval-dubai': '/food-control-department-approval-dubai',
    '/services/jafza': '/services/jafza-noc-dubai',
    '/services/dha': '/services/dha-approvals-dubai',
    '/services/dso': '/services/dso-approvals-dubai',
    '/services/dda': '/services/dda-approvals-dubai',
    '/services/dubai-development-authority-approvals': '/services/dda-approvals-dubai',
    '/services/signage': '/signage-approvals-dubai',
    '/services/signage-approvals-dubai': '/signage-approvals-dubai',
    '/services/spa': '/spa-approvals-dubai',
    '/services/spa-approvals-dubai': '/spa-approvals-dubai',
    '/services/shisha': '/shisha-cafe-license-dubai',
    '/services/shisha-cafe-license-dubai': '/shisha-cafe-license-dubai',
    '/services/smoking': '/smoking-permit-dubai',
    '/services/smoking-permit-dubai': '/smoking-permit-dubai',
    '/services/pool': '/services/swimming-pool-approvals-dubai',
    '/services/solar': '/solar-approvals-dubai',
    '/services/solar-approvals-dubai': '/solar-approvals-dubai',
    '/services/rta': '/services/rta-approvals-dubai',
    '/services/trakhees': '/services/trakhees-approvals-dubai',
    '/services/concordia': '/services/concordia-approvals-dubai',
  };

  let canonicalPath = pageRedirects[path] ?? serviceRedirects[path] ?? path;

  if (canonicalPath.startsWith('/blog/')) {
    const slug = canonicalPath.slice('/blog/'.length);
    const canonicalSlug = blogCanonicalRedirects[slug];
    if (canonicalSlug) {
      canonicalPath = `/blog/${canonicalSlug}`;
    }
  }

  const isWwwHost =
    host === 'www.buildingapprovals.ae' ||
    host === 'www.buildingapprovals.ae:3000' ||
    host.startsWith('www.buildingapprovals.ae:');

  const needsRedirect = isWwwHost || canonicalPath !== path;

  if (needsRedirect) {
    const redirectUrl = new URL(canonicalPath + request.nextUrl.search, CANONICAL_ORIGIN);
    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
