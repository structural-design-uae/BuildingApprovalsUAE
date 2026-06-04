import { SITE_URL, getServiceCanonicalUrl } from './serviceSlugs';

export const servicesIndexMetadata = {
  title: 'Our Services | Building Approvals Dubai',
  description:
    'Explore expert services for Building Approvals Dubai, including Dubai permits & NOCs, authority approvals, and consultant support for every fitout project.',
  canonical: `${SITE_URL}/services`,
};

export const serviceMetadata: Record<
  string,
  { title: string; description: string; canonical: string }
> = {
  'civil-defense': {
    title: 'Civil Defense Approval Dubai | Fast-Track DCD Certificates',
    description:
      'Professional Civil Defense approval consultants in Dubai. Quick NOC processing, fire safety certificates & DCD permits. 98% first-time approval rate. Contact Now',
    canonical: getServiceCanonicalUrl('civil-defense'),
  },
  dewa: {
    title: 'DEWA Approval Services Dubai | Authority Approval Experts',
    description:
      'Professional DEWA Approval services in Dubai for commercial, residential, and fitout projects. Start your authority approval process today. Contact Now!',
    canonical: getServiceCanonicalUrl('dewa'),
  },
  'dubai-municipality': {
    title: 'Dubai Municipality Building Approval | Expert DM Permit Services',
    description:
      'Expert Dubai Municipality approval services with guaranteed timelines. Fast-track building permits & DM certificates. 15+ years of experience. Contact now!',
    canonical: getServiceCanonicalUrl('dubai-municipality'),
  },
  emaar: {
    title: 'Emaar NOC Dubai | Fast & Smooth Authority Approvals',
    description:
      'Trusted Emaar NOC consultants in Dubai helping businesses secure permits and approvals for fit-out, renovation, and modification projects.',
    canonical: getServiceCanonicalUrl('emaar'),
  },
  nakheel: {
    title: 'Nakheel NOC Dubai | Professional Permits and NOC Services',
    description:
      'Professional Nakheel Permits & NOC services in Dubai for villas, offices, shops, and modifications. Fast, clear authority approval guidance. Contact now!',
    canonical: getServiceCanonicalUrl('nakheel'),
  },
  'food-control': {
    title: 'Food Control Department Approval | Building Approvals Dubai',
    description:
      'Fast Food Control Department approval services in Dubai for restaurants, cafes, kitchens, and food businesses. Get permit support today.',
    canonical: getServiceCanonicalUrl('food-control'),
  },
  jafza: {
    title: 'JAFZA NOC Dubai | Fast track Authority Permits and NOCs',
    description:
      'Secure JAFZA NOC for projects in Dubai with expert documentation, submission, and approval coordination support. Get instant expert consultation. Contact now!',
    canonical: getServiceCanonicalUrl('jafza'),
  },
  dha: {
    title: 'DHA Approval Dubai | Complete DDA Permits & NOC Support',
    description:
      'Complete DHA licensing solutions for healthcare facilities in Dubai. Medical center permits, clinic approvals & pharmacy licenses. Get instant Consultation!',
    canonical: getServiceCanonicalUrl('dha'),
  },
  dso: {
    title: 'DSO Approval Services Dubai | Permits & NOCs',
    description:
      'Fast and professional DSO Approval & DIEZ Approval support in Dubai for fitout and building modification projects. Contact authority approval experts today.',
    canonical: getServiceCanonicalUrl('dso'),
  },
  dda: {
    title: 'DDA Approval Dubai | Complete DDA Permits & NOC Support',
    description:
      'Secure DDA Approval in Dubai with Building Approvals Dubai. Expert help for Dubai authority approvals, permits, and NOCs for fitout and renovation projects.',
    canonical: getServiceCanonicalUrl('dda'),
  },
  signage: {
    title: 'Signage Approval Dubai | Expert help for Shops and Offices',
    description:
      'Professional Dubai signage approval services for retail shops, offices, restaurants, and commercial properties. Get permits and NOCs with ease.',
    canonical: getServiceCanonicalUrl('signage'),
  },
  spa: {
    title: 'Spa Approval Dubai | Expert Service for Wellness Centers',
    description:
      'Get fast spa approval services in Dubai for salons, wellness centers, and spa facilities with expert support for permits and NOCs. Contact now!',
    canonical: getServiceCanonicalUrl('spa'),
  },
  shisha: {
    title: 'Shisha Cafe License Dubai | Building Approvals Dubai',
    description:
      'Professional Shisha Cafe License Dubai supports cafe owners, restaurants, and lounges needing authority approvals and permit assistance.',
    canonical: getServiceCanonicalUrl('shisha'),
  },
  smoking: {
    title: 'Smoking Permit Dubai | Fast Approval & Permits Services',
    description:
      'Professional Smoking Permit services in Dubai for cafes, lounges, and restaurants. Get smooth approval support from start to completion.',
    canonical: getServiceCanonicalUrl('smoking'),
  },
  pool: {
    title: 'Swimming Pool Approval Dubai | Fast Design & Safety Permits',
    description:
      'Expert swimming pool approval services in Dubai. design approval, safety certificates & municipality permits. Guaranteed compliance with Dubai regulations.',
    canonical: getServiceCanonicalUrl('pool'),
  },
  solar: {
    title: 'Solar Approval Dubai | Permits & NOCs Services Dubai',
    description:
      'Professional Solar Approval Dubai consultants helping with authority permits, solar NOC, documentation, and approval coordination. Contact now!',
    canonical: getServiceCanonicalUrl('solar'),
  },
  tent: {
    title: 'Tent Approval Dubai | Building Approvals Dubai',
    description:
      'Tent and temporary structure approvals in Dubai with safety compliance, documentation, and authority liaison.',
    canonical: getServiceCanonicalUrl('tent'),
  },
  rta: {
    title: 'RTA Approval Dubai | Fast Track Permit & NOC Services',
    description:
      'Get expert Dubai RTA Approval support for permits, NOCs, fit-out, renovation, signage, and construction projects. Fast Dubai Authority Approval assistance.',
    canonical: getServiceCanonicalUrl('rta'),
  },
  tecom: {
    title: 'Tecom & DCCA Approval | Building Approvals Dubai',
    description:
      'Tecom and DCCA approvals with compliant designs, documentation, and authority coordination for free zone projects.',
    canonical: getServiceCanonicalUrl('tecom'),
  },
  tpc: {
    title: 'Third Party Consultants Approval | Building Approvals Dubai',
    description:
      'Third-party consultant support for Dubai authority submissions, compliance reviews, and faster approvals.',
    canonical: getServiceCanonicalUrl('tpc'),
  },
  trakhees: {
    title: 'Trakhees Approval Dubai | Expert Authority Approval Support',
    description:
      'Trusted Trakhees approval consultants in Dubai helping with permits, NOCs, fitout approvals, and project documentation from start to finish. Contact now!',
    canonical: getServiceCanonicalUrl('trakhees'),
  },
  concordia: {
    title: 'Concordia Approval Dubai | Get Fast & Easy Approvals',
    description:
      'Get Concordia approval services in Dubai for fitout, renovation, and modification projects with expert support for permits, NOC, and authority approvals.',
    canonical: getServiceCanonicalUrl('concordia'),
  },
};

for (const [alias, serviceId] of Object.entries({
  'civil-defence-approvals-dubai': 'civil-defense',
  'dewa-approvals-dubai': 'dewa',
  'dubai-municipality-approvals': 'dubai-municipality',
  'emaar-noc-dubai': 'emaar',
  'nakheel-noc-dubai': 'nakheel',
  'food-control-department-approval-dubai': 'food-control',
  'jafza-noc-dubai': 'jafza',
  'dha-approvals-dubai': 'dha',
  'dso-approvals-dubai': 'dso',
  'dubai-development-authority-approvals': 'dda',
  'signage-approvals-dubai': 'signage',
  'spa-approvals-dubai': 'spa',
  'shisha-cafe-license-dubai': 'shisha',
  'smoking-permit-dubai': 'smoking',
  'swimming-pool-approvals-dubai': 'pool',
  'solar-approvals-dubai': 'solar',
  'rta-approvals-dubai': 'rta',
  'trakhees-approvals-dubai': 'trakhees',
  'concordia-approvals-dubai': 'concordia',
})) {
  serviceMetadata[alias] = serviceMetadata[serviceId];
}
