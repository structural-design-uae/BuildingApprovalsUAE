import { getServiceCanonicalPath } from '@/app/services/serviceSlugs';

export interface FooterServiceLink {
  label: string;
  href: string;
}

export const footerServiceCategories: Array<{
  title: string;
  links: FooterServiceLink[];
}> = [
  {
    title: 'Authority Approvals',
    links: [
      { label: 'Dubai Municipality', href: getServiceCanonicalPath('dubai-municipality') },
      { label: 'Civil Defense (DCD)', href: getServiceCanonicalPath('civil-defense') },
      { label: 'DEWA Approval', href: getServiceCanonicalPath('dewa') },
      { label: 'DDA Approval', href: getServiceCanonicalPath('dda') },
      { label: 'Trakhees Approval', href: getServiceCanonicalPath('trakhees') },
      { label: 'DHA Approval', href: getServiceCanonicalPath('dha') },
      { label: 'DSO / DIEZ Approval', href: getServiceCanonicalPath('dso') },
      { label: 'RTA Permits', href: getServiceCanonicalPath('rta') },
      { label: 'JAFZA NOC', href: getServiceCanonicalPath('jafza') },
      { label: 'Concordia Approval', href: getServiceCanonicalPath('concordia') },
    ],
  },
  {
    title: 'Developer & Community NOCs',
    links: [
      { label: 'Emaar NOC', href: getServiceCanonicalPath('emaar') },
      { label: 'Nakheel NOC', href: getServiceCanonicalPath('nakheel') },
      { label: 'Tecom & DCCA', href: getServiceCanonicalPath('tecom') },
      { label: 'Third Party Consultants', href: getServiceCanonicalPath('tpc') },
    ],
  },
  {
    title: 'Specialized Permits',
    links: [
      { label: 'Food Control Department', href: getServiceCanonicalPath('food-control') },
      { label: 'Signage Approval', href: getServiceCanonicalPath('signage') },
      { label: 'Spa Approval', href: getServiceCanonicalPath('spa') },
      { label: 'Shisha Cafe License', href: getServiceCanonicalPath('shisha') },
      { label: 'Smoking Permit', href: getServiceCanonicalPath('smoking') },
      { label: 'Swimming Pool Approval', href: getServiceCanonicalPath('pool') },
      { label: 'Solar Approval', href: getServiceCanonicalPath('solar') },
      { label: 'Tent Approval', href: getServiceCanonicalPath('tent') },
    ],
  },
];
