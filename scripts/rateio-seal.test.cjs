const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { LOOKUP_SEAL_TTL_MS, isLookupSealConfigured, openLookupSnapshot, sealLookupSnapshot } = require('../.test-build/lookupSeal.js');

const SECRET = 'chave-de-teste-com-mais-de-32-caracteres-para-o-lacre';
const TOKEN = 'rl1.payload-de-exemplo.assinatura';

function project(reference = 'L-0029') {
  return {
    reference,
    modality: 'leasing',
    state: 'BA',
    installedAt: '2024-03-01',
    holder: { name: 'Maria Silva', documentMasked: '***.456.789-**', email: 'maria@example.com', phone: '71999990000' },
    generatorUnit: { ucNumber: '123456', address: 'Rua A, 100' },
    shareUnits: [{ ucNumber: '123456', holderName: 'Maria Silva', address: 'Rua A, 100', percent: 100 }],
  };
}

function withSecret(value, run) {
  const before = process.env.RATEIO_LOOKUP_SEAL_SECRET;
  const beforeShared = process.env.SITE_PUBLIC_API_KEY;
  if (value == null) delete process.env.RATEIO_LOOKUP_SEAL_SECRET;
  else process.env.RATEIO_LOOKUP_SEAL_SECRET = value;
  delete process.env.SITE_PUBLIC_API_KEY;
  try {
    return run();
  } finally {
    if (before == null) delete process.env.RATEIO_LOOKUP_SEAL_SECRET;
    else process.env.RATEIO_LOOKUP_SEAL_SECRET = before;
    if (beforeShared == null) delete process.env.SITE_PUBLIC_API_KEY;
    else process.env.SITE_PUBLIC_API_KEY = beforeShared;
  }
}

test('o retrato lacrado volta idêntico — é isto que substitui a memória da instância', () => {
  withSecret(SECRET, () => {
    const seal = sealLookupSnapshot({ token: TOKEN, project: project() });
    assert.ok(typeof seal === 'string' && seal.startsWith('rs1.'));
    assert.deepEqual(openLookupSnapshot({ token: TOKEN, seal }), project());
  });
});

test('lacre adulterado não abre', () => {
  withSecret(SECRET, () => {
    const seal = sealLookupSnapshot({ token: TOKEN, project: project() });
    const parts = seal.split('.');
    const corrupted = Buffer.from(parts[2], 'base64url');
    corrupted[0] = corrupted[0] ^ 0xff;
    parts[2] = corrupted.toString('base64url');
    assert.equal(openLookupSnapshot({ token: TOKEN, seal: parts.join('.') }), null);
  });
});

test('o lacre está preso ao token: o de um lookup não abre com o token de outro', () => {
  withSecret(SECRET, () => {
    const seal = sealLookupSnapshot({ token: TOKEN, project: project('L-0029') });
    assert.equal(openLookupSnapshot({ token: 'rl1.outro.token', seal }), null);
  });
});

test('a janela é a mesma hora do token do app, e vencida não abre', () => {
  withSecret(SECRET, () => {
    assert.equal(LOOKUP_SEAL_TTL_MS, 60 * 60_000);
    const emitidoEm = Date.UTC(2026, 7, 28, 12, 0, 0);
    const seal = sealLookupSnapshot({ token: TOKEN, project: project(), now: emitidoEm });
    assert.ok(openLookupSnapshot({ token: TOKEN, seal, now: emitidoEm + 59 * 60_000 }));
    assert.equal(openLookupSnapshot({ token: TOKEN, seal, now: emitidoEm + 61 * 60_000 }), null);
  });
});

test('sem segredo não há lacre, e o site recai na memória do processo', () => {
  withSecret(null, () => {
    assert.equal(isLookupSealConfigured(), false);
    assert.equal(sealLookupSnapshot({ token: TOKEN, project: project() }), null);
    assert.equal(openLookupSnapshot({ token: TOKEN, seal: 'rs1.a.b.c' }), null);
  });
});

test('a chave do site serve de segredo quando não há um dedicado', () => {
  const before = process.env.RATEIO_LOOKUP_SEAL_SECRET;
  const beforeShared = process.env.SITE_PUBLIC_API_KEY;
  delete process.env.RATEIO_LOOKUP_SEAL_SECRET;
  process.env.SITE_PUBLIC_API_KEY = SECRET;
  try {
    assert.equal(isLookupSealConfigured(), true);
    const seal = sealLookupSnapshot({ token: TOKEN, project: project() });
    assert.deepEqual(openLookupSnapshot({ token: TOKEN, seal }), project());
  } finally {
    if (before == null) delete process.env.RATEIO_LOOKUP_SEAL_SECRET;
    else process.env.RATEIO_LOOKUP_SEAL_SECRET = before;
    if (beforeShared == null) delete process.env.SITE_PUBLIC_API_KEY;
    else process.env.SITE_PUBLIC_API_KEY = beforeShared;
  }
});

test('o segredo é lido a cada chamada, então a rotação vale sem cold start', () => {
  const seal = withSecret(SECRET, () => sealLookupSnapshot({ token: TOKEN, project: project() }));
  assert.equal(withSecret('outra-chave-de-teste-com-mais-de-32-caracteres', () => openLookupSnapshot({ token: TOKEN, seal })), null);
  assert.ok(withSecret(SECRET, () => openLookupSnapshot({ token: TOKEN, seal })));
});

test('o submit confere o lacre e não depende mais da memória da instância', () => {
  const route = fs.readFileSync('src/app/api/rateio/solicitacoes/route.ts', 'utf8');
  assert.match(route, /resolveLookupSnapshot\(token, body\.lookupSeal\)/);
  assert.doesNotMatch(route, /getRememberedLookup/);
  assert.doesNotMatch(route, /nesta instância/);
});

test('o lookup devolve o lacre e o formulário o reenvia', () => {
  const lookupRoute = fs.readFileSync('src/app/api/rateio/lookup/route.ts', 'utf8');
  assert.match(lookupRoute, /const lookupSeal = rememberLookup\(data\.lookupToken, data\.project\)/);
  assert.match(lookupRoute, /\.\.\.\(lookupSeal \? \{ lookupSeal \} : \{\}\)/);
  assert.match(lookupRoute, /\[rateio-lookup\] lacre indisponível/);
  const form = fs.readFileSync('src/components/rateio/RateioForm.tsx', 'utf8');
  assert.match(form, /lookupSeal: lookup\?\.lookupSeal/);
});

test('a memória do processo passou a durar a mesma hora do token do app', () => {
  const server = fs.readFileSync('src/lib/rateio/server.ts', 'utf8');
  assert.match(server, /expiresAt: now \+ LOOKUP_SEAL_TTL_MS/);
  assert.doesNotMatch(server, /30 \* 60_000/);
});
