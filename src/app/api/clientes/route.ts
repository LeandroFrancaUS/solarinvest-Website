import { NextResponse } from 'next/server';

type ClientePayload = {
  nome: string;
  documento: string; // CPF ou CNPJ
  telefone: string;
  email: string;
  endereco: string;
  uc: string;
};

type ClienteRecord = ClientePayload & {
  id: string;
  createdAt: string;
};

type ClienteStore = {
  clientes: ClienteRecord[];
  exactKeySet: Set<string>;
  ucSet: Set<string>;
  documentoSet: Set<string>;
  telefoneSet: Set<string>;
  emailSet: Set<string>;
  enderecoSet: Set<string>;
};

declare global {
  // eslint-disable-next-line no-var
  var __clientesStore: ClienteStore | undefined;
}

const store: ClienteStore = globalThis.__clientesStore ?? {
  clientes: [],
  exactKeySet: new Set(),
  ucSet: new Set(),
  documentoSet: new Set(),
  telefoneSet: new Set(),
  emailSet: new Set(),
  enderecoSet: new Set(),
};

globalThis.__clientesStore = store;

function normalizeDocumento(value: string) {
  return value.replace(/\D/g, '');
}

function normalizeTelefone(value: string) {
  return value.replace(/\D/g, '');
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeEndereco(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeUC(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '');
}

function normalizeNome(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function buildExactKey(payload: ClientePayload) {
  const normalized = {
    nome: normalizeNome(payload.nome),
    documento: normalizeDocumento(payload.documento),
    telefone: normalizeTelefone(payload.telefone),
    email: normalizeEmail(payload.email),
    endereco: normalizeEndereco(payload.endereco),
    uc: normalizeUC(payload.uc),
  };

  return JSON.stringify(normalized);
}

function validatePayload(payload: Partial<ClientePayload>): payload is ClientePayload {
  return (
    typeof payload.nome === 'string' &&
    typeof payload.documento === 'string' &&
    typeof payload.telefone === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.endereco === 'string' &&
    typeof payload.uc === 'string' &&
    payload.nome.trim().length > 0 &&
    payload.documento.trim().length > 0 &&
    payload.telefone.trim().length > 0 &&
    payload.email.trim().length > 0 &&
    payload.endereco.trim().length > 0 &&
    payload.uc.trim().length > 0
  );
}

export async function POST(request: Request) {
  let data: unknown;

  try {
    data = await request.json();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'JSON inválido.' },
      { status: 400 }
    );
  }

  if (!validatePayload(data as Partial<ClientePayload>)) {
    return NextResponse.json(
      { success: false, error: 'Dados do cliente inválidos.' },
      { status: 400 }
    );
  }

  const payload = data as ClientePayload;

  const normalizedDocumento = normalizeDocumento(payload.documento);
  const normalizedTelefone = normalizeTelefone(payload.telefone);
  const normalizedEmail = normalizeEmail(payload.email);
  const normalizedEndereco = normalizeEndereco(payload.endereco);
  const normalizedUC = normalizeUC(payload.uc);
  const exactKey = buildExactKey(payload);

  if (store.exactKeySet.has(exactKey)) {
    return NextResponse.json(
      { success: false, error: 'Cliente já cadastrado com as mesmas informações.' },
      { status: 409 }
    );
  }

  if (store.ucSet.has(normalizedUC)) {
    return NextResponse.json(
      { success: false, error: 'UC já cadastrada.' },
      { status: 409 }
    );
  }

  if (store.documentoSet.has(normalizedDocumento)) {
    return NextResponse.json(
      { success: false, error: 'CPF/CNPJ já cadastrado.' },
      { status: 409 }
    );
  }

  if (store.telefoneSet.has(normalizedTelefone)) {
    return NextResponse.json(
      { success: false, error: 'Telefone já cadastrado.' },
      { status: 409 }
    );
  }

  if (store.emailSet.has(normalizedEmail)) {
    return NextResponse.json(
      { success: false, error: 'E-mail já cadastrado.' },
      { status: 409 }
    );
  }

  if (store.enderecoSet.has(normalizedEndereco)) {
    return NextResponse.json(
      { success: false, error: 'Endereço já cadastrado.' },
      { status: 409 }
    );
  }

  const cliente: ClienteRecord = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  store.clientes.push(cliente);
  store.exactKeySet.add(exactKey);
  store.ucSet.add(normalizedUC);
  store.documentoSet.add(normalizedDocumento);
  store.telefoneSet.add(normalizedTelefone);
  store.emailSet.add(normalizedEmail);
  store.enderecoSet.add(normalizedEndereco);

  return NextResponse.json({ success: true, cliente }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ clientes: store.clientes });
}
