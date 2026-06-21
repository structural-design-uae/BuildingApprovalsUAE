/** Legacy blog slugs that 404 — redirect to current canonical slugs. */
export const blogSlugRedirects: Record<string, string> = {
  'dm-dubai-municipality-approval-2026-complete-guide': 'dubai-municipality-approvals-permits-guide',
  'dubai-municipality-approval-process-2026': 'dubai-municipality-approval-step-by-step-guide',
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
  'dubai-municipality-dm-approvals-compliance-guide': 'dubai-municipality-approvals-compliance-guide',
  'dm-approval-common-fit-out-approval-violations-2026': 'dubai-municipality-approvals-common-violations',
};

export const deprecatedBlogSlugs = new Set(Object.keys(blogSlugRedirects));
