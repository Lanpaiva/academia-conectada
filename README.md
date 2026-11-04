# Academia Conectada

Sistema web acadêmico de gestão de academia — Análise e Desenvolvimento de Sistemas, Universidade Presbiteriana Mackenzie.

## Entrega A5 e versões

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

**Escopo acadêmico:** a interface utiliza um único aluno de demonstração (`AL01`), compartilhado por quem acessa a instância. Não há login, isolamento por usuário, recuperação de senha, pagamento, gestão de instrutores ou CRUD administrativo nesta versão. Use exclusivamente dados fictícios e execute em `127.0.0.1`. Autenticação real, perfis e demais casos de uso permanecem no escopo futuro da especificação.

A [interface anteriormente publicada na Vercel](https://academia-conectada.vercel.app) corresponde à demonstração da Iteração 1. A entrega `v2` é validada localmente com disco persistente. O arquivo SQLite local não constitui uma solução persistente para funções serverless da Vercel. A migração planejada para PostgreSQL/Neon, autenticação e implantação integrada é uma etapa posterior.

## Tecnologias efetivamente utilizadas

| Camada | Implementação |
| --- | --- |
| Execução | Node.js 24 LTS, versão 24.13.0 ou superior da série 24 |
| Interface | Next.js App Router, React, TypeScript, Tailwind CSS, Lucide |
| Serviço HTTP | Route Handler `GET/POST /api/academia` no runtime Node |
| Persistência | SQLite via `node:sqlite`, transações e restrições de integridade |
| Testes | Runner nativo `node:test`, 28 testes de serviço/persistência |
| Qualidade | ESLint, TypeScript e build de produção |

As versões exatas das bibliotecas estão registradas em `package-lock.json`. Use `npm ci`. PostgreSQL, Prisma, Better Auth e serviços externos não são necessários para executar a Iteração 2.

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
git clone --branch v2 https://github.com/Lanpaiva/academia-conectada.git
cd academia-conectada
npm ci
```

O clone de uma tag fica em estado `detached HEAD`, adequado para executar exatamente a entrega. Para desenvolver a partir dela, crie uma branch com `git switch -c minha-alteracao`.

### 3. Configuração do banco

Nenhuma credencial ou variável de ambiente é obrigatória. Na primeira consulta, o servidor cria `data/academia.sqlite`, suas tabelas e os dados fictícios iniciais. Não é necessário instalar um servidor de banco nem executar migrações manuais.

Opcionalmente, copie o arquivo de exemplo para mudar o caminho:

macOS:

```sh
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Edite `ACADEMIA_DB_PATH` em `.env.local` para um caminho local gravável. Caminhos relativos são resolvidos a partir da raiz do projeto. Reinicie o servidor depois da alteração. Não use armazenamento de rede para compartilhar o arquivo SQLite entre máquinas.

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

1. Abra a aplicação e confira os planos e a agenda.
2. Selecione Conectado, mantenha nome/e-mail fictícios, aceite os termos e confirme a matrícula. Anote o protocolo.
3. Reserve Bike indoor. Tente reservar Funcional: os horários se sobrepõem e o servidor deve recusar.
4. Confira que Pilates está lotada. Alongamento começa com uma vaga.
5. Marque Leg press, informe uma carga realizada (por exemplo, 35 kg), escreva uma observação e salve o treino.
6. Recarregue a página: protocolo, reserva e histórico devem permanecer.
7. Cancele Bike indoor dentro do prazo: a vaga deve ser liberada uma vez.
8. Pare e reinicie o servidor: os registros devem permanecer no arquivo SQLite.

Os horários são criados dois dias à frente na primeira inicialização, no fuso de São Paulo (UTC−3), e não mudam ao reiniciar. Após o início das aulas, novas reservas são bloqueadas. Para uma nova demonstração com datas futuras e dados zerados, pare o servidor e **renomeie a pasta `data` inteira para uma cópia de segurança** antes de iniciar novamente. Se configurou outro caminho, preserve também os arquivos auxiliares `-wal` e `-shm`. Os testes automatizados criam suas próprias bases temporárias e não alteram `data`.

## Regras da versão 2

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
npm run lint
npm run typecheck
npm run build
```

`npm test` executa 28 testes em bases isoladas: matrícula, obrigatoriedade, indisponibilidade, duplicidade, conflito, lotação, cancelamento nos limites, histórico, cargas, rollback, reabertura do banco e dois workers concorrentes disputando a última vaga. Avisos de recurso experimental do `node:sqlite` não representam falhas; confira os totais de aprovação e o código de saída.

A verificação pelo navegador contemplou matrícula → API → SQLite → reserva → conflito → treino → recarga → cancelamento e larguras de 360, 768, 1280 e 1920 px. Consulte [as evidências](docs/a5/validacao.md). Isso não comprova os cenários futuros de autenticação, autorização, privacidade, gestão e compatibilidade completa da A4. O catálogo A4 permanece como plano de homologação do sistema completo.

Para verificar o contrato HTTP com a aplicação já aberta em outro terminal, execute `node tests/http/check-http.mjs`. São sete verificações de entrada sem gravação de dados. A variável opcional `TEST_BASE_URL` permite usar outra porta.

## Organização do código

```text
src/app/page.tsx                  Interface da Iteração 2
src/app/api/academia/route.ts     Adaptador HTTP e validação do corpo JSON
src/lib/academia.ts              Regras, transações, schema e dados iniciais
tests/automated/                 Testes executáveis com bases temporárias
tests/manual/                    Plano completo A4 e modelo de registro
docs/a5/                        Especificação atualizada e evidências
docs/entrega-2/                  Documentação histórica anterior
```

`GET /api/academia` retorna catálogo, matrícula, agenda, prescrição e histórico. `POST /api/academia` aceita as operações `enroll`, `reserve`, `cancel` e `workout`. Retornos: 200 para sucesso; 400 para JSON/operação inválidos; 403 para falta de matrícula ou origem divergente; 404 para item inexistente; 409 para conflito de regra; 413 para corpo acima de 8 KB; 415 para formato diferente de JSON; 422 para campos inválidos; 500 para falha inesperada. A identidade AL01 é fixada no servidor e o adaptador não aceita trocar o aluno por parâmetro.

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
- **Dados antigos:** recarregar preserva os dados por projeto; siga o procedimento de cópia de segurança da pasta para reiniciar a demonstração.
- **API indisponível:** confira o terminal e use Atualizar dados na interface; não registre aprovação sem confirmar o estado persistido.
