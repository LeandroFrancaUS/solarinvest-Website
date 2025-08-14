'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

function Item({ faq }: { faq: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-orange-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between bg-orange-50 p-4 md:p-6 text-left"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-lg md:text-xl font-medium text-orange-700">{faq.question}</h3>
        <FaChevronDown
          className={`ml-4 text-orange-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 md:px-6 pb-4 md:pb-6 text-gray-700 bg-white space-y-2"
          >
            {faq.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQComoFunciona() {
  const faqs: FAQItem[] = [
    {
      question: 'A usina realmente não terá custo para mim?',
      answer: (
        <p>
          Sim. A SolarInvest assume todos os investimentos de projeto, equipamentos e
          instalação. Você paga apenas a parcela mensal acordada, sem entrada ou despesas
          extras.
        </p>
      ),
    },
    {
      question: 'Qual é a duração do contrato e haverá reajustes na parcela mensal?',
      answer: (
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Off-grid:</span> contratos de 60 meses com
            parcelas fixas durante todo o período.
          </p>
          <p>
            <span className="font-semibold">On-grid/Híbrido:</span> contratos de 36 meses
            com reajuste anual pelo índice oficial (IPCA).
          </p>
        </div>
      ),
    },
    {
      question: 'Posso antecipar a compra da usina?',
      answer: (
        <p>
          Sim. É possível antecipar o pagamento e adquirir a usina a qualquer momento,
          bastando quitar o saldo devedor previsto no contrato.
        </p>
      ),
    },
    {
      question: 'E se eu não antecipar o contrato?',
      answer: (
        <p>
          Ao final do prazo contratual, a propriedade do sistema é transferida para você
          automaticamente, sem custos adicionais.
        </p>
      ),
    },
    {
      question: 'Quais são as vantagens do leasing?',
      answer: (
        <ol className="list-decimal list-inside space-y-2">
          <li>Ausência de investimento inicial.</li>
          <li>Manutenção e monitoramento realizados pela SolarInvest.</li>
          <li>Pagamentos previsíveis e adequados ao seu consumo.</li>
          <li>Preservação do capital de giro ou orçamento familiar.</li>
          <li>Transferência de propriedade ao término do contrato.</li>
        </ol>
      ),
    },
    {
      question: 'E se a usina não gerar a quantidade de energia contratada em um mês?',
      answer: (
        <p>
          Realizamos uma avaliação técnica e compensamos eventuais diferenças conforme as
          condições estabelecidas em contrato.
        </p>
      ),
    },
    {
      question: 'E se eu consumir mais do que o contratado?',
      answer: (
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Excedente pontual:</span> o consumo adicional é
            faturado pela distribuidora conforme a tarifa vigente.
          </p>
          <p>
            <span className="font-semibold">Aumento permanente de consumo:</span> podemos
            reavaliar o projeto e ampliar a usina mediante aditivo contratual.
          </p>
        </div>
      ),
    },
    {
      question: 'E se eu consumir menos do que o contratado?',
      answer: (
        <p>
          A energia não utilizada gera créditos junto à distribuidora, que podem ser
          compensados nos meses seguintes.
        </p>
      ),
    },
    {
      question: 'E se algum equipamento falhar ou a geração ficar abaixo do esperado?',
      answer: (
        <p>
          A SolarInvest realiza a manutenção e substituição de equipamentos, garantindo o
          desempenho contratual sem custos extras ao cliente.
        </p>
      ),
    },
    {
      question:
        'A usina tem seguro ou garantia? Essa cobertura pode ser transferida?',
      answer: (
        <p>
          Sim. Os equipamentos possuem garantia e cobertura securitária contra danos. Em
          caso de transferência de titularidade, essas coberturas podem ser cedidas ao novo
          responsável mediante comunicação.
        </p>
      ),
    },
    {
      question: 'Como fica o leasing se eu quiser vender o imóvel?',
      answer: (
        <p>
          O contrato pode ser transferido ao novo proprietário após análise cadastral ou
          quitado antecipadamente pelo vendedor no ato da negociação.
        </p>
      ),
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-16 lg:px-28">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-orange-600 text-center mb-12">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Item key={idx} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

