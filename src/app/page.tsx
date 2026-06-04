import type { Metadata } from 'next';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import AuthoritiesSection from './components/AuthoritiesSection';
import WhyUsSection from './components/WhyUsSection';
import StandoutSection from './components/StandoutSection';
import FAQSection from './components/FAQSection';
import { homepageFaqs } from '@/lib/homepage-faqs';

export const metadata: Metadata = {
  title: { absolute: 'Building Approvals Dubai | DM, DCD, DDA, DEWA Consultants' },
  description:
    'Dubai’s #1 building approvals consultant. Experts in Dubai authority approvals, DM permits, DCD, DDA, DHA, DEWA, Trakhees, and Nakheel approvals across Dubai.',
  alternates: {
    canonical: 'https://buildingapprovals.ae/',
  },
  openGraph: {
    title: 'Building Approvals Dubai | DM, DCD, DDA, DEWA Consultants',
    description:
      'Dubai’s #1 building approvals consultant. Experts in Dubai authority approvals, DM permits, DCD, DDA, DHA, DEWA, Trakhees, and Nakheel approvals across Dubai.',
    url: 'https://buildingapprovals.ae/',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homepageFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <ServicesSection />
      <AuthoritiesSection />
      <WhyUsSection />
      <StandoutSection />
      <FAQSection />
    </>
  );
}
