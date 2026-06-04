import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Contact Us | Building Approvals Dubai' },
  description:
    'Contact trusted Dubai authority approval, permits & NOCs, consultants. DM, DCD, DDA, DHA, DEWA, Trakhees, Nakheel, RTA, Concordia, and more. Contact now!',
  alternates: {
    canonical: 'https://buildingapprovals.ae/contact',
  },
  openGraph: {
    title: 'Contact Us | Building Approvals Dubai',
    description:
      'Contact trusted Dubai authority approval, permits & NOCs, consultants. DM, DCD, DDA, DHA, DEWA, Trakhees, Nakheel, RTA, Concordia, and more. Contact now!',
    url: 'https://buildingapprovals.ae/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
