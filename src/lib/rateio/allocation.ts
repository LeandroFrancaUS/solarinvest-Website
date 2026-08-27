import type { EditableUnit } from './types';

export const TOTAL_BASIS_POINTS = 10_000;

export function parsePercent(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d{1,3}(?:\.\d{0,2})?$/.test(normalized)) return null;
  const [whole, decimal = ''] = normalized.split('.');
  const result = Number(whole) * 100 + Number(decimal.padEnd(2, '0'));
  return result <= TOTAL_BASIS_POINTS ? result : null;
}

export function formatPercent(points: number): string {
  return (points / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function redistribute(units: EditableUnit[], unlockAll = false): EditableUnit[] {
  if (!units.length) return [];
  const prepared = units.map((unit) => unlockAll ? { ...unit, locked: false } : { ...unit });
  const lockedTotal = prepared.reduce((sum, unit) => sum + (unit.locked ? unit.basisPoints : 0), 0);
  const unlocked = prepared.filter((unit) => !unit.locked);
  if (!unlocked.length) return prepared;
  const remaining = Math.max(0, TOTAL_BASIS_POINTS - lockedTotal);
  const base = Math.floor(remaining / unlocked.length);
  let remainder = remaining % unlocked.length;
  return prepared.map((unit) => unit.locked ? unit : {
    ...unit,
    basisPoints: base + (remainder-- > 0 ? 1 : 0),
  });
}

export function hasDuplicateUcs(units: EditableUnit[], generatorUc?: string | null, state?: string | null): boolean {
  const seen = new Set<string>();
  for (const unit of units) {
    const uc = unit.ucNumber.replace(/\D/g, '');
    if (!uc) continue;
    if (seen.has(uc) || (state === 'GO' && uc === generatorUc)) return true;
    seen.add(uc);
  }
  return false;
}
