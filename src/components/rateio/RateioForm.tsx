'use client';

import { useMemo, useState } from 'react';
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

export default function RateioForm() {
  const [stage, setStage] = useState<'lookup' | 'confirm' | 'form' | 'success'>('lookup');
  const [reference, setReference] = useState('');
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

  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (!canSubmit) return; setLoading(true); setMessage('');
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

  function reset() { setStage('lookup'); setReference(''); setVerifier(''); setLookup(null); setManual(false); setProject(emptyProject()); setUnits([]); setOriginalUnits([]); setFee(null); setConsent(false); setFeeAccepted(false); setObservations(''); setMessage(''); setProtocol(''); setFailures(0); }

  if (stage === 'success') return <section className="rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-lg md:p-10"><BadgeCheck className="mx-auto h-14 w-14 text-emerald-600" /><h2 className="mt-4 text-3xl">Solicitação enviada com sucesso</h2><p className="mt-3 text-slate-600">Protocolo</p><p className="mt-1 text-2xl font-black text-orange-600">{protocol}</p><p className="mx-auto mt-4 max-w-2xl text-slate-700">A solicitação será analisada pela equipe. O prazo depende do processamento da distribuidora e normalmente vale a partir do próximo ciclo de faturamento.</p>{manual && <p className="mx-auto mt-3 max-w-2xl font-semibold text-amber-800">Como não houve confirmação automática, os dados serão conferidos manualmente antes de qualquer alteração.</p>}{fee?.status === 'chargeable' && <p className="mt-3 font-semibold">A equipe entrará em contato com as instruções de pagamento.</p>}<button onClick={reset} className="mt-6 rounded-full bg-orange-500 px-6 py-3 text-white hover:bg-orange-600">Fazer nova solicitação</button></section>;

  if (stage === 'lookup') return <form onSubmit={performLookup} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg md:p-8"><h2 className="text-2xl">Localize seu projeto</h2><p className="mt-2 text-slate-600">Informe a referência e um dado de confirmação.</p><div className="mt-6 grid gap-5 md:grid-cols-3"><label className="font-semibold">Código de referência<input required value={reference} onChange={(e) => setReference(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label><label className="font-semibold">Verificar por<select value={verifierType} onChange={(e) => setVerifierType(e.target.value as typeof verifierType)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="document">CPF ou CNPJ</option><option value="generator_uc">UC geradora</option></select></label><label className="font-semibold">{verifierType === 'document' ? 'CPF ou CNPJ do titular' : 'Número da UC geradora'}<input required value={verifier} onChange={(e) => setVerifier(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label></div>{message && <p role="alert" className={`mt-5 rounded-2xl border p-4 ${failures >= 3 ? 'border-orange-400 bg-orange-100 font-bold' : 'border-red-200 bg-red-50 text-red-800'}`}>{message}</p>}<button disabled={loading} className="mt-6 rounded-full bg-orange-500 px-7 py-3 text-white disabled:opacity-50">{loading ? 'Consultando…' : 'Buscar projeto'}</button></form>;

  if (stage === 'confirm' && lookup) return <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg md:p-8"><h2 className="text-2xl">Confirme os dados do projeto</h2><dl className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3"><Read label="Referência" value={project.reference} /><Read label="Modalidade" value={modalityLabel(project.modality)} /><Read label="UF" value={project.state} /><Read label="Instalação" value={project.installedAt ? new Date(`${project.installedAt}T12:00:00`).toLocaleDateString('pt-BR') : null} /><Read label="Titular" value={project.holder.name} /><Read label="Documento" value={project.holder.documentMasked} /><Read label="E-mail" value={project.holder.email} /><Read label="Telefone" value={project.holder.phone} /><Read label="UC geradora" value={project.generatorUnit.ucNumber} /><Read label="Endereço" value={project.generatorUnit.address} /></dl><div className="mt-6 flex flex-wrap gap-3"><button onClick={confirmLookup} className="rounded-full bg-orange-500 px-6 py-3 text-white">Sim, são meus dados</button><button onClick={reset} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-700">Não são meus dados</button></div></section>;

  return <form onSubmit={submit} className="space-y-6"><input aria-hidden="true" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px]" name="website" />{message && <p role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">{message}</p>}<section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"><h2 className="text-2xl">Dados do projeto</h2>{manual ? <ManualProject project={project} onChange={setProject} /> : <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Read label="Referência" value={project.reference} imported /><Read label="Modalidade" value={modalityLabel(project.modality)} imported /><Read label="UF" value={project.state} imported /><Read label="Instalação" value={project.installedAt ? new Date(`${project.installedAt}T12:00:00`).toLocaleDateString('pt-BR') : null} imported /><Read label="Titular" value={project.holder.name} imported /><Read label="Documento" value={project.holder.documentMasked} imported /><Read label="E-mail" value={project.holder.email} imported /><Read label="Telefone" value={project.holder.phone} imported /><Read label="UC geradora" value={project.generatorUnit.ucNumber} imported /><Read label="Endereço" value={project.generatorUnit.address} imported /></dl>}</section>
    <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl">Unidades consumidoras</h2><p className="text-sm text-slate-600">Máximo de 20 unidades. Percentuais com duas casas decimais.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setUnits(originalUnits.map((unit) => ({ ...unit })))} className="border border-slate-200 bg-white px-3 py-2 text-sm"><RotateCcw className="mr-1 inline h-4 w-4" />Restaurar original</button><button type="button" onClick={() => setUnits((current) => redistribute(current, true))} className="border border-slate-200 bg-white px-3 py-2 text-sm">Destravar e redistribuir</button><button type="button" onClick={addUnit} disabled={units.length >= 20} className="bg-orange-500 px-3 py-2 text-sm text-white"><Plus className="mr-1 inline h-4 w-4" />Adicionar UC</button></div></div>{project.state === 'GO' && <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900"><strong>UC geradora {project.generatorUnit.ucNumber || 'não informada'}: prioridade 100%.</strong> Em Goiás, ela consome primeiro a própria geração e somente o excedente é rateado entre as beneficiárias.</div>}<div className="mt-5 space-y-3">{units.map((unit) => <div key={unit.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_1fr_1.4fr_160px_44px] md:items-end"><Field label="Número da UC" value={unit.ucNumber} onChange={(v) => updateUnit(unit.id, 'ucNumber', v)} /><Field label="Titular" value={unit.holderName} onChange={(v) => updateUnit(unit.id, 'holderName', v)} /><Field label="Endereço" value={unit.address} onChange={(v) => updateUnit(unit.id, 'address', v)} /><label className="text-sm font-semibold">{project.state === 'GO' ? 'Porcentagem do excedente' : 'Porcentagem da geração'}<input aria-label={`Percentual da UC ${unit.ucNumber || 'nova'}`} key={unit.basisPoints} defaultValue={formatPercent(unit.basisPoints)} onBlur={(e) => updatePercent(unit.id, e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /><span className={`mt-1 block text-xs ${unitStatus(unit) === 'Nova' ? 'text-blue-700' : unitStatus(unit) === 'Alterada' ? 'text-amber-700' : 'text-emerald-700'}`}>{unitStatus(unit)}{unit.locked ? ' · travada' : ''}</span></label><button aria-label="Remover unidade" type="button" onClick={() => removeUnit(unit.id)} className="h-10 bg-red-50 text-red-700"><Trash2 className="mx-auto h-4 w-4" /></button></div>)}</div><div aria-live="polite" className={`sticky bottom-3 mt-5 rounded-2xl border p-4 font-black shadow-lg ${total === TOTAL_BASIS_POINTS ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-red-300 bg-red-50 text-red-800'}`}>Total: {formatPercent(total)}% — {total === TOTAL_BASIS_POINTS ? 'fechou em 100,00%' : 'precisa fechar em 100,00%'}{duplicate && <span className="block">Há UC duplicada ou uma geradora indevida na lista.</span>}</div></section>
    {fee && <FeeAssessmentCard fee={fee} accepted={feeAccepted} onAccepted={setFeeAccepted} />}<section className="rounded-3xl border border-orange-100 bg-white p-6"><div className="grid gap-5 md:grid-cols-2"><label className="font-semibold">Tipo de solicitação<select value={requestType} onChange={(e) => setRequestType(e.target.value as RequestType)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="inclusion">Inclusão de UC</option><option value="exclusion">Exclusão de UC</option><option value="redistribution">Redistribuição de percentuais</option></select></label><label className="font-semibold md:col-span-2">Observações (opcional)<textarea maxLength={1000} value={observations} onChange={(e) => setObservations(e.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /><span className="text-xs text-slate-500">{observations.length}/1000</span></label></div><label className="mt-5 flex items-start gap-2 font-semibold"><input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />Autorizo o uso destes dados para processar a solicitação junto à distribuidora.</label><button disabled={!canSubmit} className="mt-6 rounded-full bg-orange-500 px-7 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Enviando…' : 'Enviar solicitação'}</button></section></form>;
}

function Read({ label, value, imported }: { label: string; value: string | null | undefined; imported?: boolean }) { return <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold text-slate-900">{value || 'Não informado'} {imported && <span className="ml-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">Importado do sistema</span>}</dd></div>; }
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="text-sm font-semibold">{label}<input required value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>; }
function modalityLabel(value: Modality | null) { return ({ leasing: 'Leasing', sale: 'Venda', monitoring: 'Monitoramento', buyout: 'Compra definitiva' } as Record<string, string>)[value || ''] || 'Não informada'; }
function ManualProject({ project, onChange }: { project: Project; onChange: (project: Project) => void }) {
  const set = (path: string, value: string) => { const next = structuredClone(project); const [group, field] = path.split('.'); if (field) (next[group as 'holder' | 'generatorUnit'] as unknown as Record<string, string | null>)[field] = value; else (next as unknown as Record<string, string | null>)[group] = value; onChange(next); };
  return <div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Referência" value={project.reference} onChange={(v) => set('reference', v)} /><label className="font-semibold">Modalidade<select value={project.modality || ''} onChange={(e) => set('modality', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"><option value="leasing">Leasing</option><option value="sale">Venda</option><option value="monitoring">Monitoramento</option><option value="buyout">Compra definitiva</option></select></label><Field label="UF" value={project.state || ''} onChange={(v) => set('state', v.toUpperCase().slice(0, 2))} /><label className="font-semibold">Data de instalação (opcional)<input type="date" value={project.installedAt || ''} onChange={(e) => set('installedAt', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label><Field label="Nome do titular" value={project.holder.name || ''} onChange={(v) => set('holder.name', v)} /><Field label="CPF ou CNPJ" value={project.holder.documentMasked || ''} onChange={(v) => set('holder.documentMasked', v)} /><Field label="E-mail" value={project.holder.email || ''} onChange={(v) => set('holder.email', v)} /><Field label="Telefone" value={project.holder.phone || ''} onChange={(v) => set('holder.phone', v)} /><Field label="UC geradora" value={project.generatorUnit.ucNumber || ''} onChange={(v) => set('generatorUnit.ucNumber', v.replace(/\D/g, '').slice(0, 15))} /><Field label="Endereço da geradora" value={project.generatorUnit.address || ''} onChange={(v) => set('generatorUnit.address', v)} /></div>;
}
