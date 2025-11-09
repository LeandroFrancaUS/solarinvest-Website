import Link from 'next/link';
import {
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const platforms = [
  {
    name: 'Google Reviews',
    description:
      'Publique sua experiência diretamente no Google e ajude outras pessoas a encontrarem a SolarInvest com confiança.',
    href: 'https://g.page/r/Cc6kjAVtYClSEAI/review',
    action: 'Avaliar no Google',
  },
  {
    name: 'Facebook',
    description:
      'Compartilhe seu feedback com nossa comunidade no Facebook e acompanhe novidades em tempo real.',
    href: 'https://www.facebook.com/SolarInvestSolutions',
    action: 'Comentar no Facebook',
  },
  {
    name: 'Reclame AQUI',
    description:
      'Resolva qualquer pendência com transparência e acompanhe nosso histórico de atendimento no Reclame AQUI.',
    href: 'https://www.reclameaqui.com.br/reclamar/jH8o0cH-F8WJDHnY',
    action: 'Ir para Reclame AQUI',
  },
];

const highlights = [
  {
    icon: StarIcon,
    title: 'Resultados mensuráveis',
    description:
      'Monitoramos indicadores de satisfação e transformamos insights em ações que melhoram nossos serviços.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Canal dedicado',
    description:
      'Um time especializado acompanha cada comentário para garantir respostas rápidas e personalizadas.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Transparência total',
    description:
      'Feedbacks ficam disponíveis nas plataformas oficiais para reforçar a confiança dos próximos clientes.',
  },
];

export default function FeedbackSection() {
  return (
    <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-orange-200 shadow-sm">
                Ouça nossos clientes
              </span>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-transparent sm:text-4xl bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text">
                Central de Feedback Integrado
              </h2>
              <p className="mt-4 text-base text-slate-200 sm:text-lg">
                Disponibilizamos um ambiente profissional para que parceiros e clientes avaliem a SolarInvest e acompanhem a
                reputação da marca nas principais plataformas brasileiras.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-orange-400"
                >
                  <Icon className="h-8 w-8 text-orange-400" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-slate-200">{description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Queremos ouvir você</h3>
                <p className="mt-2 text-sm text-slate-200">
                  Preferencialmente utilize uma das plataformas oficiais, mas se precisar de um contato direto, envie um e-mail
                  para <a href="mailto:brsolarinvest@gmail.com" className="text-orange-400 underline">brsolarinvest@gmail.com</a>.
                </p>
              </div>
              <Link
                href="/contato"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:bg-orange-400 sm:mt-0"
              >
                Fale com nosso time
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            {platforms.map((platform) => (
              <div key={platform.name} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{platform.name}</h3>
                    <p className="mt-2 text-sm text-slate-200">{platform.description}</p>
                  </div>
                  <MegaphoneIcon className="h-8 w-8 flex-shrink-0 text-orange-400" aria-hidden />
                </div>
                <Link
                  href={platform.href}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-orange-400 transition hover:text-orange-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {platform.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
