# Roteiro do vídeo de oito minutos

Academia Conectada • A6 Praticando e Aplicando conhecimento • 18 de novembro de 2026.

O vídeo demonstra todos os fluxos disponíveis na versão A6: catálogo (UC02), matrícula (UC03), reserva e cancelamento (UC04), consulta da prescrição (UC05) e registro e histórico (UC06). Esses casos são implementados parcialmente em relação à especificação original. Cadastro de conta, login, gestão do instrutor e administração não estão disponíveis. Não apresente matrícula como criação de conta.

## Preparação antes de gravar

1. Abra https://academia-conectada.vercel.app no Chrome, maximize a janela e deixe o zoom em 100%. Use dados fictícios. Clique em **Nova demonstração** para começar com aulas futuras e sem matrícula. Não limpe cookies durante a demonstração.
2. Deixe o relatório A6 aberto nas seções de métricas e rastreabilidade. Abra também o repositório https://github.com/Lanpaiva/academia-conectada/tree/a6-final.
3. Em um terminal, dentro do projeto, use Node 24.13 ou superior da série 24, execute `npm ci` e `npx playwright install chromium` antes de gravar. Essas instalações não entram nos oito minutos.
4. Prepare três terminais: um para `npm run test:a6`; outro para `npm test`; o terceiro para a execução pública do navegador. No macOS: `TEST_BASE_URL=https://academia-conectada.vercel.app A6_OUTPUT=tmp/gravacao npm run test:browser`. No PowerShell: `$env:TEST_BASE_URL='https://academia-conectada.vercel.app'; $env:A6_OUTPUT='tmp/gravacao'; npm run test:browser`. A automação usa seu próprio navegador, sem alterar a demonstração aberta para a gravação.
5. Antes de gravar, ensaie a sequência. O roteiro reserva tempo para cliques, carregamento e leitura dos resultados. Use um cronômetro; ajuste as pausas para terminar em 08:00. Se uma execução demorar, grave seu início e sua conclusão reais e corte somente a espera, identificando o corte. Não substitua resultado real por resultado digitado.

## 00:00 a 00:30 — Apresentação

**Ação:** mostre a capa do relatório com o cabeçalho e os cinco integrantes. Depois alterne para a aplicação, deixando a URL visível.

**Fala:** “Olá! Somos o grupo do projeto Academia Conectada, da Universidade Presbiteriana Mackenzie. Nesta entrega A6, vamos demonstrar a aplicação em funcionamento e apresentar a execução dos testes e suas métricas. O sistema reúne consulta de planos, matrícula, reservas de aulas e acompanhamento dos treinos. Vamos percorrer todas as funcionalidades implementadas nesta versão.”

## 00:30 a 01:05 — Acesso e preparação

**Ação:** mostre o aviso amarelo e clique em **Nova demonstração**. Aguarde “Nova demonstração iniciada”. Mostre os contadores zerados. Alterne rapidamente para o terminal de navegador e inicie o comando público preparado; deixe-o executando em segundo plano e retorne à aplicação.

**Fala:** “O acesso é público, sem senha. Este ambiente acadêmico usa dados fictícios e uma demonstração separada para cada navegador. O aluno AL01 é uma identidade demonstrativa; ainda não existe cadastro de conta ou login. O botão Nova demonstração prepara outro conjunto de dados e aulas futuras. Também iniciei a automação que verifica a aplicação publicada; mostrarei o resultado ao final.”

## 01:05 a 01:40 — Catálogo do UC02

**Ação:** clique em **Matrícula** no menu superior. Mostre os três cartões de planos, preços e descrições. Clique em **Selecionar Essencial** e mostre o estado “Selecionado”. Role até a agenda para apontar os horários e retorne ao formulário.

**Fala:** “Aqui o visitante consulta os planos e seus valores. Vou selecionar o Essencial, de noventa e nove reais por mês. A seleção define o plano que será enviado na matrícula. A agenda também informa professor, horário e vagas. Este é o catálogo disponível nesta versão; os filtros e a gestão administrativa previstos no projeto completo ainda não estão implementados.”

## 01:40 a 02:35 — Matrícula e validação do UC03

**Ação:** em **Nome fictício**, digite “Aluno de Demonstração”; em **E-mail fictício**, “al01@example.test”. Deixe o aceite desmarcado e clique em **Confirmar matrícula**. Mostre a validação do navegador. Marque **Aceito os termos...**, confirme e aguarde **Matrícula confirmada**. Mostre o protocolo. Recarregue a página e confira o mesmo protocolo.

**Fala:** “O usuário informa nome e e-mail fictícios para solicitar a matrícula. Primeiro vou tentar sem aceitar os termos. O formulário impede o envio, e a matrícula continua ausente. Agora aceito os termos e confirmo. O servidor valida os dados, registra o plano e devolve um protocolo. A ativação é imediata para fins acadêmicos e não realiza cobrança. Ao recarregar, o mesmo protocolo continua disponível, demonstrando a persistência. Isso é uma matrícula de demonstração, não uma conta autenticada.”

## 02:35 a 03:35 — Reserva e regras do UC04

**Ação:** clique em **Aulas**. Mostre Bike indoor com quatro vagas e clique em **Reservar Bike indoor**. Aguarde a confirmação, a redução para três vagas e o botão **Cancelar reserva**. Clique em **Reservar Funcional**; role até a mensagem de conflito no alto se necessário. Mostre que Pilates tem zero vagas e o botão **Lotada** desabilitado. Clique em **Atualizar dados** para limpar o erro.

**Fala:** “Com a matrícula confirmada, podemos reservar uma aula. Bike indoor tem quatro vagas. Ao reservar, recebemos a confirmação e a disponibilidade cai para três. Agora tento reservar Funcional, cujo horário se sobrepõe. O servidor recusa o conflito e mantém apenas a reserva anterior. Pilates já está lotada, por isso seu botão está desabilitado. As regras também são verificadas no servidor: não dependem apenas dos botões da tela. Os testes cobrem ainda duplicidade, falta de matrícula, última vaga e falha de persistência.”

## 03:35 a 04:15 — Consulta da prescrição do UC05

**Ação:** clique em **Treino**. Mostre a Sessão A e os três exercícios: Leg press, Supino reto e Remada baixa. Aponte séries, repetições, carga sugerida, descanso e orientação. Marque **Leg press** e digite **35** no campo **Carga de Leg press (kg)**, sem salvar ainda.

**Fala:** “Na área Meu treino, consultamos a Sessão A demonstrativa. Cada exercício apresenta séries, repetições, carga sugerida, descanso e orientação. A prescrição é fixa nesta versão; não existe edição por instrutor nem atribuição individual. Vou selecionar Leg press e informar trinta e cinco quilos como carga realizada. A carga prescrita continua em oitenta quilos. Esses valores são dados de teste usados para conferir a separação entre prescrição e execução.”

## 04:15 a 05:05 — Registro e histórico do UC06

**Ação:** digite “Demonstração A6” em **Observações**. Clique em **Salvar treino**, aguarde a confirmação e mostre o **Histórico de treinos**. Aponte data, exercício, carga realizada e observação. Recarregue a página, retorne a Treino e mostre o registro preservado e a carga sugerida de 80 kg na prescrição.

**Fala:** “Agora adiciono uma observação e salvo a sessão. O histórico mostra o exercício realizado, a carga utilizada e a data do registro. Vou recarregar para comprovar que a informação foi gravada no servidor. O registro permanece com trinta e cinco quilos, enquanto a prescrição mantém oitenta. A automação também simula uma resposta de rede perdida depois da gravação e repete o envio. A mesma tentativa não pode criar dois registros. Gráficos de evolução e medidas corporais permanecem fora desta versão.”

## 05:05 a 05:40 — Cancelamento e persistência do UC04

**Ação:** volte a **Aulas**, clique em **Cancelar reserva** de Bike indoor e aguarde a mensagem. Mostre a disponibilidade voltando a quatro vagas. Recarregue e confirme que a matrícula e o treino permanecem, mas a reserva foi cancelada.

**Fala:** “Também podemos cancelar a reserva até duas horas antes da aula, incluindo o limite exato. Como esta aula está dentro do prazo, vou cancelar. A vaga é liberada uma única vez e a disponibilidade volta a quatro. Após a recarga, o cancelamento permanece, sem apagar a matrícula ou o histórico de treino. Os testes de serviço verificam o instante exato do limite e os valores imediatamente antes e depois.”

## 05:40 a 06:45 — Executar e mostrar os testes

**Ação:** alterne para o terminal, execute **npm run test:a6** e mostre os 20 resultados aprovados. Execute **npm test** e aponte **28 pass / 0 fail**. Abra o terminal da automação pública iniciada em 00:30 e mostre **13 verificações de navegador aprovadas**. Se ainda estiver executando, aguarde ou identifique um corte de espera. Abra `docs/a6/evidencias/navegador.json`, mostrando A6-B07 e A6-B13; não altere o arquivo.

**Fala:** “Esta é a execução dos testes, com verificações automáticas e resultados reais. O primeiro comando executa vinte verificações do recorte operacional: matrícula, reserva, cancelamento, validações e persistência. A regressão tem vinte e oito testes aprovados. Na URL pública, a automação de navegador concluiu treze verificações. Entre elas estão o reenvio após resposta perdida e duas requisições concorrentes à última vaga da mesma demonstração. Uma retorna sucesso e a outra conflito, mantendo apenas uma reserva. Essa concorrência não equivale a dois alunos autenticados.”

## 06:45 a 07:30 — Métricas e limites da execução

**Ação:** mostre as seções **Métricas calculadas** e **Rastreabilidade** do relatório. Destaque os denominadores, a separação entre A4 e o recorte A6 e as evidências. Mostre rapidamente os sete resultados em `http-publico.txt`.

**Fala:** “No recorte A6, vinte verificações de serviço mais treze de navegador totalizam trinta e três aprovações em trinta e três verificações. A taxa é cem por cento desse recorte. Há ainda sete verificações do contrato HTTP aprovadas e vinte e oito testes de regressão, apresentados separadamente. Isso não significa aprovação integral dos sessenta e sete cenários originais da A4. O relatório mantém cada cenário e registra os impedimentos: autenticação, perfis, gestão e outros critérios ainda não atendidos. Assim, as métricas não escondem a diferença entre o sistema planejado e a versão implementada.”

## 07:30 a 08:00 — Acesso do avaliador e encerramento

**Ação:** mostre a URL pública, o repositório na tag **a6-final** e o relatório com o cabeçalho preservado. Finalize em 08:00.

**Fala:** “O avaliador pode acessar a aplicação por esta URL, sem credenciais, e iniciar sua própria demonstração. O código, os testes, as evidências e a documentação estão no repositório indicado. A aplicação deve permanecer disponível até dois de dezembro de dois mil e vinte e seis, considerando a entrega em dezoito de novembro. Encerramos a demonstração de todos os fluxos implementados. Obrigado!”

## Depois da gravação

Exporte com duração de oito minutos e verifique áudio e legibilidade dos cliques e resultados. Publique o vídeo em um serviço que permita acesso pelo link. Abra esse link em janela anônima para conferir a permissão. Entregue o relatório A6 e o link do vídeo no campo da atividade. Se o campo aceitar apenas arquivo, inclua o link no DOCX, exporte novamente o PDF e confirme que o link é clicável. A6 Praticando remete à entrega final do Aplicando; se o AVA também exigir arquivo no Praticando, anexe o mesmo relatório. O roteiro não substitui o vídeo exigido.
