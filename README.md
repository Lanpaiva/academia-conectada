# Academia Conectada

### Sistema web de gerenciamento de academia

> Projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas da Universidade Presbiteriana Mackenzie.

---

## Links do projeto

| Item | Endereço |
| --- | --- |
| Repositório | [github.com/Lanpaiva/academia-conectada](https://github.com/Lanpaiva/academia-conectada) |
| Quadro de acompanhamento | [GitHub Projects - Academia Conectada](https://github.com/users/Lanpaiva/projects/2) |
| Aplicação publicada | Será adicionada após a publicação na Vercel |

---

## Integrantes

| Nº | Nome |
|:---:|---|
| 1 | Alan Araujo Paiva |
| 2 | Ian Ávila Guerra |
| 3 | Júlio de Moura Stelzer |
| 4 | Matheus Araujo dos Santos Nunes |


---

## Sobre o projeto

O **Academia Conectada** será uma aplicação web para centralizar as principais atividades de alunos, instrutores e administradores de uma academia.

O sistema permitirá controlar matrículas, planos, aulas, reservas, treinos, exercícios e a evolução dos alunos.

---

## Funcionalidades planejadas

- Cadastro e autenticação de usuários;
- Controle de acesso por perfil;
- Perfis de aluno, instrutor e administrador;
- Apresentação de modalidades, planos e horários;
- Matrícula de alunos;
- Agenda de aulas;
- Reserva e cancelamento de aulas;
- Controle da capacidade das turmas;
- Cadastro de exercícios;
- Criação e atribuição de planos de treino;
- Registro de séries, repetições e cargas;
- Registro de medidas;
- Histórico e gráficos de evolução;
- Administração de alunos, planos, aulas e instrutores;
- Interface responsiva para computadores e celulares;
- Recursos de acessibilidade.

---

## Estado atual

O projeto está na etapa inicial de planejamento e preparação do ambiente.

O repositório e o quadro de acompanhamento já foram criados. A implementação será realizada gradualmente e acompanhada pelo GitHub Projects.

---

## Stack tecnológica

| Categoria | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| Framework | Next.js com App Router |
| Interface | React |
| Estilização | Tailwind CSS |
| Backend | Route Handlers e Server Actions |
| Banco de dados | PostgreSQL |
| Hospedagem do banco | Neon Free |
| ORM | Prisma |
| Autenticação | Better Auth |
| Formulários | React Hook Form |
| Validação | Zod |
| Gráficos | Recharts |
| Datas e horários | date-fns |
| Ícones | Lucide React |
| Testes unitários | Vitest e Testing Library |
| Testes no navegador | Playwright |
| Versionamento | Git e GitHub |
| Publicação | Vercel Hobby |

---

## Pré-requisitos

Antes de baixar o projeto, instale:

| Programa | Requisito |
| --- | --- |
| Git | Versão atual |
| Node.js | Versão 24 ou superior |
| npm | Instalado junto com o Node.js |
| Editor | Visual Studio Code recomendado |

Para verificar as instalações:

```bash
git --version
node --version
npm --version
```

---

## Instalação no macOS

### Instalar com Homebrew

```bash
brew update
brew install git
brew install node
```

Verifique as instalações:

```bash
git --version
node --version
npm --version
```

Clone o repositório:

```bash
git clone https://github.com/Lanpaiva/academia-conectada.git
cd academia-conectada
```

Instale as bibliotecas:

```bash
npm install
npx playwright install
```

Execute o projeto:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

---

## Instalação no Windows

Abra o **PowerShell** ou o **Windows Terminal**.

### Instalar com WinGet

```powershell
winget install --id Git.Git --exact
winget install --id OpenJS.NodeJS.LTS --exact
```

Feche e abra novamente o terminal.

Verifique as instalações:

```powershell
git --version
node --version
npm --version
```

Clone o repositório:

```powershell
git clone https://github.com/Lanpaiva/academia-conectada.git
Set-Location academia-conectada
```

Instale as bibliotecas:

```powershell
npm install
npx playwright install
```

Execute o projeto:

```powershell
npm run dev
```

Acesse:

```text
http://localhost:3000
```

---

## Comandos para adicionar as bibliotecas

Os comandos desta seção serão executados durante a configuração inicial do projeto.

Depois que as dependências estiverem registradas no `package.json`, os outros integrantes precisarão executar somente:

```bash
npm install
```

### Next.js, React e TypeScript

```bash
npm install next@latest react@latest react-dom@latest

npm install -D typescript
npm install -D @types/node @types/react @types/react-dom
```

### Tailwind CSS

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

### PostgreSQL e Prisma

```bash
npm install @prisma/client @prisma/adapter-pg pg

npm install -D prisma @types/pg
```

Inicializar o Prisma com PostgreSQL:

```bash
npx prisma init --datasource-provider postgresql
```

### Autenticação

```bash
npm install better-auth
```

### Formulários e validação

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Gráficos, datas e ícones

```bash
npm install recharts date-fns lucide-react
```

### Padronização do código

```bash
npm install -D eslint eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
```

### Testes unitários e de componentes

```bash
npm install -D vitest @vitejs/plugin-react jsdom

npm install -D @testing-library/react
npm install -D @testing-library/jest-dom
npm install -D @testing-library/user-event
```

### Testes no navegador

```bash
npm install -D @playwright/test
npx playwright install
```

---

## Variáveis de ambiente

As credenciais e conexões não serão enviadas ao GitHub.

Quando o arquivo `.env.example` estiver disponível, crie uma cópia local.

### macOS ou Git Bash

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

O arquivo deverá conter:

```dotenv
DATABASE_URL="endereco-do-banco-postgresql"
BETTER_AUTH_SECRET="segredo-com-pelo-menos-32-caracteres"
BETTER_AUTH_URL="http://localhost:3000"
```

> Nunca envie o arquivo `.env` ao GitHub.

---

## Banco de dados

Gerar o Prisma Client:

```bash
npx prisma generate
```

Criar ou atualizar as tabelas:

```bash
npx prisma migrate dev
```

Abrir a interface visual do banco:

```bash
npx prisma studio
```

---

## Execução do projeto

Iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

Para interromper o servidor:

```text
Ctrl + C
```

---

## Testes e qualidade

| Comando | Finalidade |
| --- | --- |
| `npm run lint` | Verificar problemas e padronização do código |
| `npm run test` | Executar testes unitários e de componentes |
| `npm run test:e2e` | Executar testes completos no navegador |
| `npm run build` | Validar a geração da aplicação para produção |

Executar todas as verificações:

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

---

## Fluxo de contribuição

1. Escolha uma atividade no [quadro do projeto](https://github.com/users/Lanpaiva/projects/2);
2. Mova a atividade para **In Progress**;
3. Atualize a branch principal;
4. Crie uma branch para a funcionalidade;
5. Implemente e teste a alteração;
6. Faça o commit;
7. Envie a branch ao GitHub;
8. Abra um Pull Request;
9. Após a aprovação, mova a atividade para **Done**.

### Criar uma branch

```bash
git switch main
git pull origin main
git switch -c feature/nome-da-funcionalidade
```

### Enviar uma alteração

```bash
git add .
git commit -m "feat: descreve a funcionalidade implementada"
git push -u origin feature/nome-da-funcionalidade
```

---

## Publicação

A aplicação será publicada utilizando:

| Serviço | Plano |
| --- | --- |
| GitHub | Gratuito |
| Vercel | Hobby gratuito |
| Neon PostgreSQL | Free |

Não serão contratados serviços pagos da AWS, IBM Cloud ou Google Cloud.

A URL pública será adicionada após a primeira publicação na Vercel.

---

## Próximos passos

1. Inicializar a aplicação Next.js;
2. Configurar as bibliotecas;
3. Criar o banco PostgreSQL;
4. Criar o modelo inicial do Prisma;
5. Implementar autenticação;
6. Criar o controle de acesso por perfil;
7. Desenvolver as funcionalidades;
8. Criar os testes automatizados;
9. Publicar a primeira versão na Vercel.

---

### Universidade Presbiteriana Mackenzie

**Curso:** Análise e Desenvolvimento de Sistemas  
**Projeto:** Academia Conectada  
**Finalidade:** Projeto acadêmico
