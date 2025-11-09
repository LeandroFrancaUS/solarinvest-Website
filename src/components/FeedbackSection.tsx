import Link from 'next/link';
import {
  BugAntIcon,
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
    <section
      id="feedback"
      className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20 px-4 text-slate-900 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-orange-600">
                Ouça nossos clientes
              </span>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-orange-700 sm:text-4xl">
                Central de Feedback Integrado
              </h2>
              <p className="mt-4 text-base text-slate-700 sm:text-lg">
                Disponibilizamos um ambiente profissional para que parceiros e clientes avaliem a SolarInvest e acompanhem a
                reputação da marca nas principais plataformas brasileiras.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-orange-200/60 bg-white p-6 shadow-[0_18px_32px_-24px_rgba(251,146,60,0.65)] transition hover:border-orange-300"
                >
                  <Icon className="h-8 w-8 text-orange-500" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-700">{description}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-orange-200/60 bg-orange-50/80 p-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Queremos ouvir você</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    Preferencialmente utilize uma das plataformas oficiais, mas se precisar de um contato direto, envie um e-mail
                    para <a href="mailto:brsolarinvest@gmail.com" className="text-orange-600 underline">brsolarinvest@gmail.com</a>.
                  </p>
                </div>
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 sm:self-auto"
                >
                  Fale com nosso time
                </Link>
              </div>

              <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-orange-200/60 bg-white p-6 shadow-[0_18px_32px_-24px_rgba(251,146,60,0.45)]">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                    <BugAntIcon className="h-6 w-6 text-orange-500" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Sugestões ou bugs no site?</h3>
                    <p className="mt-2 text-sm text-slate-700">
                      Conte para nossa equipe como podemos melhorar a experiência digital ou reporte qualquer problema técnico que encontrar.
                    </p>
                  </div>
                </div>
                <Link
                  href="mailto:brsolarinvest@gmail.com?subject=Sugest%C3%A3o%20ou%20bug%20no%20site"
                  className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-orange-400/60 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-400 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 sm:self-auto"
                >
                  Enviar sugestão
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {platforms.map((platform) => (
              <div key={platform.name} className="rounded-3xl border border-orange-200/60 bg-white p-6 shadow-[0_22px_36px_-28px_rgba(251,146,60,0.6)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{platform.name}</h3>
                    <p className="mt-2 text-sm text-slate-700">{platform.description}</p>
                  </div>
                  <MegaphoneIcon className="h-8 w-8 flex-shrink-0 text-orange-500" aria-hidden />
                </div>
                <Link
                  href={platform.href}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-orange-600 transition hover:text-orange-500"
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
