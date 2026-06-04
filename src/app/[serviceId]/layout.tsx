import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serviceMetadata } from '../services/serviceMetadata';
import { rootServiceSlugs } from '../services/serviceSlugs';

interface RootServiceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({ params }: RootServiceLayoutProps): Promise<Metadata> {
  const { serviceId } = await params;

  if (!rootServiceSlugs.has(serviceId)) {
    notFound();
  }

  const meta = serviceMetadata[serviceId];

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

export default function RootServiceLayout({ children }: RootServiceLayoutProps) {
  return children;
}
