import { Breadcrumbs, PageShell } from '@/components/cliente/ClientAreaLayout';
import RateioForm from '@/components/rateio/RateioForm';
import { referenceFromUrl } from '@/lib/rateio/reference';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Solicitação de alteração de rateio | SolarInvest',
  description: 'Consulte seu projeto e solicite a inclusão, exclusão ou redistribuição de unidades consumidoras com segurança.',
  path: '/rateio',
  keywords: ['alteração de rateio', 'rateio de energia solar', 'unidade consumidora'],
});

export default function RateioPage({ searchParams }: { searchParams?: { ref?: string | string[] } }) {
  const initialReference = referenceFromUrl(searchParams?.ref);

  return (
    <PageShell title="Solicitação de rateio" description="Consulte seu projeto e monte a nova distribuição entre as unidades consumidoras com segurança.">
      <div className="mt-6 min-w-0 sm:mt-8">
        <Breadcrumbs compact items={[{ label: 'Área do Cliente', href: '/area-do-cliente' }, { label: 'Solicitação de rateio' }]} />
        <RateioForm initialReference={initialReference} />
      </div>
    </PageShell>
  );
}
