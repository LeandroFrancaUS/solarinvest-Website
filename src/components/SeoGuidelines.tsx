'use client';

export default function SeoGuidelines() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10 rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-8 shadow-[0_25px_45px_-30px_rgba(251,146,60,0.45)]">
        <div className="space-y-3 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-600">
            SEO e Conteúdo
          </p>
          <h2 className="text-3xl font-bold text-orange-700 sm:text-4xl">
            Guia prático para posicionar seu site no Google
          </h2>
          <p className="text-base text-slate-700 sm:text-lg">
            Crie páginas úteis, rápidas e confiáveis. O Google prioriza experiências que ajudam pessoas reais.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Conteúdo e Palavras-chave
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Produza conteúdo útil, original e pensado para pessoas (não para robôs).</li>
              <li>• Responda à intenção de busca: informar, direcionar ou ajudar a concluir uma ação.</li>
              <li>• Use palavras-chave nos pontos-chave: título (50-60 caracteres), meta descrição (&lt;160), headings (H1-H6), URL curtas e descritivas.</li>
              <li>• Inclua imagens de qualidade com textos alternativos descritivos.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              SEO Técnico e Estrutura
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Garanta rastreabilidade: sitemap XML enviado no Search Console e robots.txt bem configurado.</li>
              <li>• Corrija links quebrados (404) e páginas bloqueadas indevidamente.</li>
              <li>• Priorize mobile-first: site responsivo, rápido e com recursos otimizados.</li>
              <li>• Otimize performance: comprima imagens, habilite cache e reduza bloqueios de renderização.</li>
              <li>• Use HTTPS e mantenha uma arquitetura clara (Home → categorias → páginas).</li>
              <li>• Adicione dados estruturados (Schema.org) para habilitar rich results.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Autoridade e Divulgação
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Construa backlinks de sites relevantes e confiáveis — evite compras de links.</li>
              <li>• Promova conteúdos em redes sociais, newsletters e comunidades do seu nicho.</li>
              <li>• Monitore desempenho no Search Console e Google Analytics: palavras-chave, tráfego e erros de rastreamento.</li>
              <li>• Ajuste a estratégia continuamente com base nos dados.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
