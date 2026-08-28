export type FeeStatus = 'exempt' | 'chargeable' | 'indeterminate';
export type RequestType = 'inclusion' | 'exclusion' | 'redistribution';
export type Modality = 'leasing' | 'sale' | 'monitoring' | 'buyout';

export type ShareUnit = {
  ucNumber: string | null;
  holderName: string | null;
  address: string | null;
  percent: number | null;
};

export type Project = {
  reference: string;
  modality: Modality | null;
  state: string | null;
  installedAt: string | null;
  holder: { name: string | null; documentMasked: string | null; email: string | null; phone: string | null };
  generatorUnit: { ucNumber: string | null; address: string | null; percent?: number | null };
  shareUnits: ShareUnit[];
};

export type FeeAssessment = {
  status: FeeStatus;
  amountCents?: number;
  monthsSinceBaseline?: number | null;
  baselineSource?: string;
  nextFreeAt?: string | null;
  hasPendingRequest?: boolean;
};

export type LookupSuccess = { ok: true; lookupToken: string; project: Project; feeAssessment: FeeAssessment };
export type LookupResponse = LookupSuccess | { ok: false; unavailable?: boolean; rateLimited?: boolean; retryAfter?: string };

export type EditableUnit = { id: string; ucNumber: string; holderName: string; address: string; basisPoints: number | null; locked: boolean; origin: 'current' | 'new' };
export type GeneratorAllocation = { ucNumber: string; address: string; basisPoints: number | null };
export type ComparisonStatus = 'maintained' | 'changed' | 'new' | 'removed';
export type ComparedUnit = EditableUnit & { status: ComparisonStatus };
