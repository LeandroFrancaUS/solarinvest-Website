import React from 'react';

export default function Faq() {
  const faqs = [
    {
      pergunta: 'A usina terá algum custo para mim?',
      resposta: (
        <>
          <p>
            Não! A SolarInvest projeta, aprova, instala e homologa a usina solar no seu imóvel sem que você
            precise investir nada. A partir da operação, você passa a pagar uma fatura de energia com o desconto
            contratado — 10%, 15% ou 20%, conforme o plano escolhido.
          </p>
          <p className="mt-2">
            Exemplo: se o seu consumo médio for de 600 kWh/mês e o contrato for de 5 anos, a usina será dimensionada
            para gerar esses 600 kWh/mês. Com um desconto de 10%, você pagará apenas o equivalente a 540 kWh/mês. Ao
            final do contrato (61º mês), a usina será transferida para o seu nome, e toda a energia gerada passará a
            ser consumida sem custo, conforme previsto em contrato.
          </p>
        </>
      ),
    },
    {
      pergunta: 'Posso antecipar a compra da usina?',
      resposta: (
        <p>
          Sim. A partir do 24º mês, você pode adquirir a usina pelo valor residual previsto em contrato. No documento
          constam o valor de mercado do equipamento e a tabela de amortização para o prazo contratado. Assim, você
          pode quitar o saldo e se tornar proprietário antes do término do leasing.
        </p>
      ),
    },
    {
      pergunta: 'Qual é o processo ao final do contrato?',
      resposta: (
        <p>
          Ao término, a usina será sua, sem necessidade de empréstimos, financiamentos ou aplicação de capital próprio.
        </p>
      ),
    },
    {
      pergunta: 'Quais são as vantagens do leasing?',
      resposta: (
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Manutenção e segurança inclusos:</strong> durante todo o contrato, a SolarInvest é responsável por
            monitoramento, manutenção preventiva e corretiva, limpeza e seguro da usina.
          </li>
          <li>
            <strong>Sustentabilidade:</strong> você gera energia limpa e renovável, contribuindo para a preservação do
            meio ambiente.
          </li>
          <li>
            <strong>Uso do capital de forma estratégica:</strong> você adquire a usina pagando apenas o que já pagaria na
            conta de energia, sem imobilizar recursos que poderiam ser aplicados em outros investimentos.
          </li>
          <li>
            <strong>Economia imediata:</strong> desde o primeiro mês, há desconto garantido na fatura.
          </li>
          <li>
            <strong>Aquisição garantida:</strong> ao final do contrato, você se torna proprietário de um ativo durável,
            que continua gerando energia sem custo.
          </li>
        </ul>
      ),
    },
    {
      pergunta: 'E se a usina não gerar a quantidade de energia contratada em um mês?',
      resposta: (
        <p>
          A responsabilidade é totalmente da SolarInvest. Garantimos que o volume contratado será produzido e
          disponibilizado. Caso haja falha, tomaremos as providências para compensar a diferença, sem custo para você.
        </p>
      ),
    },
    {
      pergunta: 'E se eu consumir mais do que o contratado?',
      resposta: (
        <>
          <p>
            <strong>Excedente pontual:</strong> se for um consumo eventual, dentro de até 12% da quantidade contratada,
            não haverá cobrança adicional.
          </p>
          <p className="mt-2">
            <strong>Aumento permanente de consumo:</strong> Antes do 24º mês: redimensionamos a usina (se o imóvel
            permitir) para atender a nova demanda, ajustando o valor mensal até o fim do contrato. Após o 24º mês: você
            pode optar por pagar o excedente sem desconto ou redimensionar a usina, renovando o contrato por mais 24
            meses.
          </p>
        </>
      ),
    },
    {
      pergunta: 'E se eu consumir menos do que o contratado?',
      resposta: (
        <p>
          O valor contratado permanece o mesmo. Isso porque a usina é dimensionada para atender à sua demanda média
          mensal, e a SolarInvest garante que essa produção mínima esteja sempre disponível. Funciona como o aluguel de
          um carro por um período fixo: você paga pelo tempo contratado, mesmo que use menos, e, em contrapartida,
          conta com a garantia de disponibilidade durante todo o período.
        </p>
      ),
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-16 lg:px-28">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-8 text-center">
          Perguntas Frequentes
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <details key={idx} className="border border-orange-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-orange-700">
                {faq.pergunta}
              </summary>
              <div className="mt-2 text-gray-700">{faq.resposta}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
