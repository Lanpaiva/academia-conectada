# Academia Conectada

Sistema web acadêmico de gestão de academia — Análise e Desenvolvimento de Sistemas, Universidade Presbiteriana Mackenzie.

## Entrega A6

- **[Aplicação pública](https://academia-conectada.vercel.app)** — não exige login ou senha. Use dados fictícios e clique em **Nova demonstração** para começar.
- [Relatório A6 em PDF](docs/a6/academia-conectada-a6-relatorio.pdf) e [DOCX editável](docs/a6/academia-conectada-a6-relatorio.docx): plano original, resultados, métricas, acesso e limitações.
- [Roteiro de oito minutos](docs/a6/roteiro-video.md), [PDF](docs/a6/academia-conectada-a6-roteiro.pdf) e [DOCX](docs/a6/academia-conectada-a6-roteiro.docx), com falas, cliques e demonstração dos testes.
- [Evidências da execução](docs/a6/evidencias) e [métricas calculadas](docs/a6/evidencias/metricas.json).
- [Tag a6-final](https://github.com/Lanpaiva/academia-conectada/tree/a6-final): código, testes e documentos desta entrega. A aplicação validada foi compilada a partir de `c869472`; os commits seguintes consolidam testes e documentos.

**Resultados de 18/11/2026:** 20 verificações de serviço, 13 de navegador na URL pública, 28 testes de regressão e sete verificações HTTP aprovados. Os conjuntos se sobrepõem e não representam 68 cenários distintos da A4. A aprovação de 33/33 refere-se somente ao recorte operacional A6. Os 67 cenários originais têm impedimentos à execução integral, discriminados no relatório e em `resultados-a4.json`; evidências parciais não são tratadas como homologação completa.

**Vídeo:** o grupo ainda precisa gravar e publicar a demonstração de oito minutos e entregar seu link. O roteiro não substitui o vídeo. Manter a aplicação e o armazenamento ativos até **02/12/2026**, para entrega em 18/11/2026; se a entrega ocorrer em outra data, contar 14 dias a partir dela. O teste realizado comprova acesso na data registrada, sem medir antecipadamente disponibilidade contínua futura.

## Histórico A5 e versões

- [Especificação completa revisada em PDF](docs/a5/academia-conectada-a5-especificacao.pdf) e [DOCX editável](docs/a5/academia-conectada-a5-especificacao.docx).
- [Tag v1 — Iteração 1](https://github.com/Lanpaiva/academia-conectada/tree/v1): interface demonstrativa original e planos A4.
- [Tag v2 — Iteração 2](https://github.com/Lanpaiva/academia-conectada/tree/v2): matrícula, reservas e treinos persistidos no servidor local.
- [Branch iteracao2 preservada](https://github.com/Lanpaiva/academia-conectada/tree/iteracao2) e [branch master](https://github.com/Lanpaiva/academia-conectada/tree/master) com o merge do exercício.
- [Planos de teste A4](tests/manual/README.md) e [evidências A5](docs/a5/validacao.md).
- [Quadro do projeto](https://github.com/users/Lanpaiva/projects/2).

O repositório usa `main` como branch padrão histórica. Para cumprir literalmente o enunciado A5, foi criada `master` a partir de `origin/main`, consolidada a documentação A4 e criada a tag `v1`. A branch `iteracao2` nasceu de `master`. O commit `02fc160` modificou exatamente dois arquivos (`README.md` e `src/app/layout.tsx`) para o exercício. A evolução funcional foi realizada nessa mesma branch e incorporada a `master` por merge com dois pais, mantendo `iteracao2`. A tag `v2` identifica o resultado final.

## Integrantes

| Nº | Nome |
| --- | --- |
| 1 | Alan Araujo Paiva |
| 2 | Ian Ávila Guerra |
| 3 | Júlio de Moura Stelzer |
| 4 | Matheus Araujo dos Santos Nunes |
| 5 | Luiz Felipe Mantovani |

## O que funciona na Iteração 2

- Consulta de três planos e quatro aulas com horários e disponibilidade.
- Matrícula com nome, e-mail, aceite dos termos, protocolo único e gravação no banco.
- Ativação imediata da matrícula acadêmica, sem cobrança ou integração financeira.
- Reserva com validação de matrícula, capacidade, duplicidade, horário iniciado e conflito entre aulas.
- Cancelamento até duas horas antes da aula, incluindo o limite exato; repetição não libera vagas adicionais.
- Consulta de treino fixo, seleção de exercícios, carga realizada e observação.
- Histórico persistido com prevenção de duplicação do mesmo envio, preservando a carga prescrita.
- Mensagens de erro e confirmação, consulta atualizada e manutenção dos dados após recarregar a página ou reiniciar o servidor.

**Escopo acadêmico da A6:** cada navegador recebe uma demonstração própria com AL01 fixo, identificada por cookie aleatório HttpOnly. Os dados permanecem ao recarregar; outro contexto de navegador inicia outro ambiente. Não há criação de conta, login, recuperação de senha, pagamento, gestão de instrutores ou CRUD administrativo. O isolamento da demonstração não é autenticação. Use apenas dados fictícios.

A URL pública executa os fluxos persistentes da A6. Na Vercel, cada demonstração é salva como snapshot SQLite em **Vercel Blob privado**, usando ETag e escrita condicional para detectar concorrência. O arquivo em `/tmp` é apenas temporário. Localmente, o projeto usa arquivos SQLite separados e não exige acesso ao Blob. Essa arquitetura atende à demonstração acadêmica de baixo volume; não houve homologação de carga elevada ou de segurança multiusuário.

## Tecnologias efetivamente utilizadas

| Camada | Implementação |
| --- | --- |
| Execução | Node.js 24 LTS, versão 24.13.0 ou superior da série 24 |
| Interface | Next.js App Router, React, TypeScript, Tailwind CSS, Lucide |
| Serviço HTTP | Route Handler `GET/POST /api/academia` no runtime Node |
| Persistência | SQLite via `node:sqlite`; arquivos locais ou snapshots em Blob privado na publicação |
| Testes | `node:test`, verificações A6 de serviço, Playwright e contrato HTTP |
| Qualidade | ESLint, TypeScript e build de produção |

As versões exatas das bibliotecas estão registradas em `package-lock.json`. Use `npm ci`. PostgreSQL, Prisma, Better Auth e serviços externos não são necessários para executar a A6 localmente.

## Instalação no macOS e no Windows

### 1. Pré-requisitos

Instale Git e Node.js 24 LTS, versão 24.13.0 ou superior da série 24, usando os instaladores oficiais. O npm acompanha o Node.js. No Windows, feche e abra o PowerShell depois da instalação.

Confira no Terminal do macOS ou no PowerShell do Windows:

```sh
git --version
node --version
npm --version
```

O comando Node deve mostrar `v24.x.x`. Se houver outro Node no PATH, selecione a instalação da série 24 antes de continuar.

### 2. Obter a versão entregue

Os mesmos comandos funcionam no Terminal e no PowerShell:

```sh
git clone --branch a6-final https://github.com/Lanpaiva/academia-conectada.git
cd academia-conectada
npm ci
```

O clone de uma tag fica em estado `detached HEAD`, adequado para executar exatamente a entrega. Para desenvolver a partir dela, crie uma branch com `git switch -c minha-alteracao`.

### 3. Configuração do banco

Nenhuma credencial ou variável de ambiente é obrigatória. Na primeira consulta de cada navegador, o servidor cria `data/demonstracoes/<identificador>.sqlite`, suas tabelas e os dados fictícios iniciais. Não é necessário instalar um servidor de banco nem executar migrações manuais.

Opcionalmente, copie o arquivo de exemplo para mudar o caminho:

macOS:

```sh
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Edite `ACADEMIA_DB_PATH` em `.env.local` para um caminho local gravável. O diretório desse caminho recebe a subpasta `demonstracoes`; o arquivo-base continua reservado ao serviço e aos testes da versão anterior. Caminhos relativos são resolvidos a partir da raiz do projeto. Reinicie o servidor depois da alteração. Não use armazenamento de rede para compartilhar o arquivo SQLite entre máquinas.

### 4. Executar em desenvolvimento

```sh
npm run dev
```

Abra **http://127.0.0.1:3000**. Os scripts de desenvolvimento e produção escutam somente no endereço local. Para encerrar, pressione `Ctrl+C` no terminal.

Se a porta estiver ocupada:

```sh
npm run dev -- --port 3001
```

Nesse caso, abra http://127.0.0.1:3001. Consulte no terminal a porta efetivamente usada.

### 5. Executar a compilação de produção local

Pare o servidor de desenvolvimento antes de executar:

```sh
npm run build
npm start
```

Abra novamente http://127.0.0.1:3000. Essa execução usa o mesmo caminho de banco quando a configuração é mantida.

## Roteiro de demonstração

1. Abra a aplicação, clique em **Nova demonstração** e confira os planos e a agenda.
2. Selecione Essencial, mantenha nome/e-mail fictícios, aceite os termos e confirme a matrícula. Anote o protocolo.
3. Reserve Bike indoor. Tente reservar Funcional: os horários se sobrepõem e o servidor deve recusar.
4. Confira que Pilates está lotada. Alongamento começa com uma vaga.
5. Marque Leg press, informe uma carga realizada (por exemplo, 35 kg), escreva uma observação e salve o treino.
6. Recarregue a página: protocolo, reserva e histórico devem permanecer.
7. Cancele Bike indoor dentro do prazo: a vaga deve ser liberada uma vez.
8. Pare e reinicie o servidor: os registros devem permanecer no arquivo SQLite.

Os horários são criados dois dias à frente de cada nova demonstração, no fuso de São Paulo. Depois do início de uma aula, novas reservas são bloqueadas. Para reiniciar o fluxo com datas futuras, clique em **Nova demonstração**; isso troca a demonstração selecionada, sem apagar os arquivos antigos. Recarregar a página preserva os dados associados ao cookie atual. Limpar cookies perde a referência do navegador à demonstração anterior. Os testes de serviço usam bases isoladas e os testes de navegador criam contextos próprios.

## Regras da aplicação

- Uma matrícula por aluno; reenvio do mesmo plano mantém o protocolo, outro plano ativo é recusado.
- Os dados enviados pelo navegador são validados novamente no servidor. Preços e capacidades vêm do banco.
- Intervalos se sobrepõem quando `início A < fim B` e `fim A > início B`; aulas consecutivas são permitidas.
- Cancelamento permitido com antecedência **maior ou igual a duas horas**.
- Cargas numéricas entre **0 e 500 kg**, inclusive; limite técnico definido para a massa de homologação, sem recomendação de prática esportiva.
- Observação até 500 caracteres; pelo menos um exercício válido, sem repetições no mesmo registro.
- O mesmo identificador de envio e os mesmos dados não duplicam treino; o mesmo identificador com outros dados é recusado.
- Reservas são realizadas dentro de transações `BEGIN IMMEDIATE`. A ocupação combina a massa fictícia inicial e as reservas efetivamente gravadas.

## Testes e verificação

```sh
npm test
npm run test:a6
npm run lint
npm run typecheck
npm run build
```

`npm test` executa 28 testes em bases isoladas: matrícula, obrigatoriedade, indisponibilidade, duplicidade, conflito, lotação, cancelamento nos limites, histórico, cargas, rollback, reabertura do banco e dois workers concorrentes disputando a última vaga. Avisos de recurso experimental do `node:sqlite` não representam falhas; confira os totais de aprovação e o código de saída.

`npm run test:a6` executa 20 verificações do recorte operacional e grava `servico.json`. Os resultados são relacionados ao plano original, sem substituir suas precondições de autenticação e gestão.

Para executar as 13 verificações de navegador, instale o navegador uma vez:

```sh
npx playwright install chromium
```

macOS/Linux, contra a publicação:

```sh
TEST_BASE_URL=https://academia-conectada.vercel.app A6_OUTPUT=tmp/reexecucao npm run test:browser
```

Windows PowerShell:

```powershell
$env:TEST_BASE_URL='https://academia-conectada.vercel.app'
$env:A6_OUTPUT='tmp/reexecucao'
npm run test:browser
```

Para usar Chrome já instalado, configure `CHROME_PATH` com o caminho do executável. Para testar localmente, inicie o servidor em outro terminal e defina `TEST_BASE_URL=http://127.0.0.1:3000`. Sem a variável, a automação de navegador usa a porta 3100. Ela verifica matrícula, reserva, conflito, treino, recarga, cancelamento, reenvio com resposta perdida, isolamento de demonstrações, larguras 360/768/1280/1920, catálogo vazio/503 e concorrência. Respostas controladas são injeções de teste, não incidentes espontâneos. O JSON registra o que efetivamente passou; código de saída diferente de zero indica falha.

Para o contrato HTTP, use `node tests/http/check-http.mjs`, com `TEST_BASE_URL` apontando à publicação ou ao servidor local. São sete verificações de entrada. O nome “origem local aceita” significa origem igual à URL testada; uma operação vazia ainda retorna 400.

A auditoria `npm audit --omit=dev` registrou zero vulnerabilidades conhecidas reportadas nas dependências de produção na revisão de 18/11/2026. Não representa certificação de segurança. O relatório separa A4, A6 e regressão e não afirma compatibilidade com navegadores não testados.

## Publicação e persistência

A publicação está no projeto Vercel `academia-conectada`, com Node 24, build `npm run build` e instalação `npm ci`. A integração de Blob privado fornece `BLOB_READ_WRITE_TOKEN` exclusivamente ao servidor. Não copie esse valor para README, cliente ou repositório. Cada demonstração tem snapshot próprio; escritas usam versão condicional do objeto e até quatro tentativas. Há limites de 4 MB por snapshot e 300 registros de treino por demonstração. Para renovar a massa, use **Nova demonstração**.

A validação pública foi realizada sem login da Vercel. Mantenha o alias e o armazenamento disponíveis durante a janela de avaliação; não remova o projeto nem o Blob. A entrega não inclui monitoramento contínuo. Consulte [publicacao.json](docs/a6/evidencias/publicacao.json) para a versão verificada.

## Organização do código

```text
src/app/page.tsx                  Interface da A6
src/app/api/academia/route.ts     Adaptador HTTP e validação do corpo JSON
src/lib/demo-store.ts            Isolamento da demonstração e persistência local/Blob
src/lib/academia.ts              Regras, transações, schema e dados iniciais
tests/automated/                 Testes executáveis com bases temporárias
tests/manual/                    Plano completo A4 e modelo de registro
tests/a6/                        Ensaios de serviço e navegador
docs/a6/                         Relatório, roteiro e evidências atuais
docs/a5/                        Especificação atualizada e evidências
docs/entrega-2/                  Documentação histórica anterior
```

`GET /api/academia` retorna catálogo, matrícula, agenda, prescrição e histórico. `POST /api/academia` aceita as operações `new-demo`, `enroll`, `reserve`, `cancel` e `workout`. Retornos: 200 para sucesso; 400 para JSON/operação inválidos; 403 para falta de matrícula ou origem divergente; 404 para item inexistente; 409 para conflito de regra; 413 para corpo acima de 8 KB; 415 para formato diferente de JSON; 422 para campos inválidos; 500 para falha inesperada. A identidade AL01 é fixada dentro de cada demonstração no servidor e o adaptador não aceita trocar o aluno por parâmetro.

## Conferência do exercício de Git

```sh
git fetch origin --tags
git show v1 --no-patch
git show --stat 02fc160
git log --graph --oneline --decorate origin/master origin/iteracao2
git show v2 --no-patch
git merge-base --is-ancestor origin/iteracao2 origin/master
```

O último comando deve terminar com código 0. A branch `iteracao2` deve permanecer publicada para conferência do professor. Não recrie nem mova as tags de entrega.

## Solução de problemas

- **`node:sqlite` não encontrado:** confira `node --version` e selecione Node 24.13+ da série 24.
- **`npm ci` falha:** execute na pasta que contém `package.json` e `package-lock.json`, com acesso à internet para baixar as dependências.
- **Falha ao abrir banco:** confira permissão de escrita no diretório de `ACADEMIA_DB_PATH` e reinicie.
- **`database is locked`:** encerre outras instâncias que estejam usando o mesmo arquivo e tente novamente.
- **Dados antigos ou aulas expiradas:** recarregar preserva a demonstração; use Nova demonstração para criar outra com datas futuras.
- **API indisponível:** confira o terminal e use Atualizar dados na interface; não registre aprovação sem confirmar o estado persistido.
