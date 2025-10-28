import React from 'react';

type FAQSection = {
  titulo: string;
  perguntas: { pergunta: string; resposta: React.ReactNode }[];
};

export default function Faq() {
  const sections: FAQSection[] = [
    {
      titulo: 'Sobre a SolarInvest',
      perguntas: [
        {
          pergunta: 'O que é a SolarInvest e como funciona?',
          resposta: (
            <p>
              A SolarInvest é uma empresa especializada em energia solar que oferece soluções completas — da
              instalação à manutenção — com opções de leasing ou compra direta. Assim, você reduz imediatamente sua
              conta de energia e, no caso do leasing, torna-se proprietário da usina ao final do contrato sem custos
              adicionais.
            </p>
          ),
        },
        {
          pergunta: 'Quais as vantagens de contratar a SolarInvest?',
          resposta: (
            <p>
              Você garante economia imediata sem investimento inicial, com instalação profissional, suporte completo,
              manutenção, seguro e, no modelo de leasing, transferência garantida da propriedade da usina ao final do
              contrato.
            </p>
          ),
        },
      ],
    },
    {
      titulo: 'Financiamento, Leasing e Compra',
      perguntas: [
        {
          pergunta: 'Qual a diferença entre leasing e compra direta?',
          resposta: (
            <p>
              No leasing, você paga uma mensalidade reduzida pelo uso da usina, que é automaticamente transferida para
              seu nome ao final do contrato. Na compra direta, você adquire a usina à vista ou via financiamento
              bancário. O leasing não exige entrada e inclui manutenção, suporte e seguro.
            </p>
          ),
        },
        {
          pergunta: 'Existe custo inicial para aderir ao leasing?',
          resposta: (
            <p>
              Não. A adesão ao leasing é feita sem entrada. A mensalidade é, em quase todos os casos, menor do que a
              fatura atual de energia, salvo raras exceções.
            </p>
          ),
        },
        {
          pergunta: 'Posso comprar a usina antes do fim do contrato?',
          resposta: (
            <p>
              Sim. A partir do 6º mês é possível solicitar a compra antecipada da usina com valor reduzido, conforme a
              tabela de transferência prevista em contrato.
            </p>
          ),
        },
        {
          pergunta: 'Quais as formas de pagamento na compra direta?',
          resposta: (
            <p>
              Você pode pagar à vista (transferência, Pix, débito ou crédito) ou parcelar via cartão ou financiamento
              bancário.
            </p>
          ),
        },
        {
          pergunta: 'A usina terá algum custo para mim?',
          resposta: (
            <p>
              No leasing, não há custo inicial. A mensalidade substitui a conta de luz, com valor menor, cobrindo
              instalação, suporte, manutenção e seguro durante todo o contrato. Na compra direta, há um investimento
              inicial proporcional ao tamanho do sistema.
            </p>
          ),
        },
        {
          pergunta: 'Posso antecipar a compra da usina?',
          resposta: (
            <p>
              Sim. A aquisição pode ser feita a partir do 6º mês, com valor proporcional ao tempo restante do contrato.
            </p>
          ),
        },
        {
          pergunta: 'Qual é o processo ao final do contrato?',
          resposta: (
            <p>
              Ao final do contrato de leasing, a usina é automaticamente transferida para seu nome, sem necessidade de
              cartório ou custo adicional. O contrato já garante sua titularidade.
            </p>
          ),
        },
        {
          pergunta: 'Quais são as vantagens do leasing?',
          resposta: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Sem entrada, parcelas bancárias ou juros.</li>
              <li>Economia mensal imediata.</li>
              <li>Manutenção, suporte e seguro inclusos.</li>
              <li>Possibilidade de compra antecipada.</li>
              <li>Transferência garantida da propriedade ao final do contrato.</li>
            </ul>
          ),
        },
      ],
    },
    {
      titulo: 'Instalação e Sistema',
      perguntas: [
        {
          pergunta: 'Onde a usina solar é instalada?',
          resposta: (
            <p>
              A instalação pode ser feita no seu imóvel (telhado ou solo) ou em uma usina remota com compensação de
              energia via distribuidora.
            </p>
          ),
        },
        {
          pergunta: 'E se meu telhado não for adequado?',
          resposta: (
            <p>
              A SolarInvest realiza inspeção, inclusive com drone, e pode propor uma solução alternativa como usina
              remota caso o telhado não seja viável.
            </p>
          ),
        },
        {
          pergunta: 'A SolarInvest faz visita técnica?',
          resposta: (
            <p>
              Sim. A vistoria pode ser presencial ou remota com drone para validar as condições do local e os
              parâmetros da proposta.
            </p>
          ),
        },
      ],
    },
    {
      titulo: 'Documentação e Contrato',
      perguntas: [
        {
          pergunta: 'Quais documentos são necessários?',
          resposta: (
            <p>
              Documento com foto, CPF/CNPJ, comprovante de endereço, fatura de energia, fotos ou planta do local e a
              assinatura digital dos contratos.
            </p>
          ),
        },
        {
          pergunta: 'Preciso de autorização se o imóvel não for meu?',
          resposta: (
            <p>
              Sim. É necessário apresentar um documento de autorização do proprietário, herdeiros ou representante
              legal.
            </p>
          ),
        },
        {
          pergunta: 'Herdeiros precisam assinar o contrato?',
          resposta: (
            <p>
              Não. Apenas o contratante assina o contrato principal. Os demais assinam o documento de autorização com
              firma reconhecida.
            </p>
          ),
        },
      ],
    },
    {
      titulo: 'Homologação e Garantias',
      perguntas: [
        {
          pergunta: 'A SolarInvest cuida da homologação com a distribuidora?',
          resposta: (
            <p>
              Sim. A SolarInvest gerencia todo o processo junto à distribuidora, incluindo documentação, vistoria e
              liberação da conexão.
            </p>
          ),
        },
        {
          pergunta: 'Quais as garantias dos equipamentos?',
          resposta: (
            <p>
              Os módulos solares têm até 25 anos de garantia, enquanto os inversores possuem de 5 a 10 anos, conforme
              o fabricante.
            </p>
          ),
        },
        {
          pergunta: 'Existe multa em caso de rescisão?',
          resposta: (
            <p>
              A rescisão é permitida após 24 meses. Em caso de cancelamento, aplica-se a quitação proporcional do valor
              restante.
            </p>
          ),
        },
      ],
    },
    {
      titulo: 'Economia e Retorno',
      perguntas: [
        {
          pergunta: 'Quanto posso economizar por mês?',
          resposta: (
            <p>
              A economia varia entre 15% e 30% da conta de energia, conforme o consumo e a tarifa local.
            </p>
          ),
        },
        {
          pergunta: 'Qual o retorno médio do investimento?',
          resposta: (
            <p>
              Na compra direta, o retorno varia entre 3 e 6 anos, dependendo do consumo e do investimento realizado. No
              leasing, não há investimento inicial, e o retorno real ocorre no 5º ano com a aquisição definitiva da
              usina sem custo adicional.
            </p>
          ),
        },
        {
          pergunta: 'Como acompanho meu consumo e economia?',
          resposta: (
            <p>
              Você recebe relatórios regulares da geração de energia e da economia acumulada, com suporte contínuo da
              equipe SolarInvest.
            </p>
          ),
        },
        {
          pergunta: 'E se a usina não gerar a quantidade contratada em um mês?',
          resposta: (
            <p>
              No leasing, a SolarInvest garante a geração contratada. Caso ocorra alguma falha técnica, realizamos a
              manutenção sem custo e cobrimos eventuais cobranças extras da distribuidora referentes à energia
              contratada.
            </p>
          ),
        },
        {
          pergunta: 'E se eu consumir mais do que o contratado?',
          resposta: (
            <p>
              O excedente será cobrado diretamente pela concessionária com base na tarifa vigente.
            </p>
          ),
        },
        {
          pergunta: 'E se eu consumir menos do que o contratado?',
          resposta: (
            <p>
              A energia gerada não utilizada vira crédito junto à distribuidora e pode ser usada em meses futuros,
              conforme as regras da ANEEL.
            </p>
          ),
        },
      ],
    },
    {
      titulo: 'Equipamentos e Usina',
      perguntas: [
        {
          pergunta: 'Posso escolher os modelos dos equipamentos?',
          resposta: (
            <p>
              A SolarInvest trabalha com equipamentos de ponta e marcas Tier 1. Entre os inversores: Solis, Huawei e
              Deye. Entre os módulos: Jinko, Trina, Longi e Canadian Solar. Todos com certificação INMETRO e escolhidos
              conforme disponibilidade e adequação ao projeto.
            </p>
          ),
        },
        {
          pergunta: 'O que está incluso na proposta da usina?',
          resposta: (
            <p>
              Estão inclusos os módulos, inversores, estrutura de fixação, cabeamento, conectores, projeto, instalação
              e homologação completa.
            </p>
          ),
        },
      ],
    },
    {
      titulo: 'Proposta e Contratação',
      perguntas: [
        {
          pergunta: 'Como recebo a proposta?',
          resposta: (
            <p>
              Após o envio da conta de luz e dos dados do local, você recebe uma proposta personalizada em PDF por
              e-mail ou WhatsApp, com todos os dados técnicos e financeiros do projeto e contato direto com nossa
              equipe.
            </p>
          ),
        },
        {
          pergunta: 'O valor pode mudar após a visita?',
          resposta: (
            <p>
              Sim. A proposta é baseada em estimativas e pode ser ajustada após a visita técnica ou inspeção com drone,
              conforme as condições reais do local.
            </p>
          ),
        },
        {
          pergunta: 'Qual o prazo de validade da proposta?',
          resposta: (
            <p>
              Propostas de leasing têm validade de 15 dias corridos. Propostas de compra direta são válidas por 3 dias
              corridos, salvo acordos específicos.
            </p>
          ),
        },
      ],
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-16 lg:px-28">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-8 text-center">
          Perguntas Frequentes
        </h2>
        <div className="space-y-6">
          {sections.map((section) => (
            <details key={section.titulo} className="border border-orange-200 rounded-lg p-4">
              <summary className="cursor-pointer text-xl font-semibold text-orange-700">
                {section.titulo}
              </summary>
              <div className="mt-4 space-y-4">
                {section.perguntas.map((faq) => (
                  <details key={faq.pergunta} className="border border-orange-100 rounded-md p-3">
                    <summary className="cursor-pointer font-medium text-orange-600">
                      {faq.pergunta}
                    </summary>
                    <div className="mt-2 text-gray-700 space-y-2">{faq.resposta}</div>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
