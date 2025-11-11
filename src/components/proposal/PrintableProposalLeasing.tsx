import type { PrintableProposalBaseProps } from './PrintableProposalBase';
import { PrintableProposalBase } from './PrintableProposalBase';

export type PrintableProposalLeasingProps = Omit<PrintableProposalBaseProps, 'variant'>;

export function PrintableProposalLeasing(props: PrintableProposalLeasingProps) {
  return <PrintableProposalBase {...props} variant="leasing" />;
}
