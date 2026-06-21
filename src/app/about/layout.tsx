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
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Building Approvals Dubai',
    url: 'https://buildingapprovals.ae/about',
    description: 'Dubai building approval consultants with 15+ years experience in authority permits and NOCs.',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://buildingapprovals.ae/#organization',
      name: 'Building Approvals Dubai',
      url: 'https://buildingapprovals.ae',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
