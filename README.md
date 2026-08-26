Academia Conectada

Sistema web de gerenciamento de academia desenvolvido como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas da Universidade Presbiteriana Mackenzie.

O sistema será publicado gratuitamente na Vercel. O código-fonte e o acompanhamento das atividades permanecerão públicos no GitHub.

Links do projeto

Repositório: github.com/Lanpaiva/academia-conectada

Quadro de acompanhamento: GitHub Projects - Academia Conectada

Aplicação publicada: será adicionada após a primeira publicação na Vercel

Integrantes

Nome

Alan Araujo Paiva

Gabriel Vieira Ferreira

Pedro Emmanuel Esteves

Rafaela Rarume Alves Perpetuo

Renan Urtado Challó de Oliveira Jordão

O que será desenvolvido

O Academia Conectada reunirá em uma única aplicação as principais atividades de alunos, instrutores e administradores de uma academia.

Funcionalidades planejadas:

cadastro, autenticação e controle de acesso por perfil;

apresentação pública da academia, modalidades, planos e horários;

matrícula de alunos;

agenda, reserva e cancelamento de aulas;

controle da capacidade das turmas;

cadastro de exercícios e planos de treino;

atribuição de treinos pelos instrutores;

registro de séries, repetições, cargas e medidas;

histórico e gráficos de evolução do aluno;

administração de alunos, planos, aulas e instrutores;

interface responsiva e acessível para computadores e celulares.

Estado atual

O projeto está na etapa inicial de planejamento e preparação do ambiente. O repositório e o quadro de acompanhamento já foram criados. A implementação do sistema será realizada gradualmente e registrada no GitHub Projects.

Stack tecnológica

Item

Tecnologia

Linguagem

TypeScript

Framework full stack

Next.js com App Router

Interface

React

Estilização

Tailwind CSS

Backend

Route Handlers e Server Actions do Next.js

Banco de dados

PostgreSQL

Banco em produção

Neon Free

ORM

Prisma

Autenticação

Better Auth

Formulários

React Hook Form

Validação

Zod

Gráficos

Recharts

Datas e horários

date-fns

Ícones

Lucide React

Testes unitários

Vitest e Testing Library

Testes de ponta a ponta

Playwright

Versionamento

Git e GitHub

Publicação

Vercel Hobby

Pré-requisitos

Antes de baixar o projeto, instale:

Git;

Node.js versão 24 ou superior;

npm, instalado automaticamente junto com o Node.js;

um editor de código, preferencialmente Visual Studio Code.

Para verificar o ambiente:

git --version
node --version
npm --version

Preparação no macOS

Opção 1 - instaladores oficiais

Instale o Git pela página git-scm.com/downloads/mac.

Instale a versão LTS do Node.js pela página nodejs.org/en/download.

Feche e abra novamente o Terminal.

Execute os comandos de verificação apresentados na seção anterior.

Opção 2 - Homebrew

Com o Homebrew instalado, execute:

brew update
brew install git
brew install node

Depois, confirme a instalação:

git --version
node --version
npm --version

Baixe o projeto e instale todas as bibliotecas no macOS:

git clone https://github.com/Lanpaiva/academia-conectada.git
cd academia-conectada
npm install
npx playwright install
npm run dev

Preparação no Windows

Opção 1 - instaladores oficiais

Instale o Git pela página git-scm.com/download/win.

Instale a versão LTS do Node.js pela página nodejs.org/en/download.

Feche e abra novamente o PowerShell ou Windows Terminal.

Execute os comandos de verificação apresentados anteriormente.

Opção 2 - WinGet

Abra o PowerShell ou Windows Terminal e execute:

winget install --id Git.Git --exact
winget install --id OpenJS.NodeJS.LTS --exact

Feche e abra novamente o terminal. Depois, confirme a instalação:

git --version
node --version
npm --version

Baixe o projeto e instale todas as bibliotecas no Windows:

git clone https://github.com/Lanpaiva/academia-conectada.git
Set-Location academia-conectada
npm install
npx playwright install
npm run dev

Como baixar o projeto

Os comandos abaixo são iguais no Terminal do macOS, PowerShell, Windows Terminal e Git Bash:

git clone https://github.com/Lanpaiva/academia-conectada.git
cd academia-conectada

Como instalar as bibliotecas

Instalação normal para todos os integrantes

Depois que o código inicial e o arquivo package.json estiverem disponíveis no repositório, cada integrante deverá executar dentro da pasta do projeto:

npm install
npx playwright install

O comando npm install baixará as versões registradas no projeto, incluindo Next.js, React, Tailwind CSS, Prisma, Better Auth, React Hook Form, Zod, Recharts, date-fns, Lucide React e as bibliotecas de testes. O segundo comando instalará os navegadores usados pelo Playwright.

Não é necessário instalar cada biblioteca manualmente em cada computador.

Comandos completos usados para adicionar as bibliotecas ao projeto

Os comandos abaixo serão executados uma única vez durante a criação da aplicação para registrar todas as dependências no package.json.

Framework, interface e estilização:

npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss @tailwindcss/postcss

Banco de dados e ORM:

npm install @prisma/client @prisma/adapter-pg pg
npm install -D prisma @types/pg

Autenticação, formulários e validação:

npm install better-auth
npm install react-hook-form @hookform/resolvers zod

Gráficos, datas e ícones:

npm install recharts date-fns lucide-react

Padronização do código:

npm install -D eslint eslint-config-next prettier prettier-plugin-tailwindcss

Testes unitários e de componentes:

npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

Testes completos no navegador:

npm install -D @playwright/test
npx playwright install

Inicialização do Prisma com PostgreSQL:

npx prisma init --datasource-provider postgresql

Configuração das variáveis de ambiente

As credenciais e conexões não serão salvas no GitHub. Quando o arquivo .env.example for incluído no projeto, crie uma cópia local.

No macOS ou Git Bash:

cp .env.example .env

No PowerShell:

Copy-Item .env.example .env

As principais variáveis serão:

DATABASE_URL="endereco-do-banco-postgresql"
BETTER_AUTH_SECRET="segredo-local-com-pelo-menos-32-caracteres"
BETTER_AUTH_URL="http://localhost:3000"

O arquivo .env é individual e não deve ser enviado ao repositório.

Banco de dados

Após configurar a variável DATABASE_URL, os comandos do Prisma serão:

npx prisma generate
npx prisma migrate dev

Para abrir a interface de consulta do banco durante o desenvolvimento:

npx prisma studio

Como executar localmente

Depois da instalação das dependências e da configuração do .env, execute:

npm run dev

A aplicação ficará disponível em:

http://localhost:3000

Para interromper o servidor, pressione Ctrl + C no terminal.

Testes e qualidade

Os scripts serão adicionados ao package.json durante a implementação. Os comandos planejados são:

npm run lint
npm run test
npm run test:e2e
npm run build

Comando

Finalidade

npm run lint

Verificar a padronização e possíveis problemas no código

npm run test

Executar os testes unitários e de componentes

npm run test:e2e

Executar os testes completos no navegador

npm run build

Validar a geração da aplicação para produção

Fluxo de contribuição

Antes de começar uma atividade:

selecione ou crie a tarefa correspondente no quadro do projeto;

mova a tarefa para In Progress;

atualize a branch principal;

crie uma branch específica para a atividade;

implemente e teste a alteração;

envie um Pull Request para revisão;

após a aprovação, mova a tarefa para Done.

Exemplo de criação de branch:

git switch main
git pull origin main
git switch -c feature/nome-da-funcionalidade

Exemplo de envio da alteração:

git add .
git commit -m "feat: descreve a funcionalidade implementada"
git push -u origin feature/nome-da-funcionalidade

Publicação

A aplicação será publicada no plano gratuito da Vercel e utilizará PostgreSQL no plano gratuito do Neon. Não serão contratados serviços pagos de AWS, IBM Cloud ou Google Cloud.

A URL pública será adicionada a este README após a primeira publicação.

Próximos passos

Inicializar a aplicação Next.js no repositório.

Configurar as dependências e os scripts do projeto.

Criar o banco PostgreSQL e o modelo inicial do Prisma.

Implementar autenticação e controle por perfil.

Desenvolver as funcionalidades conforme o quadro do GitHub Projects.

Criar os testes automatizados.

Publicar a primeira versão na Vercel.
