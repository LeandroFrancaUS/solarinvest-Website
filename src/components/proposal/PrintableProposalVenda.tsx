import type { PrintableProposalBaseProps } from './PrintableProposalBase';
import { PrintableProposalBase } from './PrintableProposalBase';

export type PrintableProposalVendaProps = Omit<PrintableProposalBaseProps, 'variant'>;

export function PrintableProposalVenda(props: PrintableProposalVendaProps) {
  return <PrintableProposalBase {...props} variant="venda" />;
}
