import { randomBytes } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
import { Academy, DomainError } from "./academia";

export const DEMO_COOKIE = "academia_demo";
export function demoIdentity(request: Request, renew = false) {
  const current = request.headers.get("cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith(`${DEMO_COOKIE}=`))?.slice(DEMO_COOKIE.length + 1);
  const isNew = renew || !current || !/^[a-f0-9]{64}$/.test(current);
  return { id: isNew ? randomBytes(32).toString("hex") : current!, isNew };
}

function operate(db: Academy, input?: Record<string, unknown>) {
  let result: Record<string, unknown> = {};
  if (input) {
    switch (input.action) {
      case "new-demo": result = { message: "Nova demonstração iniciada. Os dados da demonstração anterior foram preservados." }; break;
      case "enroll": result = db.enroll(input); break;
      case "reserve": result = db.reserve(input.classId); break;
      case "cancel": result = db.cancel(input.classId); break;
      case "workout": {
        // Limite do ambiente acadêmico; reenvios idempotentes continuam permitidos.
        const prior = db.db.prepare("SELECT 1 FROM workouts WHERE student='AL01' AND requestId=?").get(typeof input.requestId === "string" ? input.requestId : "");
        if (!prior && db.state().history.length >= 300) throw new DomainError("Limite da demonstração atingido. Inicie uma nova demonstração.", 409);
        result = db.saveWorkout(input); break;
      }
      default: throw new DomainError("Operação desconhecida.", 400);
    }
  }
  const state = db.state();
  return input ? { ...result, state } : state;
}

/** Pequenos arquivos SQLite por demonstração; publicação atômica por ETag.
 * /tmp é somente área de trabalho. A fonte persistente em produção é Blob privado.
 * Não representa contas, login ou concorrência de vários alunos na mesma turma real.
 */
export async function demoOperation(id: string, input?: Record<string, unknown>) {
  if (!/^[a-f0-9]{64}$/.test(id)) throw new DomainError("Demonstração inválida.", 400);
  const remote = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
  if (process.env.VERCEL && !remote) throw new Error("Armazenamento persistente não configurado.");
  if (!remote) {
    const root = dirname(resolve(process.env.ACADEMIA_DB_PATH || "data/academia.sqlite"));
    const db = new Academy(join(root, "demonstracoes", `${id}.sqlite`));
    try { return operate(db, input); } finally { db.close(); }
  }
  const pathname = `a6/demonstracoes/${id}.sqlite`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const temp = mkdtempSync(join(tmpdir(), "academia-a6-"));
    try {
      const existing = await get(pathname, { access: "private", useCache: false });
      const path = join(temp, "snapshot.sqlite");
      if (existing?.statusCode === 200) {
        const bytes = Buffer.from(await new Response(existing.stream).arrayBuffer());
        if (bytes.length > 4 * 1024 * 1024) throw new Error("Demonstração excede o limite de armazenamento.");
        writeFileSync(path, bytes);
      }
      const db = new Academy(path);
      let response;
      try { response = operate(db, input); } finally { db.close(); }
      if (input || !existing) {
        await put(pathname, readFileSync(path), {
          access: "private", addRandomSuffix: false,
          allowOverwrite: Boolean(existing),
          ...(existing ? { ifMatch: existing.blob.etag } : {}),
          contentType: "application/vnd.sqlite3", cacheControlMaxAge: 60,
        });
      }
      return response;
    } catch (error) {
      const race = error instanceof BlobPreconditionFailedError || (error instanceof Error && /already exists/i.test(error.message));
      if (!race) throw error;
      if (attempt === 3) throw new DomainError("Outra operação atualizou a demonstração. Atualize os dados e tente novamente.", 409);
    } finally { rmSync(temp, { recursive: true, force: true }); }
  }
  throw new Error("Operação não concluída.");
}
