'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, BadgeCheck, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { FeeAssessmentCard } from './FeeAssessmentCard';
import { formatPercent, hasDuplicateUcs, parsePercent, redistribute, TOTAL_BASIS_POINTS } from '@/lib/rateio/allocation';
import type { EditableUnit, FeeAssessment, LookupSuccess, Modality, Project, RequestType } from '@/lib/rateio/types';

const SUPPORT = '62 99116 7558';
const emptyProject = (): Project => ({ reference: '', modality: 'leasing', state: 'GO', installedAt: null, holder: { name: '', documentMasked: '', email: '', phone: '' }, generatorUnit: { ucNumber: '', address: '' }, shareUnits: [] });
const uid = () => crypto.randomUUID();
const toUnits = (lookup: LookupSuccess): EditableUnit[] => {
  const units = lookup.project.shareUnits.map((unit) => ({ id: uid(), ucNumber: unit.ucNumber || '', holderName: unit.holderName || '', address: unit.address || '', basisPoints: Math.round((unit.percent || 0) * 100), locked: false, origin: 'current' as const }));
  if (lookup.project.state === 'DF' && lookup.project.generatorUnit.ucNumber && !units.some((unit) => unit.ucNumber === lookup.project.generatorUnit.ucNumber)) {
    units.unshift({ id: uid(), ucNumber: lookup.project.generatorUnit.ucNumber, holderName: lookup.project.holder.name || '', address: lookup.project.generatorUnit.address || '', basisPoints: 0, locked: false, origin: 'current' });
  }
  return units;
};

export default function RateioForm({ initialReference = '' }: { initialReference?: string }) {
  const [stage, setStage] = useState<'lookup' | 'confirm' | 'form' | 'success'>('lookup');
  const [reference, setReference] = useState(initialReference);
  const [verifierType, setVerifierType] = useState<'document' | 'generator_uc'>('document');
  const [verifier, setVerifier] = useState('');
  const [lookup, setLookup] = useState<LookupSuccess | null>(null);
  const [manual, setManual] = useState(false);
  const [project, setProject] = useState<Project>(emptyProject);
  const [originalUnits, setOriginalUnits] = useState<EditableUnit[]>([]);
  const [units, setUnits] = useState<EditableUnit[]>([]);
  const [fee, setFee] = useState<FeeAssessment | null>(null);
  const [feeAccepted, setFeeAccepted] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>('redistribution');
  const [observations, setObservations] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [mountedAt, setMountedAt] = useState(Date.now());
  const [failures, setFailures] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const total = units.reduce((sum, unit) => sum + unit.basisPoints, 0);
  const duplicate = hasDuplicateUcs(units, project.generatorUnit.ucNumber, project.state);
  const validUnits = units.length > 0 && units.length <= 20 && units.every((unit) => /^\d{15}$/.test(unit.ucNumber) && unit.holderName.trim());
  const canSubmit = total === TOTAL_BASIS_POINTS && !duplicate && validUnits && consent && (fee?.status !== 'chargeable' || feeAccepted) && !loading;

  async function performLookup(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setMessage('');
    try {
      const response = await fetch('/api/rateio/lookup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reference, verifierType, verifier }) });
      const data = await response.json();
      if (data.ok) {
        if (!data.lookupToken) { openManual(); return; }
        if (data.feeAssessment.hasPendingRequest) { setMessage(`Já existe uma solicitação em análise para este projeto. Fale conosco pelo WhatsApp ${SUPPORT}.`); return; }
        setLookup(data); setProject(data.project); setFee(data.feeAssessment); setStage('confirm'); setFailures(0);
      } else if (data.unavailable) openManual();
      else if (data.rateLimited || response.status === 429) setMessage('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
      else { const next = failures + 1; setFailures(next); setMessage(`Não foi possível confirmar os dados. Confira as informações e, se precisar, fale pelo WhatsApp ${SUPPORT}.`); }
    } catch { openManual(); }
    finally { setLoading(false); }
  }

  function openManual() {
    setManual(true); setProject({ ...emptyProject(), reference }); setFee({ status: 'indeterminate' }); setUnits([]); setOriginalUnits([]); setMountedAt(Date.now()); setStage('form'); setMessage('Não foi possível confirmar automaticamente o projeto. Preencha todos os dados; a equipe fará uma conferência manual.');
  }

  function confirmLookup() {
    if (!lookup) return;
    const imported = toUnits(lookup); setUnits(imported); setOriginalUnits(imported.map((unit) => ({ ...unit }))); setMountedAt(Date.now()); setStage('form'); setMessage('');
  }

  function updateUnit(id: string, field: 'ucNumber' | 'holderName' | 'address', value: string) { setUnits((current) => current.map((unit) => unit.id === id ? { ...unit, [field]: field === 'ucNumber' ? value.replace(/\D/g, '').slice(0, 15) : value } : unit)); }
  function updatePercent(id: string, value: string) {
    const parsed = parsePercent(value);
    if (parsed === null) { setUnits((current) => current.map((unit) => unit.id === id ? { ...unit, basisPoints: -1, locked: true } : unit)); return; }
    setUnits((current) => redistribute(current.map((unit) => unit.id === id ? { ...unit, basisPoints: parsed, locked: true } : unit)));
  }
  function addUnit() { if (units.length >= 20) return; setUnits((current) => redistribute([...current, { id: uid(), ucNumber: '', holderName: '', address: '', basisPoints: 0, locked: false, origin: 'new' }])); }
  function removeUnit(id: string) { setUnits((current) => redistribute(current.filter((unit) => unit.id !== id))); }
  const unitStatus = useMemo(() => (unit: EditableUnit) => {
    if (unit.origin === 'new') return 'Nova';
    const old = originalUnits.find((item) => item.ucNumber === unit.ucNumber);
    return old && old.basisPoints === unit.basisPoints && old.address === unit.address && old.holderName === unit.holderName ? 'Atual' : 'Alterada';
  }, [originalUnits]);

  function focusFirstError() {
    requestAnimationFrame(() => {
      const first = document.querySelector<HTMLElement>('[data-rateio-error="true"] input, [data-rateio-error="true"] button, [data-rateio-error="true"]');
      first?.focus({ preventScroll: true });
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) { setShowErrors(true); focusFirstError(); return; }
    setLoading(true); setMessage(''); setShowErrors(false);
    const shareUnits = units.map((unit) => ({ ucNumber: unit.ucNumber, holderName: unit.holderName, address: unit.address || null, percent: unit.basisPoints / 100 }));
    try {
      const response = await fetch('/api/rateio/solicitacoes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ manual, website, mountedAt, lookupToken: lookup?.lookupToken, requestType, expectedFeeStatus: fee?.status, project, payload: { shareUnits, observations, consent } }) });
      const data = await response.json();
      if (response.status === 409 && data.code === 'FEE_VERDICT_CHANGED') { setFee(data.feeAssessment); setFeeAccepted(false); setMessage('O veredito da taxa foi atualizado. Revise a informação abaixo e confirme novamente para concluir.'); return; }
      if (response.status === 409 && data.code === 'PENDING_REQUEST_EXISTS') { setMessage(`Já existe uma solicitação em análise${data.protocol ? ` (${data.protocol})` : ''}. Fale conosco pelo WhatsApp ${SUPPORT}.`); return; }
      if (!response.ok || !data.ok) { setMessage(data.code === 'LOOKUP_EXPIRED' ? 'A confirmação expirou. Volte e faça uma nova busca.' : 'Não foi possível enviar agora. Seus dados foram mantidos; tente novamente.'); return; }
      setProtocol(data.protocol); setFee(data.feeAssessment || fee); setStage('success');
    } catch { setMessage('Falha de comunicação ao enviar. Seus dados foram mantidos; tente novamente.'); }
    finally { setLoading(false); }
  }

  function reset() { setStage('lookup'); setReference(initialReference); setVerifier(''); setLookup(null); setManual(false); setProject(emptyProject()); setUnits([]); setOriginalUnits([]); setFee(null); setConsent(false); setFeeAccepted(false); setObservations(''); setMessage(''); setProtocol(''); setFailures(0); setShowErrors(false); }

  if (stage === 'success') return <section className="min-w-0 rounded-3xl border border-emerald-200 bg-white p-4 text-center sm:p-6 shadow-lg md:p-10"><BadgeCheck className="mx-auto h-14 w-14 text-emerald-600" /><h2 className="mt-4 break-words text-2xl sm:text-3xl">Solicitação enviada com sucesso</h2><p className="mt-3 text-slate-600">Protocolo</p><p className="mt-1 select-all break-all text-xl font-black text-orange-600 sm:text-2xl">{protocol}</p><p className="mx-auto mt-4 max-w-2xl text-slate-700">A solicitação será analisada pela equipe. O prazo depende do processamento da distribuidora e normalmente vale a partir do próximo ciclo de faturamento.</p>{manual && <p className="mx-auto mt-3 max-w-2xl font-semibold text-amber-800">Como não houve confirmação automática, os dados serão conferidos manualmente antes de qualquer alteração.</p>}{fee?.status === 'chargeable' && <p className="mt-3 font-semibold">A equipe entrará em contato com as instruções de pagamento.</p>}<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"><button onClick={reset} className="rounded-full bg-orange-500 px-6 py-3 text-white hover:bg-orange-600">Fazer nova solicitação</button><Link href="/" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-700 hover:border-slate-400 hover:bg-slate-50">Não, obrigado. Voltar ao início</Link></div></section>;

  if (stage === 'lookup') return <form onSubmit={performLookup} className="rateio-form min-w-0 rounded-3xl border border-orange-100 bg-white p-4 shadow-lg sm:p-6 md:p-8"><h2 className="text-2xl">Localize seu projeto</h2><p className="mt-2 text-slate-600">Informe a referência e um dado de confirmação.</p><div className="mt-6 grid gap-5 md:grid-cols-3"><label className="font-semibold">Código de referência<input required value={reference} onChange={(e) => setReference(e.target.value)} autoCapitalize="characters" autoComplete="off" className="rateio-control mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label><label className="font-semibold">Verificar por<select value={verifierType} onChange={(e) => setVerifierType(e.target.value as typeof verifierType)} className="rateio-control mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="document">CPF ou CNPJ</option><option value="generator_uc">UC geradora</option></select></label><label className="font-semibold">{verifierType === 'document' ? 'CPF ou CNPJ do titular' : 'Número da UC geradora'}<input required value={verifier} onChange={(e) => setVerifier(e.target.value.replace(/\D/g, ''))} inputMode="numeric" autoComplete="off" className="rateio-control mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label></div>{message && <p role="alert" className={`mt-5 rounded-2xl border p-4 ${failures >= 3 ? 'border-orange-400 bg-orange-100 font-bold' : 'border-red-200 bg-red-50 text-red-800'}`}>{message}</p>}<button disabled={loading} className="mt-6 rounded-full bg-orange-500 px-7 py-3 text-white disabled:opacity-50">{loading ? 'Consultando…' : 'Buscar projeto'}</button></form>;

  if (stage === 'confirm' && lookup) return <section className="rateio-form min-w-0 rounded-3xl border border-orange-100 bg-white p-4 shadow-lg sm:p-6 md:p-8"><h2 className="text-2xl">Confirme os dados do projeto</h2><dl className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3"><Read label="Referência" value={project.reference} /><Read label="Modalidade" value={modalityLabel(project.modality)} /><Read label="UF" value={project.state} /><Read label="Instalação" value={project.installedAt ? new Date(`${project.installedAt}T12:00:00`).toLocaleDateString('pt-BR') : null} /><Read label="Titular" value={project.holder.name} /><Read label="Documento" value={project.holder.documentMasked} /><Read label="E-mail" value={project.holder.email} /><Read label="Telefone" value={project.holder.phone} /><Read label="UC geradora" value={project.generatorUnit.ucNumber} /><Read label="Endereço" value={project.generatorUnit.address} /></dl><div className="mt-6 flex flex-wrap gap-3"><button onClick={confirmLookup} className="rounded-full bg-orange-500 px-6 py-3 text-white">Sim, são meus dados</button><button onClick={reset} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-700">Não são meus dados</button></div></section>;

  return <form onSubmit={submit} className="rateio-form min-w-0 space-y-6 pb-32 sm:pb-36 md:pb-0"><input aria-hidden="true" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px]" name="website" />{message && <p role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">{message}</p>}<section className="min-w-0 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6"><h2 className="text-2xl">Dados do projeto</h2>{manual ? <ManualProject project={project} onChange={setProject} /> : <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Read label="Referência" value={project.reference} imported /><Read label="Modalidade" value={modalityLabel(project.modality)} imported /><Read label="UF" value={project.state} imported /><Read label="Instalação" value={project.installedAt ? new Date(`${project.installedAt}T12:00:00`).toLocaleDateString('pt-BR') : null} imported /><Read label="Titular" value={project.holder.name} imported /><Read label="Documento" value={project.holder.documentMasked} imported /><Read label="E-mail" value={project.holder.email} imported /><Read label="Telefone" value={project.holder.phone} imported /><Read label="UC geradora" value={project.generatorUnit.ucNumber} imported /><Read label="Endereço" value={project.generatorUnit.address} imported /></dl>}</section>
    <section className="min-w-0 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl">Unidades consumidoras</h2><p className="text-sm text-slate-600">Máximo de 20 unidades. Percentuais com duas casas decimais.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setUnits(originalUnits.map((unit) => ({ ...unit })))} className="border border-slate-200 bg-white px-3 py-2 text-sm"><RotateCcw className="mr-1 inline h-4 w-4" />Restaurar original</button><button type="button" onClick={() => setUnits((current) => redistribute(current, true))} className="border border-slate-200 bg-white px-3 py-2 text-sm">Destravar e redistribuir</button><button type="button" onClick={addUnit} disabled={units.length >= 20} className="bg-orange-500 px-3 py-2 text-sm text-white"><Plus className="mr-1 inline h-4 w-4" />Adicionar UC</button></div></div>{project.state === 'GO' && <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900"><strong>UC geradora {project.generatorUnit.ucNumber || 'não informada'}: prioridade 100%.</strong> Em Goiás, ela consome primeiro a própria geração e somente o excedente é rateado entre as beneficiárias.</div>}<div className="mt-5 space-y-3">{units.map((unit) => <div key={unit.id} data-rateio-error={showErrors && (!/^\d{15}$/.test(unit.ucNumber) || !unit.holderName.trim()) ? "true" : undefined} className="min-w-0 grid scroll-mt-28 gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_1fr_1.4fr_160px_44px] md:items-end"><Field label="Número da UC" inputMode="numeric" digitsOnly value={unit.ucNumber} onChange={(v) => updateUnit(unit.id, 'ucNumber', v)} /><Field label="Titular" autoComplete="name" value={unit.holderName} onChange={(v) => updateUnit(unit.id, 'holderName', v)} /><Field label="Endereço" value={unit.address} onChange={(v) => updateUnit(unit.id, 'address', v)} /><label className="text-sm font-semibold">{project.state === 'GO' ? 'Porcentagem do excedente' : 'Porcentagem da geração'}<input inputMode="decimal" aria-label={`Percentual da UC ${unit.ucNumber || 'nova'}`} key={unit.basisPoints} defaultValue={formatPercent(unit.basisPoints)} onBlur={(e) => updatePercent(unit.id, e.target.value)} className="rateio-control mt-1 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2" /><span className={`mt-1 block text-xs ${unitStatus(unit) === 'Nova' ? 'text-blue-700' : unitStatus(unit) === 'Alterada' ? 'text-amber-700' : 'text-emerald-700'}`}>{unitStatus(unit)}{unit.locked ? ' · travada' : ''}</span></label><button aria-label="Remover unidade" type="button" onClick={() => removeUnit(unit.id)} className="min-h-11 min-w-11 justify-self-stretch bg-red-50 text-red-700 md:h-11 md:w-11 md:justify-self-auto"><Trash2 className="mx-auto h-4 w-4" /></button></div>)}</div><div aria-live="polite" data-rateio-error={showErrors && (total !== TOTAL_BASIS_POINTS || duplicate || !validUnits) ? "true" : undefined} tabIndex={-1} className={`mt-5 hidden md:block rounded-2xl border p-4 font-black shadow-lg ${total === TOTAL_BASIS_POINTS ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-red-300 bg-red-50 text-red-800'}`}>Total: {formatPercent(total)}% — {total === TOTAL_BASIS_POINTS ? 'fechou em 100,00%' : 'precisa fechar em 100,00%'}{duplicate && <span className="block">Há UC duplicada ou uma geradora indevida na lista.</span>}</div></section>
    {fee && <FeeAssessmentCard fee={fee} accepted={feeAccepted} onAccepted={setFeeAccepted} />}<section className="min-w-0 rounded-3xl border border-orange-100 bg-white p-4 sm:p-6"><div className="grid gap-5 md:grid-cols-2"><label className="font-semibold">Tipo de solicitação<select value={requestType} onChange={(e) => setRequestType(e.target.value as RequestType)} className="rateio-control mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="inclusion">Inclusão de UC</option><option value="exclusion">Exclusão de UC</option><option value="redistribution">Redistribuição de percentuais</option></select></label><label className="font-semibold md:col-span-2">Observações (opcional)<textarea maxLength={1000} value={observations} onChange={(e) => setObservations(e.target.value)} rows={4} className="rateio-control mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /><span className="text-xs text-slate-500">{observations.length}/1000</span></label></div><label data-rateio-error={showErrors && !consent ? "true" : undefined} className="mt-5 flex min-h-11 scroll-mt-28 items-start gap-3 font-semibold"><input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0 h-11 w-11 shrink-0 accent-orange-500" />Autorizo o uso destes dados para processar a solicitação junto à distribuidora.</label>{showErrors && !consent && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">Confirme a autorização para continuar.</p>}<button disabled={loading} className="mt-6 hidden min-h-11 rounded-full bg-orange-500 px-7 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50 md:inline-flex">{loading ? 'Enviando…' : 'Enviar solicitação'}</button></section><div className="rateio-mobile-actions fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.14)] backdrop-blur md:hidden"><div className="mx-auto flex max-w-[1320px] items-center gap-3"><div aria-live="polite" data-rateio-error={showErrors && (total !== TOTAL_BASIS_POINTS || duplicate || !validUnits) ? "true" : undefined} tabIndex={-1} className={`min-w-0 flex-1 text-sm font-black ${total === TOTAL_BASIS_POINTS && !duplicate ? 'text-emerald-700' : 'text-red-700'}`}><span className="block">Total: {formatPercent(total)}%</span><span className="block text-xs">{total === TOTAL_BASIS_POINTS && !duplicate ? 'Fechou em 100,00%' : 'Precisa fechar em 100,00%'}</span></div><button disabled={loading} className="min-h-11 shrink-0 rounded-full bg-orange-500 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Enviando…' : 'Enviar'}</button></div></div></form>;
}

function Read({ label, value, imported }: { label: string; value: string | null | undefined; imported?: boolean }) { return <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold text-slate-900">{value || 'Não informado'} {imported && <span className="ml-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">Importado do sistema</span>}</dd></div>; }
function Field({ label, value, onChange, type = "text", inputMode, autoComplete, digitsOnly = false }: { label: string; value: string; onChange: (value: string) => void; type?: React.HTMLInputTypeAttribute; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; autoComplete?: string; digitsOnly?: boolean }) { return <label className="min-w-0 text-sm font-semibold">{label}<input required type={type} inputMode={inputMode} autoComplete={autoComplete} value={value} onChange={(e) => onChange(digitsOnly ? e.target.value.replace(/\D/g, "") : e.target.value)} className="rateio-control mt-1 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2" /></label>; }
function modalityLabel(value: Modality | null) { return ({ leasing: 'Leasing', sale: 'Venda', monitoring: 'Monitoramento', buyout: 'Compra definitiva' } as Record<string, string>)[value || ''] || 'Não informada'; }
function ManualProject({ project, onChange }: { project: Project; onChange: (project: Project) => void }) {
  const set = (path: string, value: string) => { const next = structuredClone(project); const [group, field] = path.split('.'); if (field) (next[group as 'holder' | 'generatorUnit'] as unknown as Record<string, string | null>)[field] = value; else (next as unknown as Record<string, string | null>)[group] = value; onChange(next); };
  return <div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Referência" value={project.reference} onChange={(v) => set('reference', v)} /><label className="font-semibold">Modalidade<select value={project.modality || ''} onChange={(e) => set('modality', e.target.value)} className="rateio-control mt-1 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2"><option value="leasing">Leasing</option><option value="sale">Venda</option><option value="monitoring">Monitoramento</option><option value="buyout">Compra definitiva</option></select></label><Field label="UF" value={project.state || ''} onChange={(v) => set('state', v.toUpperCase().slice(0, 2))} /><label className="font-semibold">Data de instalação (opcional)<input type="date" value={project.installedAt || ''} onChange={(e) => set('installedAt', e.target.value)} className="rateio-control mt-1 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2" /></label><Field label="Nome do titular" autoComplete="name" value={project.holder.name || ''} onChange={(v) => set('holder.name', v)} /><Field label="CPF ou CNPJ" inputMode="numeric" digitsOnly value={project.holder.documentMasked || ''} onChange={(v) => set('holder.documentMasked', v)} /><Field label="E-mail" type="email" inputMode="email" autoComplete="email" value={project.holder.email || ''} onChange={(v) => set('holder.email', v)} /><Field label="Telefone" type="tel" inputMode="tel" autoComplete="tel" value={project.holder.phone || ''} onChange={(v) => set('holder.phone', v)} /><Field label="UC geradora" inputMode="numeric" digitsOnly value={project.generatorUnit.ucNumber || ''} onChange={(v) => set('generatorUnit.ucNumber', v.replace(/\D/g, '').slice(0, 15))} /><Field label="Endereço da geradora" value={project.generatorUnit.address || ''} onChange={(v) => set('generatorUnit.address', v)} /></div>;
}
