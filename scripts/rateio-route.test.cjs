const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { referenceFromUrl } = require('../.test-build/reference.js');
const { isRateioTestProject } = require('../.test-build/testProject.js');

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
  assert.match(route, /idempotencyKey: `rateio-\$\{details\.protocol\}`/);
  assert.ok(route.lastIndexOf('await sendRateioEmail') > route.indexOf('await callRateioApp'));
});

test('servidor classifica e registra anexo e atividade no histórico do projeto', () => {
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  assert.match(route, /const classification = classifyRateio\(original\)/);
  assert.match(route, /buildRateioHistoryAttachment\(details\)/);
  assert.match(route, /\/api\/public\/rateio\/request-history/);
  assert.match(route, /activity: \{ description: historyAttachment\.activityDescription, attachmentFilename: historyAttachment\.filename \}/);
});

test('segunda solicitação pendente é liberada somente para contas de teste do Solar Lab', () => {
  assert.equal(isRateioTestProject({ reference: 'L-0029' }), true);
  assert.equal(isRateioTestProject({ reference: 'V-0029' }), true);
  assert.equal(isRateioTestProject({ reference: 'M-0029' }), true);
  assert.equal(isRateioTestProject({ reference: 'L-0002' }), false);

  const lookupRoute = fs.readFileSync('src/app/api/rateio/lookup/route.ts', 'utf8');
  assert.match(lookupRoute, /isRateioTestProject\(data\.project\)/);
  assert.match(lookupRoute, /hasPendingRequest: false/);

  const submitRoute = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  // A isenção é uma política do app. Enviar um campo novo daqui quebra o
  // contrato estrito da API antes de a solicitação chegar ao processamento.
  assert.doesNotMatch(submitRoute, /\btestProject\s*,/);
  assert.match(submitRoute, /callRateioApp\('\/api\/public\/rateio\/requests'/);
});

test('falhas de validação registram campo e mensagem no log do servidor', () => {
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  assert.match(route, /\[rateio-submit\] Falha de validação/);
  assert.match(route, /issues: upstreamValidationIssues\(upstream\.data\)/);
  assert.match(route, /field: 'lookupToken'/);
  assert.match(route, /field: 'requestType'/);
});

test('confirmação do lookup funciona entre instâncias serverless e valida a UF', () => {
  const lookupRoute = fs.readFileSync('src/app/api/rateio/lookup/route.ts', 'utf8');
  const submitRoute = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  const server = fs.readFileSync('src/lib/rateio/server.ts', 'utf8');
  assert.match(lookupRoute, /lookupProof: createLookupProof/);
  assert.match(submitRoute, /getRememberedLookup\(token\) \|\| verifyLookupProof\(proof, token\)/);
  assert.match(server, /createHmac\('sha256'/);
  assert.match(server, /timingSafeEqual/);
  assert.match(submitRoute, /validationError\('DIFFERENT_STATE'/);
  assert.match(submitRoute, /const \{ state: _state, \.\.\.acceptedFields \} = fields/);
});

test('formulário oferece a lista de UFs e impede UF diferente da geradora', () => {
  const form = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(form, /const BRAZILIAN_STATES = \['AC'.*'TO'\]/);
  assert.match(form, /<StateSelect value=\{unit\.state\}/);
  assert.match(form, /unit\.state === project\.state/);
  assert.match(form, /Não é possível incluir UC de diferente UF no rateio/);
  assert.match(form, /lookupProof: lookup\?\.lookupProof/);
});

test('projeto real continua exibindo o bloqueio de solicitação em análise', () => {
  const form = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(form, /if \(data\.feeAssessment\.hasPendingRequest\)/);
  assert.match(form, /Já existe uma solicitação em análise para este projeto/);
  assert.match(form, /PENDING_REQUEST_EXISTS/);
});
