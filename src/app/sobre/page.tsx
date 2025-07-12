export default function Sobre() {
  const valores = [
    "Compromisso com o cliente e com o planeta",
    "Tecnologia acessível e eficiente",
    "Transparência em cada etapa do processo",
    "Soluções que se adaptam a cada realidade",
  ];

  return (
    <section className="min-h-screen bg-orange-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-700 mb-6">
          Sobre a Solar Invest
        </h1>

        <p className="text-gray-700 text-base sm:text-lg mb-10 leading-relaxed">
          A Solar Invest Solutions nasceu com o propósito de democratizar o acesso à energia solar no Brasil.
          Nossa missão é levar soluções sustentáveis, acessíveis e personalizadas a residências, condomínios e pequenos negócios,
          reduzindo custos e promovendo autonomia energética.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🌞 Missão</h2>
            <p className="text-gray-600">
              Tornar a energia solar uma realidade viável para todos, com soluções sob medida, simples e transparentes.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🔭 Visão</h2>
            <p className="text-gray-600">
              Ser referência nacional em soluções solares inteligentes para comunidades e residências.
            </p>
          </div>
        </div>

        <div className="mt-12 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">💡 Nossos valores</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm sm:text-base">
            {valores.map((valor, idx) => (
              <li key={idx}>{valor}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}