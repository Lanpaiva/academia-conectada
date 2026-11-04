import { parentPort, workerData } from "node:worker_threads";
import { Academy, DomainError } from "../../src/lib/academia.ts";
const { file, epoch, student, gate } = workerData;
const db = new Academy(file, () => epoch);
parentPort!.postMessage("ready");
Atomics.wait(new Int32Array(gate), 0, 0, 10000);
try { db.reserve("alongamento", student); parentPort!.postMessage("reservada"); }
catch (error) { if (error instanceof DomainError && error.message === "Aula lotada.") parentPort!.postMessage("lotada"); else throw error; }
finally { db.close(); }
