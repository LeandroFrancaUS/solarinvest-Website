This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Search and SEO

A página `/search` oferece uma busca simples, alimentada pelo endpoint `/api/search`, que indexa as principais páginas do site. A página de busca inclui metadados de título e descrição para melhorar o SEO e facilitar que mecanismos de busca compreendam seu conteúdo.

Para testar localmente:

1. Execute `npm run dev`.
2. Visite `http://localhost:3000/search`.
3. Digite um termo como "soluções" para ver os resultados filtrados.

## Integração Kommo (pré-análise)

- Defina as variáveis em `.env.local` e no painel da Vercel (nunca commit das chaves):
  - `KOMMO_SUBDOMAIN`, `KOMMO_LONG_LIVED_TOKEN`
  - `KOMMO_PIPELINE_ID`, `KOMMO_STATUS_ID`
  - `KOMMO_CONTACT_EMAIL_FIELD_ID`, `KOMMO_CONTACT_PHONE_FIELD_ID`
  - Campos de lead (quando configurados): `KOMMO_LEAD_FIELD_ID_MUNICIPIO`, `KOMMO_LEAD_FIELD_ID_TIPO_IMOVEL`,
    `KOMMO_LEAD_FIELD_ID_CONSUMO_MEDIO`, `KOMMO_LEAD_FIELD_ID_TIPO_SISTEMA`, `KOMMO_LEAD_FIELD_ID_TIPO_INSTALACAO`,
    `KOMMO_LEAD_FIELD_ID_TIPO_REDE`, `KOMMO_LEAD_FIELD_ID_RELACAO_IMOVEL`, `KOMMO_LEAD_FIELD_ID_CPF_CNPJ`,
    `KOMMO_LEAD_FIELD_ID_STATUS_RESULTADO`, `KOMMO_LEAD_FIELD_ID_UTM_SOURCE`, `KOMMO_LEAD_FIELD_ID_UTM_MEDIUM`,
    `KOMMO_LEAD_FIELD_ID_UTM_CAMPAIGN`, `KOMMO_LEAD_FIELD_ID_UTM_CONTENT`.
- Use os templates `.env.example` ou `.env.local.example` como base, copiando para `.env.local` com os valores reais em desenvolvimento.
- Para mapear os IDs no Kommo, use o script `scripts/kommo_dump_ids.ts`:
  ```bash
  KOMMO_SUBDOMAIN=... KOMMO_LONG_LIVED_TOKEN=... npx ts-node scripts/kommo_dump_ids.ts
  ```

