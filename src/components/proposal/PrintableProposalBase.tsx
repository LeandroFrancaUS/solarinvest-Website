import clsx from 'clsx';
import type { ReactNode } from 'react';
import { PrintableProposalConsumerUnits } from './PrintableProposalConsumerUnits';
import type { ProposalConsumerUnitsData } from './types';

export interface PrintableProposalBaseProps {
  consumerUnits: ProposalConsumerUnitsData;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: 'leasing' | 'venda';
}

export function PrintableProposalBase({
  consumerUnits,
  header,
  footer,
  children,
  className,
  variant,
}: PrintableProposalBaseProps) {
  return (
    <article className={clsx('printable-proposal', variant ? `printable-proposal--${variant}` : null, className)}>
      {header}
      <PrintableProposalConsumerUnits consumerUnits={consumerUnits} />
      {children}
      {footer}
    </article>
  );
}
