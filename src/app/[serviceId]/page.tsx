import { notFound } from 'next/navigation';
import ServiceDetailPage from '../services/[serviceId]/page';
import { rootServiceSlugs } from '../services/serviceSlugs';

interface RootServicePageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function RootServicePage({ params }: RootServicePageProps) {
  const { serviceId } = await params;

  if (!rootServiceSlugs.has(serviceId)) {
    notFound();
  }

  return <ServiceDetailPage params={Promise.resolve({ serviceId })} />;
}
