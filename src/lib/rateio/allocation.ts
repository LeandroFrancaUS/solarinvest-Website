import type { ComparedUnit, EditableUnit, GeneratorAllocation, Project } from './types';

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

export function redistribute(units: EditableUnit[], unlockAll = false, targetTotal = TOTAL_BASIS_POINTS): EditableUnit[] {
  if (!units.length) return [];
  const prepared = units.map((unit) => unlockAll ? { ...unit, locked: false } : { ...unit });
  const lockedTotal = prepared.reduce((sum, unit) => sum + (unit.locked ? unit.basisPoints || 0 : 0), 0);
  const unlocked = prepared.filter((unit) => !unit.locked);
  if (!unlocked.length) return prepared;
  const remaining = Math.max(0, targetTotal - lockedTotal);
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

export function initializeAllocation(project: Project, makeId: () => string): { generator: GeneratorAllocation; units: EditableUnit[]; hasMissingPercent: boolean } {
  const generatorShare = project.state === 'DF' ? project.shareUnits.find((unit) => unit.ucNumber && unit.ucNumber === project.generatorUnit.ucNumber) : undefined;
  const generator = {
    ucNumber: project.generatorUnit.ucNumber || '',
    address: project.generatorUnit.address || generatorShare?.address || '',
    basisPoints: project.state === 'DF' && (project.generatorUnit.percent ?? generatorShare?.percent) != null ? Math.round((project.generatorUnit.percent ?? generatorShare?.percent)! * 100) : null,
  };
  let units: EditableUnit[] = project.shareUnits
    .filter((unit) => !(project.state === 'DF' && unit.ucNumber && unit.ucNumber === project.generatorUnit.ucNumber))
    .map((unit) => ({
      id: makeId(), ucNumber: unit.ucNumber || '', holderName: unit.holderName || '', address: unit.address || '',
      basisPoints: unit.percent == null ? null : Math.round(unit.percent * 100), locked: false, origin: 'current' as const, ownershipConfirmed: null,
    }));
  const hasMissingPercent = (project.state === 'DF' && generator.basisPoints == null) || units.some((unit) => unit.basisPoints == null);
  if (!units.length) units = [{ id: makeId(), ucNumber: '', holderName: '', address: '', basisPoints: null, locked: false, origin: 'new', ownershipConfirmed: null }];
  if (project.state === 'GO' && units.length === 1 && units[0].origin === 'current') units = [{ ...units[0], basisPoints: TOTAL_BASIS_POINTS, locked: true }];
  return { generator, units, hasMissingPercent };
}

export function compareUnits(units: EditableUnit[], original: EditableUnit[]): ComparedUnit[] {
  const liveById = new Map(units.map((unit) => [unit.id, unit]));
  const originalById = new Map(original.map((unit) => [unit.id, unit]));
  const result: ComparedUnit[] = units.map((unit) => {
    const old = originalById.get(unit.id);
    const status = !old ? 'new' : unit.ucNumber === old.ucNumber && unit.address === old.address && unit.basisPoints === old.basisPoints ? 'maintained' : 'changed';
    return { ...unit, status };
  });
  for (const old of original) if (!liveById.has(old.id)) result.push({ ...old, status: 'removed' });
  return result;
}
