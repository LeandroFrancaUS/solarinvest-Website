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

test('interface cobre taxas, falhas e dados do cadastro somente para leitura', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  const fee = fs.readFileSync('src/components/rateio/FeeAssessmentCard.tsx', 'utf8');
  for (const status of ['exempt', 'chargeable', 'indeterminate']) assert.match(fee, new RegExp(status));
  assert.match(source, /hasPendingRequest/);
  assert.match(source, /FEE_VERDICT_CHANGED/);
  assert.match(source, /PENDING_REQUEST_EXISTS/);
  assert.match(source, /data\.unavailable\) openManual/);
  assert.match(source, /else \{ const next = failures \+ 1/);
  assert.match(source, /Estes dados vieram do seu cadastro/);
  assert.doesNotMatch(source, /Importado do sistema/);
  const read = source.slice(source.indexOf('function Read'), source.indexOf('function Field'));
  assert.doesNotMatch(read, /<input/);
});

test('interface começa com linha vazia, posterga o total e deduz o tipo da solicitação', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(source, /return units\.length \? units : \[blankUnit\(\)\]/);
  assert.match(source, /showErrors \|\| units\.some/);
  assert.match(source, /requestType: inferRequestType\(units, originalUnits\)/);
  assert.doesNotMatch(source, />Tipo de solicitação</);
});

test('cancelamento protege alterações e limpa a consulta', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(source, /formDirty && !window\.confirm/);
  assert.match(source, /function cancel\(\)[\s\S]*reset\(\)/);
  assert.match(source, /setLookup\(null\)/);
  assert.match(source, /rateio-cancel-mobile/);
});

test('titular é único na interface e imposto pelo servidor no fluxo consultado', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  assert.match(source, /Titular de todas as unidades/);
  assert.match(source, /Esta unidade está em nome de outra pessoa/);
  assert.match(route, /holderName: original\.holder\.name/);
  assert.match(route, /safePayload/);
});

test('envio inválido mostra pendências, mensagens por campo e rola ao primeiro erro', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(source, /if \(!canSubmit\) \{ setShowErrors\(true\); focusFirstError\(\); return; \}/);
  assert.match(source, /scrollIntoView\(\{ behavior: 'smooth'/);
  assert.match(source, /Para enviar, confira:/);
  assert.match(source, /Informe os 15 números da unidade consumidora/);
  assert.match(source, /Informe o endereço da unidade/);
  assert.match(source, /Informe um percentual maior que zero/);
  assert.match(source, /<form noValidate onSubmit=\{submit\}/);
});

test('envio válido dispara a requisição e os botões de envio nunca são desabilitados', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(source, /if \(!canSubmit\)[\s\S]*fetch\('\/api\/rateio\/solicitacoes'/);
  const finalForm = source.slice(source.indexOf('<form noValidate onSubmit={submit}'));
  assert.doesNotMatch(finalForm, /<button disabled=\{loading\}/);
});

test('honeypot encerra antes de qualquer envio real', () => {
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  const postHandler = route.slice(route.indexOf('export async function POST'));
  assert.ok(postHandler.indexOf('if (body.website)') < postHandler.indexOf('await callRateioApp'));
  assert.ok(postHandler.indexOf('if (body.website)') < postHandler.indexOf('await sendRateioEmail'));
});
