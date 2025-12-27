'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import PreApprovalForm, { StatusResultado, statusVisuals } from './PreApprovalForm';

export default function AnalisePageClient() {
  const searchParams = useSearchParams();
  const shouldAutoOpen = searchParams?.get('abrir') === 'true';
  const [mostrarFormulario, setMostrarFormulario] = useState(shouldAutoOpen);
  const [resultado, setResultado] = useState<{ status: StatusResultado; message: string } | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useEffect(() => {
    if (shouldAutoOpen && !hasAutoOpened) {
      setHasAutoOpened(true);
      setMostrarFormulario(true);
    }

    if (mostrarFormulario) {
      const anchor = document.getElementById('pre-aprovacao');
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [mostrarFormulario, shouldAutoOpen, hasAutoOpened]);

  useEffect(() => {
    if (resultado) {
      const anchor = document.getElementById('resultado-analise');
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [resultado]);

  const iniciarAnalise = () => {
    setResultado(null);
    setMostrarFormulario(true);
    setHasAutoOpened(true);
  };

  const handleSubmitted = (res: { status: StatusResultado; message: string }) => {
    setResultado(res);
    setMostrarFormulario(false);
  };

  return (
    <main className="min-h-screen bg-white py-16 px-4 md:px-8 space-y-12">
      <section className="max-w-5xl mx-auto text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-heading font-bold text-orange-600"
        >
          Análise de aprovação para Leasing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-700 max-w-3xl mx-auto"
        >
          Confirme seus dados para avaliarmos rapidamente a elegibilidade do leasing SolarInvest. O formulário será aberto após
          você solicitar a análise.
        </motion.p>

        {!resultado && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={iniciarAnalise}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-6 py-3 shadow-md hover:bg-orange-700 transition"
            >
              Iniciar pré-análise
            </button>
          </div>
        )}
      </section>

      {mostrarFormulario && (
        <section className="max-w-7xl mx-auto" id="pre-aprovacao">
          <PreApprovalForm onSubmitted={handleSubmitted} />
        </section>
      )}

      {resultado && (
        <section id="resultado-analise" className="max-w-3xl mx-auto text-center space-y-4">
          <div
            className={`rounded-2xl border p-6 shadow-lg ${statusVisuals[resultado.status].styles} animate-[pulse_1.2s_ease-in-out_1]`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`text-3xl ${statusVisuals[resultado.status].accent}`} aria-hidden>
                {statusVisuals[resultado.status].icon}
              </div>
              <div>
                <p
                  className={`text-base md:text-xl font-extrabold uppercase tracking-wide ${
                    statusVisuals[resultado.status].accent
                  }`}
                >
                  {statusVisuals[resultado.status].title}
                </p>
                <p className="whitespace-pre-line mt-2 leading-relaxed text-gray-800">{resultado.message}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={iniciarAnalise}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-5 py-3 shadow-md hover:bg-orange-700 transition"
            >
              Iniciar nova pré-análise
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
