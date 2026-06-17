import { BatteryCharging, ClipboardCheck, FileText, HelpCircle, MonitorDot, ShieldCheck, Sparkles, Wrench, Zap, Settings } from 'lucide-react';

export const quickTags = ['Limpeza dos Módulos', 'Garantias', 'Manutenção', 'Inversores', 'Suporte Técnico', 'Planos de O&M'];

export const categories = [
  { title: 'Limpeza dos Módulos', href: '/area-do-cliente/limpeza-modulos', icon: Sparkles, description: 'Frequência, materiais permitidos, horários seguros e checklist de inspeção.' },
  { title: 'Manutenção Preventiva', href: '/area-do-cliente/planos', icon: ClipboardCheck, description: 'Rotinas para preservar geração, segurança elétrica e vida útil da usina.' },
  { title: 'Manutenção Corretiva', href: '/area-do-cliente/suporte', icon: Wrench, description: 'Como agir diante de alarmes, falhas de geração e danos aparentes.' },
  { title: 'Garantias de Equipamentos', href: '/area-do-cliente/garantias', icon: ShieldCheck, description: 'Entenda garantias de produto, performance, nota fiscal e número de série.' },
  { title: 'Inversores', href: '/area-do-cliente/inversores', icon: Zap, description: 'Ventilação, alarmes, firmware, limpeza externa e sinais de falha.' },
  { title: 'Monitoramento', href: '/area-do-cliente/monitoramento', icon: MonitorDot, description: 'Indicadores saudáveis, alertas e interpretação da geração diária e mensal.' },
  { title: 'Segurança', href: '/area-do-cliente/limpeza-modulos#seguranca', icon: BatteryCharging, description: 'Trabalho em altura, EPIs, NR-35 e cuidados elétricos essenciais.' },
  { title: 'Documentação', href: '/area-do-cliente#downloads', icon: FileText, description: 'Biblioteca preparada para manuais, checklists e procedimentos.' },
  { title: 'Contratar Serviços', href: '/area-do-cliente/planos', icon: Settings, description: 'Planos Essencial, Premium e Total Care para operação e manutenção.' },
  { title: 'Perguntas Frequentes', href: '/area-do-cliente#faq', icon: HelpCircle, description: 'Respostas objetivas para dúvidas comuns de clientes e visitantes.' },
];

export const knowledgeItems = [
  ...categories.map((item) => ({ type: 'Categoria', title: item.title, href: item.href, excerpt: item.description })),
  { type: 'Guia', title: 'Manual de Limpeza', href: '/area-do-cliente/limpeza-modulos', excerpt: 'Como limpar placas, frequência recomendada, equipamentos permitidos e riscos da limpeza inadequada.' },
  { type: 'Procedimento', title: 'Frequência recomendada', href: '/area-do-cliente/limpeza-modulos#frequencia', excerpt: 'Baixa sujeira: 1 a 2 vezes por ano; sujeira moderada: a cada 6 meses; alta sujeira: a cada 3 meses.' },
  { type: 'Guia', title: 'Equipamentos permitidos', href: '/area-do-cliente/limpeza-modulos#materiais', excerpt: 'Água limpa, detergente neutro, esponja macia, microfibra e escova macia.' },
  { type: 'Alerta', title: 'Riscos da limpeza inadequada', href: '/area-do-cliente/limpeza-modulos#proibido', excerpt: 'Evite lavadora de alta pressão, solventes, abrasivos, soda cáustica, metal e objetos cortantes.' },
  { type: 'Guia', title: 'Diagnóstico de inversores', href: '/area-do-cliente/inversores', excerpt: 'LED vermelho, alarmes, desligamentos e baixa geração exigem análise técnica.' },
  { type: 'Procedimento', title: 'Abrir chamado de garantia', href: '/area-do-cliente/garantias', excerpt: 'Identifique equipamento, nota fiscal, número de série e acompanhe a análise.' },
  { type: 'Serviço', title: 'Solicitar proposta de O&M', href: '/area-do-cliente/planos', excerpt: 'Planos de manutenção com inspeção, monitoramento, prevenção e suporte prioritário.' },
  { type: 'Suporte', title: 'Abrir chamado técnico', href: '/area-do-cliente/suporte', excerpt: 'Envie seus dados, cidade, tipo de equipamento e descrição do problema.' },
];

export const faqs = [
  ['Quando devo limpar meus módulos?', 'Faça inspeção visual mensal e programe limpeza conforme sujeira, queda de performance e condições locais como poeira, aves, folhas, maresia ou atividade agrícola.'],
  ['Posso usar lavadora de pressão?', 'Não. Jatos de alta pressão podem danificar vedações, vidro, conectores e revestimentos, além de contrariar manuais de fabricantes.'],
  ['Posso subir sobre os módulos?', 'Não. O peso pode causar microfissuras, quebra de vidro e risco grave de queda.'],
  ['O que reduz a geração?', 'Sujeira, sombreamento, falhas de inversor, conexões danificadas, temperatura elevada, degradação natural e indisponibilidade da rede.'],
  ['Como saber se o inversor está funcionando?', 'Verifique aplicativo de monitoramento, LEDs, mensagens no visor, geração diária e alarmes ativos.'],
  ['Quem aciona a garantia?', 'O cliente pode acionar o fabricante, mas a SolarInvest pode apoiar na documentação, diagnóstico e abertura do chamado.'],
  ['Como contratar manutenção?', 'Acesse Planos de O&M ou Suporte Técnico e solicite uma proposta.'],
  ['Quanto dura um inversor?', 'A vida útil típica fica em torno de 10 a 15 anos, variando por marca, ventilação, temperatura e manutenção.'],
  ['Quanto dura um módulo solar?', 'Módulos fotovoltaicos normalmente têm garantia de performance longa, frequentemente próxima de 25 anos ou mais, conforme fabricante.'],
  ['A chuva limpa os módulos?', 'Ajuda, mas nem sempre remove fezes, gordura, poeira aderida e resíduos em cantos ou baixa inclinação.'],
  ['Qual horário é mais seguro para limpeza?', 'Início da manhã ou final da tarde, com módulos frios e baixa irradiância.'],
  ['Posso usar detergente neutro?', 'Sim, quando necessário e bem diluído, sempre com enxágue completo e sem produtos agressivos.'],
  ['Produtos abrasivos são permitidos?', 'Não. Podem riscar o vidro e prejudicar a camada antirreflexo.'],
  ['Preciso desligar o sistema?', 'Siga o procedimento técnico do equipamento. Em caso de dúvida, chame profissional habilitado.'],
  ['Limpeza melhora a geração?', 'Pode recuperar perdas causadas por sujeira, principalmente em regiões secas, agrícolas ou com muita poeira.'],
  ['Como identificar baixa geração?', 'Compare geração atual com histórico, previsão de irradiação e sistemas similares. Quedas persistentes exigem diagnóstico.'],
  ['O que fazer com vidro quebrado?', 'Não toque nem lave. Isole a área e solicite inspeção técnica.'],
  ['Cabo exposto é emergência?', 'Sim. Evite contato, sinalize a área e acione suporte técnico.'],
  ['Como preservar a garantia?', 'Siga manual do fabricante, registre manutenções, use materiais permitidos e evite intervenções não autorizadas.'],
  ['Monitoramento substitui manutenção?', 'Não. Ele indica desempenho, mas inspeções físicas e elétricas continuam importantes.'],
  ['Qual plano escolher?', 'Depende do porte da usina, criticidade da energia, acesso ao telhado e necessidade de monitoramento contínuo.'],
  ['O que é manutenção preventiva?', 'É a inspeção programada para encontrar falhas antes que causem perda de geração ou riscos de segurança.'],
  ['O que é manutenção corretiva?', 'É o atendimento para corrigir falhas já identificadas, como alarmes, cabos danificados ou inversor parado.'],
  ['Como localizar o número de série?', 'Geralmente na etiqueta do equipamento, nota fiscal, aplicativo ou documentação do projeto.'],
  ['Posso limpar com sol forte?', 'Não. Há risco de choque térmico e maior risco ocupacional por calor.'],
  ['Maresia exige mais cuidado?', 'Sim. Ambientes salinos exigem inspeções mais frequentes e atenção a corrosão.'],
  ['Região agrícola suja mais?', 'Sim. Poeira de solo, defensivos e colheitas podem exigir inspeção e limpeza mais frequentes.'],
  ['Inversor pode ficar sem ventilação?', 'Não. Entradas e saídas de ar devem permanecer livres para evitar superaquecimento.'],
  ['Atualização de firmware é obrigatória?', 'Quando recomendada pelo fabricante ou suporte técnico, pode corrigir falhas e melhorar estabilidade.'],
  ['Como abrir chamado?', 'Use o formulário de Suporte Técnico com dados de contato, cidade, equipamento e descrição do problema.'],
];

export const downloads = ['Manual de Limpeza', 'Guia de Garantias', 'Checklist de Inspeção', 'Guia de Boas Práticas', 'Procedimento de Emergência'];
