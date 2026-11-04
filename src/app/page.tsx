"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Check, Dumbbell, RefreshCw } from "lucide-react";
import type { AcademyState } from "../lib/academia";

const button = "focus-ring min-h-11 rounded-md bg-[var(--brand)] px-4 py-2 font-bold text-white hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-50";
const input = "focus-ring min-h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2";
const panel = "rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6";
const dateTime = (time: number) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(time);
const currency = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
async function readState(signal?: AbortSignal): Promise<AcademyState> {
  const response = await fetch("/api/academia", { cache: "no-store", signal });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Falha ao consultar os dados.");
  return body;
}

export default function Home() {
  const [state, setState] = useState<AcademyState | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [planId, setPlanId] = useState("plus");
  const [name, setName] = useState("Aluno de Demonstração");
  const [email, setEmail] = useState("al01@example.test");
  const [terms, setTerms] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loads, setLoads] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const requestId = useRef("");
  const requestInFlight = useRef(false);

  async function refresh() {
    try {
      setState(await readState());
      setError("");
    } catch (reason) {
      if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    readState(controller.signal).then(setState).catch(reason => {
      if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message);
    });
    return () => controller.abort();
  }, []);

  async function send(payload: Record<string, unknown>) {
    if (requestInFlight.current) return false;
    requestInFlight.current = true;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/academia", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Operação não concluída.");
      setState(body.state); setMessage(body.message);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha de conexão. Atualize os dados para conferir o resultado.");
      return false;
    } finally { setBusy(false); requestInFlight.current = false; }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[var(--brand)] font-bold text-white">AC</span>
            <div><h1 className="text-2xl font-bold">Academia Conectada</h1><p className="text-sm text-[var(--muted)]">Sua matrícula, suas aulas e seu treino</p></div>
          </div>
          <nav aria-label="Seções" className="flex flex-wrap gap-4 text-sm font-bold text-[var(--brand)]">
            <a className="focus-ring p-2" href="#matricula">Matrícula</a><a className="focus-ring p-2" href="#aulas">Aulas</a><a className="focus-ring p-2" href="#treino">Treino</a>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <section className={panel}>
          <p className="text-sm font-bold text-[var(--brand)]">ITERAÇÃO 2</p>
          <h2 className="mt-2 text-3xl font-bold">Organize sua rotina na academia</h2>
          <p className="mt-3 max-w-3xl leading-7">Escolha um plano, reserve sua próxima aula e acompanhe os treinos registrados.</p>
          <p className="mt-4 rounded-md bg-[#fff2c8] p-3 text-sm leading-6 text-[#624510]">Ambiente acadêmico compartilhado com o aluno de demonstração AL01. Use somente dados fictícios. A matrícula não gera cobrança; esta versão não possui login.</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="rounded-md bg-[var(--mint)] px-3 py-2 font-semibold text-[#205734]">{state?.enrollment ? `Plano ${state.enrollment.planName} ativo` : "Matrícula não realizada"}</span>
            <span>{state?.classes.filter(item => item.reserved).length ?? 0} reserva(s)</span>
            <span>{state?.history.length ?? 0} treino(s) registrado(s)</span>
            <button className="focus-ring ml-auto flex min-h-11 items-center gap-2 rounded-md border border-[var(--line)] px-3 font-semibold disabled:opacity-50" type="button" disabled={busy} onClick={() => void refresh()}><RefreshCw size={16} aria-hidden="true" />Atualizar dados</button>
          </div>
        </section>
        <div aria-live="polite" aria-atomic="true">{message && <p className="rounded-md border border-[#b9dfc6] bg-[var(--mint)] p-4 font-semibold text-[#205734]">{message}</p>}</div>
        {error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-4 font-semibold text-red-800">{error}</p>}
        {!state ? <p role="status">{error ? "Use Atualizar dados para tentar novamente." : "Carregando dados da academia…"}</p> : <>
          <section id="matricula" className={panel}>
            <h2 className="text-2xl font-bold">Planos e matrícula</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {state.plans.map(plan => <article key={plan.id} className={`rounded-md border p-4 ${planId === plan.id ? "border-[var(--brand)] bg-[#fff8f8]" : "border-[var(--line)]"}`}>
                <h3 className="text-xl font-bold">{plan.name}</h3><p className="mt-2 text-2xl font-bold">{currency(plan.price)}<span className="text-sm font-normal"> / mês</span></p>
                <p className="mt-3 text-sm leading-6">{plan.description}</p>
                {!state.enrollment && <button type="button" disabled={busy} className="focus-ring mt-4 min-h-11 rounded-md border border-[var(--brand)] px-3 font-bold text-[var(--brand)]" onClick={() => setPlanId(plan.id)} aria-pressed={planId === plan.id}>{planId === plan.id ? "Selecionado" : `Selecionar ${plan.name}`}</button>}
              </article>)}
            </div>
            {state.enrollment ? <div className="mt-5 rounded-md bg-[#f5fbf7] p-4 leading-7">
              <h3 className="font-bold">Matrícula confirmada</h3><p>{state.enrollment.name} · {state.enrollment.planName}</p><p className="break-all text-sm">Protocolo: {state.enrollment.protocol}</p><p className="text-sm">Registrada em {dateTime(state.enrollment.created)}. Sem pagamento nesta etapa acadêmica.</p>
            </div> : <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={event => { event.preventDefault(); void send({ action: "enroll", planId, name, email, terms }); }}>
              <label className="grid gap-2 font-semibold">Nome fictício<input className={input} required maxLength={100} autoComplete="off" value={name} onChange={event => setName(event.target.value)} disabled={busy} /></label>
              <label className="grid gap-2 font-semibold">E-mail fictício<input className={input} required type="email" maxLength={200} autoComplete="off" value={email} onChange={event => setEmail(event.target.value)} disabled={busy} /></label>
              <label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2"><input className="focus-ring mt-1 h-5 w-5 shrink-0 accent-[var(--brand)]" type="checkbox" required checked={terms} onChange={event => setTerms(event.target.checked)} disabled={busy} />Aceito os termos da demonstração acadêmica: uso de dados fictícios, ativação imediata da matrícula para testes e ausência de cobrança.</label>
              <button className={button} disabled={busy} type="submit">{busy ? "Processando…" : "Confirmar matrícula"}</button>
            </form>}
          </section>
          <section id="aulas" className={panel}>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><CalendarCheck aria-hidden="true" />Agenda de aulas</h2>
            <p className="mt-2 text-sm leading-6">Horários de São Paulo. Cancelamento permitido até 2 horas antes do início, incluindo o instante exato do limite.</p>
            {!state.enrollment && <p className="mt-3 font-semibold text-[var(--brand)]">Confirme sua matrícula para reservar uma vaga.</p>}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {state.classes.map(item => {
                const available = item.capacity - item.occupied;
                const expired = item.starts <= state.serverTime;
                const late = item.starts - state.serverTime < state.cancelWindowMs;
                const disabled = busy || !state.enrollment || (item.reserved ? late : expired || available === 0);
                return <article key={item.id} className="rounded-md border border-[var(--line)] p-4">
                  <h3 className="text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6">{dateTime(item.starts)} · {item.teacher}</p>
                  <p className="mt-3 font-semibold">{available} vaga(s) disponível(is) de {item.capacity}</p>
                  {Boolean(item.reserved) && <p className="mt-2 flex items-center gap-2 font-bold text-[#205734]"><Check size={17} aria-hidden="true" />Sua reserva está confirmada</p>}
                  <button className={`${button} mt-4 w-full`} type="button" disabled={disabled} onClick={() => void send({ action: item.reserved ? "cancel" : "reserve", classId: item.id })}>{item.reserved ? late ? "Prazo de cancelamento encerrado" : "Cancelar reserva" : expired ? "Aula iniciada" : available === 0 ? "Lotada" : `Reservar ${item.title}`}</button>
                </article>;
              })}
            </div>
          </section>
          <section id="treino" className={panel}>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><Dumbbell aria-hidden="true" />Meu treino</h2>
            <p className="mt-2 text-sm leading-6">Sessão A de demonstração. Marque os exercícios realizados e informe a carga utilizada para registrar a sessão.</p>
            {!state.enrollment ? <p className="mt-4 font-semibold text-[var(--brand)]">Confirme a matrícula para consultar e registrar o treino.</p> : <form className="mt-5 space-y-4" onSubmit={async event => {
              event.preventDefault();
              if (!requestId.current) requestId.current = crypto.randomUUID();
              const saved = await send({ action: "workout", requestId: requestId.current, notes, exercises: state.exercises.filter(item => selected[item.id]).map(item => ({ id: item.id, load: Number(loads[item.id] ?? item.load) })) });
              if (saved) { setSelected({}); setNotes(""); requestId.current = ""; }
            }}>
              <fieldset disabled={busy} className="space-y-3">
                <legend className="mb-3 font-bold">Exercícios da sessão</legend>
                {state.exercises.map(item => <div key={item.id} className="grid gap-4 rounded-md border border-[var(--line)] p-4 sm:grid-cols-[1fr_150px]">
                  <label className="flex items-start gap-3"><input className="focus-ring mt-1 h-5 w-5 shrink-0 accent-[var(--brand)]" type="checkbox" checked={Boolean(selected[item.id])} onChange={event => { setSelected({ ...selected, [item.id]: event.target.checked }); requestId.current = ""; }} /><span><span className="font-bold">{item.name}</span><span className="mt-1 block text-sm leading-6">{item.sets} séries × {item.reps} repetições · {item.load} kg sugeridos · {item.rest}s de descanso.</span><span className="block text-sm leading-6">{item.guidance}</span></span></label>
                  <label className="grid gap-2 text-sm font-semibold">Carga de {item.name} (kg)<input className={input} type="number" min="0" max="500" step="any" required={Boolean(selected[item.id])} disabled={!selected[item.id]} value={loads[item.id] ?? item.load} onChange={event => { setLoads({ ...loads, [item.id]: event.target.value }); requestId.current = ""; }} /></label>
                </div>)}
                <label className="grid gap-2 font-semibold">Observações<textarea className={input} rows={3} maxLength={500} value={notes} onChange={event => { setNotes(event.target.value); requestId.current = ""; }} placeholder="Como foi a sessão?" /></label>
              </fieldset>
              <button className={button} type="submit" disabled={busy || !Object.values(selected).some(Boolean)}>{busy ? "Salvando…" : "Salvar treino"}</button>
            </form>}
            <h3 className="mt-7 text-xl font-bold">Histórico de treinos</h3>
            {state.history.length === 0 ? <p className="mt-3 text-sm">Nenhum treino registrado.</p> : <ol className="mt-4 space-y-3">
              {state.history.map(record => <li key={record.id} className="rounded-md border border-[var(--line)] bg-[#f5fbf7] p-4"><p className="font-bold">{dateTime(record.created)}</p><ul className="mt-2 space-y-1 text-sm">{record.exercises.map(exercise => <li key={exercise.id}>{exercise.name}: {exercise.sets} × {exercise.reps}, {exercise.load} kg</li>)}</ul>{record.notes && <p className="mt-3 whitespace-pre-wrap break-words text-sm">{record.notes}</p>}</li>)}
            </ol>}
          </section>
        </>}
        <footer className="pb-5 text-center text-sm text-[var(--muted)]">Academia Conectada · Projeto acadêmico Mackenzie · Versão 2.0</footer>
      </div>
    </main>
  );
}
