import 'server-only';
import { LOOKUP_SEAL_TTL_MS, openLookupSnapshot, sealLookupSnapshot } from './lookupSeal';
import type { Project } from './types';

const APP_URL = process.env.SOLARINVEST_APP_URL || 'https://app.solarinvest.info';
export const LOOKUP_TIMEOUT_MS = 8_000;
export const SUBMIT_TIMEOUT_MS = 12_000;

// O retrato do lookup vive em DOIS lugares, e a ordem entre eles importa.
//
// O `Map` abaixo é uma conveniência de processo quente: quando o submit cai na
// mesma instância do lookup, ele responde sem trabalho nenhum. O que NÃO se
// pode fazer é depender dele. Cada rota do App Router é uma serverless function
// própria, e mesmo dentro de uma delas a Vercel serve requisições concorrentes
// em instâncias distintas — o Map do lookup simplesmente não existe no submit,
// e o formulário morria com LOOKUP_EXPIRED depois de um lookup bem-sucedido.
//
// Quem garante a correção é o lacre (`lookupSeal.ts`): cifrado, autenticado,
// preso ao `lookupToken` e devolvido pelo próprio navegador. Ele não depende de
// instância nenhuma. O Map ficou como atalho e como rede para o caso de não
// haver segredo configurado.
type StoredLookup = { project: Project; expiresAt: number };
const lookupStore = new Map<string, StoredLookup>();

/**
 * Guarda o retrato no processo e devolve o lacre que o navegador deve reenviar.
 *
 * O lacre é null quando não há segredo configurado; nesse caso só resta o Map,
 * que é o comportamento anterior.
 */
export function rememberLookup(token: string, project: Project) {
  const now = Date.now();
  for (const [key, entry] of lookupStore) if (entry.expiresAt <= now) lookupStore.delete(key);
  // A janela é a mesma do token assinado pelo app (uma hora). Enquanto foram
  // trinta minutos, o site expirava sozinho um lookup que o app ainda aceitava.
  lookupStore.set(token, { project: structuredClone(project), expiresAt: now + LOOKUP_SEAL_TTL_MS });
  return sealLookupSnapshot({ token, project, now });
}

export function getRememberedLookup(token: string) {
  const entry = lookupStore.get(token);
  if (!entry || entry.expiresAt <= Date.now()) {
    lookupStore.delete(token);
    return null;
  }
  return structuredClone(entry.project);
}

/**
 * O retrato confirmado no lookup, venha ele de onde vier.
 *
 * O lacre vem antes do Map de propósito: ele é a fonte que vale em qualquer
 * instância, e conferi-lo primeiro faz o caminho correto ser o caminho normal —
 * um bug no lacre aparece em desenvolvimento, em vez de ficar escondido atrás
 * de um processo quente e só surgir em produção.
 */
export function resolveLookupSnapshot(token: string, seal: unknown) {
  return openLookupSnapshot({ token, seal }) ?? getRememberedLookup(token);
}

export async function callRateioApp(path: string, body: unknown, timeout: number, visitorIp?: string) {
  const apiKey = process.env.SITE_PUBLIC_API_KEY;
  if (!apiKey) return { unavailable: true as const, status: 503, data: null, headers: new Headers() };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(`${APP_URL}${path}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-site-api-key': apiKey,
        ...(visitorIp ? { 'x-forwarded-for': visitorIp } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: controller.signal,
    });
    let data: unknown = null;
    try { data = await response.json(); } catch { /* invalid upstream response */ }
    return { unavailable: response.status === 401 || response.status === 404 || response.status >= 500, status: response.status, data, headers: response.headers };
  } catch (error) {
    console.error(`Falha ao chamar SolarInvest App em ${path}`, error);
    return { unavailable: true as const, status: 503, data: null, headers: new Headers() };
  } finally {
    clearTimeout(timer);
  }
}

export function visitorIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

const attempts = new Map<string, number[]>();
export function limited(key: string, maximum: number) {
  const now = Date.now();
  const active = (attempts.get(key) || []).filter((time) => now - time < 10 * 60_000);
  if (active.length >= maximum) return true;
  active.push(now);
  attempts.set(key, active);
  return false;
}
