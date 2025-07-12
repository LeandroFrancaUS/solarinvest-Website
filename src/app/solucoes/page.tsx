export default function Solucoes() {
  const tipos = [
    {
      id: 'on-grid',
      nome: 'On-grid',
      descricao: 'Conectado à rede elétrica. Ideal para quem busca economia imediata na conta de luz, sem se desconectar da distribuidora. Mais comum em áreas urbanas.',
      cor: 'from-green-100 to-green-200',
    },
    {
      id: 'hibrida',
      nome: 'Híbrida',
      descricao: 'Combina energia solar com baterias e rede elétrica. Garante funcionamento mesmo em caso de apagão. Equilíbrio entre autonomia e custo-benefício.',
      cor: 'from-yellow-100 to-yellow-200',
    },
    {
      id: 'off-grid',
      nome: 'Off-grid',
      descricao: '100% independente da rede elétrica. Utiliza baterias para armazenar energia. Ideal para áreas remotas ou condomínios autossuficientes.',
      cor: 'from-red-100 to-orange-200',
    },
  ];

  return (
    <section className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-700 mb-12">
          Nossas Soluções em Energia Solar
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tipos.map((tipo) => (
            <div
              key={tipo.id}
              id={tipo.id}
              className={`p-6 rounded-xl shadow bg-gradient-to-br ${tipo.cor} text-left hover:scale-[1.02] transition-transform`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{tipo.nome}</h2>
              <p className="text-sm sm:text-base text-gray-700">{tipo.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}