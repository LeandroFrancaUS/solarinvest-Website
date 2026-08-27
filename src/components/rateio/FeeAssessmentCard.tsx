import type { FeeAssessment } from '@/lib/rateio/types';

export function FeeAssessmentCard({ fee, accepted, onAccepted }: { fee: FeeAssessment; accepted: boolean; onAccepted?: (value: boolean) => void }) {
  const money = typeof fee.amountCents === 'number' ? (fee.amountCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
  return (
    <div className={`rounded-2xl border p-4 ${fee.status === 'chargeable' ? 'border-amber-300 bg-amber-50' : fee.status === 'exempt' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
      <h3 className="font-black text-slate-900">Taxa da solicitação</h3>
      {fee.status === 'exempt' && <p className="mt-1 text-emerald-800">Esta solicitação está isenta de taxa.</p>}
      {fee.status === 'chargeable' && <>
        <p className="mt-1 text-amber-900">Esta solicitação possui taxa de <strong>{money}</strong>.</p>
        {fee.nextFreeAt && <p className="mt-1 text-sm text-amber-800">Próxima solicitação gratuita a partir de {new Date(`${fee.nextFreeAt}T12:00:00`).toLocaleDateString('pt-BR')}.</p>}
        {onAccepted && <label className="mt-3 flex min-h-11 items-start gap-3 font-semibold text-amber-950"><input type="checkbox" checked={accepted} onChange={(event) => onAccepted(event.target.checked)} className="h-11 w-11 shrink-0 accent-orange-500" /> Estou ciente da taxa informada.</label>}
      </>}
      {fee.status === 'indeterminate' && <p className="mt-1 text-slate-700">A equipe confirmará se há taxa antes de dar andamento à solicitação.</p>}
    </div>
  );
}
