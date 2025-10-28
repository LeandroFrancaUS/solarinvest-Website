'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

import type { AnalyticsProps, BeforeSendEvent } from '@/lib/vercel-analytics-stub';

const AnalyticsComponent = dynamic(async () => {
  try {
    const mod = await import('@vercel/analytics/next');
    return mod.Analytics;
  } catch (error) {
    const mod = await import('@/lib/vercel-analytics-stub');
    return mod.Analytics;
  }
}, { ssr: false, loading: () => null });

const Analytics = AnalyticsComponent as unknown as ComponentType<AnalyticsProps>;

export { Analytics };
export type { BeforeSendEvent };
