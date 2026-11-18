import { DomainError } from "../../../lib/academia";
import { DEMO_COOKIE, demoIdentity, demoOperation } from "../../../lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function success(data: unknown, request: Request, identity: ReturnType<typeof demoIdentity>) {
  const response = reply(data);
  if (identity.isNew) response.headers.set("Set-Cookie", `${DEMO_COOKIE}=${identity.id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`);
  return response;
}
function reply(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}
function failure(error: unknown) {
  if (error instanceof DomainError) return reply({ error: error.message }, error.status);
  console.error("Falha no serviço da academia", error);
  return reply({ error: "Não foi possível concluir a operação. Atualize os dados antes de tentar novamente." }, 500);
}
export async function GET(request: Request) {
  try {
    const identity = demoIdentity(request);
    return success(await demoOperation(identity.id), request, identity);
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    // Demonstração isolada pelo cookie aleatório; não é autenticação de usuário.
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
    if (!["enroll", "reserve", "cancel", "workout", "new-demo"].includes(String(input.action))) return reply({ error: "Operação desconhecida." }, 400);
    const identity = demoIdentity(request, input.action === "new-demo");
    return success(await demoOperation(identity.id, input), request, identity);
  } catch (error) { return failure(error); }
}
