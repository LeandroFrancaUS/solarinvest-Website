'use client';

import { CheckCircleIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

export default function Beneficios() {
  // 🎯 Lista dos benefícios oferecidos
  const beneficios = [
    {
      titulo: 'Economia na Conta de Luz',
      descricao: 'Reduza seus custos mensais com energia e ganhe previsibilidade financeira com tarifas solares mais baixas.',
      icone: CheckCircleIcon,
    },
    {
      titulo: 'Segurança Contra Apagões',
      descricao: 'Tenha fornecimento contínuo de energia, mesmo em quedas da rede, com sistemas híbridos e baterias solares.',
      icone: ShieldCheckIcon,
    },
    {
      titulo: 'Sustentabilidade e Valorização',
      descricao: 'Contribua com o meio ambiente e aumente o valor do seu imóvel com energia renovável certificada.',
      icone: BoltIcon,
    },
    {
      titulo: 'Desconto imediato e leasing',
      descricao: 'Modelos de leasing e assinatura com usina fotovoltaica sem investimento inicial e descontos de 20% a 30%.',
      icone: BoltIcon,
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* 🧱 Título da seção */}
        <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-4">
          Por que escolher a SolarInvest?
        </h2>
        <p className="text-gray-700 text-base sm:text-lg mb-12 max-w-2xl mx-auto">
          Oferecemos benefícios reais para sua casa ou empresa com energia solar inteligente e acessível.
        </p>

        {/* 📦 Grid dos cards de benefícios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {beneficios.map((beneficio, index) => (
            <div
              key={index}
              className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow hover:shadow-md transition"
            >
              {/* Ícone ilustrativo */}
              <beneficio.icone className="h-10 w-10 text-orange-500 mb-4 mx-auto" />

              {/* Título do benefício */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {beneficio.titulo}
              </h3>

              {/* Descrição */}
              <p className="text-sm text-gray-700">
                {beneficio.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
