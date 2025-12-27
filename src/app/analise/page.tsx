import { Suspense } from 'react';
import AnalisePageClient from './AnalisePageClient';
import metadata from './page.metadata';

export { metadata };

export default function AnalisePage() {
  return (
    <Suspense fallback={null}>
      <AnalisePageClient />
    </Suspense>
  );
}
