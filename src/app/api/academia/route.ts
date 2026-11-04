import { resolve } from "node:path";
import { Academy, DomainError } from "../../../lib/academia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const globalDb = globalThis as typeof globalThis & { academy?: Academy; academyConstructor?: typeof Academy };
function database() {
  // Reabre a conexão após hot reload para não manter instâncias de classes antigas.
  if (globalDb.academy && globalDb.academyConstructor !== Academy) {
    globalDb.academy.close();
    globalDb.academy = undefined;
  }
  globalDb.academy ??= new Academy(resolve(process.env.ACADEMIA_DB_PATH || "data/academia.sqlite"));
  globalDb.academyConstructor = Academy;
  return globalDb.academy;
}
function reply(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}
function failure(error: unknown) {
  if (error instanceof DomainError) return reply({ error: error.message }, error.status);
  console.error("Falha no serviço da academia", error);
  return reply({ error: "Não foi possível concluir a operação. Atualize os dados antes de tentar novamente." }, 500);
}
export async function GET() {
  try { return reply(database().state()); } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    // Instância acadêmica compartilhada, sem contas reais. Não é autenticação.
    const origin = request.headers.get("origin");
    // Next pode normalizar request.url para localhost no desenvolvimento.
    // Host representa o endereço efetivamente usado pelo navegador.
    const address = new URL(request.url);
    const expectedOrigin = `${address.protocol}//${request.headers.get("host") || address.host}`;
    if (origin && origin !== expectedOrigin) return reply({ error: "Origem não permitida." }, 403);
    if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "Envie JSON." }, 415);
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Corpo JSON obrigatório." }, 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 8192) { await reader.cancel(); return reply({ error: "Solicitação excede 8 KB." }, 413); }
      chunks.push(chunk.value);
    }
    let input: Record<string, unknown>;
    try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
    catch { return reply({ error: "JSON inválido." }, 400); }
    if (!input || typeof input !== "object" || Array.isArray(input)) return reply({ error: "Objeto JSON obrigatório." }, 400);
    const db = database();
    let result;
    switch (input.action) {
      case "enroll": result = db.enroll(input); break;
      case "reserve": result = db.reserve(input.classId); break;
      case "cancel": result = db.cancel(input.classId); break;
      case "workout": result = db.saveWorkout(input); break;
      default: return reply({ error: "Operação desconhecida." }, 400);
    }
    return reply({ ...result, state: db.state() });
  } catch (error) { return failure(error); }
}
