export const SITE_URL = 'https://buildingapprovals.ae';

export const serviceCanonicalPaths: Record<string, string> = {
  'dubai-municipality': '/services/dubai-municipality-approvals',
  'civil-defense': '/services/civil-defence-approvals-dubai',
  dda: '/services/dubai-development-authority-approvals',
  dha: '/services/dha-approvals-dubai',
  dewa: '/services/dewa-approvals-dubai',
  dso: '/services/dso-approvals-dubai',
  rta: '/services/rta-approvals-dubai',
  jafza: '/services/jafza-noc-dubai',
  nakheel: '/services/nakheel-noc-dubai',
  trakhees: '/services/trakhees-approvals-dubai',
  concordia: '/services/concordia-approvals-dubai',
  pool: '/services/swimming-pool-approvals-dubai',
  emaar: '/services/emaar-noc-dubai',
  'food-control': '/food-control-department-approval-dubai',
  signage: '/signage-approvals-dubai',
  spa: '/spa-approvals-dubai',
  shisha: '/shisha-cafe-license-dubai',
  smoking: '/smoking-permit-dubai',
  solar: '/solar-approvals-dubai',
  tent: '/services/tent',
  tecom: '/services/tecom',
  tpc: '/services/tpc',
};

export const serviceSlugAliases: Record<string, string> = {
  'dubai-municipality-approvals': 'dubai-municipality',
  'civil-defence-approvals-dubai': 'civil-defense',
  'dubai-development-authority-approvals': 'dda',
  'dha-approvals-dubai': 'dha',
  'dewa-approvals-dubai': 'dewa',
  'dso-approvals-dubai': 'dso',
  'rta-approvals-dubai': 'rta',
  'jafza-noc-dubai': 'jafza',
  'nakheel-noc-dubai': 'nakheel',
  'trakhees-approvals-dubai': 'trakhees',
  'concordia-approvals-dubai': 'concordia',
  'swimming-pool-approvals-dubai': 'pool',
  'emaar-noc-dubai': 'emaar',
  'food-control-department-approval-dubai': 'food-control',
  'signage-approvals-dubai': 'signage',
  'spa-approvals-dubai': 'spa',
  'shisha-cafe-license-dubai': 'shisha',
  'smoking-permit-dubai': 'smoking',
  'solar-approvals-dubai': 'solar',
};

export const rootServiceSlugs = new Set([
  'food-control-department-approval-dubai',
  'signage-approvals-dubai',
  'spa-approvals-dubai',
  'shisha-cafe-license-dubai',
  'smoking-permit-dubai',
  'solar-approvals-dubai',
]);

export function resolveServiceId(slug: string): string {
  return serviceSlugAliases[slug] ?? slug;
}

export function getServiceCanonicalPath(slug: string): string {
  const serviceId = resolveServiceId(slug);
  return serviceCanonicalPaths[serviceId] ?? `/services/${slug}`;
}

export function getServiceCanonicalUrl(slug: string): string {
  return `${SITE_URL}${getServiceCanonicalPath(slug)}`;
}
