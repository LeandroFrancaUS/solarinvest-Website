import type { FeeAssessment, Project, RequestType } from './types';

type AnyRecord = Record<string, unknown>;

export type RateioClassification = 'adhesion' | 'update';

export function classifyRateio(project: Pick<Project, 'shareUnits'>): RateioClassification {
  return project.shareUnits?.some((unit) => unit.percent != null) ? 'update' : 'adhesion';
}

export type RateioEmailInput = {
  protocol: string;
  manual: boolean;
  project: Project;
  requestType: RequestType;
  payload: AnyRecord;
  feeAssessment?: FeeAssessment | null;
  feeAccepted?: boolean;
  submittedAt: Date;
  ip: string;
  userAgent: string;
  classification?: RateioClassification;
};

export function escapeEmailHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]!));
}

const record = (value: unknown): AnyRecord => value && typeof value === 'object' ? value as AnyRecord : {};
const array = (value: unknown): AnyRecord[] => Array.isArray(value) ? value.map(record) : [];
const value = (input: unknown, fallback = 'Não informado') => String(input ?? '').trim() || fallback;
const percent = (input: unknown) => Number(input || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
const pointsPercent = (input: unknown) => percent(Number(input || 0) / 100);
const dateTime = (date: Date) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'medium' }).format(date);

function row(label: string, content: string) {
  return `<tr><td style="padding:5px 12px 5px 0;color:#64748b;vertical-align:top;width:145px"><strong>${label}</strong></td><td style="padding:5px 0;color:#0f172a">${content}</td></tr>`;
}

function originalPercent(unit: AnyRecord, originals: AnyRecord[]) {
  const original = originals.find((candidate) => value(candidate.ucNumber, '') === value(unit.ucNumber, ''));
  return original?.percent;
}

export function buildRateioEmail(input: RateioEmailInput) {
  const { project, payload } = input;
  const comparison = record(payload.comparison);
  const beneficiaries = array(comparison.beneficiaries);
  const originals = array(payload.originalShareUnits);
  const shareUnits = array(payload.shareUnits);
  const classification = input.classification ?? classifyRateio(project);
  const classificationLabel = classification === 'adhesion' ? 'Adesão de rateio' : 'Atualização de rateio';
  const when = dateTime(input.submittedAt);
  const rows: Array<{ uc: string; address: string; allocation: string; status: string; removed: boolean }> = [];

  for (const unit of beneficiaries) {
    const status = value(unit.status, 'maintained');
    const from = originalPercent(unit, originals);
    const removed = status === 'removed';
    const allocation = removed ? `<s>${percent(from)}</s>` : pointsPercent(unit.basisPoints);
    rows.push({ uc: value(unit.ucNumber), address: value(unit.address), allocation, status: status === 'new' ? 'Adicionar' : removed ? 'Remover' : '', removed });
  }
  // Older/manual clients may not send a comparison block.
  if (!beneficiaries.length) for (const unit of shareUnits.filter((unit) => project.state !== 'DF' || value(unit.ucNumber, '') !== value(project.generatorUnit.ucNumber, ''))) {
    rows.push({ uc: value(unit.ucNumber), address: value(unit.address), allocation: percent(unit.percent), status: '', removed: false });
  }
  // O payload final já não contém as removidas e, no DF, contém também a
  // parcela da geradora: ele é a fonte correta para o total final do rateio.
  const total = shareUnits.reduce((sum, unit) => sum + Number(unit.percent ?? 0), 0);
  const observations = value(payload.observations, '');
  const ownershipInconsistencies = Array.isArray(payload.ownershipInconsistencies) ? payload.ownershipInconsistencies.map((uc) => value(uc, '')).filter(Boolean) : [];
  const consent = payload.consent === true ? 'Sim, o cliente autorizou o uso dos dados.' : 'Não consta autorização do uso dos dados.';
  const tableRows = rows.map((item) => `<tr style="${item.removed ? 'text-decoration:line-through;color:#991b1b;background:#fef2f2' : ''}"><td style="padding:9px;border:1px solid #cbd5e1">${escapeEmailHtml(item.uc)}</td><td style="padding:9px;border:1px solid #cbd5e1">${escapeEmailHtml(item.address)}</td><td style="padding:9px;border:1px solid #cbd5e1;white-space:nowrap">${item.allocation}</td><td style="padding:9px;border:1px solid #cbd5e1"><strong>${item.status}</strong></td></tr>`).join('');
  const html = `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9"><tr><td align="center" style="padding:24px 10px"><table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#ffffff;border-collapse:collapse"><tr><td style="padding:28px">
  <p style="margin:0;color:#ea580c;font-size:13px;font-weight:bold;text-transform:uppercase">Solicitação de alteração de rateio</p><h1 style="margin:6px 0 14px;font-size:26px">Protocolo ${escapeEmailHtml(input.protocol)}</h1>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${row('Solicitada em', escapeEmailHtml(when))}${row('Projeto', escapeEmailHtml(project.reference))}${row('UF', escapeEmailHtml(project.state))}</table>
  <p style="margin:18px 0;padding:12px;background:#fff7ed;border-left:4px solid #f97316;font-size:17px"><strong>${classificationLabel}</strong></p>
  <h2 style="font-size:18px;margin:24px 0 8px">Dados do titular</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${row('Nome', escapeEmailHtml(project.holder.name))}${row('Documento', escapeEmailHtml(project.holder.documentMasked))}${row('E-mail', `<a href="mailto:${escapeEmailHtml(project.holder.email)}">${escapeEmailHtml(project.holder.email)}</a>`)}${row('Telefone', `<a href="tel:${escapeEmailHtml(project.holder.phone)}">${escapeEmailHtml(project.holder.phone)}</a>`)}</table>
  <h2 style="font-size:18px;margin:24px 0 8px">Unidade geradora</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${row('Unidade consumidora', escapeEmailHtml(project.generatorUnit.ucNumber))}${row('Endereço', escapeEmailHtml(project.generatorUnit.address))}</table>
  <h2 style="font-size:18px;margin:24px 0 8px">Rateio solicitado</h2><table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px"><thead><tr style="background:#e2e8f0"><th align="left" style="padding:9px;border:1px solid #cbd5e1">Unidade consumidora</th><th align="left" style="padding:9px;border:1px solid #cbd5e1">Endereço</th><th align="left" style="padding:9px;border:1px solid #cbd5e1">Percentual</th><th align="left" style="padding:9px;border:1px solid #cbd5e1">Situação</th></tr></thead><tbody>${tableRows}<tr style="background:#f8fafc;font-weight:bold"><td colspan="2" align="right" style="padding:10px;border:1px solid #cbd5e1">Total</td><td style="padding:10px;border:1px solid #cbd5e1">${percent(total)}</td><td style="padding:10px;border:1px solid #cbd5e1"></td></tr></tbody></table>
  ${project.state === 'GO' ? '<p style="padding:10px;background:#eff6ff;color:#1e3a8a"><strong>Goiás:</strong> os percentuais referem-se apenas ao excedente; a unidade geradora consome primeiro a própria geração.</p>' : ''}
  ${ownershipInconsistencies.length ? `<h2 style="font-size:18px;margin:24px 0 8px;color:#b45309">Alerta de inconsistência cadastral</h2><p>O cliente respondeu “não” para a titularidade de unidade(s) importada(s): ${escapeEmailHtml(ownershipInconsistencies.join(', '))}. A linha foi corrigida ou removida antes do envio.</p>` : ''}${observations ? `<h2 style="font-size:18px;margin:24px 0 8px">Observações do cliente</h2><p style="white-space:pre-wrap">${escapeEmailHtml(observations)}</p>` : ''}<p><strong>Autorização:</strong> ${escapeEmailHtml(consent)}</p>
  </td></tr></table></td></tr></table></body></html>`;

  const textRows = rows.map((item) => `- ${item.uc} | ${item.address} | ${item.allocation.replace(/<[^>]+>/g, '')} | ${item.status}`).join('\n');
  const text = `SOLICITAÇÃO DE ALTERAÇÃO DE RATEIO
Protocolo: ${input.protocol}
Data e hora: ${when}
Projeto: ${project.reference}
UF: ${value(project.state)}
${classificationLabel}

DADOS DO TITULAR
Nome: ${value(project.holder.name)}
Documento: ${value(project.holder.documentMasked)}
E-mail: ${value(project.holder.email)}
Telefone: ${value(project.holder.phone)}

UNIDADE GERADORA
UC: ${value(project.generatorUnit.ucNumber)}
Endereço: ${value(project.generatorUnit.address)}

RATEIO SOLICITADO
${textRows}
Total: ${percent(total)}
${project.state === 'GO' ? '\nGoiás: os percentuais referem-se apenas ao excedente; a geradora consome primeiro a própria geração.\n' : ''}${ownershipInconsistencies.length ? `\nALERTA DE INCONSISTÊNCIA CADASTRAL\nO cliente negou a titularidade das unidades importadas: ${ownershipInconsistencies.join(', ')}. A linha foi corrigida ou removida antes do envio.\n` : ''}${observations ? `\nOBSERVAÇÕES DO CLIENTE\n${observations}\n` : ''}
Autorização: ${consent}`;
  return { subject: `${classificationLabel} — ${project.reference} — ${value(project.holder.name)}`, html, text };
}
