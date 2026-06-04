import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'About Us | Building Approvals Dubai' },
  description:
    'Learn about our Building approval consultants helping clients secure Dubai Building Approvals, permits, and NOCs. 15+ years of experience. Contact now!',
  alternates: {
    canonical: 'https://buildingapprovals.ae/about',
  },
  openGraph: {
    title: 'About Us | Building Approvals Dubai',
    description:
      'Learn about our Building approval consultants helping clients secure Dubai Building Approvals, permits, and NOCs. 15+ years of experience. Contact now!',
    url: 'https://buildingapprovals.ae/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
