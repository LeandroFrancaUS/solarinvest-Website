const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { buildRateioEmail } = require('../.test-build/email.js');

const holder = { name: 'Maria <Silva>', documentMasked: '***.123.456-**', email: 'maria@example.com', phone: '+55 62 99999-0000' };
const base = { protocol: 'RAT-2026-001', manual: false, requestType: 'redistribution', submittedAt: new Date('2026-08-28T15:34:56Z'), ip: '203.0.113.10', userAgent: 'Mozilla/5.0 <Gmail test>', feeAccepted: true };
const unit = (id, uc, address, basisPoints, status, holderName = 'Maria <Silva>') => ({ id, ucNumber: uc, address, basisPoints, status, holderName, locked: false, origin: 'current' });
const project = (state, shareUnits, generatorPercent) => ({ reference: `PROJ-${state}`, modality: 'leasing', state, installedAt: null, holder, generatorUnit: { ucNumber: '000000000000001', address: 'Rua da Geração, 1', percent: generatorPercent }, shareUnits });

const cases = {
  go_uma_beneficiaria: {
    ...base, requestType: 'inclusion', project: project('GO', [{ ucNumber: '000000000000002', address: 'Rua Goiás, 2', percent: 100, holderName: holder.name }]),
    payload: { shareUnits: [{ ucNumber: '000000000000002', address: 'Rua Goiás, 2', percent: 100 }], originalShareUnits: [], comparison: { beneficiaries: [unit('a', '000000000000002', 'Rua Goiás, 2', 10000, 'new')] }, observations: 'Atender antes das 14h & confirmar.', consent: true },
    feeAssessment: { status: 'exempt', nextFreeAt: '2027-08-28T03:00:00Z' },
  },
  df_varias_unidades: {
    ...base, project: project('DF', [{ ucNumber: '000000000000001', address: 'Rua da Geração, 1', percent: 20 }, { ucNumber: '000000000000002', address: 'SQN 100', percent: 35 }, { ucNumber: '000000000000003', address: 'SQS 200', percent: 45 }], 20),
    payload: { shareUnits: [{ ucNumber: '000000000000001', percent: 20 }, { ucNumber: '000000000000002', percent: 35 }, { ucNumber: '000000000000003', percent: 45 }], originalShareUnits: [{ ucNumber: '000000000000001', percent: 25 }, { ucNumber: '000000000000002', percent: 30 }, { ucNumber: '000000000000003', percent: 45 }], comparison: { generator: { basisPoints: 2000, status: 'changed' }, beneficiaries: [unit('a', '000000000000002', 'SQN 100', 3500, 'changed'), unit('b', '000000000000003', 'SQS 200', 4500, 'maintained')] }, consent: true },
    feeAssessment: { status: 'chargeable', amountCents: 12990 },
  },
  removida_e_alterada: {
    ...base, manual: true, project: project('DF', [{ ucNumber: '000000000000001', address: 'Rua da Geração, 1', percent: 30 }, { ucNumber: '000000000000002', address: 'Rua A', percent: 70 }], 30),
    payload: { shareUnits: [{ ucNumber: '000000000000001', percent: 30 }, { ucNumber: '000000000000002', percent: 70 }], originalShareUnits: [{ ucNumber: '000000000000001', percent: 30 }, { ucNumber: '000000000000002', percent: 40 }, { ucNumber: '000000000000003', percent: 30 }], comparison: { generator: { basisPoints: 3000, status: 'maintained' }, beneficiaries: [unit('a', '000000000000002', 'Rua A', 7000, 'changed'), unit('b', '000000000000003', 'Rua B', 3000, 'removed')] }, consent: true },
    feeAssessment: { status: 'indeterminate' },
  },
};

for (const [name, input] of Object.entries(cases)) test(`snapshot do e-mail: ${name}`, () => {
  const actual = buildRateioEmail(input);
  const path = `scripts/__snapshots__/${name}.snap`;
  if (process.env.UPDATE_SNAPSHOTS) fs.writeFileSync(path, JSON.stringify(actual, null, 2) + '\n');
  assert.equal(JSON.stringify(actual, null, 2) + '\n', fs.readFileSync(path, 'utf8'));
});

test('escapa conteúdo do cliente e não renderiza JSON bruto', () => {
  const result = buildRateioEmail(cases.go_uma_beneficiaria);
  assert.match(result.html, /Maria &lt;Silva&gt;/);
  assert.doesNotMatch(result.html, /<pre|"shareUnits"/);
  assert.match(result.html, /mailto:maria@example\.com/);
  assert.match(result.html, /tel:\+55 62 99999-0000/);
});
