// src/lib/rateio/lookupSeal.ts
//
// LACRE DO LOOKUP — o retrato do projeto que sobrevive à troca de instância.
//
// ─────────────────────────────────────────────────────────────────────────────
// O PROBLEMA
//
// O submit precisa do projeto EXATAMENTE como o app o devolveu no lookup: é
// dele que sai o titular confirmado, a lista original de UCs e a classificação
// que vai para a triagem. O navegador também tem esses dados, mas o navegador
// pode editá-los — por isso o servidor nunca aceitou a cópia do cliente.
//
// A primeira solução foi guardar o retrato num Map em memória. Em serverless
// isso não é uma cache com miss ocasional: o lookup e o submit são invocações
// separadas, atendidas por instâncias diferentes, e o Map de uma não existe na
// outra. O submit então recusava com LOOKUP_EXPIRED um lookup que tinha acabado
// de dar certo. A mensagem "não foi reconhecida NESTA INSTÂNCIA" descrevia o
// bug com precisão.
//
// ─────────────────────────────────────────────────────────────────────────────
// A SOLUÇÃO: ESTADO NENHUM
//
// O retrato volta para o navegador LACRADO — cifrado e autenticado com
// AES-256-GCM — e o navegador o devolve no submit. Nenhuma instância precisa
// lembrar de nada, então não há instância errada para cair.
//
// Isso não afrouxa a garantia que o Map dava:
//
//   • CONFIDENCIALIDADE não é o ponto. O navegador já recebeu o projeto em
//     claro na resposta do lookup — cifrar é higiene, não segredo novo. O que
//     importa é o resto.
//   • INTEGRIDADE é o ponto. GCM autentica: um byte trocado no lacre e a
//     abertura falha. O cliente continua sem conseguir plantar outro titular.
//   • VÍNCULO AO TOKEN. O `lookupToken` entra como dado adicional autenticado
//     (AAD), então o lacre do projeto A não abre acompanhado do token do
//     projeto B. Sem isso, dois lookups legítimos poderiam ser cruzados.
//   • VALIDADE. A expiração viaja DENTRO do texto cifrado, não ao lado dele:
//     é conteúdo autenticado, e o cliente não consegue esticá-la.
//
// ─────────────────────────────────────────────────────────────────────────────
// A JANELA É A DO APP, NÃO UMA MENOR
//
// Quem assina o `lookupToken` é o app, com uma hora de validade e um motivo
// escrito: quem preenche este formulário é um leigo no celular que sai para
// procurar a conta de luz. O lacre precisa durar o mesmo tanto. Enquanto o site
// usou trinta minutos, ele expirava sozinho no meio de um percurso que o app
// ainda considerava válido — e o cliente lia "a confirmação expirou" sem ter
// feito nada de errado.
//
// ─────────────────────────────────────────────────────────────────────────────
// DE ONDE VEM A CHAVE
//
// De `RATEIO_LOOKUP_SEAL_SECRET` quando existir. Não existindo, de
// `SITE_PUBLIC_API_KEY` — que já é obrigatória para o fluxo funcionar, então a
// correção não depende de ninguém lembrar de criar uma variável nova.
//
// Nos dois casos a chave de cifragem é DERIVADA por HKDF-SHA256 com salt e info
// fixos, nunca usada crua. A derivação é o que separa os usos: a mesma
// `SITE_PUBLIC_API_KEY` continua sendo o header de autenticação para o app, e a
// chave que abre o lacre é um valor distinto do qual não se volta para o
// segredo. Sem nenhum dos dois segredos não há lacre, e o submit recai no
// retrato em memória — o comportamento antigo, que acerta quando a instância é
// a mesma.

import { createCipheriv, createDecipheriv, hkdfSync, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Project } from './types';

/** Prefixo de versão: trocar o formato sem abrir lacre antigo por engano. */
const SEAL_VERSION = 'rs1';

/** Uma hora, em milissegundos. A mesma janela do token assinado pelo app. */
export const LOOKUP_SEAL_TTL_MS = 60 * 60_000;

const KEY_BYTES = 32;
const IV_BYTES = 12;
const TAG_BYTES = 16;

/** Domínio da derivação. Trocar qualquer um destes invalida todo lacre emitido. */
const HKDF_SALT = 'solarinvest.rateio.lookup-seal.v1';
const HKDF_INFO = 'aes-256-gcm';

/** Piso de entropia do segredo dedicado. Abaixo disso ele é ignorado. */
const SECRET_MIN_LENGTH = 32;

type SealedPayload = { p: Project; e: number };

function readEnv(name: string) {
  return String(process.env?.[name] ?? '').trim();
}

/**
 * O segredo cru, ou null quando não há nenhum utilizável.
 *
 * Lido a cada chamada, e não cacheado em módulo: em serverless o processo
 * sobrevive entre requisições, e cachear faria uma rotação de segredo só valer
 * no próximo cold start.
 */
export function lookupSealSecret() {
  const dedicated = readEnv('RATEIO_LOOKUP_SEAL_SECRET');
  if (dedicated.length >= SECRET_MIN_LENGTH) return dedicated;
  const shared = readEnv('SITE_PUBLIC_API_KEY');
  return shared.length >= SECRET_MIN_LENGTH ? shared : null;
}

/** O lacre está configurado? */
export function isLookupSealConfigured() {
  return lookupSealSecret() != null;
}

function derivedKey(secret: string) {
  return Buffer.from(hkdfSync('sha256', Buffer.from(secret, 'utf8'), Buffer.from(HKDF_SALT, 'utf8'), Buffer.from(HKDF_INFO, 'utf8'), KEY_BYTES));
}

function base64url(buffer: Buffer) {
  return buffer.toString('base64url');
}

/**
 * Lacra o retrato do projeto.
 *
 * @param input.token   O `lookupToken` que o app assinou. Entra como AAD.
 * @param input.project O DTO exatamente como o app o devolveu.
 * @returns O lacre, ou null quando não há segredo configurado.
 */
export function sealLookupSnapshot({
  token,
  project,
  now = Date.now(),
  ttlMs = LOOKUP_SEAL_TTL_MS,
}: { token: string; project: Project; now?: number; ttlMs?: number }): string | null {
  const secret = lookupSealSecret();
  const aad = String(token ?? '').trim();
  if (!secret || !aad || !project) return null;
  if (!Number.isFinite(now) || !Number.isFinite(ttlMs) || ttlMs <= 0) return null;

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', derivedKey(secret), iv);
  cipher.setAAD(Buffer.from(aad, 'utf8'));
  const payload: SealedPayload = { p: project, e: Math.floor(now + ttlMs) };
  const sealed = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return [SEAL_VERSION, base64url(iv), base64url(sealed), base64url(cipher.getAuthTag())].join('.');
}

/**
 * Abre o lacre e devolve o retrato, ou null quando ele não vale.
 *
 * Um só null para todas as recusas — formato errado, assinatura quebrada, token
 * de outro lookup, prazo vencido. O chamador não tem o que fazer de diferente
 * em cada caso, e distinguir só ajudaria quem estivesse sondando o formato.
 */
export function openLookupSnapshot({
  token,
  seal,
  now = Date.now(),
}: { token: string; seal: unknown; now?: number }): Project | null {
  const secret = lookupSealSecret();
  const aad = String(token ?? '').trim();
  const raw = typeof seal === 'string' ? seal.trim() : '';
  if (!secret || !aad || !raw) return null;

  const parts = raw.split('.');
  if (parts.length !== 4) return null;
  const [version, ivPart, sealedPart, tagPart] = parts;
  if (version !== SEAL_VERSION) return null;

  try {
    const iv = Buffer.from(ivPart, 'base64url');
    const sealed = Buffer.from(sealedPart, 'base64url');
    const tag = Buffer.from(tagPart, 'base64url');
    if (iv.length !== IV_BYTES || tag.length !== TAG_BYTES || sealed.length === 0) return null;

    const decipher = createDecipheriv('aes-256-gcm', derivedKey(secret), iv);
    decipher.setAAD(Buffer.from(aad, 'utf8'));
    decipher.setAuthTag(tag);
    const opened = Buffer.concat([decipher.update(sealed), decipher.final()]);
    const payload = JSON.parse(opened.toString('utf8')) as Partial<SealedPayload>;

    const expiresAt = Number(payload?.e);
    if (!Number.isFinite(expiresAt) || !(now < expiresAt)) return null;
    const project = payload?.p;
    if (!project || typeof project !== 'object' || typeof project.reference !== 'string' || !project.reference) return null;
    return project;
  } catch {
    // `decipher.final()` lança quando a tag não confere. Lacre adulterado,
    // token trocado ou chave errada chegam todos aqui, e todos são a mesma
    // recusa.
    return null;
  }
}

/**
 * Compara dois lacres em tempo constante. Existe para o teste — a rota não
 * precisa comparar lacres, só abrir o que recebeu.
 */
export function sealsMatch(a: unknown, b: unknown) {
  const left = Buffer.from(typeof a === 'string' ? a : '', 'utf8');
  const right = Buffer.from(typeof b === 'string' ? b : '', 'utf8');
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}
