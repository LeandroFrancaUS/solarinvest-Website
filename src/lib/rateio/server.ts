import 'server-only';
import type { Project } from './types';

const APP_URL = process.env.SOLARINVEST_APP_URL || 'https://app.solarinvest.info';
export const LOOKUP_TIMEOUT_MS = 8_000;
export const SUBMIT_TIMEOUT_MS = 12_000;

type StoredLookup = { project: Project; expiresAt: number };
const lookupStore = new Map<string, StoredLookup>();

export function rememberLookup(token: string, project: Project) {
  const now = Date.now();
  for (const [key, entry] of lookupStore) if (entry.expiresAt <= now) lookupStore.delete(key);
  lookupStore.set(token, { project: structuredClone(project), expiresAt: now + 30 * 60_000 });
}

export function getRememberedLookup(token: string) {
  const entry = lookupStore.get(token);
  if (!entry || entry.expiresAt <= Date.now()) {
    lookupStore.delete(token);
    return null;
  }
  return structuredClone(entry.project);
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
  } catch {
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
