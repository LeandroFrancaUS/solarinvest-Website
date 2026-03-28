// src/app/comofunciona/page.tsx

import ComoFunciona from '@/components/ComoFunciona';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Como Funciona a Energia Solar Residencial | SolarInvest',
  description:
    'Entenda como funciona a energia solar residencial, quando precisa de bateria, o que acontece sem luz e como reduzir sua conta com uma solução prática e segura.',
  path: '/comofunciona',
  keywords: [
    'energia solar como funciona',
    'energia solar residencial como funciona',
    'energia solar precisa de bateria',
    'energia solar funciona sem luz',
    'energia solar vantagens e desvantagens',
  ],
});

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white">
      <ComoFunciona />
    </main>
  );
}
