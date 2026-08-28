import type { Project, RequestType, ShareUnit } from './types';

export type RateioSubmissionInput = {
  original: Project;
  requestType: RequestType;
  lookupToken: string;
  safePayload: Record<string, unknown>;
  shareUnits: ShareUnit[];
  expectedFeeStatus: unknown;
  feeAccepted: boolean;
  classification: string;
};

// Keep this object aligned with the app's strict public API contract. Test
// project exemptions are derived by the app from the reference, not sent as
// an extra property by the website.
export function buildRateioAppSubmission(input: RateioSubmissionInput) {
  return {
    reference: input.original.reference,
    requestType: input.requestType,
    lookupToken: input.lookupToken,
    payload: { ...input.safePayload, originalShareUnits: input.original.shareUnits },
    submittedFields: { ...input.original, shareUnits: input.shareUnits },
    expectedFeeStatus: input.expectedFeeStatus,
    feeAccepted: input.feeAccepted,
    classification: input.classification,
  };
}
