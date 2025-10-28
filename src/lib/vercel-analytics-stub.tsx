'use client';

/**
 * Minimal fallback implementation used when @vercel/analytics isn't installed.
 */
export type BeforeSendEvent = {
  url: string;
  [key: string]: unknown;
};

export type AnalyticsProps = {
  beforeSend?: (event: BeforeSendEvent) => BeforeSendEvent | null;
  mode?: 'auto' | 'development' | 'production';
  debug?: boolean;
  endpoint?: string;
  scriptSrc?: string;
} & Record<string, unknown>;

export function Analytics(_props: AnalyticsProps) {
  return null;
}

export default Analytics;
