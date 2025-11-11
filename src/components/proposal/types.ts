export interface ConsumerUnitLocation {
  numero: string;
  endereco: string;
}

export interface BeneficiaryConsumerUnit extends ConsumerUnitLocation {
  rateioPercentual?: number;
}

export interface ProposalConsumerUnitsData {
  ucGeradora: ConsumerUnitLocation;
  ucsBeneficiarias?: BeneficiaryConsumerUnit[];
}

export interface PrintableProposalStructure {
  consumerUnits: ProposalConsumerUnitsData;
}
