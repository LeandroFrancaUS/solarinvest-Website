export const RATEIO_REFERENCE_PATTERN = /^[A-Z][A-Z0-9]{0,9}-\d{4,12}$/;

export function referenceFromUrl(value: string | string[] | undefined): string {
  if (typeof value !== 'string') return '';
  const normalized = value.trim().toUpperCase();
  return RATEIO_REFERENCE_PATTERN.test(normalized) ? normalized : '';
}
