import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export const CANCEL_WINDOW_MS = 2 * 60 * 60 * 1000;
export const DEMO_STUDENT = "AL01";
export const prescription = [
  { id: "leg", name: "Leg press", sets: 4, reps: 10, load: 80, rest: 75, guidance: "Realizar o movimento com controle." },
  { id: "bench", name: "Supino reto", sets: 4, reps: 8, load: 42, rest: 90, guidance: "Manter os apoios durante a execução." },
  { id: "row", name: "Remada baixa", sets: 3, reps: 12, load: 45, rest: 60, guidance: "Manter o tronco estável." }
];
export type Plan = { id: string; name: string; price: number; description: string; active: number };
export type ClassItem = { id: string; title: string; teacher: string; starts: number; ends: number; capacity: number; occupied: number; reserved: number };
export type Enrollment = { planId: string; planName: string; protocol: string; name: string; email: string; created: number };
export type Workout = { id: string; created: number; exercises: Array<{ id: string; name: string; sets: number; reps: number; load: number }>; notes: string };
export type AcademyState = { plans: Plan[]; classes: ClassItem[]; enrollment: Enrollment | null; exercises: typeof prescription; history: Workout[]; serverTime: number; cancelWindowMs: number };

export class DomainError extends Error {
  status: number;
  constructor(message: string, status = 422) { super(message); this.status = status; }
}

function field(value: unknown, name: string, max = 120): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new DomainError(`${name} inválido.`);
  return value.trim();
}

/** Serviço da iteração 2. O adaptador HTTP usa somente AL01, sem autenticação. */
export class Academy {
  db: DatabaseSync;
  now: () => number;
  constructor(path: string, now: () => number = Date.now) {
    this.now = now;
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS plans(id TEXT PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL CHECK(price>=0), description TEXT NOT NULL, active INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS classes(id TEXT PRIMARY KEY, title TEXT NOT NULL, teacher TEXT NOT NULL, starts INTEGER NOT NULL, ends INTEGER NOT NULL, capacity INTEGER NOT NULL CHECK(capacity>0), occupied INTEGER NOT NULL CHECK(occupied>=0 AND occupied<=capacity), CHECK(ends>starts));
      CREATE TABLE IF NOT EXISTS enrollments(student TEXT PRIMARY KEY, planId TEXT NOT NULL REFERENCES plans(id), protocol TEXT UNIQUE NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, created INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS reservations(student TEXT NOT NULL REFERENCES enrollments(student), classId TEXT NOT NULL REFERENCES classes(id), created INTEGER NOT NULL, PRIMARY KEY(student,classId));
      CREATE TABLE IF NOT EXISTS workouts(id TEXT PRIMARY KEY, student TEXT NOT NULL REFERENCES enrollments(student), requestId TEXT NOT NULL, payload TEXT NOT NULL, created INTEGER NOT NULL, UNIQUE(student,requestId));`);
    this.transaction(() => {
      const insert = this.db.prepare("INSERT OR IGNORE INTO plans VALUES(?,?,?,?,1)");
      insert.run("basic", "Essencial", 9900, "Musculação e plano de treino inicial.");
      insert.run("plus", "Conectado", 14900, "Musculação, aulas coletivas e acompanhamento.");
      insert.run("premium", "Performance", 21900, "Treinos e revisões frequentes com o instrutor.");
      // Datas futuras criadas uma vez; reiniciar o servidor não altera a agenda.
      const day = new Date(this.now()); day.setUTCHours(22, 0, 0, 0); day.setUTCDate(day.getUTCDate() + 2);
      const start = day.getTime();
      const add = this.db.prepare("INSERT OR IGNORE INTO classes VALUES(?,?,?,?,?,?,?)");
      add.run("bike", "Bike indoor", "Marina Costa", start, start + 3600000, 18, 14);
      add.run("funcional", "Funcional", "Rafael Lima", start + 1800000, start + 5400000, 16, 9);
      add.run("pilates", "Pilates solo", "Bianca Rocha", start + 86400000, start + 90000000, 12, 12);
      add.run("alongamento", "Alongamento", "Marina Costa", start + 90000000, start + 93600000, 10, 9);
    });
  }
  close() { this.db.close(); }
  transaction<T>(work: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try { const result = work(); this.db.exec("COMMIT"); return result; }
    catch (error) { this.db.exec("ROLLBACK"); throw error; }
  }
  state(student = DEMO_STUDENT): AcademyState {
    // Snapshot único: catálogo, reservas e histórico correspondem à mesma leitura.
    return this.transaction(() => ({
      plans: this.db.prepare("SELECT * FROM plans WHERE active=1 ORDER BY price").all() as Plan[],
      classes: this.db.prepare(`SELECT c.id,c.title,c.teacher,c.starts,c.ends,c.capacity,
        c.occupied+(SELECT COUNT(*) FROM reservations r WHERE r.classId=c.id) AS occupied,
        EXISTS(SELECT 1 FROM reservations r WHERE r.classId=c.id AND r.student=?) AS reserved
        FROM classes c ORDER BY c.starts,c.id`).all(student) as ClassItem[],
      enrollment: (this.db.prepare(`SELECT e.planId,p.name AS planName,e.protocol,e.name,e.email,e.created
        FROM enrollments e JOIN plans p ON p.id=e.planId WHERE student=?`).get(student) as Enrollment | undefined) ?? null,
      exercises: prescription,
      history: this.db.prepare("SELECT id,created,payload FROM workouts WHERE student=? ORDER BY created DESC,id DESC").all(student).map(row => ({ id: String(row.id), created: Number(row.created), ...JSON.parse(String(row.payload)) })),
      serverTime: this.now(), cancelWindowMs: CANCEL_WINDOW_MS
    }));
  }
  enroll(input: Record<string, unknown>, student = DEMO_STUDENT) {
    const planId = field(input.planId, "Plano");
    const name = field(input.name, "Nome", 100);
    const email = field(input.email, "E-mail", 200).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new DomainError("Informe um e-mail válido.");
    if (input.terms !== true) throw new DomainError("Aceite os termos para solicitar matrícula.");
    return this.transaction(() => {
      if (!this.db.prepare("SELECT id FROM plans WHERE id=? AND active=1").get(planId)) throw new DomainError("Plano indisponível.", 404);
      const existing = this.db.prepare("SELECT planId,protocol FROM enrollments WHERE student=?").get(student);
      if (existing) {
        if (existing.planId !== planId) throw new DomainError("Já existe matrícula ativa em outro plano.", 409);
        return { message: "Matrícula já existente. Protocolo preservado.", protocol: String(existing.protocol) };
      }
      const protocol = `MAT-${randomUUID()}`;
      this.db.prepare("INSERT INTO enrollments VALUES(?,?,?,?,?,?)").run(student, planId, protocol, name, email, this.now());
      return { message: "Matrícula acadêmica registrada e ativada, sem cobrança.", protocol };
    });
  }
  requireEnrollment(student: string) {
    if (!this.db.prepare("SELECT student FROM enrollments WHERE student=?").get(student)) throw new DomainError("Realize a matrícula antes de continuar.", 403);
  }
  reserve(classId: unknown, student = DEMO_STUDENT) {
    const id = field(classId, "Aula");
    return this.transaction(() => {
      this.requireEnrollment(student);
      const item = this.db.prepare("SELECT * FROM classes WHERE id=?").get(id);
      if (!item) throw new DomainError("Aula não encontrada.", 404);
      if (Number(item.starts) <= this.now()) throw new DomainError("A aula já começou.", 409);
      if (this.db.prepare("SELECT 1 FROM reservations WHERE student=? AND classId=?").get(student, id)) throw new DomainError("Você já tem reserva nesta aula.", 409);
      const count = Number(this.db.prepare("SELECT COUNT(*) AS n FROM reservations WHERE classId=?").get(id)!.n);
      if (Number(item.occupied) + count >= Number(item.capacity)) throw new DomainError("Aula lotada.", 409);
      if (this.db.prepare(`SELECT 1 FROM reservations r JOIN classes c ON c.id=r.classId
        WHERE r.student=? AND c.starts<? AND c.ends>?`).get(student, item.ends, item.starts)) throw new DomainError("Há conflito com outra aula reservada.", 409);
      this.db.prepare("INSERT INTO reservations VALUES(?,?,?)").run(student, id, this.now());
      return { message: "Reserva confirmada." };
    });
  }
  cancel(classId: unknown, student = DEMO_STUDENT) {
    const id = field(classId, "Aula");
    return this.transaction(() => {
      this.requireEnrollment(student);
      const item = this.db.prepare("SELECT starts FROM classes WHERE id=?").get(id);
      if (!item) throw new DomainError("Aula não encontrada.", 404);
      if (!this.db.prepare("SELECT 1 FROM reservations WHERE student=? AND classId=?").get(student, id)) return { message: "Nenhuma reserva ativa nesta aula." };
      if (Number(item.starts) - this.now() < CANCEL_WINDOW_MS) throw new DomainError("Cancelamento permitido até 2 horas antes da aula.", 409);
      this.db.prepare("DELETE FROM reservations WHERE student=? AND classId=?").run(student, id);
      return { message: "Reserva cancelada. A vaga foi liberada." };
    });
  }
  saveWorkout(input: Record<string, unknown>, student = DEMO_STUDENT) {
    const requestId = field(input.requestId, "Identificador do envio", 100);
    if (!Array.isArray(input.exercises) || input.exercises.length === 0 || input.exercises.length > prescription.length) throw new DomainError("Marque pelo menos um exercício.");
    if (typeof input.notes !== "string" || input.notes.trim().length > 500) throw new DomainError("Observação deve ter até 500 caracteres.");
    const seen = new Set<string>();
    const exercises = input.exercises.map((entry: unknown) => {
      if (!entry || typeof entry !== "object") throw new DomainError("Exercício inválido.");
      const value = entry as Record<string, unknown>;
      const exercise = prescription.find(p => p.id === value.id);
      if (!exercise || seen.has(exercise.id)) throw new DomainError("Exercício inválido ou duplicado.");
      seen.add(exercise.id);
      if (typeof value.load !== "number" || !Number.isFinite(value.load) || value.load < 0 || value.load > 500) throw new DomainError("Carga deve ser um número entre 0 e 500 kg.");
      return { id: exercise.id, name: exercise.name, sets: exercise.sets, reps: exercise.reps, load: value.load };
    }).sort((a, b) => a.id.localeCompare(b.id));
    const payload = JSON.stringify({ exercises, notes: input.notes.trim() });
    return this.transaction(() => {
      this.requireEnrollment(student);
      const existing = this.db.prepare("SELECT id,payload FROM workouts WHERE student=? AND requestId=?").get(student, requestId);
      if (existing) {
        if (existing.payload !== payload) throw new DomainError("Este envio já foi utilizado com outros dados. Inicie um novo registro.", 409);
        return { message: "Registro já salvo. Histórico preservado.", id: String(existing.id) };
      }
      const id = randomUUID();
      this.db.prepare("INSERT INTO workouts VALUES(?,?,?,?,?)").run(id, student, requestId, payload, this.now());
      return { message: "Treino salvo no histórico.", id };
    });
  }
}
