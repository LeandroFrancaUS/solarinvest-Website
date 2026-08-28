const test = require('node:test');
const assert = require('node:assert/strict');
const { buildRateioAppSubmission } = require('../.test-build/submission.js');

test('payload de projeto de teste enviado pela rota direta chega à chamada da API do app', async () => {
  const original = {
    reference: 'L-0029', modality: 'leasing', state: 'GO', installedAt: '2025-01-01',
    holder: { name: 'Projeto Solar Lab', documentMasked: '***', email: 'lab@example.com', phone: '62999999999' },
    generatorUnit: { ucNumber: '123456789012345', address: 'Rua do Laboratório' },
    shareUnits: [{ ucNumber: '987654321012345', holderName: 'Projeto Solar Lab', address: 'Rua Beneficiária', percent: 100 }],
  };
  const shareUnits = [{ ucNumber: '987654321012345', holderName: 'Projeto Solar Lab', address: 'Rua Beneficiária', percent: 100 }];
  const browserPayload = {
    shareUnits,
    comparison: { generator: { ucNumber: '123456789012345', status: 'maintained' }, beneficiaries: [] },
    observations: '', consent: true,
  };
  const request = buildRateioAppSubmission({
    original,
    requestType: 'redistribution',
    lookupToken: 'token-from-direct-route-lookup',
    safePayload: browserPayload,
    shareUnits,
    expectedFeeStatus: 'exempt',
    feeAccepted: false,
    classification: 'existing_allocation',
  });

  let received;
  const callRateioApp = async (path, body) => { received = { path, body }; return { status: 201 }; };
  const response = await callRateioApp('/api/public/rateio/requests', request);

  assert.equal(response.status, 201);
  assert.equal(received.path, '/api/public/rateio/requests');
  assert.equal(received.body.reference, 'L-0029');
  assert.equal(received.body.lookupToken, 'token-from-direct-route-lookup');
  assert.equal(received.body.testProject, undefined, 'campo fora do contrato não pode ser enviado');
  assert.deepEqual(received.body.payload.shareUnits, shareUnits);
});
