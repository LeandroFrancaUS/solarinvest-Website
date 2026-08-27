const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { redistribute, hasDuplicateUcs, TOTAL_BASIS_POINTS } = require('../.test-build/allocation.js');

const unit = (id, points = 0, locked = false) => ({ id, ucNumber: id.padStart(15, '0'), holderName: 'Titular', address: '', basisPoints: points, locked, origin: 'current' });

test('divisão igualitária conserva exatamente 10000 centésimos', () => {
  for (let count = 1; count <= 20; count++) {
    const result = redistribute(Array.from({ length: count }, (_, index) => unit(String(index + 1))));
    assert.equal(result.reduce((sum, item) => sum + item.basisPoints, 0), TOTAL_BASIS_POINTS);
    assert.ok(Math.max(...result.map(x => x.basisPoints)) - Math.min(...result.map(x => x.basisPoints)) <= 1);
  }
});

test('redistribui apenas linhas destravadas', () => {
  const result = redistribute([unit('1', 3333, true), unit('2'), unit('3')]);
  assert.equal(result[0].basisPoints, 3333);
  assert.deepEqual(result.slice(1).map(x => x.basisPoints), [3334, 3333]);
  assert.equal(result.reduce((sum, item) => sum + item.basisPoints, 0), TOTAL_BASIS_POINTS);
});

test('geradora é rejeitada em GO e aceita em DF', () => {
  const generator = '123456789012345';
  const items = [{ ...unit('1'), ucNumber: generator }];
  assert.equal(hasDuplicateUcs(items, generator, 'GO'), true);
  assert.equal(hasDuplicateUcs(items, generator, 'DF'), false);
});

test('interface cobre taxas, pendência, indisponibilidade, confirmação e campos importados sem input', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  const fee = fs.readFileSync('src/components/rateio/FeeAssessmentCard.tsx', 'utf8');
  for (const status of ['exempt', 'chargeable', 'indeterminate']) assert.match(fee, new RegExp(status));
  assert.match(source, /hasPendingRequest/);
  assert.match(source, /FEE_VERDICT_CHANGED/);
  assert.match(source, /PENDING_REQUEST_EXISTS/);
  assert.match(source, /data\.unavailable\) openManual/);
  assert.match(source, /else \{ const next = failures \+ 1/);
  assert.match(source, /<Read label="Referência"[\s\S]* imported/);
  const read = source.slice(source.indexOf('function Read'), source.indexOf('function Field'));
  assert.doesNotMatch(read, /<input/);
});

test('honeypot encerra antes de qualquer envio real', () => {
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  assert.ok(route.indexOf('if (body.website)') < route.indexOf('await callRateioApp'));
  assert.ok(route.indexOf('if (body.website)') < route.indexOf('new Resend'));
});
