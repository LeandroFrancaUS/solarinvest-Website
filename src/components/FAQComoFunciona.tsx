'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function FAQComoFunciona() {
  const faqs: { pergunta: string; resposta: JSX.Element }[] = [
    {
      pergunta: 'A usina terá algum custo para mim?',
      resposta: (
        <p>
          Não. A SolarInvest projeta, aprova, instala e homologa a usina solar no seu imóvel sem que você precise investir
          nada. A partir da operação, você passa a pagar uma fatura de energia com o desconto contratado — 10%, 15% ou 20%,
          conforme o plano escolhido. Exemplo: se o seu consumo médio for de 600 kWh/mês e o contrato for de 5 anos, a usina
          será dimensionada para gerar esses 600 kWh/mês. Com um desconto de 10%, você pagará apenas o equivalente a 540
          kWh/mês. Ao final do contrato (61º mês), a usina será transferida para o seu nome, e toda a energia gerada passará a
          ser consumida sem custo, conforme previsto em contrato.
        </p>
      ),
    },
    {
      pergunta: 'Posso antecipar a compra da usina?',
      resposta: (
        <p>
          Sim. A partir do 24º mês, você pode adquirir a usina pelo valor residual previsto em contrato. No documento constam o
          valor de mercado do equipamento e a tabela de amortização para o prazo contratado. Assim, você pode quitar o saldo e
          se tornar proprietário antes do término do leasing.
        </p>
      ),
    },
    {
      pergunta: 'E se eu não quiser antecipar o contrato?',
      resposta: (
        <p>
          Basta manter o pagamento mensal até o final do prazo. Ao término, a usina será sua, sem necessidade de empréstimos,
          financiamentos ou aplicação de capital próprio.
        </p>
      ),
    },
    {
      pergunta: 'Quais são as vantagens do leasing?',
      resposta: (
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Manutenção e segurança inclusas: durante todo o contrato, a SolarInvest é responsável por monitoramento,
            manutenção preventiva e corretiva, limpeza e seguro da usina.
          </li>
          <li>
            Sustentabilidade: você gera energia limpa e renovável, contribuindo para a preservação do meio ambiente.
          </li>
          <li>
            Uso do capital de forma estratégica: você adquire a usina pagando apenas o que já pagaria na conta de energia, sem
            imobilizar recursos que poderiam ser aplicados em outros investimentos.
          </li>
          <li>Economia imediata: desde o primeiro mês, há desconto garantido na fatura.</li>
          <li>
            Aquisição garantida: ao final do contrato, você se torna proprietário de um ativo durável, que continua gerando
            energia sem custo.
          </li>
        </ul>
      ),
    },
    {
      pergunta: 'E se a usina não gerar a quantidade de energia contratada em um mês?',
      resposta: (
        <p>
          A responsabilidade é totalmente da SolarInvest. Garantimos que o volume contratado será produzido e disponibilizado.
          Caso haja falha, tomaremos as providências para compensar a diferença, sem custo para você.
        </p>
      ),
    },
    {
      pergunta: 'E se eu consumir mais do que o contratado?',
      resposta: (
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <span className="font-medium">Excedente pontual:</span> se for um consumo eventual, dentro de até 12% da quantidade contratada, não haverá cobrança
            adicional.
          </li>
          <li>
            <span className="font-medium">Aumento permanente de consumo:</span>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <span className="font-medium">Antes do 24º mês:</span> redimensionamos a usina (se o imóvel permitir) para atender à nova demanda, ajustando o valor
                mensal até o fim do contrato.
              </li>
              <li>
                <span className="font-medium">Após o 24º mês:</span> você pode optar por pagar o excedente sem desconto ou redimensionar a usina, renovando o contrato
                por mais 24 meses.
              </li>
            </ul>
          </li>
        </ul>
      ),
    },
    {
      pergunta: 'E se eu consumir menos do que o contratado?',
      resposta: (
        <p>
          O valor contratado permanece o mesmo. Isso porque a usina é dimensionada para atender à sua demanda média mensal, e a
          SolarInvest garante que essa produção mínima esteja sempre disponível. Funciona como o aluguel de um carro por um
          período fixo: você paga pelo tempo contratado, mesmo que use menos, e, em contrapartida, conta com a garantia de
          disponibilidade durante todo o período.
        </p>
      ),
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-16 lg:px-28">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-8 text-center">Dúvidas Frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg bg-white">
              <button
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-800 focus:outline-none"
                onClick={() => toggle(index)}
              >
                <span>{faq.pergunta}</span>
                <FaChevronDown
                  className={`text-orange-500 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && <div className="p-4 border-t border-gray-200 text-gray-700">{faq.resposta}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

