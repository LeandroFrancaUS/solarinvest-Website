import { NextResponse } from "next/server";
import { processKommoPreAnalise } from "@/lib/kommo/preAnalise";

export const runtime = "nodejs"; // ✅ OBRIGATÓRIO

export async function POST(request: Request) {
  // 🔐 Validar credenciais Kommo (server-side)
  const subdomain = process.env.KOMMO_SUBDOMAIN;
  const token = process.env.KOMMO_LONG_LIVED_TOKEN;

  if (!subdomain || !token) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: "KOMMO_NOT_CONFIGURED",
        message:
          "Integração indisponível no momento. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }

  // 📦 Parse seguro do body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errorCode: "INVALID_JSON",
        message: "Formato inválido. Envie os dados novamente.",
      },
      { status: 400 }
    );
  }

  // 🌐 Captura de IP (para rate limit / log / auditoria)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  // 🚀 Processa pré-análise (Kommo)
  try {
    const result = await processKommoPreAnalise(body as any, ip);

    return NextResponse.json(result.body, {
      status: result.status,
    });
  } catch (error) {
    console.error("Erro ao processar pré-análise Kommo:", error);

    return NextResponse.json(
      {
        ok: false,
        errorCode: "INTERNAL_ERROR",
        message:
          "Não foi possível enviar sua pré-análise agora. Tente novamente em alguns minutos.",
      },
      { status: 500 }
    );
  }
}
