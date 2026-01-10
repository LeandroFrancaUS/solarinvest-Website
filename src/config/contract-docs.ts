type ContractDocLink = {
  label: string;
  urlTemplate: string;
};

const githubDocsBase = 'https://raw.githubusercontent.com/solarinvest/documentos/main';

export const contractDocLinks: ContractDocLink[] = [
  {
    label: 'Contrato de leasing (atualizado)',
    urlTemplate: `${githubDocsBase}/contrato-leasing-{{dia}}-{{mes}}.pdf`,
  },
  {
    label: 'Anexos do contrato (atualizados)',
    urlTemplate: `${githubDocsBase}/anexos-contrato-{{dia}}-{{mes}}.pdf`,
  },
];

export function resolveDocUrl(template: string, date: Date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return template.replaceAll('{{dia}}', day).replaceAll('{{mes}}', month);
}
