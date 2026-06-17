import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { PageShell, SupportCta } from '@/components/cliente/ClientAreaLayout';

export const metadata = buildMetadata({
  title: 'Manual de Limpeza dos Módulos Fotovoltaicos | SolarInvest',
  description:
    'Guia detalhado para limpeza de módulos fotovoltaicos: desligamento de disjuntores e chaves seccionadoras, frequência, materiais permitidos, itens proibidos, segurança NR-35 e sinais de alerta.',
  path: '/area-do-cliente/limpeza-modulos',
  keywords: ['limpeza de placas solares', 'como limpar módulos fotovoltaicos', 'manutenção preventiva de usina solar'],
});

const rows = [
  ['Baixa sujeira', '1 a 2 vezes por ano'],
  ['Sujeira moderada', 'a cada 6 meses'],
  ['Alta sujeira', 'a cada 3 meses'],
  ['Regiões agrícolas', 'inspeção frequente'],
];

const steps = [
  {
    title: 'Planeje a limpeza antes de subir no telhado',
    text: 'Confira a previsão do tempo, escolha início da manhã ou final da tarde, separe EPIs e confirme se há acesso seguro. Não execute o serviço com chuva, vento forte, telhado molhado ou sensação de insegurança.',
  },
  {
    title: 'Desligue os disjuntores e chaves seccionadoras do sistema',
    text: 'Antes de molhar qualquer parte da usina, desligue o inversor conforme o manual do fabricante e coloque na posição OFF os disjuntores CA, disjuntores CC e chaves seccionadoras identificadas no quadro fotovoltaico. Esse procedimento reduz riscos durante a limpeza, mas não elimina totalmente a tensão dos módulos, pois eles continuam gerando energia quando recebem luz.',
  },
  {
    title: 'Aguarde a estabilização e nunca toque em partes elétricas',
    text: 'Após o desligamento, aguarde alguns minutos para o inversor encerrar a operação. Não abra caixas, não manuseie conectores MC4, não toque em cabos, emendas, string boxes ou partes metálicas energizáveis. Se houver cabo solto, conector danificado ou cheiro de queimado, interrompa imediatamente e chame suporte técnico.',
  },
  {
    title: 'Garanta segurança de acesso e prevenção de queda',
    text: 'Use calçado antiderrapante, luvas, óculos e, em trabalho em altura, sistema de ancoragem e treinamento compatível com NR-35. Não pise sobre os módulos, trilhos ou telhas frágeis. A limpeza não deve ser feita por pessoas sem preparo para acesso em altura.',
  },
  {
    title: 'Remova sujeira superficial sem raspar o vidro',
    text: 'Retire folhas e resíduos soltos com escova macia ou água em baixa pressão. Não use objetos cortantes, espátulas, palha de aço ou escovas metálicas, pois podem riscar o vidro e danificar a camada antirreflexo.',
  },
  {
    title: 'Aplique água limpa e detergente neutro somente quando necessário',
    text: 'Utilize água limpa em temperatura ambiente. Para sujeira aderida, use pequena quantidade de detergente neutro diluído com esponja macia, pano de microfibra ou escova macia. Evite excesso de produto para não deixar película sobre o vidro.',
  },
  {
    title: 'Enxágue completamente e deixe secar naturalmente',
    text: 'Remova todo resíduo de detergente com água limpa e baixa pressão. Não direcione jato para conectores, caixa de junção, bordas ou passagens de cabos. Deixe secar naturalmente ou use rodo/borracha apropriada sem pressionar o vidro.',
  },
  {
    title: 'Faça inspeção visual antes de religar',
    text: 'Verifique se não há vidro quebrado, manchas permanentes, delaminação, pontos quentes aparentes, cabos expostos, conectores danificados, infiltração, folgas ou resíduos. Registre fotos se encontrar algo incomum.',
  },
  {
    title: 'Religue o sistema com cuidado e monitore a geração',
    text: 'Com a área seca e segura, religue as chaves seccionadoras e disjuntores na sequência indicada pelo fabricante ou pela documentação da instalação. Depois, confirme se o inversor voltou ao estado normal e acompanhe o aplicativo de monitoramento nas próximas horas.',
  },
];

export default function Page() {
  return (
    <PageShell
      title="Manual de Limpeza dos Módulos"
      description="Orientações detalhadas para limpar módulos fotovoltaicos com segurança, preservando geração, garantia e integridade da usina. A limpeza parece simples, mas envolve eletricidade, altura e risco de dano ao equipamento quando feita de forma incorreta."
    >
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <article className="space-y-8 text-slate-700">
          <section className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm">
            <div className="flex gap-4">
              <ShieldAlert className="mt-1 h-7 w-7 flex-none text-orange-600" aria-hidden="true" />
              <div>
                <h2 className="text-2xl font-black text-slate-900">Antes de começar: atenção à seriedade do procedimento</h2>
                <p className="mt-3 leading-relaxed">
                  Módulos fotovoltaicos podem permanecer energizados sempre que recebem luz. Desligar disjuntores e chaves seccionadoras reduz riscos operacionais, mas não transforma o arranjo fotovoltaico em um equipamento totalmente sem tensão. Se você não souber identificar disjuntor CA, disjuntor CC, chave seccionadora ou inversor, não execute a limpeza por conta própria.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Quando limpar</h2>
            <p className="mt-3 leading-relaxed">
              Limpe quando houver acúmulo visível de poeira, fezes de pássaros, folhas, poluição, maresia, fuligem ou fumaça, especialmente se a geração cair em relação ao histórico. A recomendação operacional é fazer inspeção visual mensal e comparar a geração no aplicativo de monitoramento antes de decidir pela limpeza.
            </p>
          </section>

          <section id="frequencia" className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Frequência recomendada</h2>
            <p className="mt-3 leading-relaxed">
              A frequência depende do nível de sujeira, inclinação dos módulos, período de chuvas e exposição local. Não existe um intervalo único para todos os sistemas: use a tabela como referência e ajuste com base na inspeção visual e no desempenho real da usina.
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              {rows.map(([condition, frequency]) => (
                <div key={condition} className="grid grid-cols-2 border-b border-slate-100 last:border-0">
                  <strong className="bg-orange-50 p-4 text-slate-900">{condition}</strong>
                  <span className="p-4">{frequency}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Horário correto</h2>
            <p className="mt-3 leading-relaxed">
              Realize a limpeza no início da manhã ou no final da tarde, quando os módulos estão mais frios e a irradiância é menor. Nunca limpe sob sol forte ou com módulos muito quentes: a água fria sobre vidro aquecido pode provocar choque térmico, além de aumentar risco de queimadura, desidratação e queda durante o trabalho.
            </p>
          </section>

          <section id="materiais" className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Materiais permitidos</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li>✓ água limpa em temperatura ambiente</li>
              <li>✓ detergente neutro bem diluído</li>
              <li>✓ esponja macia sem abrasivo</li>
              <li>✓ pano de microfibra limpo</li>
              <li>✓ escova macia de cerdas não metálicas</li>
              <li>✓ rodo apropriado com borracha macia</li>
            </ul>
          </section>

          <section id="proibido" className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Proibido utilizar</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li>✗ lavadora de alta pressão</li>
              <li>✗ produtos abrasivos</li>
              <li>✗ soda cáustica</li>
              <li>✗ solventes, álcool forte ou amônia</li>
              <li>✗ escovas metálicas ou palha de aço</li>
              <li>✗ objetos cortantes ou raspadores rígidos</li>
            </ul>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Passo a passo detalhado</h2>
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Passo {index + 1}</span>
                  <h3 className="mt-2 text-lg font-black text-slate-900">{step.title}</h3>
                  <p className="mt-2 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="seguranca" className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Segurança</h2>
            <p className="mt-3 leading-relaxed">
              Há risco de queda, choque elétrico, queimaduras e dano permanente aos equipamentos. Trabalho em telhados exige planejamento, isolamento da área, EPIs adequados e capacitação compatível com NR-35 quando houver trabalho em altura. Se não houver treinamento, ponto de ancoragem, acesso seguro ou conhecimento elétrico mínimo, contrate empresa especializada.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Sinais de alerta</h2>
            <p className="mt-3 leading-relaxed">
              Se qualquer item abaixo for identificado, não continue a limpeza. Interrompa o procedimento, mantenha distância de partes elétricas e solicite inspeção técnica.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <span>□ vidro quebrado</span>
              <span>□ manchas permanentes</span>
              <span>□ delaminação</span>
              <span>□ pontos quentes aparentes</span>
              <span>□ cabos expostos</span>
              <span>□ conectores danificados</span>
            </div>
            <div className="mt-6"><SupportCta /></div>
          </section>
        </article>

        <aside className="h-fit space-y-5">
          <div className="rounded-3xl bg-orange-50 p-6 shadow-sm">
            <h2 className="font-black text-slate-900">Resumo rápido</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Desligue disjuntores e chaves seccionadoras, mantenha distância de componentes elétricos, use apenas materiais suaves e nunca trabalhe em altura sem segurança adequada.
            </p>
          </div>
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-6 w-6 flex-none text-red-600" aria-hidden="true" />
              <div>
                <h2 className="font-black text-red-950">Pare imediatamente se houver risco</h2>
                <p className="mt-2 text-sm leading-relaxed text-red-900">
                  Cabo exposto, vidro quebrado, conector solto, cheiro de queimado ou dúvida sobre o desligamento exigem atendimento técnico.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 flex-none text-emerald-600" aria-hidden="true" />
              <div>
                <h2 className="font-black text-emerald-950">Boa prática</h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-900">
                  Fotografe antes e depois, registre a data da limpeza e acompanhe a geração nos dias seguintes para confirmar recuperação de desempenho.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
