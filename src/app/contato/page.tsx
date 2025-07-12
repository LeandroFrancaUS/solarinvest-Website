// src/app/contato/page.tsx

import ContatoForm from '@/components/ContatoForm';

// 🔍 SEO Metadata
export const metadata = {
  title: 'Fale Conosco | Solar Invest Solutions',
  description:
    'Entre em contato com nossa equipe e tire suas dúvidas sobre energia solar para sua casa ou comunidade.',
  keywords: [
    'contato solar invest',
    'fale conosco',
    'atendimento energia solar',
    'suporte solar',
    'consultoria solar',
  ],
};

export default function ContatoPage() {
  return (
    <section className="min-h-screen bg-orange-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
        {/* 🧡 Título da página */}
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-6 text-center">
          Fale com a SolarInvest
        </h1>

        {/* 🧡 Formulário de contato */}
        <ContatoForm />
      </div>
    </section>
  );
}