import type { FeeAssessment, Project, RequestType } from './types';

type AnyRecord = Record<string, unknown>;

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
};

const requestLabels: Record<RequestType, string> = {
  inclusion: 'Inclusão de unidade beneficiária',
  exclusion: 'Exclusão de unidade beneficiária',
  redistribution: 'Redistribuição de percentuais',
};
const statusLabels: Record<string, string> = { maintained: 'Mantida', changed: 'Alterada', new: 'Incluída', removed: 'Removida' };
const modalityLabels: Record<string, string> = { leasing: 'Locação', sale: 'Venda', monitoring: 'Monitoramento', buyout: 'Aquisição' };

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
const money = (cents: unknown) => (Number(cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dateTime = (date: Date) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'medium' }).format(date);
const dateOnly = (input: string) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).format(new Date(input));

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
  const generatorComparison = record(comparison.generator);
  const requested = requestLabels[input.requestType];
  const when = dateTime(input.submittedAt);
  const rows: Array<{ uc: string; address: string; allocation: string; status: string; removed: boolean }> = [];

  if (project.state === 'DF') {
    const generatorShare = shareUnits.find((unit) => value(unit.ucNumber, '') === value(project.generatorUnit.ucNumber, ''));
    const now = generatorComparison.basisPoints == null ? generatorShare?.percent : Number(generatorComparison.basisPoints) / 100;
    const before = project.generatorUnit.percent ?? originals.find((unit) => value(unit.ucNumber, '') === value(project.generatorUnit.ucNumber, ''))?.percent;
    const changed = generatorComparison.status === 'changed';
    rows.push({ uc: value(project.generatorUnit.ucNumber), address: value(project.generatorUnit.address), allocation: changed ? `${percent(before)} → <strong>${percent(now)}</strong>` : percent(now), status: changed ? 'Alterada' : 'Mantida', removed: false });
  }
  for (const unit of beneficiaries) {
    const status = value(unit.status, 'maintained');
    const from = originalPercent(unit, originals);
    const allocation = status === 'changed' ? `${percent(from)} → <strong>${pointsPercent(unit.basisPoints)}</strong>` : pointsPercent(unit.basisPoints);
    rows.push({ uc: value(unit.ucNumber), address: value(unit.address), allocation, status: statusLabels[status] || value(status), removed: status === 'removed' });
  }
  // Older/manual clients may not send a comparison block.
  if (!beneficiaries.length) for (const unit of shareUnits.filter((unit) => project.state !== 'DF' || value(unit.ucNumber, '') !== value(project.generatorUnit.ucNumber, ''))) {
    rows.push({ uc: value(unit.ucNumber), address: value(unit.address), allocation: percent(unit.percent), status: 'A conferir', removed: false });
  }
  const total = rows.filter((item) => !item.removed).reduce((sum, item) => {
    const unit = shareUnits.find((candidate) => value(candidate.ucNumber, '') === item.uc);
    return sum + Number(unit?.percent ?? 0);
  }, 0);
  const closes = Math.abs(total - 100) < 0.005;
  const edited = beneficiaries.filter((unit) => unit.status !== 'maintained').map((unit) => `${statusLabels[value(unit.status, '')] || unit.status}: unidade ${value(unit.ucNumber)}`);
  if (generatorComparison.status === 'changed') edited.unshift('Percentual da unidade geradora');
  const fee = input.feeAssessment;
  const feeText = fee?.status === 'exempt' ? 'Solicitação isenta de taxa.' : fee?.status === 'chargeable'
    ? `Solicitação com taxa de ${money(fee.amountCents)}. Cliente ${input.feeAccepted ? 'confirmou' : 'não confirmou'} ciência da cobrança.`
    : 'Taxa ainda não determinada; confirmar durante a triagem.';
  const nextFree = fee?.nextFreeAt ? ` Próxima solicitação gratuita a partir de ${dateOnly(fee.nextFreeAt)}.` : '';
  const observations = value(payload.observations, '');
  const consent = payload.consent === true ? 'Sim, o cliente autorizou o uso dos dados.' : 'Não consta autorização do uso dos dados.';
  const manualAlert = input.manual ? `<div style="margin:0 0 20px;padding:14px;border:2px solid #d97706;background:#fffbeb;color:#92400e"><strong>ATENÇÃO: SOLICITAÇÃO MANUAL, SEM CONFIRMAÇÃO AUTOMÁTICA.</strong><br>Confira todos os dados antes de executar a alteração.</div>` : '';
  const tableRows = rows.map((item) => `<tr style="${item.removed ? 'text-decoration:line-through;color:#991b1b;background:#fef2f2' : ''}"><td style="padding:9px;border:1px solid #cbd5e1">${escapeEmailHtml(item.uc)}</td><td style="padding:9px;border:1px solid #cbd5e1">${escapeEmailHtml(item.address)}</td><td style="padding:9px;border:1px solid #cbd5e1;white-space:nowrap">${item.allocation}</td><td style="padding:9px;border:1px solid #cbd5e1"><strong>${item.status}</strong></td></tr>`).join('');
  const html = `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9"><tr><td align="center" style="padding:24px 10px"><table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#ffffff;border-collapse:collapse"><tr><td style="padding:28px">${manualAlert}
  <p style="margin:0;color:#ea580c;font-size:13px;font-weight:bold;text-transform:uppercase">Solicitação de alteração de rateio</p><h1 style="margin:6px 0 14px;font-size:26px">Protocolo ${escapeEmailHtml(input.protocol)}</h1>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${row('Solicitada em', escapeEmailHtml(when))}${row('Projeto', escapeEmailHtml(project.reference))}${row('Modalidade', escapeEmailHtml(modalityLabels[value(project.modality, '')] || value(project.modality)))}${row('UF', escapeEmailHtml(project.state))}</table>
  <p style="margin:18px 0;padding:12px;background:#fff7ed;border-left:4px solid #f97316;font-size:17px"><strong>Pedido:</strong> ${requested}</p>
  <h2 style="font-size:18px;margin:24px 0 8px">Dados do titular</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${row('Nome', escapeEmailHtml(project.holder.name))}${row('Documento', escapeEmailHtml(project.holder.documentMasked))}${row('E-mail', `<a href="mailto:${escapeEmailHtml(project.holder.email)}">${escapeEmailHtml(project.holder.email)}</a>`)}${row('Telefone', `<a href="tel:${escapeEmailHtml(project.holder.phone)}">${escapeEmailHtml(project.holder.phone)}</a>`)}</table>
  <h2 style="font-size:18px;margin:24px 0 8px">Unidade geradora <span style="font-size:12px;color:#475569;background:#e2e8f0;padding:4px 7px">FIXA — NÃO ALTERAR</span></h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${row('Unidade consumidora', escapeEmailHtml(project.generatorUnit.ucNumber))}${row('Endereço', escapeEmailHtml(project.generatorUnit.address))}</table>
  <h2 style="font-size:18px;margin:24px 0 8px">Rateio solicitado</h2><table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px"><thead><tr style="background:#e2e8f0"><th align="left" style="padding:9px;border:1px solid #cbd5e1">Unidade consumidora</th><th align="left" style="padding:9px;border:1px solid #cbd5e1">Endereço</th><th align="left" style="padding:9px;border:1px solid #cbd5e1">Percentual</th><th align="left" style="padding:9px;border:1px solid #cbd5e1">Situação</th></tr></thead><tbody>${tableRows}<tr style="background:#f8fafc;font-weight:bold"><td colspan="2" align="right" style="padding:10px;border:1px solid #cbd5e1">Total</td><td style="padding:10px;border:1px solid #cbd5e1">${percent(total)}</td><td style="padding:10px;border:1px solid #cbd5e1;color:${closes ? '#166534' : '#991b1b'}">${closes ? 'Confirmado: fecha 100%' : 'ATENÇÃO: não fecha 100%'}</td></tr></tbody></table>
  ${project.state === 'GO' ? '<p style="padding:10px;background:#eff6ff;color:#1e3a8a"><strong>Goiás:</strong> os percentuais referem-se apenas ao excedente; a unidade geradora consome primeiro a própria geração.</p>' : ''}
  <h2 style="font-size:18px;margin:24px 0 8px">Cobrança</h2><p>${escapeEmailHtml(feeText + nextFree)}</p>
  ${observations ? `<h2 style="font-size:18px;margin:24px 0 8px">Observações do cliente</h2><p style="white-space:pre-wrap">${escapeEmailHtml(observations)}</p>` : ''}<p><strong>Autorização:</strong> ${escapeEmailHtml(consent)}</p>
  <div style="margin-top:28px;padding-top:14px;border-top:1px solid #cbd5e1;color:#64748b;font-size:11px;line-height:1.5"><strong>Rastreabilidade</strong><br>Data e hora: ${escapeEmailHtml(when)}<br>Endereço de origem: ${escapeEmailHtml(input.ip)}<br>Navegador: ${escapeEmailHtml(input.userAgent)}<br>Origem: ${input.manual ? '<strong style="color:#92400e">caminho manual, sem confirmação automática</strong>' : 'confirmação automática do sistema'}<br>Campos editados: ${escapeEmailHtml(edited.length ? edited.join('; ') : 'nenhum')}</div>
  </td></tr></table></td></tr></table></body></html>`;

  const textRows = rows.map((item) => `- ${item.uc} | ${item.address} | ${item.allocation.replace(/<[^>]+>/g, '')} | ${item.status}`).join('\n');
  const text = `${input.manual ? 'ATENÇÃO: SOLICITAÇÃO MANUAL, SEM CONFIRMAÇÃO AUTOMÁTICA.\n\n' : ''}SOLICITAÇÃO DE ALTERAÇÃO DE RATEIO\nProtocolo: ${input.protocol}\nSolicitada em: ${when}\nProjeto: ${project.reference}\nModalidade: ${modalityLabels[value(project.modality, '')] || value(project.modality)}\nUF: ${value(project.state)}\nPedido: ${requested}\n\nDADOS DO TITULAR\nNome: ${value(project.holder.name)}\nDocumento: ${value(project.holder.documentMasked)}\nE-mail: ${value(project.holder.email)}\nTelefone: ${value(project.holder.phone)}\n\nUNIDADE GERADORA (FIXA — NÃO ALTERAR)\nUC: ${value(project.generatorUnit.ucNumber)}\nEndereço: ${value(project.generatorUnit.address)}\n\nRATEIO SOLICITADO\n${textRows}\nTOTAL: ${percent(total)} — ${closes ? 'Confirmado: fecha 100%' : 'ATENÇÃO: não fecha 100%'}\n${project.state === 'GO' ? '\nGoiás: os percentuais referem-se apenas ao excedente; a geradora consome primeiro a própria geração.\n' : ''}\nCOBRANÇA\n${feeText}${nextFree}\n${observations ? `\nOBSERVAÇÕES DO CLIENTE\n${observations}\n` : ''}\nAutorização: ${consent}\n\nRASTREABILIDADE\nData e hora: ${when}\nEndereço de origem: ${input.ip}\nNavegador: ${input.userAgent}\nOrigem: ${input.manual ? 'caminho manual, sem confirmação automática' : 'confirmação automática do sistema'}\nCampos editados: ${edited.length ? edited.join('; ') : 'nenhum'}`;
  return { subject: `${requested} — ${project.reference} — ${value(project.holder.name)}`, html, text };
}
