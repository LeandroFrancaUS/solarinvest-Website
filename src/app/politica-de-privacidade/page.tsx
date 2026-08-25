import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Saiba como a SolarInvest coleta, utiliza, compartilha e protege dados pessoais e como exercer seus direitos.',
  alternates: { canonical: '/politica-de-privacidade' },
};

const sections = [
  ['dados-coletados', 'Dados que coletamos'],
  ['como-usamos', 'Como usamos os dados'],
  ['compartilhamento', 'Compartilhamento'],
  ['meta', 'Meta e WhatsApp'],
  ['retencao', 'Retenção e segurança'],
  ['direitos', 'Seus direitos'],
  ['exclusao', 'Exclusão de dados'],
  ['contato', 'Contato'],
] as const;

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="bg-slate-50 pb-20 pt-28 text-slate-700 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-3xl bg-[#0B1622] px-6 py-12 text-white shadow-xl sm:px-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Privacidade e transparência</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Política de Privacidade</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Esta política explica como a SolarInvest Solutions trata seus dados pessoais ao usar nosso site,
            formulários, canais de atendimento e integrações com plataformas da Meta.
          </p>
          <p className="mt-5 text-sm text-slate-400">Última atualização: 25 de agosto de 2026.</p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="font-bold text-slate-900">Nesta política</p>
            <nav className="mt-4 flex flex-col gap-2" aria-label="Seções da política de privacidade">
              {sections.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="text-sm text-slate-600 hover:text-orange-600">
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <section>
              <h2 className="text-2xl font-black text-slate-900">1. Quem controla seus dados</h2>
              <p className="mt-3 leading-7">
                A <strong>SolarInvest Solutions</strong>, com atendimento em Anápolis, Goiás, é a controladora dos
                dados pessoais tratados nos canais descritos nesta política. Para questões de privacidade, use o
                e-mail <a className="font-semibold text-orange-700 underline" href="mailto:contato@solarinvest.info">contato@solarinvest.info</a>.
              </p>
            </section>

            <section id="dados-coletados" className="scroll-mt-28">
              <h2 className="text-2xl font-black text-slate-900">2. Dados que coletamos</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-7">
                <li><strong>Contato:</strong> nome, e-mail, telefone/WhatsApp, mensagem, município e estado.</li>
                <li><strong>Pré-análise:</strong> CPF ou CNPJ, CEP, endereço, relação com o imóvel, perfil do cliente, consumo, tarifa, tipo de rede e de instalação.</li>
                <li><strong>Documentos enviados:</strong> conta de energia, documentos de identificação, comprovantes, autorizações, contratos e fotos que você optar por anexar.</li>
                <li><strong>Dados técnicos e de navegação:</strong> endereço IP, dispositivo, navegador, páginas acessadas, origem da visita, cookies e eventos de uso.</li>
                <li><strong>Atendimento:</strong> conteúdo e histórico das conversas realizadas por e-mail, telefone, WhatsApp ou redes sociais.</li>
              </ul>
              <p className="mt-3 leading-7">Não envie dados pessoais de terceiros sem autorização nem informações desnecessárias para o atendimento.</p>
            </section>

            <section id="como-usamos" className="scroll-mt-28">
              <h2 className="text-2xl font-black text-slate-900">3. Como e por que usamos os dados</h2>
              <p className="mt-3 leading-7">Tratamos dados para responder solicitações, realizar pré-análises, elaborar propostas, prestar suporte, prevenir fraude e abuso, cumprir obrigações legais e melhorar o site e nossos serviços.</p>
              <p className="mt-3 leading-7">Conforme o caso, o tratamento se baseia em procedimentos preliminares ou execução de contrato, cumprimento de obrigação legal, exercício de direitos, legítimo interesse ou consentimento. Comunicações promocionais podem ser interrompidas a qualquer momento pelo próprio canal ou por solicitação.</p>
            </section>

            <section id="compartilhamento" className="scroll-mt-28">
              <h2 className="text-2xl font-black text-slate-900">4. Com quem compartilhamos</h2>
              <p className="mt-3 leading-7">Podemos compartilhar somente os dados necessários com provedores de hospedagem, analytics, e-mail, CRM, atendimento, segurança e armazenamento; integradores e parceiros necessários à proposta ou execução do serviço; autoridades públicas quando exigido; e empresas envolvidas em reorganização societária.</p>
              <p className="mt-3 leading-7"><strong>Não vendemos dados pessoais.</strong> Exigimos que fornecedores tratem as informações para finalidades determinadas e adotem medidas de proteção compatíveis.</p>
            </section>

            <section id="meta" className="scroll-mt-28 rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h2 className="text-2xl font-black text-slate-900">5. Plataformas da Meta e WhatsApp</h2>
              <p className="mt-3 leading-7">Usamos produtos da Meta, incluindo WhatsApp, Facebook e Instagram, para comunicação, presença social e, quando habilitados, mensuração e publicidade. Ao interagir por esses canais, podemos receber identificadores de perfil, telefone, nome, conteúdo da mensagem e dados sobre a interação, conforme suas configurações e permissões.</p>
              <p className="mt-3 leading-7">Usamos esses dados para responder, prestar o serviço solicitado, registrar o atendimento e avaliar campanhas. A Meta também trata informações como controladora independente segundo suas próprias políticas. Você pode consultar a <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-800 underline">Política de Privacidade da Meta</a>.</p>
              <p className="mt-3 leading-7">Não usamos dados obtidos por produtos da Meta para discriminação, vigilância ou finalidades incompatíveis com a interação informada. Se uma permissão de plataforma deixar de ser necessária, interromperemos seu uso e excluiremos os dados correspondentes, observadas as obrigações legais.</p>
            </section>

            <section id="retencao" className="scroll-mt-28">
              <h2 className="text-2xl font-black text-slate-900">6. Retenção, transferências e segurança</h2>
              <p className="mt-3 leading-7">Mantemos os dados pelo tempo necessário às finalidades informadas e, depois, pelos prazos legais ou necessários ao exercício de direitos. Contatos sem contratação e documentos de pré-análise são revisados periodicamente e eliminados ou anonimizados quando deixam de ser necessários.</p>
              <p className="mt-3 leading-7">Alguns fornecedores podem processar dados fora do Brasil. Nesses casos, adotamos mecanismos contratuais e medidas exigidas pela legislação aplicável. Empregamos controles técnicos e administrativos para reduzir riscos de acesso, alteração, perda ou divulgação indevida, embora nenhum sistema seja totalmente infalível.</p>
            </section>

            <section id="direitos" className="scroll-mt-28">
              <h2 className="text-2xl font-black text-slate-900">7. Seus direitos</h2>
              <p className="mt-3 leading-7">Nos termos da LGPD, você pode solicitar confirmação e acesso, correção, anonimização, bloqueio ou eliminação, portabilidade quando regulamentada, informação sobre compartilhamentos, revisão de decisões automatizadas, oposição e revogação do consentimento. Também pode peticionar à Autoridade Nacional de Proteção de Dados.</p>
              <p className="mt-3 leading-7">Para proteger o titular, poderemos solicitar informações razoáveis para confirmar sua identidade antes de atender ao pedido.</p>
            </section>

            <section id="exclusao" className="scroll-mt-28 rounded-2xl border-2 border-orange-200 bg-orange-50 p-6">
              <h2 className="text-2xl font-black text-slate-900">8. Como solicitar a exclusão dos dados</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-6 leading-7">
                <li>Envie um e-mail para <a href="mailto:contato@solarinvest.info?subject=Solicita%C3%A7%C3%A3o%20de%20exclus%C3%A3o%20de%20dados" className="font-semibold text-orange-800 underline">contato@solarinvest.info</a> com o assunto “Solicitação de exclusão de dados”.</li>
                <li>Informe seu nome, o canal utilizado e os dados que deseja excluir. Para dados do WhatsApp, informe o número com DDD; para Facebook ou Instagram, indique o perfil usado no contato.</li>
                <li>Após confirmar sua identidade, excluiremos ou anonimizaremos os dados vinculados, inclusive os recebidos por produtos da Meta, e confirmaremos a conclusão pelo canal informado.</li>
              </ol>
              <p className="mt-3 leading-7">Poderemos conservar o mínimo necessário quando houver obrigação legal, prevenção a fraude ou necessidade de exercício regular de direitos, informando essa circunstância na resposta.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900">9. Cookies e tecnologias semelhantes</h2>
              <p className="mt-3 leading-7">Cookies essenciais permitem o funcionamento do site. Tecnologias de medição, quando habilitadas, ajudam a compreender desempenho e navegação. Você pode bloquear ou apagar cookies nas configurações do navegador, mas isso pode limitar algumas funções.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900">10. Crianças e adolescentes</h2>
              <p className="mt-3 leading-7">Nossos serviços não são direcionados a crianças. Se identificarmos coleta indevida de dados de criança ou adolescente sem a participação do responsável, adotaremos medidas para eliminá-los.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900">11. Alterações desta política</h2>
              <p className="mt-3 leading-7">Podemos atualizar esta política para refletir mudanças legais, técnicas ou operacionais. A versão vigente e sua data de atualização permanecerão publicadas nesta página. Alterações relevantes poderão ser comunicadas nos canais disponíveis.</p>
            </section>

            <section id="contato" className="scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-black text-slate-900">12. Fale conosco</h2>
              <p className="mt-3 leading-7">Dúvidas ou solicitações sobre privacidade podem ser enviadas para <a href="mailto:contato@solarinvest.info" className="font-semibold text-orange-700 underline">contato@solarinvest.info</a> ou pelo telefone/WhatsApp <a href="tel:+5562995150975" className="font-semibold text-orange-700 underline">(62) 99515-0975</a>.</p>
              <Link href="/contato" className="mt-5 inline-flex rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-500">Ir para a página de contato</Link>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
