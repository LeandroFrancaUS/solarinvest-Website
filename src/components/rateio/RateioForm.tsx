'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BadgeCheck, CheckCircle2, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { FeeAssessmentCard } from './FeeAssessmentCard';
import { compareUnits, formatPercent, hasDuplicateUcs, initializeAllocation, parsePercent, redistribute, TOTAL_BASIS_POINTS } from '@/lib/rateio/allocation';
import type { EditableUnit, FeeAssessment, GeneratorAllocation, LookupSuccess, Modality, Project, RequestType } from '@/lib/rateio/types';

const SUPPORT = '62 99116 7558';
const emptyProject = (): Project => ({ reference: '', modality: 'leasing', state: 'GO', installedAt: null, holder: { name: '', documentMasked: '', email: '', phone: '' }, generatorUnit: { ucNumber: '', address: '' }, shareUnits: [] });
const uid = () => crypto.randomUUID();
const blankUnit = (): EditableUnit => ({ id: uid(), ucNumber: '', holderName: '', address: '', basisPoints: null, locked: false, origin: 'new', ownershipConfirmed: null });

export function normalizeUcNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 15);
  return digits ? digits.padStart(15, '0') : '';
}

export function inferRequestType(units: EditableUnit[], originalUnits: EditableUnit[]): RequestType {
  const originalUcs = new Set(originalUnits.map((unit) => unit.ucNumber).filter(Boolean));
  const finalUcs = new Set(units.map((unit) => unit.ucNumber).filter(Boolean));
  if ([...finalUcs].some((uc) => !originalUcs.has(uc))) return 'inclusion';
  if ([...originalUcs].some((uc) => !finalUcs.has(uc))) return 'exclusion';
  return 'redistribution';
}

function unitsMatch(units: EditableUnit[], original: EditableUnit[]) {
  if (units.length !== original.length) return false;
  return units.every((unit, index) => {
    const old = original[index];
    return old && unit.ucNumber === old.ucNumber && unit.holderName === old.holderName && unit.address === old.address && unit.basisPoints === old.basisPoints;
  });
}

function normalizedName(value: string | null | undefined) {
  return (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
}

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
  const [generator, setGenerator] = useState<GeneratorAllocation>({ ucNumber: '', address: '', basisPoints: null });
  const [originalGenerator, setOriginalGenerator] = useState<GeneratorAllocation>({ ucNumber: '', address: '', basisPoints: null });
  const [hasMissingPercent, setHasMissingPercent] = useState(false);
  const [fee, setFee] = useState<FeeAssessment | null>(null);
  const [feeAccepted, setFeeAccepted] = useState(false);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [mountedAt, setMountedAt] = useState(Date.now());
  const [failures, setFailures] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [ownershipInconsistencies, setOwnershipInconsistencies] = useState<string[]>([]);

  const total = units.reduce((sum, unit) => sum + (unit.basisPoints || 0), project.state === 'DF' ? generator.basisPoints || 0 : 0);
  const duplicate = hasDuplicateUcs(units, project.generatorUnit.ucNumber, project.state);
  const validUnits = units.length > 0 && units.length <= 20 && units.every((unit) => /^\d{15}$/.test(unit.ucNumber) && unit.address.trim() && (unit.basisPoints || 0) > 0) && (project.state !== 'DF' || (generator.basisPoints || 0) > 0);
  const ownershipConfirmed = units.length > 0 && units.every((unit) => unit.ownershipConfirmed === true);
  const manualProjectComplete = !manual || Boolean(project.reference.trim() && project.state?.trim() && project.holder.name?.trim() && project.holder.documentMasked?.trim() && project.holder.email?.trim() && project.holder.phone?.trim() && project.generatorUnit.ucNumber?.trim() && project.generatorUnit.address?.trim());
  const pendingItems = [
    ...(!manualProjectComplete ? ['Complete os dados do projeto e informe o titular das unidades.'] : []),
    ...(units.length === 0 ? ['Adicione pelo menos uma unidade consumidora.'] : []),
    ...(!validUnits ? ['Preencha o número, o endereço e o percentual de todas as unidades.'] : []),
    ...(!ownershipConfirmed ? ['Confirme que você é o atual titular de todas as unidades beneficiárias.'] : []),
    ...(duplicate ? ['Remova unidades repetidas ou a unidade geradora indevida.'] : []),
    ...(total !== TOTAL_BASIS_POINTS ? [`A soma precisa ser 100,00% (${total < TOTAL_BASIS_POINTS ? `faltam ${formatPercent(TOTAL_BASIS_POINTS - total)}%` : `retire ${formatPercent(total - TOTAL_BASIS_POINTS)}%`}).`] : []),
    ...(fee?.status === 'chargeable' && !feeAccepted ? ['Confirme que está ciente da taxa.'] : []),
    ...(!consent ? ['Autorize o uso dos dados para enviar a solicitação.'] : []),
  ];
  const canSubmit = pendingItems.length === 0;

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
    setManual(true); setProject({ ...emptyProject(), reference }); setFee({ status: 'indeterminate' }); setUnits([{ ...blankUnit(), basisPoints: TOTAL_BASIS_POINTS, locked: true }]); setOriginalUnits([]); setGenerator({ ucNumber: '', address: '', basisPoints: null }); setOriginalGenerator({ ucNumber: '', address: '', basisPoints: null }); setHasMissingPercent(false); setMountedAt(Date.now()); setFormDirty(false); setStage('form'); setMessage('Não foi possível confirmar automaticamente o projeto. Preencha todos os dados; a equipe fará uma conferência manual.');
  }

  function confirmLookup() {
    if (!lookup) return;
    const imported = initializeAllocation(lookup.project, uid); setUnits(imported.units); setOriginalUnits(imported.units.filter((unit) => unit.origin === 'current').map((unit) => ({ ...unit }))); setGenerator(imported.generator); setOriginalGenerator({ ...imported.generator }); setHasMissingPercent(imported.hasMissingPercent); setMountedAt(Date.now()); setFormDirty(false); setStage('form'); setMessage('');
  }

  function updateUnit(id: string, field: 'ucNumber' | 'holderName' | 'address', value: string) { setFormDirty(true); setUnits((current) => current.map((unit) => unit.id === id ? { ...unit, [field]: field === 'ucNumber' ? value.replace(/\D/g, '').slice(0, 15) : value, ...(field === 'ucNumber' || field === 'address' ? { ownershipConfirmed: null } : {}) } : unit)); }
  function completeUnitNumber(id: string, value: string) { updateUnit(id, 'ucNumber', normalizeUcNumber(value)); }
  function confirmOwnership(unit: EditableUnit, value: boolean) {
    setFormDirty(true);
    setUnits((current) => current.map((item) => item.id === unit.id ? { ...item, ownershipConfirmed: value } : item));
    if (!value && unit.origin === 'current') setOwnershipInconsistencies((current) => current.includes(unit.ucNumber) ? current : [...current, unit.ucNumber]);
  }
  function updatePercent(id: string, value: string) {
    setFormDirty(true);
    const parsed = parsePercent(value);
    setUnits((current) => project.state === 'GO' && parsed != null
      ? redistribute(current.map((unit) => ({ ...unit, basisPoints: unit.id === id ? parsed : unit.basisPoints, locked: unit.id === id })))
      : current.map((unit) => unit.id === id ? { ...unit, basisPoints: parsed, locked: true } : unit));
  }
  function addUnit() { if (units.length < 20) { setFormDirty(true); setUnits((current) => { const added = [...current, blankUnit()]; return project.state === 'GO' ? redistribute(added, true) : added; }); } }
  function removeUnit(id: string) { setFormDirty(true); setUnits((current) => { const remaining = current.filter((unit) => unit.id !== id); if (!remaining.length) return project.state === 'GO' ? [{ ...blankUnit(), basisPoints: TOTAL_BASIS_POINTS, locked: true }] : [blankUnit()]; return project.state === 'GO' ? redistribute(remaining, true) : remaining; }); }

  function cancel() {
    if (formDirty && !window.confirm('Cancelar esta solicitação? Os dados preenchidos serão perdidos.')) return;
    reset();
  }

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
    if (loading) { setMessage('A solicitação já está sendo enviada. Aguarde.'); return; }
    setLoading(true); setMessage(''); setShowErrors(false);
    const beneficiaryUnits = units.map((unit) => ({ ucNumber: unit.ucNumber, holderName: project.holder.name, address: unit.address || null, percent: (unit.basisPoints || 0) / 100, ownershipConfirmed: unit.ownershipConfirmed }));
    const shareUnits = project.state === 'DF' ? [{ ucNumber: generator.ucNumber, holderName: project.holder.name, address: generator.address || null, percent: (generator.basisPoints || 0) / 100 }, ...beneficiaryUnits] : beneficiaryUnits;
    const comparison = compareUnits(units, originalUnits);
    const generatorComparison = { ...generator, status: generator.basisPoints === originalGenerator.basisPoints ? 'maintained' : 'changed' };
    try {
      const response = await fetch('/api/rateio/solicitacoes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ manual, website, mountedAt, lookupToken: lookup?.lookupToken, requestType: inferRequestType(units, originalUnits), expectedFeeStatus: fee?.status, feeAccepted, project, payload: { shareUnits, comparison: { generator: generatorComparison, beneficiaries: comparison }, ownershipInconsistencies, observations: '', consent } }) });
      const data = await response.json();
      if (response.status === 409 && data.code === 'FEE_VERDICT_CHANGED') { setFee(data.feeAssessment); setFeeAccepted(false); setMessage('O veredito da taxa foi atualizado. Revise a informação abaixo e confirme novamente para concluir.'); return; }
      if (response.status === 409 && data.code === 'PENDING_REQUEST_EXISTS') { setMessage(`Já existe uma solicitação em análise${data.protocol ? ` (${data.protocol})` : ''}. Fale conosco pelo WhatsApp ${SUPPORT}.`); return; }
      if (!response.ok || !data.ok) { setMessage(data.code === 'LOOKUP_EXPIRED' ? 'A confirmação expirou. Volte e faça uma nova busca.' : 'Não foi possível enviar agora. Seus dados foram mantidos; tente novamente.'); return; }
      setProtocol(data.protocol); setFee(data.feeAssessment || fee); setStage('success');
    } catch (error) { console.error('Falha ao enviar solicitação de distribuição de créditos', error); setMessage('Falha de comunicação ao enviar. Seus dados foram mantidos; tente novamente.'); }
    finally { setLoading(false); }
  }

  function reset() { setStage('lookup'); setReference(initialReference); setVerifier(''); setLookup(null); setManual(false); setProject(emptyProject()); setUnits([]); setOriginalUnits([]); setGenerator({ ucNumber: '', address: '', basisPoints: null }); setOriginalGenerator({ ucNumber: '', address: '', basisPoints: null }); setHasMissingPercent(false); setFee(null); setConsent(false); setFeeAccepted(false); setOwnershipInconsistencies([]); setMessage(''); setProtocol(''); setFailures(0); setShowErrors(false); setFormDirty(false); }

  if (stage === 'success') return <section className="min-w-0 rounded-3xl border border-emerald-200 bg-white p-4 text-center sm:p-6 shadow-lg md:p-10"><BadgeCheck className="mx-auto h-14 w-14 text-emerald-600" /><h2 className="mt-4 break-words text-2xl sm:text-3xl">Solicitação enviada com sucesso</h2><p className="mt-3 text-slate-600">Protocolo</p><p className="mt-1 select-all break-all text-xl font-black text-orange-600 sm:text-2xl">{protocol}</p><p className="mx-auto mt-4 max-w-2xl text-slate-700">A solicitação será analisada pela equipe. O prazo depende do processamento da distribuidora e normalmente vale a partir do próximo ciclo de faturamento.</p>{manual && <p className="mx-auto mt-3 max-w-2xl font-semibold text-amber-800">Como não houve confirmação automática, os dados serão conferidos manualmente antes de qualquer alteração.</p>}{fee?.status === 'chargeable' && <p className="mt-3 font-semibold">A equipe entrará em contato com as instruções de pagamento.</p>}<button onClick={reset} className="mt-6 rounded-full bg-orange-500 px-6 py-3 text-white hover:bg-orange-600">Fazer nova solicitação</button></section>;

  if (stage === 'lookup') return <form onSubmit={performLookup} className="rateio-form min-w-0 rounded-3xl border border-orange-100 bg-white p-4 shadow-lg sm:p-6 md:p-8"><h2 className="text-2xl">Localize seu projeto</h2><p className="mt-2 text-slate-600">Informe a referência e um dado de confirmação.</p><div className="mt-6 grid gap-5 md:grid-cols-3"><label className="font-semibold">Código de referência<input required value={reference} onChange={(e) => setReference(e.target.value)} autoCapitalize="characters" autoComplete="off" className="rateio-control mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label><label className="font-semibold">Verificar por<select value={verifierType} onChange={(e) => setVerifierType(e.target.value as typeof verifierType)} className="rateio-control mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="document">CPF ou CNPJ</option><option value="generator_uc">UC geradora</option></select></label><label className="font-semibold">{verifierType === 'document' ? 'CPF ou CNPJ do titular' : 'Número da UC geradora'}<input required value={verifier} onChange={(e) => setVerifier(e.target.value.replace(/\D/g, ''))} onBlur={() => verifierType === 'generator_uc' && setVerifier(normalizeUcNumber(verifier))} inputMode="numeric" autoComplete="off" className="rateio-control mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" /></label></div>{message && <p role="alert" className={`mt-5 rounded-2xl border p-4 ${failures >= 3 ? 'border-orange-400 bg-orange-100 font-bold' : 'border-red-200 bg-red-50 text-red-800'}`}>{message}</p>}<button disabled={loading} className="mt-6 rounded-full bg-orange-500 px-7 py-3 text-white disabled:opacity-50">{loading ? 'Consultando…' : 'Buscar projeto'}</button></form>;

  if (stage === 'confirm' && lookup) return <section className="rateio-form min-w-0 rounded-3xl border border-orange-100 bg-white p-4 shadow-lg sm:p-6 md:p-8"><h2 className="text-2xl">Confirme os dados do projeto</h2><dl className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3"><Read label="Referência" value={project.reference} /><Read label="Modalidade" value={modalityLabel(project.modality)} /><Read label="UF" value={project.state} /><Read label="Instalação" value={project.installedAt ? new Date(`${project.installedAt}T12:00:00`).toLocaleDateString('pt-BR') : null} /><Read label="Titular" value={project.holder.name} /><Read label="Documento" value={project.holder.documentMasked} /><Read label="E-mail" value={project.holder.email} /><Read label="Telefone" value={project.holder.phone} /><Read label="UC geradora" value={project.generatorUnit.ucNumber} /><Read label="Endereço" value={project.generatorUnit.address} /></dl><div className="mt-6 flex flex-wrap gap-3"><button onClick={confirmLookup} className="rounded-full bg-orange-500 px-6 py-3 text-white">Sim, são meus dados</button><button onClick={reset} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-700">Não são meus dados</button></div></section>;

  const showTotal = showErrors || units.some((unit) => (unit.basisPoints || 0) > 0) || (generator.basisPoints || 0) > 0;
  const changed = !unitsMatch(units, originalUnits) || generator.basisPoints !== originalGenerator.basisPoints;
  const totalComplete = total === TOTAL_BASIS_POINTS && !duplicate;
  const comparison = compareUnits(units, originalUnits);

  return (
    <form noValidate onSubmit={submit} className="rateio-form min-w-0 space-y-5 pb-32 sm:pb-36 md:pb-0">
      <input aria-hidden="true" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px]" name="website" />
      {message && <p role="alert" className="text-sm font-semibold text-slate-700">{message}</p>}

      <section className="min-w-0 border-b border-slate-200 bg-white px-1 pb-5">
        <h2 className="text-xl font-bold text-slate-900">Dados do projeto</h2>
        {!manual && <p className="mt-2 text-sm text-slate-500">Estes dados vieram do seu cadastro. Se algo estiver errado, fale com nossa equipe pelo WhatsApp {SUPPORT}.</p>}
        {manual ? <ManualProject project={project} showErrors={showErrors} onChange={(value) => { setFormDirty(true); setProject(value); setGenerator((current) => ({ ...current, ucNumber: value.generatorUnit.ucNumber || '', address: value.generatorUnit.address || '' })); }} /> : (
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <Read label="Referência" value={project.reference} /><Read label="Modalidade" value={modalityLabel(project.modality)} /><Read label="UF" value={project.state} />
            <Read label="Titular" value={project.holder.name} /><Read label="Documento" value={project.holder.documentMasked} /><Read label="UC geradora" value={project.generatorUnit.ucNumber} />
            <Read label="Endereço" value={project.generatorUnit.address} />
          </dl>
        )}
      </section>

      <section className="min-w-0 bg-white px-1 py-2">
        <h2 className="text-xl font-bold text-slate-900">Unidades que receberão os créditos</h2>
        <p className="mt-1 text-sm text-slate-600">Informe as unidades que vão receber os créditos e quanto cada uma recebe, somando 100%.</p>
        <p className="mt-3 text-sm text-slate-600">Todas as unidades precisam estar no nome do titular informado nos dados do projeto. Unidades em nome de outra pessoa não podem receber os créditos.</p>
        {project.state === 'GO' && <p className="mt-3 text-sm leading-6 text-slate-500">Em Goiás, toda a geração atende primeiro o consumo da unidade geradora. Os percentuais abaixo valem somente para o excedente, que é o que sobra quando a geração é maior que o consumo total da geradora. Nos meses sem excedente, não há crédito para distribuir.</p>}

        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-800">Unidade geradora — fixa</p>
          <div className="mt-2 grid gap-3 md:grid-cols-[1fr_1.6fr_180px]"><Read label="Unidade consumidora" value={generator.ucNumber} /><Read label="Endereço" value={generator.address} />
            {project.state === 'DF' ? <label data-rateio-error={showErrors && (generator.basisPoints || 0) <= 0 ? 'true' : undefined} className="text-sm font-semibold">Percentual da geração<input inputMode="decimal" aria-label="Percentual da unidade geradora" key={`generator-${generator.basisPoints}`} defaultValue={generator.basisPoints == null ? '' : formatPercent(generator.basisPoints)} onBlur={(event) => { setFormDirty(true); setGenerator((current) => ({ ...current, basisPoints: parsePercent(event.target.value) })); }} className="rateio-control mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />{showErrors && (generator.basisPoints || 0) <= 0 && <span role="alert" className="mt-1 block text-xs font-semibold text-red-700">Informe o percentual da geradora.</span>}</label> : <p className="text-sm text-slate-600">Toda a geração atende primeiro esta unidade; somente o excedente é distribuído.</p>}
          </div>
        </div>

        {hasMissingPercent && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">A distribuição ainda não está registrada no sistema. {project.state === 'GO' && units.length === 1 && units[0].locked ? 'Foi aplicada abaixo a regra de unidade beneficiária única.' : 'Informe como deseja distribuir os percentuais.'}</p>}
        {project.state === 'GO' && units.length === 1 && units[0].locked && <p className="mt-3 text-sm font-semibold text-slate-700">Com uma única unidade beneficiária, todo o excedente (100%) vai para ela. Ao adicionar outra unidade, os percentuais serão liberados.</p>}

        <div className="mt-5 rounded-2xl border-2 border-orange-300 bg-orange-50/70 p-3 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <span className="rounded-xl bg-orange-500 p-2 text-white"><Plus className="h-5 w-5" /></span>
            <div><h3 className="font-bold text-slate-900">Preencha aqui as UCs beneficiárias</h3><p className="mt-1 text-sm text-slate-600">Informe o número da UC, o endereço e o percentual destinado a cada unidade.</p></div>
          </div>
          <div className="space-y-3">
          {units.map((unit, index) => (
            <div key={unit.id} className="grid min-w-0 scroll-mt-28 gap-3 rounded-xl border border-orange-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1.6fr_180px_44px] md:items-end">
              <Field label={`UC beneficiária ${index + 1}`} inputMode="numeric" digitsOnly value={unit.ucNumber} error={showErrors && !/^\d{15}$/.test(unit.ucNumber) ? 'Informe os 15 números da unidade consumidora.' : undefined} onChange={(value) => updateUnit(unit.id, 'ucNumber', value)} onBlur={(value) => completeUnitNumber(unit.id, value)} />
              <Field label="Endereço" value={unit.address} error={showErrors && !unit.address.trim() ? 'Informe o endereço da unidade.' : undefined} onChange={(value) => updateUnit(unit.id, 'address', value)} />
              <label data-rateio-error={showErrors && (unit.basisPoints || 0) <= 0 ? 'true' : undefined} className="text-sm font-semibold">{project.state === 'GO' ? 'Excedente (%)' : 'Percentual da geração'}
                <PercentInput ariaLabel={`Percentual da unidade ${unit.ucNumber || index + 1}`} value={unit.basisPoints} onChange={(value) => updatePercent(unit.id, value)} disabled={unit.locked} />
                {showErrors && (unit.basisPoints || 0) <= 0 && <span role="alert" className="mt-1 block text-xs font-semibold text-red-700">Informe um percentual maior que zero.</span>}
              </label>
              <button aria-label="Remover unidade" type="button" onClick={() => removeUnit(unit.id)} className="justify-self-start border border-slate-300 bg-white text-slate-600 md:justify-self-auto"><Trash2 className="mx-auto h-4 w-4" /></button>
              <fieldset data-rateio-error={showErrors && unit.ownershipConfirmed !== true ? 'true' : undefined} className="md:col-span-full">
                <legend className="text-sm font-semibold text-slate-900">Você é o atual titular desta unidade consumidora?</legend>
                <div className="mt-2 flex gap-5"><label className="flex items-center gap-2"><input type="radio" name={`ownership-${unit.id}`} checked={unit.ownershipConfirmed === true} onChange={() => confirmOwnership(unit, true)} className="accent-emerald-600" />Sim</label><label className="flex items-center gap-2"><input type="radio" name={`ownership-${unit.id}`} checked={unit.ownershipConfirmed === false} onChange={() => confirmOwnership(unit, false)} className="accent-orange-500" />Não</label></div>
                {unit.ownershipConfirmed === true && <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-700"><BadgeCheck className="h-5 w-5" />Titularidade confirmada — unidade liberada para envio.</p>}
                {unit.ownershipConfirmed === false && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">Somente contas registradas no CPF ou CNPJ do titular da unidade geradora podem sofrer alteração de rateio. Corrija a unidade ou remova esta linha.</p>}
              </fieldset>
              {!manual && unit.holderName && normalizedName(unit.holderName) !== normalizedName(project.holder.name) && <p role="alert" className="text-sm font-semibold text-amber-800 md:col-span-full">Esta unidade está em nome de outra pessoa. Fale com nossa equipe pelo WhatsApp {SUPPORT}.</p>}
            </div>
          ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {changed && originalUnits.length > 0 && <button type="button" onClick={() => { setFormDirty(true); setUnits(originalUnits.map((unit) => ({ ...unit }))); setGenerator({ ...originalGenerator }); }} className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"><RotateCcw className="mr-1 inline h-4 w-4" />Voltar à distribuição atual</button>}
          {units.length > 1 && <button type="button" onClick={() => { setFormDirty(true); setUnits((current) => redistribute(current, true, project.state === 'DF' ? Math.max(0, TOTAL_BASIS_POINTS - (generator.basisPoints || 0)) : TOTAL_BASIS_POINTS)); }} className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">Dividir igualmente entre as unidades</button>}
          <button type="button" onClick={addUnit} disabled={units.length >= 20} className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:opacity-50"><Plus className="mr-1 inline h-4 w-4" />Adicionar unidade</button>
        </div>

        {showTotal && <div aria-live="polite" data-rateio-error={showErrors && (!totalComplete || !validUnits) ? 'true' : undefined} tabIndex={-1} className={`mt-4 font-bold ${totalComplete ? 'text-emerald-700' : 'text-slate-600'}`}>Total: {formatPercent(total)}% — {totalComplete ? 'soma correta' : 'a soma precisa ser 100,00%'}{duplicate && <span className="block">Há uma unidade repetida ou uma unidade geradora indevida.</span>}</div>}
        <p className="mt-3 text-sm font-semibold text-slate-700">A soma deve ser exatamente 100%. A distribuidora recusa solicitações com total diferente.</p>
      </section>

      <section className="min-w-0 border-t border-slate-200 bg-white px-1 pt-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-start gap-3"><span className="rounded-xl bg-orange-100 p-2 text-orange-600"><Sparkles className="h-5 w-5" /></span><div><h2 className="text-xl font-bold text-slate-900">Confira antes de enviar</h2><p className="mt-1 text-sm text-slate-600">Revise a distribuição final. As alterações solicitadas estão destacadas.</p></div></div>
          </div>
          <div className="space-y-3 p-4 sm:p-6">
            <ReviewRow label="Unidade geradora" ucNumber={generator.ucNumber || 'Não informada'} value={project.state === 'DF' ? `${formatPercent(generator.basisPoints || 0)}% da geração` : 'Prioridade sobre toda a geração'} status={generator.basisPoints === originalGenerator.basisPoints ? 'maintained' : 'changed'} />
            {comparison.map((unit, index) => <ReviewRow key={`${unit.id}-${unit.status}`} label="Unidade beneficiária" ucNumber={unit.ucNumber || String(index + 1)} value={`${formatPercent(unit.basisPoints || 0)}% ${project.state === 'GO' ? 'do excedente' : 'da geração'}`} status={unit.status} />)}
            <div className={`flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${totalComplete ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}><span className="flex items-center gap-2 font-semibold text-slate-800">{totalComplete && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}Total da distribuição</span><strong className={`text-xl ${totalComplete ? 'text-emerald-700' : 'text-amber-800'}`}>{formatPercent(total)}%</strong></div>
            {project.state === 'GO' && <p className="flex items-center gap-2 text-sm text-slate-600"><ArrowRight className="h-4 w-4 shrink-0 text-orange-500" />Esta distribuição se aplica somente ao excedente da geração.</p>}
          </div>
        </div>

        {fee && <div className="mt-5"><FeeAssessmentCard fee={fee} accepted={feeAccepted} showError={showErrors} onAccepted={(value) => { setFormDirty(true); setFeeAccepted(value); }} /></div>}
        <label data-rateio-error={showErrors && !consent ? 'true' : undefined} className="mt-5 flex min-h-11 cursor-pointer scroll-mt-28 items-start gap-3 font-semibold text-slate-900"><input type="checkbox" required checked={consent} onChange={(event) => { setFormDirty(true); setConsent(event.target.checked); }} className="mt-0.5 h-5 w-5 shrink-0 accent-orange-500" /><span>Autorizo o uso destes dados para enviar a solicitação à distribuidora.</span></label>
        {showErrors && !consent && <p role="alert" className="mt-1 text-sm font-semibold text-red-700">Confirme a autorização para continuar.</p>}
        {showErrors && pendingItems.length > 0 && <div role="alert" className="mt-5 border-l-2 border-slate-400 pl-4 text-sm text-slate-700"><p className="font-bold">Para enviar, confira:</p><ul className="mt-1 list-disc space-y-1 pl-5">{pendingItems.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        <div className="mt-6 hidden items-center gap-4 md:flex"><button disabled={!canSubmit || loading} className="min-h-11 rounded-full bg-orange-500 px-7 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Enviando…' : 'Enviar solicitação'}</button><button type="button" onClick={cancel} className="border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600">Cancelar</button></div>
      </section>

      <div className="rateio-mobile-actions fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.14)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[1320px] items-center gap-2"><div className={`min-w-0 flex-1 text-sm font-bold ${totalComplete ? 'text-emerald-700' : 'text-slate-600'}`}>Total: {formatPercent(total)}%</div><button type="button" onClick={cancel} className="rateio-cancel-mobile shrink-0 border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-600">Cancelar</button><button disabled={!canSubmit || loading} className="min-h-11 shrink-0 rounded-full bg-orange-500 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Enviando…' : 'Enviar'}</button></div>
      </div>
    </form>
  );
}

function Read({ label, value }: { label: string; value: string | null | undefined }) { return <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-0.5 break-words text-slate-900">{value || 'Não informado'}</dd></div>; }
function statusLabel(status: 'maintained' | 'changed' | 'new' | 'removed') { return ({ maintained: 'Mantida', changed: 'Alterada', new: 'Nova', removed: 'Removida' } as const)[status]; }
function ReviewRow({ label, ucNumber, value, status }: { label: string; ucNumber: string; value: string; status: 'maintained' | 'changed' | 'new' | 'removed' }) {
  const emphasized = status !== 'maintained';
  const tone = status === 'removed' ? 'border-red-200 bg-red-50 text-red-700' : emphasized ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-600';
  return <div className={`rounded-xl border px-4 py-3 ${tone}`}><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="text-xs font-bold uppercase tracking-wide opacity-75">{label}</span><p className={`mt-0.5 font-mono font-bold ${status === 'removed' ? 'line-through' : ''}`}>{ucNumber}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${emphasized ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>{statusLabel(status)}</span></div><p className={`mt-2 text-sm font-semibold ${status === 'removed' ? 'line-through' : ''}`}>{value}</p>{emphasized && <p className="mt-1 text-xs font-bold">Alteração solicitada</p>}</div>;
}
function Field({ label, value, onChange, onBlur, type = "text", inputMode, autoComplete, digitsOnly = false, error, hint }: { label: string; value: string; onChange: (value: string) => void; onBlur?: (value: string) => void; type?: React.HTMLInputTypeAttribute; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; autoComplete?: string; digitsOnly?: boolean; error?: string; hint?: string }) { return <label data-rateio-error={error ? "true" : undefined} className="min-w-0 text-sm font-semibold">{label}<input type={type} inputMode={inputMode} autoComplete={autoComplete} value={value} onChange={(e) => onChange(digitsOnly ? e.target.value.replace(/\D/g, "") : e.target.value)} onBlur={(e) => onBlur?.(e.target.value)} className="rateio-control mt-1 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2" />{hint && !error && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}{error && <span role="alert" className="mt-1 block text-xs font-semibold text-red-700">{error}</span>}</label>; }
function PercentInput({ ariaLabel, value, onChange, disabled }: { ariaLabel: string; value: number | null; onChange: (value: string) => void; disabled?: boolean }) {
  const plain = value == null ? '' : (value / 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const [display, setDisplay] = useState(plain ? `${plain}%` : '');
  const preserveTypedFormatting = useRef(false);
  useEffect(() => { if (preserveTypedFormatting.current) preserveTypedFormatting.current = false; else setDisplay(plain ? `${plain}%` : ''); }, [plain]);
  return <input inputMode="decimal" aria-label={ariaLabel} value={display} onFocus={() => setDisplay((current) => current.replace(/\s*%$/, ''))} onChange={(event) => setDisplay(event.target.value)} onBlur={() => { const raw = display.replace(/\s*%$/, '').trim(); preserveTypedFormatting.current = true; onChange(raw); setDisplay(parsePercent(raw) == null ? raw : `${raw.replace('.', ',')}%`); }} disabled={disabled} className="rateio-control mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100" />;
}
function modalityLabel(value: Modality | null) { return ({ leasing: 'Leasing', sale: 'Venda', monitoring: 'Monitoramento', buyout: 'Compra definitiva' } as Record<string, string>)[value || ''] || 'Não informada'; }
function ManualProject({ project, onChange, showErrors }: { project: Project; onChange: (project: Project) => void; showErrors: boolean }) {
  const set = (path: string, value: string) => { const next = structuredClone(project); const [group, field] = path.split('.'); if (field) (next[group as 'holder' | 'generatorUnit'] as unknown as Record<string, string | null>)[field] = value; else (next as unknown as Record<string, string | null>)[group] = value; onChange(next); };
  return <div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Referência" value={project.reference} error={showErrors && !project.reference.trim() ? 'Informe a referência.' : undefined} onChange={(v) => set('reference', v)} /><label className="font-semibold">Modalidade<select value={project.modality || ''} onChange={(e) => set('modality', e.target.value)} className="rateio-control mt-1 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2"><option value="leasing">Leasing</option><option value="sale">Venda</option><option value="monitoring">Monitoramento</option><option value="buyout">Compra definitiva</option></select></label><Field label="UF" value={project.state || ''} error={showErrors && !project.state?.trim() ? 'Informe a UF.' : undefined} onChange={(v) => set('state', v.toUpperCase().slice(0, 2))} /><label className="font-semibold">Data de instalação (opcional)<input type="date" value={project.installedAt || ''} onChange={(e) => set('installedAt', e.target.value)} className="rateio-control mt-1 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2" /></label><Field label="CPF ou CNPJ" inputMode="numeric" digitsOnly value={project.holder.documentMasked || ''} error={showErrors && !project.holder.documentMasked?.trim() ? 'Informe o CPF ou CNPJ.' : undefined} onChange={(v) => set('holder.documentMasked', v)} /><Field label="E-mail" type="email" inputMode="email" autoComplete="email" value={project.holder.email || ''} error={showErrors && !project.holder.email?.trim() ? 'Informe o e-mail.' : undefined} onChange={(v) => set('holder.email', v)} /><Field label="Telefone" type="tel" inputMode="tel" autoComplete="tel" value={project.holder.phone || ''} error={showErrors && !project.holder.phone?.trim() ? 'Informe o telefone.' : undefined} onChange={(v) => set('holder.phone', v)} /><Field label="UC geradora" inputMode="numeric" digitsOnly value={project.generatorUnit.ucNumber || ''} error={showErrors && !project.generatorUnit.ucNumber?.trim() ? 'Informe a UC geradora.' : undefined} onChange={(v) => set('generatorUnit.ucNumber', v.replace(/\D/g, '').slice(0, 15))} onBlur={(v) => set('generatorUnit.ucNumber', normalizeUcNumber(v))} /><Field label="Endereço da geradora" value={project.generatorUnit.address || ''} error={showErrors && !project.generatorUnit.address?.trim() ? 'Informe o endereço da geradora.' : undefined} onChange={(v) => set('generatorUnit.address', v)} /></div>;
}
