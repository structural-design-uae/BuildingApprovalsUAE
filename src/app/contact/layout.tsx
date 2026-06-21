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
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Building Approvals Dubai',
    url: 'https://buildingapprovals.ae/contact',
    description: 'Contact Dubai authority approval consultants for DM, DCD, DEWA, DDA, Trakhees, and other permits.',
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': 'https://buildingapprovals.ae/#organization',
      name: 'Building Approvals Dubai',
      telephone: '+971589575610',
      email: 'info@buildingapprovals.ae',
      url: 'https://buildingapprovals.ae',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
