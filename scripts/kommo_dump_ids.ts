const subdomain = process.env.KOMMO_SUBDOMAIN;
const token = process.env.KOMMO_LONG_LIVED_TOKEN;

if (!subdomain || !token) {
  console.error('Defina KOMMO_SUBDOMAIN e KOMMO_LONG_LIVED_TOKEN para executar o script.');
  process.exit(1);
}

const baseUrl = `https://${subdomain}.kommo.com/api/v4`;

async function kommoFetch(path: string) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Language': 'pt',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha na requisição (${response.status})`);
  }

  return response.json();
}

async function listPipelines() {
  const data = await kommoFetch('/leads/pipelines');
  console.log('\n=== Pipelines e statuses ===');
  for (const pipeline of data._embedded?.pipelines ?? []) {
    console.log(`Pipeline: ${pipeline.name} (id: ${pipeline.id})`);
    for (const status of pipeline._embedded?.statuses ?? []) {
      console.log(`  - Status: ${status.name} (id: ${status.id})`);
    }
  }
}

function printField(field: any) {
  console.log(`- ${field.name} (id: ${field.id})`);
}

async function listContactFields() {
  const data = await kommoFetch('/contacts/custom_fields');
  const fields = data._embedded?.custom_fields ?? [];
  const emails = fields.filter((field: any) => field.type === 'multitext' && field.code === 'EMAIL');
  const phones = fields.filter((field: any) => field.type === 'multitext' && field.code === 'PHONE');

  console.log('\n=== Campos de contato ===');
  if (emails.length === 0) console.log('Campo de e-mail não encontrado.');
  emails.forEach(printField);

  if (phones.length === 0) console.log('Campo de telefone/whatsapp não encontrado.');
  phones.forEach(printField);
}

async function listLeadFields() {
  const data = await kommoFetch('/leads/custom_fields');
  const fields = data._embedded?.custom_fields ?? [];
  const targets = [
    'Município',
    'Tipo de imóvel',
    'Consumo médio mensal',
    'Tipo de sistema',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
  ];

  console.log('\n=== Campos de lead ===');
  for (const name of targets) {
    const match = fields.find((field: any) => field.name.toLowerCase() === name.toLowerCase());
    if (match) {
      printField(match);
    } else {
      console.log(`Campo "${name}" não encontrado.`);
    }
  }
}

async function main() {
  try {
    await listPipelines();
    await listContactFields();
    await listLeadFields();
  } catch (error) {
    console.error('Erro ao consultar Kommo:', (error as Error).message);
  }
}

void main();
