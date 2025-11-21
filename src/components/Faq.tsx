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
              A SolarInvest é uma empresa especializada em energia solar que entrega o projeto completo: estudo de
              viabilidade, instalação, homologação, monitoramento e manutenção. Você pode escolher entre leasing (sem
              entrada e com mensalidade menor que a conta de luz) ou compra direta. No leasing, a usina é transferida
              automaticamente para o seu nome ao final do contrato.
            </p>
          ),
        },
        {
          pergunta: 'Quais as vantagens de contratar a SolarInvest?',
          resposta: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Economia imediata, com mensalidade de leasing geralmente menor que a fatura de energia.</li>
              <li>Zero investimento inicial, homologação e manutenção inclusas.</li>
              <li>Equipe técnica especializada e equipamentos Tier 1 com garantia estendida.</li>
              <li>Transferência garantida da usina no fim do leasing, sem burocracia ou custo extra.</li>
            </ul>
          ),
        },
      ],
    },
    {
      titulo: 'Leasing, Compra e Financiamento',
      perguntas: [
        {
          pergunta: 'Qual a diferença entre leasing e compra direta?',
          resposta: (
            <p>
              No leasing, você paga uma mensalidade pelo uso da usina e ela é transferida para o seu nome ao final do
              contrato, sem entrada ou juros. Na compra direta, o investimento é feito à vista ou parcelado, e a
              propriedade é imediata. O leasing protege seu fluxo de caixa e inclui operação, manutenção e seguro.
            </p>
          ),
        },
        {
          pergunta: 'E entre leasing e financiamento bancário?',
          resposta: (
            <p>
              O financiamento bancário exige entrada, comprovação de crédito e cobra juros. No leasing, não há entrada
              nem juros bancários; a mensalidade já contempla instalação, seguro, operação e manutenção. O processo é
              mais rápido e com menos burocracia.
            </p>
          ),
        },
        {
          pergunta: 'Quais são os reais benefícios do leasing?',
              resposta: (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Economia imediata sem investir nada: a mensalidade substitui parte da conta de luz.</li>
                  <li>Tranquilidade psicológica: manutenção, seguro e monitoramento são responsabilidade da SolarInvest.</li>
                  <li>
                    Previsibilidade: a cobrança segue uma fórmula contratual transparente, baseada no kWh e na tarifa da
                    distribuidora, sem surpresas, juros ou cobranças escondidas.
                  </li>
                  <li>Flexibilidade: opção de compra antecipada com desconto.</li>
                  <li>Transferência garantida da propriedade ao final do contrato.</li>
                </ul>
              ),
            },
        {
          pergunta: 'A usina terá algum custo para mim?',
          resposta: (
            <p>
              No leasing, não há custo inicial. Você paga apenas a mensalidade, que costuma ser menor que a fatura de
              energia, e ela já cobre instalação, seguro, operação e manutenção. Na compra direta, existe o custo do
              investimento inicial ou parcelas de financiamento.
            </p>
          ),
        },
        {
          pergunta: 'Posso comprar a usina antes do fim do leasing?',
          resposta: (
            <p>
              Sim. Após o 6º mês você pode solicitar a compra antecipada com valor reduzido, seguindo a tabela de
              transferência prevista em contrato.
            </p>
          ),
        },
        {
          pergunta: 'Como funciona o fim do contrato de leasing?',
          resposta: (
            <p>
              Ao final do prazo, a usina é transferida automaticamente para o seu nome. Não há necessidade de cartório
              nem cobrança extra: a titularidade já está garantida em contrato.
            </p>
          ),
        },
        {
          pergunta: 'Quais as formas de pagamento para compra direta?',
          resposta: (
            <p>
              Aceitamos Pix, transferência, cartão de crédito, débito, boleto bancário e financiamento com bancos
              parceiros. As condições são apresentadas junto com a proposta.
            </p>
          ),
        },
      ],
    },
    {
      titulo: 'Instalação e Sistema',
      perguntas: [
        {
          pergunta: 'Onde a usina é instalada?',
          resposta: (
            <p>
              Instalações podem ser feitas no telhado, no solo do seu imóvel ou em uma usina remota, com compensação de
              energia pela distribuidora. Avaliamos a melhor opção para garantir geração e segurança.
            </p>
          ),
        },
        {
          pergunta: 'E se meu telhado não for adequado?',
          resposta: (
            <p>
              Nossa equipe verifica estrutura, inclinação e sombreamento. Se o telhado não for viável, apresentamos
              alternativas como estrutura em solo ou alocação em usina remota para você continuar economizando.
            </p>
          ),
        },
        {
          pergunta: 'A SolarInvest faz visita técnica?',
          resposta: (
            <p>
              Sim. Fazemos vistoria presencial ou remota com drone para confirmar medidas, estrutura e rota dos cabos,
              garantindo que a instalação siga as melhores práticas e o orçamento acordado.
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
              RG ou CNH, CPF/CNPJ, comprovante de endereço, fatura recente de energia, fotos do local (ou planta) e a
              assinatura digital dos contratos. Em leasing, pode ser solicitado comprovante de renda para análise de
              crédito.
            </p>
          ),
        },
        {
          pergunta: 'E se o imóvel não estiver em meu nome?',
          resposta: (
            <p>
              É necessário apresentar autorização do proprietário ou documento que comprove posse/uso do imóvel. No
              leasing, a titularidade da conta de energia também deve estar regularizada para a compensação.
            </p>
          ),
        },
        {
          pergunta: 'Preciso de autorização de herdeiros?',
          resposta: (
            <p>
              Se o imóvel estiver em inventário ou com vários herdeiros, basta uma autorização formal dos demais
              proprietários, com firma reconhecida, permitindo a instalação e a compensação de energia.
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
              Sim. Protocolamos o projeto, acompanhamos vistorias e entregamos a homologação concluída junto à
              distribuidora. Você não precisa lidar com burocracias ou prazos.
            </p>
          ),
        },
        {
          pergunta: 'Quais as garantias dos equipamentos?',
          resposta: (
            <p>
              Módulos com garantia de performance de até 25 anos e inversores com 5 a 10 anos, conforme fabricante. A
              instalação possui garantia contratual e manutenção preventiva está inclusa no leasing.
            </p>
          ),
        },
        {
          pergunta: 'Existe multa se eu quiser sair?',
          resposta: (
            <p>
              No leasing, há possibilidade de cancelamento após o período mínimo. Aplica-se a quitação proporcional dos
              valores restantes e custos de desinstalação, conforme previsto em contrato. Na compra direta, não há
              multa após a entrega e homologação.
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
              A economia média fica entre 15% e 35% da conta de energia, dependendo do consumo, bandeira tarifária e
              radiação da sua região. No leasing, essa redução já aparece na primeira fatura após a homologação.
            </p>
          ),
        },
        {
          pergunta: 'Qual o retorno do investimento?',
          resposta: (
            <p>
              Na compra direta, o payback costuma ocorrer entre 3 e 6 anos. No leasing, o retorno é psicológico e
              financeiro desde o início: você paga menos que na conta de luz e, ao final do contrato, recebe a usina já
              quitada.
            </p>
          ),
        },
        {
          pergunta: 'Como acompanho meu consumo e economia?',
          resposta: (
            <p>
              Você acompanha em tempo real por aplicativo e recebe relatórios periódicos com geração, consumo e
              economia acumulada. Nossa equipe também monitora a performance para agir rápido em qualquer anomalia.
            </p>
          ),
        },
        {
          pergunta: 'E se a usina não gerar o contratado?',
          resposta: (
            <p>
              No leasing, a SolarInvest garante a geração contratada. Caso haja falha técnica, fazemos a correção sem
              custo e compensamos o que faltar conforme previsto em contrato.
            </p>
          ),
        },
        {
          pergunta: 'E se eu consumir mais ou menos que o contratado?',
          resposta: (
            <p>
              Se consumir mais, a diferença é cobrada pela distribuidora na tarifa vigente. Se consumir menos, os
              créditos ficam acumulados para uso futuro, seguindo as regras da ANEEL.
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
              Trabalhamos apenas com marcas Tier 1. Entre os inversores: Solis, Huawei e Deye. Entre os módulos: Jinko,
              Trina, Longi e Canadian Solar, todos certificados pelo INMETRO. Sugerimos o melhor conjunto para seu
              projeto, mas você pode indicar preferências.
            </p>
          ),
        },
        {
          pergunta: 'O que está incluso na proposta da usina?',
          resposta: (
            <p>
              Módulos, inversores, estruturas de fixação, cabeamento, conectores, projeto executivo, ART, instalação,
              homologação e monitoramento. Em leasing, manutenção preventiva e corretiva também estão incluídas.
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
              Após análise da sua conta de luz e dados do local, enviamos uma proposta personalizada em PDF por e-mail
              ou WhatsApp, com resumo financeiro, detalhes técnicos e simulação de economia.
            </p>
          ),
        },
        {
          pergunta: 'O valor pode mudar após a visita?',
          resposta: (
            <p>
              Sim. A proposta inicial é baseada em estimativas. Após a visita técnica ou inspeção com drone, o valor
              pode ser ajustado para refletir as condições reais de instalação e garantir segurança e performance.
            </p>
          ),
        },
        {
          pergunta: 'Qual a validade da proposta?',
          resposta: (
            <p>
              Propostas de leasing são válidas por 15 dias corridos. Para compra direta, a validade padrão é de 3 dias
              devido à variação cambial e disponibilidade de equipamentos.
            </p>
          ),
        },
      ],
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-orange-50/40 to-white py-20 px-6 md:px-16 lg:px-28">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-10 text-center">
          Perguntas Frequentes
        </h2>
        <div className="space-y-6">
          {sections.map((section) => (
            <details
              key={section.titulo}
              className="group rounded-2xl bg-white/80 p-6 shadow-lg shadow-orange-100/50 ring-1 ring-orange-100 backdrop-blur-sm transition-all duration-300 hover:shadow-orange-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                <span>{section.titulo}</span>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600 transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="mt-6 space-y-4">
                {section.perguntas.map((faq) => (
                  <details
                    key={faq.pergunta}
                    className="group rounded-xl bg-white/90 p-5 ring-1 ring-orange-100/70 transition-all duration-300 hover:bg-white"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                      <span>{faq.pergunta}</span>
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-lg font-bold text-orange-500 transition-transform duration-300 group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </span>
                    </summary>
                    <div className="mt-3 text-gray-700 leading-relaxed space-y-2">{faq.resposta}</div>
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
