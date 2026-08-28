const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { referenceFromUrl } = require('../.test-build/reference.js');

test('rota /rateio renderiza a instância única do formulário', () => {
  const page = fs.readFileSync('src/app/rateio/page.tsx', 'utf8');
  assert.match(page, /<RateioForm initialReference=\{initialReference\}/);
  assert.match(page, /path: '\/rateio'/);
});

test('ref válida preenche o formulário e valores estranhos são ignorados', () => {
  assert.equal(referenceFromUrl('l-0002'), 'L-0002');
  assert.equal(referenceFromUrl(' javascript:alert(1) '), '');
  assert.equal(referenceFromUrl(['L-0002']), '');
});

test('verificador da URL não é lido nem pode iniciar a busca', () => {
  const page = fs.readFileSync('src/app/rateio/page.tsx', 'utf8');
  assert.doesNotMatch(page, /searchParams\?\.(verifier|cpf|cnpj|uc)/i);
  const form = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(form, /useState\(initialReference\)/);
  assert.match(form, /useState\(''\)/); // verificador começa sempre vazio
  assert.match(form, /onSubmit=\{performLookup\}/); // busca exige ação explícita
});

test('proteções contra overflow móvel e área segura estão presentes', () => {
  const css = fs.readFileSync('src/app/globals.css', 'utf8');
  const form = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(css, /font-size:\s*16px/);
  assert.match(form, /env\(safe-area-inset-bottom\)/);
  assert.match(form, /min-w-0/);
  assert.match(form, /pb-32/);
});

test('solicitações de rateio confirmadas notificam o inbox operacional', () => {
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  assert.match(route, /const RATEIO_INBOX = 'brsolarinvest@gmail.com'/);
  assert.match(route, /upstream\.status >= 200 && upstream\.status < 300 && responseData\?\.ok === true/);
  assert.match(route, /await sendRateioEmail\(\{/);
  assert.match(route, /idempotencyKey: `rateio-\$\{protocol\}`/);
  assert.ok(route.lastIndexOf('await sendRateioEmail') > route.indexOf('await callRateioApp'));
});
