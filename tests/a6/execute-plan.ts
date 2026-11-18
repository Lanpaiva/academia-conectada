/** Executa regras do recorte implementado; não simula aprovação dos perfis da A4. */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Academy, DomainError, CANCEL_WINDOW_MS } from "../../src/lib/academia.ts";

const output = process.env.A6_OUTPUT || "docs/a6/evidencias";
mkdirSync(output, { recursive: true });
const epoch = Date.UTC(2026, 10, 18, 15);
const enrollment = { name: "Aluno Teste A6", email: "al01@example.test", planId: "basic", terms: true };
const workout = { requestId: "a6-envio", exercises: [{ id: "leg", load: 20 }, { id: "row", load: 15 }], notes: "Movimento realizado com controle" };
const results: Array<Record<string, unknown>> = [];
function denied(action: () => unknown, status: number, text: RegExp) {
  assert.throws(action, (error: unknown) => error instanceof DomainError && error.status === status && text.test(error.message));
}
function run(id: string, source: string, title: string, action: (db: Academy) => string) {
  const start = performance.now();
  const db = new Academy(":memory:", () => epoch);
  try {
    const observed = action(db);
    results.push({ id, source, title, status: "Aprovado", observed, durationMs: +(performance.now() - start).toFixed(2) });
  } catch (error) {
    results.push({ id, source, title, status: "Reprovado", observed: String(error), durationMs: +(performance.now() - start).toFixed(2) });
  } finally { db.close(); }
}
run("A6-S01", "CT02-01", "Catálogo público do recorte", db => {
  const s = db.state(); assert.equal(s.plans[0].price, 9900); assert.equal(s.plans[0].name, "Essencial"); assert.equal(s.classes.length, 4);
  return "Três planos; Essencial R$ 99,00; quatro aulas futuras. Não verifica perfil autenticado.";
});
run("A6-S02", "CT03-01, CT03-02", "Matrícula e protocolo persistido", db => {
  const { protocol } = db.enroll(enrollment); const state = db.state();
  assert.equal(state.enrollment?.protocol, protocol); assert.equal(state.enrollment?.planId, "basic");
  assert.equal(db.enroll(enrollment).protocol, protocol); assert.equal(db.db.prepare("SELECT COUNT(*) n FROM enrollments").get()?.n, 1);
  return "AL01 vinculado ao Essencial; consulta e reenvio preservam protocolo e uma única matrícula; sem pagamento.";
});
run("A6-S03", "CT03-03", "Dados obrigatórios", db => {
  for (const change of [{ name: "" }, { email: "" }, { email: "invalido" }]) denied(() => db.enroll({ ...enrollment, ...change }), 422, /Nome|mail/);
  assert.equal(db.state().enrollment, null); return "Nome vazio, e-mail vazio e inválido recusados; nenhuma matrícula.";
});
run("A6-S04", "CT03-04", "Aceite dos termos", db => {
  denied(() => db.enroll({ ...enrollment, terms: false }), 422, /Aceite/); assert.equal(db.state().enrollment, null); return "Sem aceite retorna 422 e não grava protocolo.";
});
run("A6-S05", "CT03-05", "Plano indisponível", db => {
  db.db.exec("UPDATE plans SET active=0 WHERE id='basic'"); denied(() => db.enroll(enrollment), 404, /indisponível/);
  assert.equal(db.state().enrollment, null); return "Plano desativado recusado também na camada de serviço.";
});
run("A6-S06", "CT03-06", "Matrícula incompatível", db => {
  db.enroll(enrollment); const before = db.state().enrollment; denied(() => db.enroll({ ...enrollment, planId: "plus" }), 409, /outro plano/);
  assert.deepEqual(db.state().enrollment, before); return "Outro plano retorna 409; matrícula original intacta.";
});
run("A6-S07", "CT04-01", "Reserva da última vaga", db => {
  db.enroll(enrollment); db.reserve("alongamento"); const c = db.state().classes.find(c => c.id === "alongamento")!;
  assert.equal(c.capacity, 10); assert.equal(c.occupied, 10); assert.equal(c.reserved, 1); return "Ocupação passou de 9 para 10; reserva persistida. Ocupação inicial é massa sintética.";
});
run("A6-S08", "CT04-02", "Reserva sem matrícula", db => {
  denied(() => db.reserve("alongamento"), 403, /matrícula/); assert.equal(db.state().classes.find(c => c.id === "alongamento")?.occupied, 9);
  return "Sem matrícula retorna 403; vaga preservada. Não simula login de AL03.";
});
run("A6-S09", "CT04-03", "Lotação", db => {
  db.enroll(enrollment); denied(() => db.reserve("pilates"), 409, /lotada/); assert.equal(db.state().classes.find(c => c.id === "pilates")?.occupied, 12);
  return "Pilates lotada retorna 409 e mantém ocupação 12/12.";
});
run("A6-S10", "CT04-04", "Duplicidade", db => {
  db.enroll(enrollment); db.db.exec("UPDATE classes SET capacity=10,occupied=8 WHERE id='bike'"); db.reserve("bike");
  denied(() => db.reserve("bike"), 409, /já tem/); const c = db.state().classes.find(c => c.id === "bike")!;
  assert.equal(c.occupied, 9); assert.equal(c.reserved, 1); return "Duplicação recusada; uma reserva, ocupação 9/10.";
});
run("A6-S11", "CT04-05", "Conflito de horário", db => {
  db.enroll(enrollment); db.reserve("bike"); denied(() => db.reserve("funcional"), 409, /conflito/);
  assert.equal(db.state().classes.filter(c => c.reserved).length, 1); return "Sobreposição Bike/Funcional recusada; apenas Bike reservada.";
});
run("A6-S12", "CT04-06", "Cancelamento idempotente", db => {
  db.enroll(enrollment); db.reserve("alongamento"); db.cancel("alongamento"); db.cancel("alongamento");
  assert.equal(db.state().classes.find(c => c.id === "alongamento")?.occupied, 9); return "Duas solicitações de cancelamento liberam somente uma vaga; ocupação 9/10.";
});
run("A6-S13", "CT04-07, CT04-08", "Fronteiras do prazo", db => {
  db.enroll(enrollment); const start = db.state().classes.find(c => c.id === "bike")!.starts;
  for (const offset of [1, 0, -1]) {
    db.now = () => epoch; db.reserve("bike"); db.now = () => start - CANCEL_WINDOW_MS - offset;
    if (offset >= 0) { db.cancel("bike"); assert.equal(db.state().classes.find(c => c.id === "bike")?.reserved, 0); }
    else { denied(() => db.cancel("bike"), 409, /2 horas/); assert.equal(db.state().classes.find(c => c.id === "bike")?.reserved, 1); }
  }
  return "T=2h inclusivo; T+1ms e T aceitos; T−1ms recusado, sem liberar a vaga.";
});
run("A6-S14", "CT04-10", "Falha e recuperação", db => {
  db.enroll(enrollment); db.db.exec("CREATE TRIGGER fail_a6 BEFORE INSERT ON reservations BEGIN SELECT RAISE(ABORT,'falha A6'); END;");
  assert.throws(() => db.reserve("alongamento"), /falha A6/); assert.equal(db.state().classes.find(c => c.id === "alongamento")?.occupied, 9);
  db.db.exec("DROP TRIGGER fail_a6"); db.reserve("alongamento"); assert.equal(db.state().classes.find(c => c.id === "alongamento")?.occupied, 10);
  return "Erro injetado aborta transação; após recuperação, apenas uma reserva é gravada.";
});
run("A6-S15", "CT05-01", "Consulta da prescrição demonstrativa", db => {
  db.enroll(enrollment); const ex = db.state().exercises;
  assert.deepEqual(ex.map(e => e.id), ["leg", "bench", "row"]); assert.equal(ex[0].sets, 4); assert.equal(ex[0].load, 80); assert.equal(ex[0].rest, 75);
  return "Sessão A fixa com três exercícios e orientações. Não cobre duas sessões ou atribuição individual da A4.";
});
run("A6-S16", "CT06-01", "Registro e histórico", db => {
  db.enroll(enrollment); db.saveWorkout(workout); const s = db.state(); assert.equal(s.history.length, 1);
  assert.deepEqual(s.history[0].exercises.map(e => e.load), [20, 15]); assert.equal(s.history[0].notes, workout.notes); assert.equal(s.exercises[0].load, 80);
  return "Histórico contém cargas 20/15 kg e observação; prescrição original permanece em 80 kg para Leg press.";
});
run("A6-S17", "CT06-02", "Carga não numérica e correção", db => {
  db.enroll(enrollment); denied(() => db.saveWorkout({ ...workout, exercises: [{ id: "leg", load: "vinte" }, { id: "row", load: 15 }] }), 422, /Carga/);
  assert.equal(db.state().history.length, 0); db.saveWorkout(workout); assert.equal(db.state().history.length, 1); return "Texto rejeitado sem registro parcial; após correção, somente um treino completo.";
});
run("A6-S18", "CT06-03", "Limites da carga", db => {
  db.enroll(enrollment);
  for (const load of [-0.01, 500.01]) denied(() => db.saveWorkout({ ...workout, exercises: [{ id: "leg", load }] }), 422, /Carga/);
  for (const load of [0, 500]) db.saveWorkout({ ...workout, requestId: `limite-${load}`, exercises: [{ id: "leg", load }] });
  assert.equal(db.state().history.length, 2); return "0 e 500 kg aceitos; −0,01 e 500,01 recusados. Repetições não são editáveis nesta versão.";
});
run("A6-S19", "CT06-05", "Reenvio após resposta perdida", db => {
  db.enroll(enrollment); db.saveWorkout(workout); db.saveWorkout(workout); assert.equal(db.state().history.length, 1);
  return "Repetir a mesma chave de envio preserva um único registro; interrupção real da rede é verificada separadamente no navegador.";
});
run("A6-S20", "CT03-02, CT04-01, CT06-01", "Persistência após reabrir arquivo", () => {
  const dir = mkdtempSync(join(tmpdir(), "a6-persist-")); const path = join(dir, "test.sqlite");
  try {
    const first = new Academy(path, () => epoch); first.enroll(enrollment); first.reserve("bike"); first.saveWorkout(workout); const a = first.state(); first.close();
    const second = new Academy(path, () => epoch + 1000); const b = second.state(); second.close();
    assert.deepEqual(b.enrollment, a.enrollment); assert.deepEqual(b.history, a.history); assert.deepEqual(b.classes, a.classes);
    return "Nova conexão ao arquivo recupera matrícula, protocolo, reserva e treino sem duplicação.";
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
const report = { executedAt: new Date().toISOString(), node: process.version, scope: "Recorte operacionalizado da v2; IDs A6-S não são aprovação integral dos cenários originais A4.", fixtures: "SQLite isolado; relógio 18/11/2026 12h São Paulo; AL01 fixo, sem login; basic=PL01; aulas e exercícios mapeados por função.", results };
writeFileSync(join(output, "servico.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`${results.filter(r => r.status === "Aprovado").length}/${results.length} verificações de serviço aprovadas.`);
if (results.some(r => r.status !== "Aprovado")) process.exitCode = 1;
