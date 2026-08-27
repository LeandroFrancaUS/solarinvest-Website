import type { FeeAssessment } from '@/lib/rateio/types';

export function FeeAssessmentCard({ fee, accepted, onAccepted, showError = false }: { fee: FeeAssessment; accepted: boolean; onAccepted?: (value: boolean) => void; showError?: boolean }) {
  const money = typeof fee.amountCents === 'number' ? (fee.amountCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
  return (
    <div className="border-t border-slate-200 pt-5 text-slate-700">
      {fee.status === 'exempt' && <p>Esta solicitação não tem taxa.</p>}
      {fee.status === 'chargeable' && <>
        <p>Taxa desta solicitação: <strong>{money}</strong>.</p>
        {onAccepted && <label data-rateio-error={showError && !accepted ? 'true' : undefined} className="mt-3 flex min-h-11 cursor-pointer items-start gap-3 font-semibold text-slate-900"><input type="checkbox" checked={accepted} onChange={(event) => onAccepted(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-orange-500" /><span>Estou ciente da taxa informada.{showError && !accepted && <span role="alert" className="mt-1 block text-xs text-red-700">Confirme a ciência da taxa para continuar.</span>}</span></label>}
      </>}
      {fee.status === 'indeterminate' && <p>A equipe confirmará se há taxa antes de continuar.</p>}
    </div>
  );
}
