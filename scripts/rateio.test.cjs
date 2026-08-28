const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { compareUnits, initializeAllocation, redistribute, hasDuplicateUcs, TOTAL_BASIS_POINTS } = require('../.test-build/allocation.js');

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

const project = (state, shareUnits = [], generatorPercent = null) => ({
  reference: 'L-0002', modality: 'leasing', state, installedAt: null,
  holder: { name: 'Titular', documentMasked: '', email: '', phone: '' },
  generatorUnit: { ucNumber: '999999999999999', address: 'Geradora', percent: generatorPercent }, shareUnits,
});
const ids = () => { let id = 0; return () => String(++id); };

test('projeto de GO sem beneficiárias abre a primeira linha com cem por cento', () => {
  const result = initializeAllocation(project('GO'), ids());
  assert.equal(result.units.length, 1);
  assert.equal(result.units[0].origin, 'new');
  assert.equal(result.units[0].basisPoints, TOTAL_BASIS_POINTS);
  assert.equal(result.units[0].locked, true);
});

test('GO com uma beneficiária fixa cem por cento e adicionar outra permite edição', () => {
  const result = initializeAllocation(project('GO', [{ ucNumber: '111111111111111', holderName: 'Titular', address: 'A', percent: null }]), ids());
  assert.equal(result.units[0].basisPoints, 10000);
  assert.equal(result.units[0].locked, true);
  const withSecond = redistribute([...result.units, unit('2')], true);
  assert.equal(withSecond.every(item => !item.locked), true);
  assert.deepEqual(withSecond.map(item => item.basisPoints), [5000, 5000]);
});

test('edição de um percentual em GO recalcula os demais e conserva cem por cento', () => {
  const current = [unit('1', 5000), unit('2', 3000), unit('3', 2000)];
  const edited = current.map(item => ({ ...item, basisPoints: item.id === '2' ? 2000 : item.basisPoints, locked: item.id === '2' }));
  const result = redistribute(edited);
  assert.deepEqual(result.map(item => item.basisPoints), [4000, 2000, 4000]);
  assert.equal(result.reduce((sum, item) => sum + item.basisPoints, 0), TOTAL_BASIS_POINTS);
});

test('interface identifica o rateio de Goiás como Excedente (%)', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(source, /project\.state === 'GO' \? 'Excedente \(%\)'/);
  assert.doesNotMatch(source, /Percentual do excedente/);
});

test('DF não preenche percentuais nulos e inclui a geradora no total', () => {
  const result = initializeAllocation(project('DF', [{ ucNumber: '111111111111111', holderName: 'Titular', address: 'A', percent: null }]), ids());
  assert.equal(result.generator.basisPoints, null);
  assert.equal(result.units[0].basisPoints, null);
  result.generator.basisPoints = 4000; result.units[0].basisPoints = 6000;
  assert.equal(result.generator.basisPoints + result.units[0].basisPoints, TOTAL_BASIS_POINTS);
});

test('comparativo conserva beneficiária importada removida', () => {
  const original = [{ ...unit('1', 5000), address: 'A' }, { ...unit('2', 5000), address: 'B' }];
  const comparison = compareUnits([original[0]], original);
  assert.equal(comparison.find(item => item.id === '2').status, 'removed');
  assert.equal(comparison.find(item => item.id === '1').status, 'maintained');
});

test('geradora é fixa em GO e só o percentual é editável em DF', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  const fixedBlock = source.slice(source.indexOf('Unidade geradora — fixa'), source.indexOf('{hasMissingPercent'));
  assert.doesNotMatch(fixedBlock, /onChange=.*ucNumber/);
  assert.doesNotMatch(fixedBlock, /onChange=.*address/);
  assert.match(fixedBlock, /project\.state === 'DF'/);
  assert.match(fixedBlock, /Percentual da unidade geradora/);
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

test('interface começa com a primeira linha de GO em 100%, posterga o total e deduz o tipo da solicitação', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(source, /initializeAllocation\(lookup\.project, uid\)/);
  assert.match(source, /setUnits\(\[\{ \.\.\.blankUnit\(\), basisPoints: TOTAL_BASIS_POINTS, locked: true \}\]\)/);
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

test('titular não é repetido na seção de UCs e é imposto pelo servidor no fluxo consultado', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  assert.doesNotMatch(source, /Titular de todas as unidades/);
  assert.match(source, /titular informado nos dados do projeto/);
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

test('envio só é habilitado após todas as confirmações de titularidade', () => {
  const source = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(source, /if \(!canSubmit\)[\s\S]*fetch\('\/api\/rateio\/solicitacoes'/);
  const finalForm = source.slice(source.indexOf('<form noValidate onSubmit={submit}'));
  assert.match(finalForm, /disabled=\{!canSubmit \|\| loading\}/);
  assert.match(finalForm, /Você é o atual titular desta unidade consumidora/);
  assert.match(source, /ownershipConfirmed: null/);
  assert.match(finalForm, /Titularidade confirmada/);
  assert.match(finalForm, /Somente contas registradas no CPF ou CNPJ/);
});

test('servidor rejeita beneficiária sem titularidade confirmada', () => {
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  assert.match(route, /ownershipConfirmed !== true/);
  assert.match(route, /OWNERSHIP_CONFIRMATION_REQUIRED/);
});

test('honeypot encerra antes de qualquer envio real', () => {
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  const postHandler = route.slice(route.indexOf('export async function POST'));
  assert.ok(postHandler.indexOf('if (body.website)') < postHandler.indexOf('await callRateioApp'));
  assert.ok(postHandler.indexOf('if (body.website)') < postHandler.indexOf('await sendRateioEmail'));
});
