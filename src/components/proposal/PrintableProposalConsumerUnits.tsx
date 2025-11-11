import clsx from 'clsx';
import type { ProposalConsumerUnitsData } from './types';

const formatPercentage = (value: number): string => {
  if (!Number.isFinite(value)) {
    return `${value}`;
  }

  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  const hasDecimals = !Number.isInteger(rounded);

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(rounded);
};

const joinUnitParts = (parts: string[]): string => parts.filter(Boolean).join(' — ');

export interface PrintableProposalConsumerUnitsProps {
  consumerUnits: ProposalConsumerUnitsData;
  className?: string;
}

export function PrintableProposalConsumerUnits({
  consumerUnits,
  className,
}: PrintableProposalConsumerUnitsProps) {
  const { ucGeradora, ucsBeneficiarias } = consumerUnits;
  const hasBeneficiaries = Array.isArray(ucsBeneficiarias) && ucsBeneficiarias.length > 0;
  const beneficiaries = hasBeneficiaries ? ucsBeneficiarias : [];

  return (
    <section className={clsx('proposal-consumer-units printable-proposal__block', className)}>
      <h3 className="proposal-consumer-units__title">UC Geradora</h3>
      <p className="proposal-consumer-units__generator">
        {joinUnitParts([`UC nº ${ucGeradora.numero}`, ucGeradora.endereco])}
      </p>

      {hasBeneficiaries ? (
        <>
          <h4 className="proposal-consumer-units__subtitle">UCs Beneficiárias</h4>
          <ul className="proposal-consumer-units__list" role="list">
            {beneficiaries.map((beneficiary) => {
              const parts = [
                `UC nº ${beneficiary.numero}`,
                beneficiary.endereco,
              ];

              if (typeof beneficiary.rateioPercentual === 'number' && Number.isFinite(beneficiary.rateioPercentual)) {
                parts.push(`Rateio: ${formatPercentage(beneficiary.rateioPercentual)}%`);
              }

              return (
                <li key={beneficiary.numero} className="proposal-consumer-units__item">
                  {joinUnitParts(parts)}
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </section>
  );
}
