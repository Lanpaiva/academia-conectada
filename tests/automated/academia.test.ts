import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Worker } from "node:worker_threads";
import { Academy, CANCEL_WINDOW_MS, DomainError } from "../../src/lib/academia.ts";

const epoch = Date.UTC(2026, 10, 4, 15);
const valid = { planId: "plus", name: "Aluno Teste", email: "al01@example.test", terms: true };
const workout = { requestId: "envio-1", notes: "Sessão concluída", exercises: [{ id: "leg", load: 35 }] };
function fixture() { return new Academy(":memory:", () => epoch); }
function fails(action: () => unknown, status: number, pattern: RegExp) {
  assert.throws(action, (e: unknown) => e instanceof DomainError && e.status === status && pattern.test(e.message));
}

test("catálogo inicial tem planos, horários futuros e aula lotada", () => {
  const db = fixture(); try {
    const state = db.state(); assert.equal(state.plans.length, 3); assert.equal(state.classes.length, 4);
    assert.ok(state.classes.every(c => c.starts > epoch));
    const full = state.classes.find(c => c.id === "pilates")!; assert.equal(full.occupied, full.capacity);
    assert.equal(state.enrollment, null);
  } finally { db.close(); }
});
test("matrícula persiste protocolo e impede incompatibilidade", () => {
  const db = fixture(); try {
    const first = db.enroll(valid); assert.match(first.protocol, /^MAT-/);
    assert.equal(db.enroll(valid).protocol, first.protocol);
    fails(() => db.enroll({ ...valid, planId: "basic" }), 409, /outro plano/);
    assert.equal(db.state().enrollment!.planId, "plus");
  } finally { db.close(); }
});
for (const [title, change, status] of [
  ["sem aceite", { terms: false }, 422], ["sem nome", { name: " " }, 422],
  ["e-mail inválido", { email: "abc" }, 422], ["plano inexistente", { planId: "x" }, 404]
] as const) test(`matrícula rejeita ${title} sem criar registro`, () => {
  const db = fixture(); try { fails(() => db.enroll({ ...valid, ...change }), status, /./); assert.equal(db.state().enrollment, null); } finally { db.close(); }
});
test("plano desativado não aceita matrícula", () => {
  const db = fixture(); try { db.db.prepare("UPDATE plans SET active=0 WHERE id=?").run("plus"); fails(() => db.enroll(valid), 404, /indisponível/); } finally { db.close(); }
});
test("reserva e treino exigem matrícula", () => {
  const db = fixture(); try { fails(() => db.reserve("bike"), 403, /matrícula/); fails(() => db.saveWorkout(workout), 403, /matrícula/); } finally { db.close(); }
});
test("reserva disponível grava uma vaga e rejeita duplicação", () => {
  const db = fixture(); try {
    db.enroll(valid); db.reserve("bike"); fails(() => db.reserve("bike"), 409, /já tem/);
    const item = db.state().classes.find(c => c.id === "bike")!; assert.equal(item.occupied, 15); assert.equal(item.reserved, 1);
  } finally { db.close(); }
});
test("lotação e conflito não alteram reservas", () => {
  const db = fixture(); try {
    db.enroll(valid); fails(() => db.reserve("pilates"), 409, /lotada/); db.reserve("bike");
    fails(() => db.reserve("funcional"), 409, /conflito/); assert.equal(db.state().classes.filter(c => c.reserved).length, 1);
  } finally { db.close(); }
});
test("aulas consecutivas sem sobreposição são permitidas", () => {
  const db = fixture(); try {
    db.enroll(valid); const bike = db.state().classes.find(c => c.id === "bike")!;
    db.db.prepare("UPDATE classes SET starts=?, ends=? WHERE id='funcional'").run(bike.ends, bike.ends + 3600000);
    db.reserve("bike"); db.reserve("funcional"); assert.equal(db.state().classes.filter(c => c.reserved).length, 2);
  } finally { db.close(); }
});
test("aula inexistente e aula iniciada são rejeitadas", () => {
  const db = fixture(); try { db.enroll(valid); fails(() => db.reserve("inexistente"), 404, /encontrada/); db.db.prepare("UPDATE classes SET starts=? WHERE id='bike'").run(epoch); fails(() => db.reserve("bike"), 409, /começou/); } finally { db.close(); }
});
for (const [offset, allowed] of [[1, true], [0, true], [-1, false]] as const) test(`cancelamento no limite de 2h com diferença ${offset}ms`, () => {
  const db = fixture(); try {
    db.enroll(valid); db.reserve("bike"); const starts = db.state().classes.find(c => c.id === "bike")!.starts;
    db.now = () => starts - CANCEL_WINDOW_MS - offset;
    if (allowed) { db.cancel("bike"); db.cancel("bike"); assert.equal(db.state().classes.find(c => c.id === "bike")!.occupied, 14); }
    else { fails(() => db.cancel("bike"), 409, /2 horas/); assert.equal(db.state().classes.find(c => c.id === "bike")!.occupied, 15); }
  } finally { db.close(); }
});
test("cancelamento não remove reserva de outro aluno", () => {
  const db = fixture(); try { db.enroll(valid); db.enroll(valid, "AL02"); db.reserve("bike", "AL02"); db.cancel("bike"); assert.equal(db.state("AL02").classes.find(c => c.id === "bike")!.reserved, 1); } finally { db.close(); }
});
test("gravação do treino mantém carga realizada e não altera prescrição", () => {
  const db = fixture(); try {
    db.enroll(valid); const first = db.saveWorkout(workout); assert.equal(db.saveWorkout(workout).id, first.id);
    assert.equal(db.state().history.length, 1); assert.equal(db.state().history[0].exercises[0].load, 35);
    assert.equal(db.state().exercises.find(e => e.id === "leg")!.load, 80);
    fails(() => db.saveWorkout({ ...workout, notes: "outro texto" }), 409, /outros dados/);
  } finally { db.close(); }
});
for (const value of [-1, 501, NaN, Infinity, "20"]) test(`carga inválida ${String(value)} não produz histórico`, () => {
  const db = fixture(); try { db.enroll(valid); fails(() => db.saveWorkout({ ...workout, exercises: [{ id: "leg", load: value }] }), 422, /Carga/); assert.equal(db.state().history.length, 0); } finally { db.close(); }
});
for (const value of [0, 500]) test(`carga no limite ${value} é aceita`, () => {
  const db = fixture(); try { db.enroll(valid); db.saveWorkout({ ...workout, exercises: [{ id: "leg", load: value }] }); assert.equal(db.state().history[0].exercises[0].load, value); } finally { db.close(); }
});
test("exercícios ausentes, desconhecidos e repetidos são rejeitados", () => {
  const db = fixture(); try {
    db.enroll(valid);
    for (const exercises of [[], [{ id: "x", load: 2 }], [{ id: "leg", load: 2 }, { id: "leg", load: 3 }]]) fails(() => db.saveWorkout({ ...workout, exercises }), 422, /exercício|Exercício/);
    fails(() => db.saveWorkout({ ...workout, notes: "a".repeat(501) }), 422, /500/);
    assert.equal(db.state().history.length, 0);
  } finally { db.close(); }
});
test("falha na persistência desfaz transação e permite recuperação", () => {
  const db = fixture(); try {
    db.enroll(valid); db.db.exec("CREATE TRIGGER fail_reservation BEFORE INSERT ON reservations BEGIN SELECT RAISE(ABORT,'falha injetada'); END;");
    assert.throws(() => db.reserve("bike"), /falha injetada/); assert.equal(db.state().classes.find(c => c.id === "bike")!.occupied, 14);
    db.db.exec("DROP TRIGGER fail_reservation"); db.reserve("bike"); assert.equal(db.state().classes.find(c => c.id === "bike")!.occupied, 15);
  } finally { db.close(); }
});
test("reabrir o arquivo mantém matrícula, agenda, reserva e treino", () => {
  const dir = mkdtempSync(join(tmpdir(), "academia-test-")); const file = join(dir, "db.sqlite");
  try {
    const first = new Academy(file, () => epoch); first.enroll(valid); first.reserve("bike"); first.saveWorkout(workout); const before = first.state(); first.close();
    const second = new Academy(file, () => epoch + 86400000); const after = second.state(); second.close();
    assert.deepEqual(after.enrollment, before.enrollment); assert.deepEqual(after.classes, before.classes); assert.deepEqual(after.history, before.history);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test("dois processos concorrentes disputam a última vaga sem exceder capacidade", async () => {
  const dir = mkdtempSync(join(tmpdir(), "academia-race-")); const file = join(dir, "db.sqlite");
  const gate = new SharedArrayBuffer(4); const flag = new Int32Array(gate);
  const workers: Worker[] = [];
  try {
    const setup = new Academy(file, () => epoch); setup.enroll(valid, "AL01"); setup.enroll(valid, "AL02"); setup.close();
    let ready = 0;
    const outcomes = await Promise.all(["AL01", "AL02"].map(student => new Promise<string>((resolve, reject) => {
      const worker = new Worker(new URL("./reservation-worker.ts", import.meta.url), { workerData: { file, epoch, student, gate } }); workers.push(worker);
      worker.on("error", reject);
      worker.on("exit", code => { if (code !== 0) reject(new Error(`Worker terminou com ${code}`)); });
      worker.on("message", message => { if (message === "ready") { ready++; if (ready === 2) { Atomics.store(flag, 0, 1); Atomics.notify(flag, 0, 2); } } else resolve(message); });
    })));
    assert.deepEqual(outcomes.sort(), ["lotada", "reservada"]);
    const check = new Academy(file, () => epoch); assert.equal(check.state().classes.find(c => c.id === "alongamento")!.occupied, 10); check.close();
  } finally { await Promise.all(workers.map(worker => worker.terminate())); rmSync(dir, { recursive: true, force: true }); }
});
