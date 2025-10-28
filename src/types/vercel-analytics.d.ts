declare module '@vercel/analytics/next' {
  import type { ComponentType } from 'react';
  import type { AnalyticsProps, BeforeSendEvent } from '../lib/vercel-analytics-stub';

  export type { AnalyticsProps, BeforeSendEvent };

  export const Analytics: ComponentType<AnalyticsProps>;
  export default Analytics;
}
