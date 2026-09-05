"use client";

import {
  Activity,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  Edit3,
  HeartPulse,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserCog,
  UserRound,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

type Profile = "visitante" | "aluno" | "instrutor" | "admin";
type Section = "visao" | "planos" | "aulas" | "treino" | "gestao" | "admin";

type Plan = {
  id: string;
  name: string;
  price: string;
  description: string;
  benefits: string[];
  highlight?: boolean;
};

type ClassItem = {
  id: string;
  title: string;
  modality: string;
  teacher: string;
  time: string;
  room: string;
  capacity: number;
  booked: number;
};

type Exercise = {
  id: string;
  name: string;
  sets: string;
  load: string;
  rest: string;
};

type Student = {
  id: string;
  name: string;
  plan: string;
  status: "Ativo" | "Aguardando" | "Revisao";
  nextReview: string;
};

const profileOptions: Array<{ id: Profile; label: string; icon: LucideIcon }> = [
  { id: "visitante", label: "Visitante", icon: UserRound },
  { id: "aluno", label: "Aluno", icon: Dumbbell },
  { id: "instrutor", label: "Instrutor", icon: ClipboardList },
  { id: "admin", label: "Admin", icon: UserCog }
];

const sections: Array<{ id: Section; label: string; icon: LucideIcon }> = [
  { id: "visao", label: "Visão", icon: LayoutDashboard },
  { id: "planos", label: "Planos", icon: Sparkles },
  { id: "aulas", label: "Aulas", icon: CalendarCheck },
  { id: "treino", label: "Treino", icon: Dumbbell },
  { id: "gestao", label: "Gestão", icon: ClipboardList },
  { id: "admin", label: "Admin", icon: ShieldCheck }
];

const plans: Plan[] = [
  {
    id: "basic",
    name: "Essencial",
    price: "R$ 99",
    description: "Acesso livre à musculação, avaliação inicial e treinos base.",
    benefits: ["Musculação", "Treino inicial", "App do aluno"]
  },
  {
    id: "plus",
    name: "Conectado",
    price: "R$ 149",
    description: "Plano completo para aulas coletivas, evolução e acompanhamento.",
    benefits: ["Aulas coletivas", "Evolução mensal", "Reserva online"],
    highlight: true
  },
  {
    id: "premium",
    name: "Performance",
    price: "R$ 219",
    description: "Rotina com revisoes frequentes e acompanhamento personalizado.",
    benefits: ["Instrutor dedicado", "Revisao quinzenal", "Relatorios"]
  }
];

const classes: ClassItem[] = [
  {
    id: "bike",
    title: "Bike indoor",
    modality: "Cardio",
    teacher: "Marina Costa",
    time: "Hoje, 19:00",
    room: "Sala 2",
    capacity: 18,
    booked: 14
  },
  {
    id: "funcional",
    title: "Funcional",
    modality: "Condicionamento",
    teacher: "Rafael Lima",
    time: "Amanhã, 07:30",
    room: "Box externo",
    capacity: 16,
    booked: 9
  },
  {
    id: "pilates",
    title: "Pilates solo",
    modality: "Mobilidade",
    teacher: "Bianca Rocha",
    time: "Amanhã, 18:15",
    room: "Sala 1",
    capacity: 12,
    booked: 12
  }
];

const exercises: Exercise[] = [
  { id: "leg", name: "Leg press", sets: "4 x 10", load: "80 kg", rest: "75 s" },
  { id: "bench", name: "Supino reto", sets: "4 x 8", load: "42 kg", rest: "90 s" },
  { id: "row", name: "Remada baixa", sets: "3 x 12", load: "45 kg", rest: "60 s" },
  { id: "plank", name: "Prancha", sets: "3 x 40 s", load: "Livre", rest: "45 s" }
];

const students: Student[] = [
  {
    id: "lara",
    name: "Lara Souza",
    plan: "Hipertrofia A/B",
    status: "Ativo",
    nextReview: "12 set"
  },
  {
    id: "caio",
    name: "Caio Martins",
    plan: "Condicionamento",
    status: "Revisao",
    nextReview: "Hoje"
  },
  {
    id: "nina",
    name: "Nina Alves",
    plan: "Retorno gradual",
    status: "Aguardando",
    nextReview: "18 set"
  }
];

const evolution = [
  { label: "Mai", value: 44 },
  { label: "Jun", value: 52 },
  { label: "Jul", value: 59 },
  { label: "Ago", value: 67 },
  { label: "Set", value: 76 }
];

const profileCopy: Record<
  Profile,
  { title: string; description: string; primaryAction: string }
> = {
  visitante: {
    title: "Conheça planos, aulas e horários antes da matrícula",
    description:
      "A área pública mostra modalidades, valores demonstrativos e canais de contato para transformar o visitante em aluno.",
    primaryAction: "Criar conta"
  },
  aluno: {
    title: "Acompanhe matrícula, aulas reservadas e treino vigente",
    description:
      "O aluno consulta seu plano, registra a execução do treino e acompanha sua evolução em uma única rotina.",
    primaryAction: "Registrar treino"
  },
  instrutor: {
    title: "Revise treinos e acompanhe alunos autorizados",
    description:
      "Instrutores mantêm planos, ajustam cargas e publicam novas versões sem apagar o histórico.",
    primaryAction: "Nova revisao"
  },
  admin: {
    title: "Administre planos, modalidades, alunos e agenda",
    description:
      "A administração acompanha capacidade, matrículas e cadastros com controle por perfil.",
    primaryAction: "Abrir cadastros"
  }
};

export default function Home() {
  const [activeProfile, setActiveProfile] = useState<Profile>("aluno");
  const [activeSection, setActiveSection] = useState<Section>("visao");
  const [enrolledPlan, setEnrolledPlan] = useState("Conectado");
  const [protocol, setProtocol] = useState("MAT-2026-0905");
  const [reservations, setReservations] = useState<Record<string, boolean>>({
    funcional: true
  });
  const [done, setDone] = useState<Record<string, boolean>>({
    leg: true,
    bench: true
  });

  const completedExercises = useMemo(
    () => exercises.filter((exercise) => done[exercise.id]).length,
    [done]
  );
  const workoutProgress = Math.round((completedExercises / exercises.length) * 100);
  const reservedCount = Object.values(reservations).filter(Boolean).length;

  function handleEnrollment(plan: Plan) {
    setEnrolledPlan(plan.name);
    setProtocol(`MAT-2026-${plan.id.toUpperCase()}`);
    setActiveProfile("aluno");
    setActiveSection("visao");
  }

  function toggleReservation(classId: string) {
    setReservations((current) => ({
      ...current,
      [classId]: !current[classId]
    }));
  }

  function toggleExercise(exerciseId: string) {
    setDone((current) => ({
      ...current,
      [exerciseId]: !current[exerciseId]
    }));
  }

  const visibleSections =
    activeProfile === "visitante"
      ? sections.filter((section) => ["visao", "planos", "aulas"].includes(section.id))
      : sections.filter((section) =>
          activeProfile === "aluno"
            ? ["visao", "planos", "aulas", "treino"].includes(section.id)
            : activeProfile === "instrutor"
              ? ["visao", "treino", "gestao"].includes(section.id)
              : true
        );

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="grid h-12 w-12 place-items-center rounded-md bg-[var(--brand)] text-lg font-bold text-white shadow-sm"
              >
                AC
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-[var(--brand)]">
                  Academia Conectada
                </p>
                <h1 className="text-2xl font-bold text-[#20242c] sm:text-3xl">
                  Gestão de alunos, planos, treinos e aulas
                </h1>
              </div>
            </div>

            <div
              aria-label="Selecionar perfil"
              className="grid grid-cols-2 gap-2 rounded-md border border-[var(--line)] bg-[#f4f4ee] p-1 sm:flex"
              role="group"
            >
              {profileOptions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`focus-ring flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                    activeProfile === id
                      ? "bg-white text-[var(--brand)] shadow-sm"
                      : "text-[#45505d] hover:bg-white/75"
                  }`}
                  onClick={() => {
                    setActiveProfile(id);
                    setActiveSection("visao");
                  }}
                  title={`Usar perfil ${label}`}
                  type="button"
                >
                  <Icon aria-hidden="true" size={17} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <nav aria-label="Secoes do sistema" className="flex gap-2 overflow-x-auto pb-1">
            {visibleSections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`focus-ring flex min-h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition ${
                  activeSection === id
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--line)] bg-white text-[#45505d] hover:border-[#b8c0b4]"
                }`}
                onClick={() => setActiveSection(id)}
                title={`Abrir ${label}`}
                type="button"
              >
                <Icon aria-hidden="true" size={17} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <section className="space-y-5">
          <OverviewPanel
            activeProfile={activeProfile}
            completedExercises={completedExercises}
            enrolledPlan={enrolledPlan}
            protocol={protocol}
            reservedCount={reservedCount}
            workoutProgress={workoutProgress}
          />

          {(activeSection === "visao" || activeSection === "planos") && (
            <PlansPanel
              activeProfile={activeProfile}
              enrolledPlan={enrolledPlan}
              onEnroll={handleEnrollment}
            />
          )}

          {(activeSection === "visao" || activeSection === "aulas") && (
            <ClassesPanel reservations={reservations} onToggle={toggleReservation} />
          )}

          {(activeSection === "visao" || activeSection === "treino") &&
            activeProfile !== "visitante" && (
              <WorkoutPanel
                activeProfile={activeProfile}
                done={done}
                onToggleExercise={toggleExercise}
                progress={workoutProgress}
              />
            )}

          {(activeSection === "gestao" || activeSection === "visao") &&
            activeProfile === "instrutor" && <InstructorPanel />}

          {(activeSection === "admin" || activeSection === "visao") &&
            activeProfile === "admin" && <AdminPanel />}
        </section>

        <aside className="space-y-5">
          <AccessPanel activeProfile={activeProfile} />
          <StatusPanel
            activeProfile={activeProfile}
            enrolledPlan={enrolledPlan}
            protocol={protocol}
            reservedCount={reservedCount}
            workoutProgress={workoutProgress}
          />
        </aside>
      </div>
    </main>
  );
}

function OverviewPanel({
  activeProfile,
  completedExercises,
  enrolledPlan,
  protocol,
  reservedCount,
  workoutProgress
}: {
  activeProfile: Profile;
  completedExercises: number;
  enrolledPlan: string;
  protocol: string;
  reservedCount: number;
  workoutProgress: number;
}) {
  const copy = profileCopy[activeProfile];

  return (
    <section className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[var(--mint)] px-3 py-1 text-sm font-semibold text-[#205734]">
              {activeProfile === "visitante" ? "Área pública" : "Sessão demonstrativa"}
            </span>
            <span className="rounded-md bg-[#fff2c8] px-3 py-1 text-sm font-semibold text-[#73500d]">
              MVP academico
            </span>
          </div>
          <h2 className="max-w-3xl text-3xl font-bold leading-tight text-[#20242c] sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted)]">
            {copy.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--brand)] px-4 text-sm font-bold text-white transition hover:bg-[var(--brand-dark)]"
              href={activeProfile === "visitante" ? "#planos" : "#treino"}
            >
              {copy.primaryAction}
              <ChevronRight aria-hidden="true" size={18} />
            </a>
            <a
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--line)] bg-white px-4 text-sm font-bold text-[#39424e] transition hover:bg-[#f8f8f4]"
              href="#aulas"
            >
              Ver agenda
              <CalendarCheck aria-hidden="true" size={18} />
            </a>
          </div>
        </div>

        <div className="rounded-md border border-[#d9e5dc] bg-[#f5fbf7] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#52606d]">Resumo do acesso</p>
              <p className="mt-1 text-2xl font-bold text-[#20242c]">
                {activeProfile === "visitante" ? "Sem conta" : enrolledPlan}
              </p>
            </div>
            <ShieldCheck aria-hidden="true" className="text-[var(--teal)]" size={32} />
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-3">
            <Metric label="Protocolo" value={protocol.replace("MAT-", "")} />
            <Metric label="Aulas" value={String(reservedCount)} />
            <Metric label="Treino" value={`${workoutProgress}%`} />
          </dl>
          <p className="mt-4 text-sm leading-6 text-[#60706a]">
            {completedExercises} de {exercises.length} exercicios marcados na sessao atual.
          </p>
        </div>
      </div>
    </section>
  );
}

function PlansPanel({
  activeProfile,
  enrolledPlan,
  onEnroll
}: {
  activeProfile: Profile;
  enrolledPlan: string;
  onEnroll: (plan: Plan) => void;
}) {
  return (
    <section
      className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm"
      id="planos"
    >
      <SectionHeader
        icon={Sparkles}
        kicker="Planos e modalidades"
        title="Escolha de plano com matrícula demonstrativa"
      />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const current = enrolledPlan === plan.name;

          return (
            <article
              className={`rounded-md border p-4 ${
                plan.highlight
                  ? "border-[var(--brand)] bg-[#fff8f8]"
                  : "border-[var(--line)] bg-white"
              }`}
              key={plan.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#20242c]">{plan.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    {plan.description}
                  </p>
                </div>
                {plan.highlight && (
                  <span className="rounded-md bg-[var(--brand)] px-2 py-1 text-xs font-bold text-white">
                    Popular
                  </span>
                )}
              </div>

              <p className="mt-4 text-3xl font-bold text-[#20242c]">
                {plan.price}
                <span className="text-sm font-semibold text-[var(--muted)]">/mes</span>
              </p>
              <ul className="mt-4 space-y-2">
                {plan.benefits.map((benefit) => (
                  <li className="flex items-center gap-2 text-sm text-[#3d4652]" key={benefit}>
                    <Check aria-hidden="true" className="text-[#23824a]" size={16} />
                    {benefit}
                  </li>
                ))}
              </ul>
              <button
                className={`focus-ring mt-5 flex min-h-10 w-full items-center justify-center gap-2 rounded-md px-3 text-sm font-bold transition ${
                  current
                    ? "bg-[#e5efe7] text-[#24623b]"
                    : "bg-[#20242c] text-white hover:bg-[#343a44]"
                }`}
                disabled={current && activeProfile !== "visitante"}
                onClick={() => onEnroll(plan)}
                title={current ? "Plano selecionado" : `Solicitar matrícula no plano ${plan.name}`}
                type="button"
              >
                {current ? "Plano atual" : "Solicitar matrícula"}
                <ChevronRight aria-hidden="true" size={17} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ClassesPanel({
  reservations,
  onToggle
}: {
  reservations: Record<string, boolean>;
  onToggle: (classId: string) => void;
}) {
  return (
    <section
      className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm"
      id="aulas"
    >
      <SectionHeader
        icon={CalendarCheck}
        kicker="Agenda de aulas"
        title="Reservas com controle de vagas"
      />
      <div className="mt-5 space-y-3">
        {classes.map((item) => {
          const reserved = Boolean(reservations[item.id]);
          const booked = item.booked + (reserved ? 1 : 0);
          const available = Math.max(item.capacity - booked, 0);
          const percent = Math.min(100, Math.round((booked / item.capacity) * 100));
          const full = available === 0 && !reserved;

          return (
            <article
              className="grid gap-4 rounded-md border border-[var(--line)] bg-[#fdfdfb] p-4 md:grid-cols-[minmax(0,1fr)_180px]"
              key={item.id}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-[#20242c]">{item.title}</h3>
                  <span className="rounded-md bg-[#e7f1f2] px-2 py-1 text-xs font-bold text-[var(--teal)]">
                    {item.modality}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {item.time} · {item.teacher} · {item.room}
                </p>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm font-semibold text-[#4b5563]">
                    <span>{available} vagas disponíveis</span>
                    <span>
                      {booked}/{item.capacity}
                    </span>
                  </div>
                  <div className="h-2 rounded-md bg-[#e6e9e2]">
                    <div
                      className={`h-2 rounded-md ${full ? "bg-[var(--brand)]" : "bg-[var(--teal)]"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-start md:justify-end">
                <button
                  className={`focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition md:w-auto ${
                    reserved
                      ? "border border-[var(--brand)] bg-white text-[var(--brand)] hover:bg-[#fff3f3]"
                      : full
                        ? "bg-[#e6e6e0] text-[#777d85]"
                        : "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]"
                  }`}
                  disabled={full}
                  onClick={() => onToggle(item.id)}
                  title={reserved ? "Cancelar reserva" : "Reservar vaga"}
                  type="button"
                >
                  {reserved ? <X aria-hidden="true" size={17} /> : <Check aria-hidden="true" size={17} />}
                  {reserved ? "Cancelar" : full ? "Lotada" : "Reservar"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function WorkoutPanel({
  activeProfile,
  done,
  onToggleExercise,
  progress
}: {
  activeProfile: Profile;
  done: Record<string, boolean>;
  onToggleExercise: (exerciseId: string) => void;
  progress: number;
}) {
  return (
    <section
      className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm"
      id="treino"
    >
      <SectionHeader
        icon={Dumbbell}
        kicker={activeProfile === "instrutor" ? "Plano publicado" : "Meu treino"}
        title="Sessão A com registro de execução"
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-3">
          {exercises.map((exercise) => {
            const checked = Boolean(done[exercise.id]);

            return (
              <label
                className="grid cursor-pointer gap-3 rounded-md border border-[var(--line)] bg-[#fdfdfb] p-4 sm:grid-cols-[36px_minmax(0,1fr)_160px]"
                key={exercise.id}
              >
                <input
                  checked={checked}
                  className="focus-ring mt-1 h-5 w-5 accent-[var(--brand)]"
                  onChange={() => onToggleExercise(exercise.id)}
                  type="checkbox"
                />
                <span>
                  <span className="block text-base font-bold text-[#20242c]">
                    {exercise.name}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">
                    {exercise.sets} · Carga sugerida {exercise.load} · Descanso {exercise.rest}
                  </span>
                </span>
                <span
                  className={`flex min-h-9 items-center justify-center rounded-md text-sm font-bold ${
                    checked ? "bg-[var(--mint)] text-[#205734]" : "bg-[#eeeeea] text-[#59616d]"
                  }`}
                >
                  {checked ? "Concluído" : "Pendente"}
                </span>
              </label>
            );
          })}
        </div>

        <div className="rounded-md border border-[#dbe5ef] bg-[#f6f9fc] p-4">
          <p className="text-sm font-semibold text-[#52606d]">Evolução do aluno</p>
          <p className="mt-1 text-3xl font-bold text-[#20242c]">{progress}%</p>
          <div className="mt-4 flex h-32 items-end gap-2">
            {evolution.map((point) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={point.label}>
                <div
                  className="w-full rounded-md bg-[var(--teal)]"
                  style={{ height: `${point.value}%` }}
                  title={`${point.label}: ${point.value}%`}
                />
                <span className="text-xs font-semibold text-[#64707d]">{point.label}</span>
              </div>
            ))}
          </div>
          <button
            className="focus-ring mt-5 flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#20242c] px-3 text-sm font-bold text-white transition hover:bg-[#343a44]"
            title="Salvar registro do treino"
            type="button"
          >
            <Activity aria-hidden="true" size={17} />
            Salvar registro
          </button>
        </div>
      </div>
    </section>
  );
}

function InstructorPanel() {
  return (
    <section className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm">
      <SectionHeader
        icon={ClipboardList}
        kicker="Área do instrutor"
        title="Gestão de treinos por aluno"
      />
      <div className="mt-5 grid gap-3">
        {students.map((student) => (
          <article
            className="grid gap-4 rounded-md border border-[var(--line)] bg-[#fdfdfb] p-4 md:grid-cols-[minmax(0,1fr)_170px]"
            key={student.id}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-[#20242c]">{student.name}</h3>
                <StatusBadge status={student.status} />
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Plano: {student.plan} · Proxima revisao: {student.nextReview}
              </p>
            </div>
            <button
              className="focus-ring flex min-h-10 items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white px-3 text-sm font-bold text-[#39424e] transition hover:bg-[#f7f7f2]"
              title={`Editar treino de ${student.name}`}
              type="button"
            >
              <Edit3 aria-hidden="true" size={17} />
              Editar treino
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminPanel() {
  return (
    <section className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm">
      <SectionHeader
        icon={ShieldCheck}
        kicker="Administração"
        title="Cadastros, planos e aulas"
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Alunos ativos" value="128" />
        <Metric label="Instrutores" value="9" />
        <Metric label="Modalidades" value="12" />
        <Metric label="Ocupação" value="78%" />
      </div>
      <div className="mt-5 overflow-hidden rounded-md border border-[var(--line)]">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-[#20242c] px-4 py-3 text-sm font-bold text-white">
          <span>Cadastro</span>
          <span>Status</span>
          <span className="text-right">Acao</span>
        </div>
        {["Planos", "Modalidades", "Aulas coletivas", "Instrutores"].map((row, index) => (
          <div
            className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-[var(--line)] px-4 py-3 text-sm"
            key={row}
          >
            <span className="font-semibold text-[#20242c]">{row}</span>
            <span className="text-[#52606d]">{index === 2 ? "Revisar vagas" : "Ativo"}</span>
            <button
              className="focus-ring justify-self-end rounded-md px-2 py-1 font-bold text-[var(--brand)] hover:bg-[#fff1f1]"
              title={`Manter cadastro de ${row}`}
              type="button"
            >
              Manter
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccessPanel({ activeProfile }: { activeProfile: Profile }) {
  return (
    <section className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#52606d]">Acesso</p>
          <h2 className="text-xl font-bold text-[#20242c]">
            {activeProfile === "visitante" ? "Entrar ou criar conta" : "Perfil autenticado"}
          </h2>
        </div>
        <LockKeyhole aria-hidden="true" className="text-[var(--brand)]" size={28} />
      </div>
      <div className="mt-5 grid gap-3">
        <label className="grid gap-1 text-sm font-semibold text-[#404956]">
          E-mail
          <input
            className="focus-ring min-h-11 rounded-md border border-[var(--line)] bg-[#fdfdfb] px-3 text-[#20242c]"
            defaultValue={
              activeProfile === "visitante" ? "" : `${activeProfile}@academia.test`
            }
            placeholder="nome@email.com"
            type="email"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-[#404956]">
          Perfil
          <select
            className="focus-ring min-h-11 rounded-md border border-[var(--line)] bg-[#fdfdfb] px-3 text-[#20242c]"
            defaultValue={activeProfile}
          >
            {profileOptions.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.label}
              </option>
            ))}
          </select>
        </label>
        <button
          className="focus-ring mt-1 flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--brand)] px-3 text-sm font-bold text-white transition hover:bg-[var(--brand-dark)]"
          title="Entrar no sistema"
          type="button"
        >
          <LogIn aria-hidden="true" size={17} />
          Entrar
        </button>
      </div>
    </section>
  );
}

function StatusPanel({
  activeProfile,
  enrolledPlan,
  protocol,
  reservedCount,
  workoutProgress
}: {
  activeProfile: Profile;
  enrolledPlan: string;
  protocol: string;
  reservedCount: number;
  workoutProgress: number;
}) {
  const rows = [
    ["Perfil", profileOptions.find((profile) => profile.id === activeProfile)?.label ?? ""],
    ["Matrícula", activeProfile === "visitante" ? "Não iniciada" : protocol],
    ["Plano", activeProfile === "visitante" ? "A escolher" : enrolledPlan],
    ["Reservas", String(reservedCount)],
    ["Treino", `${workoutProgress}% concluido`]
  ];

  return (
    <section className="rounded-md border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <HeartPulse aria-hidden="true" className="text-[var(--teal)]" size={28} />
        <h2 className="text-xl font-bold text-[#20242c]">Situação atual</h2>
      </div>
      <dl className="mt-5 divide-y divide-[var(--line)]">
        {rows.map(([label, value]) => (
          <div className="flex items-center justify-between gap-4 py-3" key={label}>
            <dt className="text-sm font-semibold text-[#52606d]">{label}</dt>
            <dd className="text-right text-sm font-bold text-[#20242c]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SectionHeader({
  icon: Icon,
  kicker,
  title
}: {
  icon: LucideIcon;
  kicker: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#f0f2ea] text-[var(--brand)]">
        <Icon aria-hidden="true" size={20} />
      </div>
      <div>
        <p className="text-sm font-bold uppercase text-[var(--brand)]">{kicker}</p>
        <h2 className="text-2xl font-bold text-[#20242c]">{title}</h2>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dce2da] bg-white p-3">
      <dt className="text-xs font-bold uppercase text-[#66717d]">{label}</dt>
      <dd className="mt-1 text-xl font-bold text-[#20242c]">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: Student["status"] }) {
  const className =
    status === "Ativo"
      ? "bg-[var(--mint)] text-[#205734]"
      : status === "Revisao"
        ? "bg-[#fff2c8] text-[#73500d]"
        : "bg-[#eef0f3] text-[#4b5563]";

  return <span className={`rounded-md px-2 py-1 text-xs font-bold ${className}`}>{status}</span>;
}
