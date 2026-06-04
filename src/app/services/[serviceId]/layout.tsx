import type { Metadata } from 'next';
import { serviceMetadata } from '../serviceMetadata';
import { SITE_URL } from '../serviceSlugs';

interface ServiceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({ params }: ServiceLayoutProps): Promise<Metadata> {
  const { serviceId } = await params;
  const meta = serviceMetadata[serviceId] || {
    title: 'Dubai Authority Approval Services | Building Approvals Dubai',
    description:
      'Authority approvals and NOCs across Dubai, including Civil Defense, DEWA, Dubai Municipality, RTA, Trakhees, and more.',
    canonical: `${SITE_URL}/services/${serviceId}`,
  };

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical: meta.canonical,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      type: 'website',
    },
  };
}

export default function ServiceDetailLayout({ children }: ServiceLayoutProps) {
  return children;
}
