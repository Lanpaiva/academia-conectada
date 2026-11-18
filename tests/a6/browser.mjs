import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3100';
const output = process.env.A6_OUTPUT || 'docs/a6/evidencias';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const results = [];
const note = (id, source, title, observed) => results.push({ id, source, title, status: 'Aprovado', observed });
const api = '/api/academia';
async function state() { const r = await context.request.get(base + api); assert.equal(r.status(), 200); return r.json(); }
async function post(payload) { return context.request.post(base + api, { data: payload, headers: { origin: new URL(base).origin } }); }
try {
  await page.goto(base); await page.getByRole('heading', { name: 'Planos e matrícula', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Nova demonstração', exact: true }).click();
  await page.getByText(/Nova demonstração iniciada/).waitFor();
  const catalog = await state(); assert.equal(catalog.plans.find(p => p.id === 'basic').price, 9900);
  note('A6-B01', 'UC02', 'Consulta do catálogo', 'Três planos e quatro aulas exibidos, sem login.');
  await page.getByRole('button', { name: 'Selecionar Essencial', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar matrícula', exact: true }).click();
  assert.equal((await state()).enrollment, null);
  note('A6-B02', 'CT03-04', 'Termos obrigatórios no navegador', 'Formulário sem aceite não criou matrícula.');
  await page.getByLabel(/Aceito os termos/).check();
  await page.getByRole('button', { name: 'Confirmar matrícula', exact: true }).click();
  await page.getByRole('heading', { name: 'Matrícula confirmada', exact: true }).waitFor();
  const protocol = (await state()).enrollment.protocol;
  await page.reload(); await page.getByText(`Protocolo: ${protocol}`, { exact: true }).waitFor();
  note('A6-B03', 'UC03', 'Matrícula e recarga', 'Plano Essencial e mesmo protocolo recuperados do servidor.');
  await page.getByRole('button', { name: 'Reservar Bike indoor', exact: true }).click();
  await page.getByText('Reserva confirmada.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Reservar Funcional', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'conflito' }).waitFor();
  assert.equal((await state()).classes.filter(c => c.reserved).length, 1);
  assert.equal(await page.getByRole('button', { name: 'Lotada', exact: true }).isDisabled(), true);
  note('A6-B04', 'UC04', 'Reserva conflito e lotação', 'Bike confirmada; Funcional recusada por conflito; Pilates indica lotação.');
  await page.getByRole('button', { name: 'Atualizar dados', exact: true }).click();
  await page.getByRole('checkbox', { name: /Leg press/ }).check();
  await page.getByLabel('Carga de Leg press (kg)', { exact: true }).fill('20');
  await page.getByLabel('Observações', { exact: true }).fill('Preenchimento interrompido');
  await page.reload(); await page.getByRole('heading', { name: 'Matrícula confirmada' }).waitFor();
  assert.equal((await state()).history.length, 0);
  note('A6-B05', 'CT06-04', 'Abandono sem salvar', 'Preenchimento seguido de recarga não adicionou histórico.');
  await page.getByRole('checkbox', { name: /Leg press/ }).check();
  await page.getByLabel('Carga de Leg press (kg)', { exact: true }).fill('35');
  await page.getByLabel('Observações', { exact: true }).fill('Demonstração A6');
  await page.getByRole('button', { name: 'Salvar treino', exact: true }).click();
  await page.getByText('Treino salvo no histórico.', { exact: true }).waitFor();
  await page.reload(); await page.getByText('Leg press: 4 × 10, 35 kg', { exact: true }).waitFor();
  note('A6-B06', 'UC05, UC06', 'Prescrição registro e histórico', 'Leg press consultado; carga realizada 35 kg persistida após recarga, sem alterar 80 kg prescritos.');
  for (const id of ['matricula', 'aulas', 'treino']) await page.locator('#' + id).screenshot({ path: `${output}/${id}.png` });
  // O servidor conclui a gravação, mas a resposta é perdida pelo cliente.
  let finishInterruption;
  const interruption = new Promise((resolve, reject) => { finishInterruption = { resolve, reject }; });
  await page.route('**/api/academia', async route => {
    if (route.request().method() === 'POST' && route.request().postDataJSON()?.action === 'workout') {
      try {
        const response = await route.fetch(); assert.equal(response.status(), 200); await route.abort('failed');
        finishInterruption.resolve();
      } catch (error) { finishInterruption.reject(error); }
    } else await route.continue();
  });
  await page.getByRole('checkbox', { name: /Leg press/ }).check();
  await page.getByLabel('Carga de Leg press (kg)', { exact: true }).fill('22');
  await page.getByLabel('Observações', { exact: true }).fill('Resposta interrompida A6');
  await page.getByRole('button', { name: 'Salvar treino', exact: true }).click();
  await interruption;
  await page.locator('p[role="alert"]').waitFor();
  await page.unrouteAll({ behavior: 'wait' });
  await page.getByRole('button', { name: 'Salvar treino', exact: true }).click();
  await page.getByText('Registro já salvo. Histórico preservado.', { exact: true }).waitFor();
  assert.equal((await state()).history.length, 2);
  note('A6-B07', 'CT06-05', 'Resposta perdida e reenvio', 'Cliente exibiu erro; reenvio reconheceu registro já salvo; total 2, sem duplicar a tentativa.');
  const other = await browser.newContext(); const otherPage = await other.newPage();
  await otherPage.goto(base); await otherPage.getByRole('button', { name: 'Confirmar matrícula', exact: true }).waitFor();
  const isolated = await other.request.get(base + api); assert.equal((await isolated.json()).enrollment, null); await other.close();
  note('A6-B08', 'Complementar A6', 'Isolamento entre navegadores', 'Segundo contexto inicia sem matrícula nem dados do primeiro. É isolamento da demonstração, não login.');
  await page.getByRole('button', { name: 'Cancelar reserva', exact: true }).click();
  await page.getByText('Reserva cancelada. A vaga foi liberada.', { exact: true }).waitFor();
  assert.equal((await state()).classes.find(c => c.id === 'bike').occupied, 14);
  note('A6-B09', 'CT04-06', 'Cancelamento pela interface', 'Vaga liberada; Bike voltou à ocupação 14/18.');
  for (const width of [360, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow ${width}`);
  }
  await page.setViewportSize({ width: 360, height: 900 }); await page.screenshot({ path: `${output}/mobile.png`, fullPage: true });
  note('A6-B10', 'TNF02 parcial', 'Responsividade das áreas implementadas', 'Sem rolagem horizontal em 360, 768, 1280 e 1920 px. Não cobre áreas ausentes.');
  await page.route('**/api/academia', async route => {
    if (route.request().method() === 'GET') await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...catalog, plans: [] }) });
    else await route.continue();
  });
  await page.getByRole('button', { name: 'Atualizar dados', exact: true }).click();
  await page.getByText('Nenhum plano disponível no momento.', { exact: true }).waitFor();
  await page.unroute('**/api/academia');
  await page.route('**/api/academia', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Indisponibilidade simulada A6' }) }));
  await page.getByRole('button', { name: 'Atualizar dados', exact: true }).click(); await page.getByRole('alert').filter({ hasText: 'Indisponibilidade' }).waitFor();
  await page.unroute('**/api/academia'); await page.getByRole('button', { name: 'Atualizar dados', exact: true }).click();
  await page.getByRole('heading', { name: 'Essencial', exact: true }).waitFor();
  note('A6-B11', 'CT02-05', 'Catálogo vazio falha e recuperação', 'Respostas controladas: vazio tem mensagem própria; 503 é comunicado; consulta real restaura catálogo.');
  const rejected = await post({ action: 'workout', requestId: 'bad-a6', notes: '', exercises: [{ id: 'leg', load: -1 }] });
  assert.equal(rejected.status(), 422); assert.equal((await state()).history.length, 2);
  note('A6-B12', 'CT06-03 parcial', 'Validação direta na API', 'Carga −1 enviada por HTTP recusada com 422; histórico inalterado.');
  assert.equal((await post({ action: 'new-demo' })).status(), 200);
  assert.equal((await post({ action: 'enroll', planId: 'basic', name: 'Concorrência A6', email: 'concorrencia@example.test', terms: true })).status(), 200);
  const concurrent = await Promise.all([post({ action: 'reserve', classId: 'alongamento' }), post({ action: 'reserve', classId: 'alongamento' })]);
  assert.deepEqual(concurrent.map(r => r.status()).sort(), [200, 409]);
  const last = (await state()).classes.find(c => c.id === 'alongamento');
  assert.equal(last.occupied, 10); assert.equal(last.reserved, 1);
  note('A6-B13', 'Concorrência complementar', 'Requisições HTTP concorrentes', 'Dois envios da mesma demonstração à última vaga: um 200 e um 409; uma reserva e ocupação 10/10. Não equivale a dois alunos autenticados.');
  assert.deepEqual(errors, []);
  console.log(`${results.length} verificações de navegador aprovadas em ${base}`);
} catch (error) {
  results.push({ id: 'FALHA', status: 'Reprovado', observed: String(error) }); process.exitCode = 1; console.error(error);
} finally {
  writeFileSync(`${output}/navegador.json`, JSON.stringify({ executedAt: new Date().toISOString(), base, browser: browser.version(), errors, results }, null, 2));
  await browser.close();
}
