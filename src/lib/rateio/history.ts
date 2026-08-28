import type { RateioEmailInput } from './email';
import { classifyRateio } from './email';

const statusLabels: Record<string, string> = { maintained: 'Mantida', changed: 'Alterada', new: 'Incluída', removed: 'Removida' };
const requestLabels: Record<string, string> = { inclusion: 'Inclusão', exclusion: 'Exclusão', redistribution: 'Redistribuição' };
const value = (input: unknown, fallback = 'Não informado') => String(input ?? '').trim() || fallback;
const percent = (input: unknown) => `${(Number(input || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
const money = (input: unknown) => (Number(input || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Documento humano que a API do app salva pelo fluxo normal de anexos do projeto. */
export function buildRateioHistoryAttachment(input: RateioEmailInput) {
  const comparison = input.payload.comparison && typeof input.payload.comparison === 'object' ? input.payload.comparison as Record<string, unknown> : {};
  const units = Array.isArray(comparison.beneficiaries) ? comparison.beneficiaries as Array<Record<string, unknown>> : [];
  const originals = Array.isArray(input.payload.originalShareUnits) ? input.payload.originalShareUnits as Array<Record<string, unknown>> : [];
  const classification = input.classification ?? classifyRateio(input.project);
  const fee = input.feeAssessment;
  const feeDescription = fee?.status === 'exempt' ? 'Isenta' : fee?.status === 'chargeable'
    ? `${money(fee.amountCents)} — ciência do cliente: ${input.feeAccepted ? 'sim' : 'não'}` : 'A determinar';
  const comparisons = units.map((unit) => {
    const previous = originals.find((item) => value(item.ucNumber, '') === value(unit.ucNumber, ''));
    const before = previous?.percent == null ? 'não participava' : `${Number(previous.percent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%`;
    const after = unit.status === 'removed' ? 'removida' : percent(unit.basisPoints);
    return `- ${statusLabels[value(unit.status, '')] || value(unit.status)} — UC ${value(unit.ucNumber)} — ${value(unit.address)} — anterior: ${before} — solicitado: ${after}`;
  });
  const content = `REGISTRO INTERNO — SOLICITAÇÃO DE RATEIO\n\nProtocolo: ${input.protocol}\nProjeto: ${input.project.reference}\nClassificação: ${classification === 'adhesion' ? 'Adesão de rateio' : 'Atualização de rateio'}\nTipo informado no site (apoio): ${requestLabels[input.requestType]}\nData e hora: ${input.submittedAt.toISOString()}\n\nSITUAÇÃO DE COBRANÇA\n${feeDescription}${fee?.nextFreeAt ? `\nPróxima solicitação gratuita: ${fee.nextFreeAt}` : ''}\n\nCOMPARATIVO COMPLETO\n${comparisons.length ? comparisons.join('\n') : 'Comparativo não fornecido pelo fluxo manual.'}\n\nRASTREABILIDADE\nEndereço de origem: ${input.ip}\nUser agent: ${input.userAgent}\nOrigem: ${input.manual ? 'Fluxo manual' : 'Consulta autenticada'}\n`;
  return { filename: `solicitacao-rateio-${input.protocol}.txt`, contentType: 'text/plain; charset=utf-8', content, activityDescription: `Solicitação de rateio recebida — protocolo ${input.protocol}` };
}
