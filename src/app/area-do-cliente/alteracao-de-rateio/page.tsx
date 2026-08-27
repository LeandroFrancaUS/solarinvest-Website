import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs, PageShell } from '@/components/cliente/ClientAreaLayout';
import RateioForm from '@/components/rateio/RateioForm';

export const metadata = buildMetadata({
  title: 'Alteração de rateio | Área do Cliente SolarInvest',
  description: 'Solicite inclusão, exclusão ou redistribuição de unidades consumidoras do seu sistema SolarInvest.',
  path: '/area-do-cliente/alteracao-de-rateio',
});

export default function AlteracaoRateioPage() {
  return <PageShell title="Alteração de rateio" description="Consulte seu projeto e monte a nova distribuição entre as unidades consumidoras com segurança."><div className="mt-8"><Breadcrumbs compact items={[{ label: 'Área do Cliente', href: '/area-do-cliente' }, { label: 'Alteração de rateio' }]} /><RateioForm /></div></PageShell>;
}
