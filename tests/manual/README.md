# Planos de teste A4

59 cenários funcionais e 8 verificações transversais. Situação inicial de todos: **Não executado**.

Praticando: UC04 / CT04-01 a CT04-11. Aplicando o conhecimento: UC01 a UC08 e TNF01 a TNF08.

Documento completo e critérios de homologação: [PDF](../../docs/entrega-2/academia-conectada-entrega-2.pdf) e [DOCX](../../docs/entrega-2/academia-conectada-entrega-2.docx).

Estes arquivos especificam testes manuais e de integração planejados. Não constituem uma suíte automatizada executável nem evidência de aprovação da aplicação.

## UC01 Cadastrar-se e entrar

Ambiente de homologação com autenticação e recuperação implementadas; dados fictícios reinicializados. AL01 e AL02 são alunos ativos, IN01 é instrutor e AD01 é administrador. Credenciais de teste e regra de senha configurada estão disponíveis ao executor.

### CT01-01 Cadastrar usuário com dados válidos

**Prioridade:** Alta

**Pré-condição:** Nenhuma conta utiliza novo.aluno@example.test; cadastro público habilitado.

**Dados:** Nome: Aluno de Teste; e-mail: novo.aluno@example.test; demais campos obrigatórios válidos; senha conforme a regra configurada.

1. Abrir o cadastro e preencher os dados indicados.
2. Enviar o formulário e concluir o fluxo apresentado.
3. Consultar a conta criada e o destino do acesso.

**Resultado esperado:** Uma única conta é criada com os dados informados. O sistema confirma o cadastro e direciona o usuário à área correspondente ao perfil definido para o cadastro.

### CT01-02 Validar obrigatoriedade e regra de senha

**Prioridade:** Alta

**Pré-condição:** Cadastro disponível; obrigatoriedade dos campos e regra de senha registradas no ambiente.

**Dados:** Conjunto A: nome vazio. Conjunto B: e-mail vazio. Conjunto C: novo.aluno@example.test e senha que viola uma condição documentada da regra configurada. Conjunto D: e-mail aluno-sem-arroba.

1. Preencher o cadastro com cada conjunto, mantendo válidos os demais campos.
2. Enviar o formulário e observar a validação.
3. Verificar se houve criação de conta.

**Resultado esperado:** Cada entrada inválida é rejeitada com indicação clara do campo a corrigir. Nenhuma conta é criada para os conjuntos inválidos.

### CT01-03 Impedir cadastro com e-mail existente

**Prioridade:** Alta

**Pré-condição:** AL01 possui uma conta cadastrada com al01@example.test.

**Dados:** Nome: Segundo Aluno; e-mail: al01@example.test; demais dados e senha válidos.

1. Abrir o cadastro e informar os dados indicados.
2. Enviar o formulário e observar a mensagem de validação.
3. Consultar a quantidade de contas vinculadas ao e-mail.

**Resultado esperado:** O cadastro é recusado por duplicidade de e-mail, com mensagem compreensível. A conta de AL01 permanece inalterada e existe apenas uma conta vinculada ao endereço.

### CT01-04 Entrar com credenciais válidas por perfil

**Prioridade:** Alta

**Pré-condição:** AL01, IN01 e AD01 possuem contas habilitadas; iniciar cada tentativa sem sessão ativa.

**Dados:** al01@example.test, in01@example.test e ad01@example.test, cada um com sua senha válida de homologação.

1. Informar as credenciais de uma das contas e acionar Entrar.
2. Verificar a sessão e a área apresentada.
3. Encerrar a sessão e repetir para as demais contas.

**Resultado esperado:** Cada login cria uma sessão para a conta correta. AL01 acessa a área de aluno, IN01 a de instrutor e AD01 a administrativa, conforme seus respectivos perfis.

### CT01-05 Recusar credenciais inválidas

**Prioridade:** Alta

**Pré-condição:** AL01 está habilitado; não existe conta com inexistente@example.test; navegador sem sessão ativa.

**Dados:** Conjunto A: al01@example.test com senha incorreta. Conjunto B: inexistente@example.test com uma senha de teste.

1. Tentar entrar com cada conjunto de credenciais.
2. Observar a resposta e tentar abrir diretamente uma área protegida, usando seu endereço previamente conhecido.

**Resultado esperado:** As duas tentativas são recusadas com mensagem clara. Nenhuma sessão autenticada é criada e a área protegida permanece inacessível.

### CT01-06 Recusar acesso de conta desabilitada

**Prioridade:** Alta

**Pré-condição:** Preparar conta fictícia desabilitada, distinta de AL03: matrícula inativa e conta desabilitada são estados diferentes.

**Dados:** E-mail: desabilitado@example.test; senha correta da conta desabilitada.

1. Abrir a tela de entrada e informar as credenciais.
2. Acionar Entrar e tentar acessar diretamente uma área protegida pelo endereço conhecido.

**Resultado esperado:** A conta desabilitada não obtém sessão nem acesso protegido, mesmo com senha correta. O sistema apresenta uma mensagem compreensível sobre a impossibilidade de acesso.

### CT01-07 Encerrar sessão pela saída

**Prioridade:** Alta

**Pré-condição:** AL01 está autenticado e visualiza sua área protegida, com os dados da própria conta corretamente apresentados.

**Dados:** Conta AL01: al01@example.test; endereço de uma página protegida previamente acessada.

1. Acionar a opção de saída do sistema e observar a confirmação apresentada.
2. Tentar reabrir diretamente a página protegida e atualizar a página.

**Resultado esperado:** A sessão é encerrada. O acesso protegido exige nova autenticação, sem apresentar dados privados de AL01 após a atualização.

### CT01-08 Recuperar o acesso à conta

**Prioridade:** Alta

**Pré-condição:** AL01 está habilitado e sem sessão; mecanismo de recuperação configurado para um canal de homologação acessível ao executor.

**Dados:** Conta AL01: al01@example.test; novos dados de acesso compatíveis com a regra configurada, quando solicitados.

1. Solicitar recuperação de acesso para al01@example.test.
2. Cumprir as etapas e validações do mecanismo configurado no ambiente.
3. Entrar com o acesso restabelecido.

**Resultado esperado:** O sistema fornece instruções claras e permite restabelecer o acesso após as validações previstas. O login final identifica AL01 e direciona à área de aluno.

## UC02 Consultar planos e modalidades

Ambiente de homologação com catálogo fictício conhecido. PL01 é um plano ativo de R$ 99/mês; PL02 está indisponível. Modalidades, horários, localização e contato de teste possuem valores de referência registrados. AL01 possui conta ativa.

### CT02-01 Consultar catálogo como visitante e aluno

**Prioridade:** Alta

**Pré-condição:** PL01 está publicado; modalidade de teste vinculada ao catálogo e disponível para consulta.

**Dados:** PL01: R$ 99/mês; modalidade: Musculação; perfis: visitante e AL01.

1. Abrir a seção de planos e modalidades sem autenticação.
2. Conferir PL01 e a modalidade com os dados de referência.
3. Repetir a consulta após entrar como AL01.

**Resultado esperado:** Os dois perfis conseguem consultar o catálogo. Nome, valor e detalhes de PL01 correspondem à massa de teste; a modalidade publicada é exibida sem exigir cadastro do visitante.

### CT02-02 Filtrar o catálogo e consultar detalhes

**Prioridade:** Média

**Pré-condição:** Catálogo contém itens correspondentes ao filtro e itens distintos; referências registradas.

**Dados:** Filtro disponível correspondente a PL01 ou à modalidade Musculação; outro valor sem correspondência.

1. Aplicar o filtro com correspondência e abrir um resultado.
2. Conferir detalhes com o cadastro de referência.
3. Aplicar o filtro sem correspondência e depois limpar a seleção.

**Resultado esperado:** O filtro exibe apenas itens correspondentes; os detalhes pertencem ao item selecionado. A busca sem resultado informa ausência de itens. Limpar o filtro restaura a listagem.

### CT02-03 Consultar horários, localização e contato

**Prioridade:** Média

**Pré-condição:** Conteúdo público de homologação cadastrado com os dados fictícios de referência.

**Dados:** Horário: segunda-feira às 19h; localização: Rua Exemplo, 100; contato: contato@example.test.

1. Abrir as áreas públicas de horários, localização e contato.
2. Comparar os valores exibidos com a massa de referência.
3. Repetir a consulta como AL01.

**Resultado esperado:** Visitante e aluno visualizam horário, endereço e canal de contato corretos, com identificação clara de cada informação. Os dados não são confundidos com informações de outro registro.

### CT02-04 Iniciar contato ou matrícula pelo catálogo

**Prioridade:** Alta

**Pré-condição:** PL01 acessível; encaminhamentos de contato e matrícula configurados em homologação.

**Dados:** Plano PL01: R$ 99/mês; canal de teste: contato@example.test; perfil visitante e AL01.

1. Abrir os detalhes de PL01 e acionar a opção de contato, sem enviar mensagem.
2. Retornar ao catálogo e iniciar a matrícula em PL01.
3. Se solicitado, autenticar AL01 e conferir o plano selecionado.

**Resultado esperado:** O contato encaminha ao canal configurado. O início da matrícula conduz ao fluxo correspondente a PL01, preservando sua identificação e exigindo autenticação quando aplicável.

### CT02-05 Tratar catálogo vazio e indisponibilidade

**Prioridade:** Média

**Pré-condição:** Ambiente permite preparar catálogo vazio e simular indisponibilidade temporária.

**Dados:** Conjunto A: catálogo sem itens. Conjunto B: consulta de catálogo indisponível, com dados de PL01 preservados na origem.

1. Consultar planos e modalidades com o conjunto A.
2. Preparar o conjunto B e repetir a consulta.
3. Restabelecer a consulta e atualizar.

**Resultado esperado:** A lista vazia recebe indicação própria; a falha temporária é informada de modo claro, sem representar sucesso ou inventar itens. Após o restabelecimento, os dados disponíveis voltam a ser consultáveis.

## UC03 Solicitar matrícula

Ambiente de homologação com matrícula e persistência disponíveis; AL01 e AL02 são alunos ativos, AL03 possui matrícula inativa. PL01 está ativo por R$ 99/mês e PL02 indisponível. Cada cenário deve restaurar as matrículas iniciais e registrar a regra configurada de incompatibilidade.

### CT03-01 Solicitar matrícula em plano disponível

**Prioridade:** Alta

**Pré-condição:** AL03 está autenticado, com dados cadastrais completos e sem matrícula ativa incompatível com PL01.

**Dados:** AL03: al03@example.test; PL01: R$ 99/mês; aceite dos termos marcado.

1. Selecionar PL01 e conferir os dados apresentados.
2. Confirmar os dados, aceitar os termos e enviar a solicitação.
3. Consultar o protocolo e a solicitação registrada.

**Resultado esperado:** Uma solicitação vincula AL03 a PL01, com protocolo e situação inicial conforme o fluxo configurado. Os dados exibidos correspondem ao registro. Nenhum pagamento real ou dado bancário é solicitado.

### CT03-02 Acompanhar situação da solicitação

**Prioridade:** Alta

**Pré-condição:** AL03 está autenticado e possui solicitação de PL01 registrada, com protocolo e situação conhecidos na massa de teste.

**Dados:** Aluno AL03; plano PL01; protocolo de homologação MAT-TESTE-001; situação de referência configurada.

1. Abrir o acompanhamento de matrícula de AL03.
2. Localizar MAT-TESTE-001 e conferir plano e situação.
3. Atualizar a página e repetir a consulta.

**Resultado esperado:** O acompanhamento apresenta protocolo, aluno, plano e situação coerentes com a solicitação persistida. A atualização mantém os dados corretos e não gera outra solicitação.

### CT03-03 Rejeitar solicitação com dados incompletos

**Prioridade:** Alta

**Pré-condição:** AL03 está autenticado; massa preparada com um campo cadastral obrigatório ausente, identificado pela regra configurada.

**Dados:** AL03; PL01; campo obrigatório de confirmação vazio; demais campos válidos; termos aceitos.

1. Selecionar PL01 e manter vazio o campo obrigatório definido na massa.
2. Tentar enviar a solicitação.
3. Consultar os registros de matrícula de AL03.

**Resultado esperado:** O sistema identifica o campo a corrigir e impede a conclusão. Nenhuma nova solicitação nem protocolo de sucesso é registrado para os dados incompletos.

### CT03-04 Exigir aceite dos termos

**Prioridade:** Alta

**Pré-condição:** AL03 está autenticado, com dados completos e sem matrícula ativa incompatível.

**Dados:** AL03; PL01; aceite dos termos não marcado.

1. Selecionar PL01 e confirmar os dados cadastrais.
2. Manter os termos sem aceite e tentar concluir a solicitação.
3. Consultar os registros de AL03 e verificar se uma nova solicitação foi criada.

**Resultado esperado:** A conclusão exige o aceite e informa essa necessidade. Sem aceite, nenhuma matrícula é solicitada e nenhum protocolo de sucesso é emitido.

### CT03-05 Impedir matrícula em plano indisponível

**Prioridade:** Alta

**Pré-condição:** AL03 está autenticado; PL02 está indisponível. Ambiente permite submeter sua identificação no fluxo de homologação.

**Dados:** AL03; PL02; dados cadastrais completos e termos aceitos.

1. Abrir o fluxo de matrícula apontando para PL02.
2. Tentar confirmar a solicitação.
3. Consultar a resposta e os registros de matrícula.

**Resultado esperado:** A indisponibilidade é informada e nenhuma solicitação válida é criada para PL02. Alterar a entrada para referenciar o plano não contorna a validação de disponibilidade.

### CT03-06 Bloquear matrícula ativa incompatível

**Prioridade:** Alta

**Pré-condição:** AL01 está autenticado e possui matrícula ativa que, segundo a regra configurada e registrada, é incompatível com nova solicitação de PL01.

**Dados:** AL01: al01@example.test; PL01; dados completos; termos aceitos; combinação incompatível definida na massa.

1. Selecionar PL01 e confirmar os dados de AL01.
2. Aceitar os termos e tentar enviar a solicitação.
3. Conferir as matrículas e a resposta apresentada.

**Resultado esperado:** O sistema informa a incompatibilidade e impede a nova solicitação. A matrícula ativa existente permanece inalterada, sem protocolo de sucesso para a tentativa recusada.

## UC04 Agendar ou cancelar aula

Ambiente integrado de homologação; AL01 autenticado, com matrícula ativa. Recriar a massa antes de cada cenário; as exceções são indicadas em cada caso.

### CT04-01 Reserva com vaga disponível

**Prioridade:** Alta

**Pré-condição:** AL01 sem reserva ou conflito no horário de AU01.

**Dados:** AU01: capacidade 10, nove reservas de outros alunos e uma vaga.

1. Consultar a agenda, abrir AU01 e confirmar a reserva.
2. Atualizar a página e consultar a reserva em nova sessão.

**Resultado esperado:** Uma reserva ativa de AL01 para AU01; ocupação 10 e zero vagas. A confirmação e a nova sessão mostram a mesma reserva persistida.

### CT04-02 Reserva sem matrícula ativa

**Prioridade:** Alta

**Pré-condição:** Executar com AL03 autenticado e matrícula inativa.

**Dados:** AU01 com uma vaga e AL03 sem reserva.

1. Abrir AU01 e tentar reservar.
2. Consultar reservas e ocupação no servidor.

**Resultado esperado:** Operação negada com orientação sobre a matrícula; nenhuma reserva criada e a vaga permanece disponível.

### CT04-03 Aula lotada

**Prioridade:** Alta

**Pré-condição:** AL01 sem reserva para AU02.

**Dados:** AU02: capacidade 10 e dez reservas ativas.

1. Consultar AU02 e tentar reservar; enviar também a solicitação ao servidor no ambiente de teste.
2. Reconsultar ocupação e reservas.

**Resultado esperado:** Interface informa lotação e servidor rejeita a operação; ocupação permanece 10, sem reserva adicional.

### CT04-04 Solicitação duplicada

**Prioridade:** Alta

**Pré-condição:** AL01 já tem reserva ativa em AU01.

**Dados:** AU01 com ocupação 9, incluindo AL01, e uma vaga; mesma combinação aluno e aula.

1. Reenviar a solicitação de reserva para AU01 duas vezes.
2. Atualizar a agenda e consultar as reservas de AL01.

**Resultado esperado:** Permanece exatamente uma reserva ativa para AL01 e AU01. Ocupação 9 e uma vaga disponível; mensagem informa a reserva existente.

### CT04-05 Conflito de horário

**Prioridade:** Alta

**Pré-condição:** AL01 tem reserva em AU03, das 18h às 19h em D+2.

**Dados:** AU04 no mesmo dia, das 18h30 às 19h30, com vaga.

1. Selecionar AU04 e confirmar reserva.
2. Consultar a agenda e as duas aulas.

**Resultado esperado:** Conflito informado; somente a reserva de AU03 permanece ativa. A ocupação de AU04 não muda.

### CT04-06 Cancelamento dentro do prazo

**Prioridade:** Alta

**Pré-condição:** AL01 tem reserva em AU01 e antecedência maior que T.

**Dados:** AU01: capacidade 10 e ocupação 10; prazo T configurado.

1. Abrir a reserva de AU01 e confirmar cancelamento.
2. Atualizar a página e reenviar o cancelamento da mesma reserva.

**Resultado esperado:** Reserva fica cancelada e uma vaga é liberada. Repetir a solicitação não libera outra vaga; ocupação final 9 e uma vaga.

### CT04-07 Cancelamento fora do prazo

**Prioridade:** Alta

**Pré-condição:** AL01 tem reserva em AU01; relógio de homologação permite controlar o tempo.

**Dados:** Antecedência menor que T por uma unidade de precisão do sistema.

1. Tentar cancelar AU01 após o limite permitido.
2. Atualizar a página e consultar a reserva.

**Resultado esperado:** Cancelamento recusado com indicação do prazo. Reserva continua ativa e nenhuma vaga é liberada.

### CT04-08 Limite exato de cancelamento

**Prioridade:** Alta

**Pré-condição:** Restaurar reserva ativa e relógio antes de cada variação.

**Dados:** Antecedência T+ε, T e T−ε; ε é a menor unidade de precisão do sistema.

1. Tentar cancelar uma vez em cada antecedência, com massa restaurada.
2. Conferir status e ocupação após cada tentativa.

**Resultado esperado:** T+ε permite e T−ε impede cancelamento. Em T, aplicar a inclusão ou exclusão do limite registrada na política de homologação. Vaga liberada uma única vez apenas quando permitido.

### CT04-09 Concorrência pela última vaga

**Prioridade:** Alta

**Pré-condição:** AL01 e AL02 ativos, sem conflitos e em sessões distintas.

**Dados:** AU01 com capacidade 10, ocupação 9 e uma vaga.

1. Disparar as duas solicitações de reserva simultaneamente por barreira de sincronização no teste de integração.
2. Consultar as respostas, a ocupação e as reservas persistidas.

**Resultado esperado:** Exatamente uma nova reserva é confirmada; a outra recebe indisponibilidade. Ocupação final 10 e zero vagas, sem excesso de capacidade.

### CT04-10 Falha durante a gravação

**Prioridade:** Alta

**Pré-condição:** AL01 elegível; injetar falha de persistência em homologação.

**Dados:** AU01 com uma vaga; erro de gravação antes da confirmação da transação.

1. Tentar reservar com a falha ativa.
2. Restaurar o serviço, consultar a aula e repetir a operação.

**Resultado esperado:** Primeira tentativa informa erro, sem sucesso nem gravação parcial. Após a recuperação, uma única reserva é criada e a ocupação aumenta uma vez.

### CT04-11 Permissão sobre a reserva

**Prioridade:** Alta

**Pré-condição:** AL02 possui uma reserva; identificar seu código apenas na massa de teste.

**Dados:** Visitante sem sessão e AL01 autenticado.

1. Como visitante, enviar uma solicitação de reserva.
2. Como AL01, tentar cancelar a reserva de AL02 pelo servidor.

**Resultado esperado:** Solicitações negadas por autenticação e autorização, respectivamente. Nenhuma reserva ou vaga é alterada e dados privados de AL02 não são expostos.

## UC05 Consultar plano de treino

Base de testes isolada; AL01 e AL02 ativos; IN01 autorizado a consultar AL01 e IN02 sem autorização. TR01 vigente de AL01, com sessões A e B; TR02 vencido; TR03 sem exercícios. Reiniciar a base entre cenários.

### CT05-01 Consultar sessões do treino vigente como aluno

**Prioridade:** Alta

**Pré-condição:** AL01 autenticado; TR01 é seu único treino vigente e contém duas sessões distintas.

**Dados:** Sessão A: EX01, 3 séries de 10 repetições, 20 kg, descanso 60 s, orientação Descer controladamente; sessão B: EX02, 2 séries de 12 repetições, 15 kg, 45 s, orientação Manter tronco estável.

1. Abrir Meu treino e selecionar a sessão A.
2. Selecionar a sessão B e conferir seus exercícios.
3. Reabrir a consulta após atualizar a página.

**Resultado esperado:** Deve exibir exercício, séries, repetições, carga, descanso e orientação da sessão selecionada, sem misturar dados ou alterar a prescrição persistida.

### CT05-02 Consultar aluno autorizado como instrutor

**Prioridade:** Alta

**Pré-condição:** IN01 autenticado e autorizado sobre AL01; TR01 contém EX01 e EX02 prescritos.

**Dados:** TR01: EX01, 3 séries de 10 repetições, 20 kg, 60 s, orientação Descer controladamente; EX02, 2 séries de 12 repetições, 15 kg, 45 s, orientação Manter tronco estável.

1. Selecionar AL01 na área do instrutor e abrir seu treino.
2. Conferir as sessões e comparar as prescrições com a base preparada.
3. Sair da consulta e abri-la novamente.

**Resultado esperado:** Deve apresentar o treino vigente de AL01 com séries, repetições, cargas, descansos e orientações corretos, preservando identificação, versão, valores e vínculo do plano.

### CT05-03 Consultar aluno sem plano atribuído

**Prioridade:** Média

**Pré-condição:** AL02 autenticado, com matrícula ativa e nenhum plano de treino atribuído.

**Dados:** AL02 sem prescrições; TR01 permanece exclusivamente associado a AL01, para verificar que dados de outro aluno não preencham a consulta.

1. Abrir a área Meu treino com AL02.
2. Atualizar a página e repetir a consulta.
3. Conferir os vínculos de planos na base.

**Resultado esperado:** Deve informar que não há plano disponível, sem apresentar exercícios de AL01 ou falha técnica. Nenhum plano, exercício ou vínculo deve ser criado pela consulta.

### CT05-04 Identificar plano vencido

**Prioridade:** Alta

**Pré-condição:** AL01 autenticado; nesta preparação, possui apenas TR02 vencido, sem prescrição vigente.

**Dados:** Relógio de teste em 14/10/2026; TR02 com término em 13/10/2026 e EX01 cadastrado; consulta feita após o término.

1. Abrir Meu treino e verificar o plano selecionado pelo sistema.
2. Se houver consulta histórica, abrir os detalhes de TR02.
3. Conferir a vigência armazenada na base.

**Resultado esperado:** Não deve apresentar TR02 como vigente; deve informar o vencimento ou a ausência de treino vigente. Eventual consulta histórica deve preservar a sinalização e os dados originais.

### CT05-05 Impedir consulta sem autorização

**Prioridade:** Alta

**Pré-condição:** IN02 autenticado, sem autorização sobre AL01; IN01 consulta TR01 normalmente.

**Dados:** IN02; aluno AL01; identificador TR01 obtido exclusivamente da base fictícia preparada para o teste de acesso.

1. Tentar localizar AL01 na área de acompanhamento de IN02.
2. Tentar abrir diretamente a consulta de TR01 pelo mecanismo disponível no ambiente.
3. Conferir a resposta e os dados persistidos.

**Resultado esperado:** Deve negar o acesso sem revelar exercícios, cargas ou demais dados de AL01. A tentativa não deve modificar TR01 nem conceder autorização a IN02.

### CT05-06 Tratar prescrição sem exercícios

**Prioridade:** Média

**Pré-condição:** AL01 autenticado; TR03 preparado sem exercícios simula uma inconsistência independente das validações do UC07.

**Dados:** TR03 associado a AL01, com sessão A vazia; nenhum exercício deve ser copiado automaticamente de TR01 ou de outro aluno.

1. Abrir a consulta de TR03 e selecionar a sessão vazia.
2. Atualizar a página e repetir a consulta.
3. Conferir os exercícios vinculados na base.

**Resultado esperado:** Critério sugerido: informar a ausência de exercícios sem falha técnica nem valores fictícios. O sistema deve preservar a base e não apresentar a sessão vazia como prescrição completa.

## UC06 Registrar treino e evolução

AL01 autenticado; TR01 vigente com EX01 agachamento e EX02 remada. Registros fictícios em base isolada. Limites numéricos, tipos e unidades das medidas devem ser configurados e registrados; comportamento de rascunhos é parâmetro proposto a confirmar.

### CT06-01 Salvar execução e consultar histórico

**Prioridade:** Alta

**Pré-condição:** AL01 possui TR01 vigente; não existe registro da sessão preparada para este teste.

**Dados:** Sessão A em 14/10/2026; EX01 executado com 20 kg; EX02 executado com 15 kg; observação: Movimento realizado com controle.

1. Abrir o registro de TR01 e marcar os dois exercícios executados.
2. Informar as cargas e a observação; salvar.
3. Reabrir o histórico após nova autenticação de AL01.

**Resultado esperado:** Deve manter um registro com aluno, treino, exercícios, cargas e observação corretos. A gravação da execução não deve alterar as cargas prescritas no plano original.

### CT06-02 Rejeitar valor não numérico na carga

**Prioridade:** Alta

**Pré-condição:** AL01 abriu o registro de TR01; nenhum dado desta tentativa foi salvo.

**Dados:** EX01 marcado como executado; carga informada como vinte no campo numérico; EX02 com 15 kg e observação válida.

1. Preencher a carga de EX01 com o texto indicado.
2. Tentar salvar e verificar a indicação de erro.
3. Corrigir para 20 kg e salvar novamente.

**Resultado esperado:** Deve rejeitar o valor incompatível sem persistir execução parcial. Após a correção, deve salvar somente um registro válido, preservando os demais dados preenchidos.

### CT06-03 Validar limites numéricos parametrizados

**Prioridade:** Média

**Pré-condição:** AL01 registra TR01; documentar previamente limites inclusivos L/U por campo e precisão ε aprovada para cargas.

**Dados:** Variações independentes: carga em L-ε, L, U e U+ε; repetições em L-1, L, U, U+1 e valor fracionário L+0,5.

1. Registrar os parâmetros L/U e ε; preencher EX01 com uma variação por tentativa.
2. Tentar salvar, anotando valor enviado e resultado da validação.
3. Reiniciar cada tentativa e conferir os registros persistidos.

**Resultado esperado:** Deve aceitar limites L/U, rejeitar valores externos e repetições fracionárias. O histórico deve conter apenas valores válidos, sem alterar a prescrição; evidências devem registrar os limites efetivamente usados.

### CT06-04 Interromper preenchimento antes de salvar

**Prioridade:** Alta

**Pré-condição:** AL01 preenche TR01; anotar previamente a quantidade de execuções presentes no histórico.

**Dados:** EX01 marcado com 20 kg; observação: Preenchimento interrompido; nenhum comando de confirmação ou salvamento foi acionado.

1. Preencher parcialmente o formulário com os dados indicados.
2. Sair da página ou fechar a sessão antes de salvar.
3. Entrar novamente e consultar o formulário e o histórico.

**Resultado esperado:** Não deve registrar treino concluído sem confirmação. Caso existam rascunhos, devem ser identificados separadamente; sua retenção depende de critério acordado, sem alteração do histórico concluído.

### CT06-05 Interromper comunicação durante salvamento

**Prioridade:** Alta

**Pré-condição:** Ambiente permite interromper a comunicação durante a gravação; AL01 preencheu uma execução válida.

**Dados:** EX01 com 20 kg, EX02 com 15 kg; observação: Teste de interrupção; identificar a tentativa para conferência posterior.

1. Acionar Salvar e interromper a comunicação antes da confirmação.
2. Restabelecer a conexão e consultar o histórico antes de repetir o envio.
3. Conferir os dados efetivamente persistidos.

**Resultado esperado:** Critério sugerido: deve existir uma execução completa ou nenhuma, sem registros parciais. A interface deve permitir verificar o resultado sem afirmar sucesso que não tenha sido confirmado.

### CT06-06 Preservar evolução após revisão da prescrição

**Prioridade:** Alta

**Pré-condição:** AL01 possui execução anterior de EX01 em 20 kg; IN01 pode revisar TR01.

**Dados:** Registro anterior em 12/10/2026 com observação: Execução inicial; revisão posterior prescreve 25 kg; nova execução utiliza 22 kg.

1. Revisar a carga prescrita para 25 kg como IN01.
2. Entrar como AL01 e registrar nova execução com 22 kg.
3. Consultar os dois registros após reabrir o histórico.

**Resultado esperado:** Deve preservar o registro anterior em 20 kg e a nova execução em 22 kg. A carga prescrita de 25 kg não deve substituir cargas históricas realizadas.

### CT06-07 Impedir registro para outro aluno

**Prioridade:** Alta

**Pré-condição:** AL02 autenticado; TR01 pertence a AL01; registrar seu histórico inicial para comparação.

**Dados:** Tentativa com aluno AL01, treino TR01 e EX01 em 20 kg, enviada em sessão de AL02 pelo mecanismo disponível.

1. Tentar abrir o formulário de TR01 com a sessão de AL02.
2. Tentar salvar a execução para AL01 pelo mesmo ambiente.
3. Conferir os históricos de AL01 e AL02.

**Resultado esperado:** Deve negar o registro em nome de outro aluno. Nenhum histórico deve receber a execução e nenhum vínculo deve ser transferido.

### CT06-08 Registrar medidas e consultar evolução

**Prioridade:** Alta

**Pré-condição:** AL01 autenticado; ambiente preparado com tipo de medida peso e unidade kg, conforme configuração registrada antes da execução.

**Dados:** Duas medições fictícias: 70,0 kg em 01/10/2026 e 71,0 kg em 14/10/2026; registrar o tipo e a unidade efetivamente configurados.

1. Salvar a primeira medição e depois a segunda, com suas respectivas datas.
2. Reabrir o histórico e a consulta de evolução após nova autenticação.
3. Selecionar o período das medições e comparar valores e gráfico.

**Resultado esperado:** Deve persistir as duas datas, valores e unidades; histórico e gráfico devem mostrar pontos correspondentes em ordem cronológica, com diferença de 1,0 kg, sem substituir a primeira medição.

## UC07 Gerenciar treinos de alunos

IN01 autenticado e autorizado sobre AL01; IN02 sem autorização sobre AL01. TR01 vigente contém EX01 e EX02. A base é reiniciada entre cenários; regras não descritas de encerramento ou acesso por perfil devem ser confirmadas.

### CT07-01 Criar e publicar plano completo

**Prioridade:** Alta

**Pré-condição:** IN01 autorizado sobre AL01; nesta preparação, AL01 não possui plano vigente.

**Dados:** Novo plano TR10; sessão A; EX01 com 3 séries, 20 kg e 60 s de descanso; EX02 com 2 séries, 15 kg e 45 s.

1. Selecionar AL01 e criar TR10 com sessão e exercícios.
2. Preencher os campos exigidos e publicar.
3. Reabrir o plano como instrutor e consultá-lo como AL01.

**Resultado esperado:** Deve persistir e apresentar a mesma prescrição completa nos dois acessos, associada somente a AL01, com versão identificável e sem exercícios duplicados.

### CT07-02 Revisar sem apagar histórico

**Prioridade:** Alta

**Pré-condição:** IN01 autorizado sobre AL01; TR01 possui execução histórica de EX01 em 20 kg.

**Dados:** Prescrição anterior de EX01: 3 séries, 20 kg, 60 s; revisão proposta: 4 séries, 25 kg, 75 s; EX02 permanece igual.

1. Abrir TR01, revisar os três valores de EX01 e publicar nova versão.
2. Reabrir a prescrição vigente como AL01.
3. Consultar a execução histórica e comparar seus dados.

**Resultado esperado:** Deve exibir os novos valores na versão publicada e preservar integralmente o histórico anterior. A revisão não deve alterar EX02 nem criar execução retroativa.

### CT07-03 Atribuir plano ao aluno selecionado

**Prioridade:** Alta

**Pré-condição:** Nesta preparação, IN01 também está autorizado sobre AL02, sem plano vigente; AL01 mantém TR01.

**Dados:** Plano novo TR11 para AL02; sessão A com EX02, 2 séries, 15 kg e 45 s de descanso; nenhum vínculo com AL01.

1. Selecionar AL02, preencher TR11 e confirmar a atribuição.
2. Consultar Meu treino como AL02 e verificar a prescrição.
3. Consultar AL01 e conferir os vínculos na base.

**Resultado esperado:** Deve atribuir TR11 exclusivamente a AL02 e permitir sua consulta. TR01 deve continuar associado a AL01 sem alteração de conteúdo ou titularidade.

### CT07-04 Encerrar plano preservando registros anteriores

**Prioridade:** Alta

**Pré-condição:** IN01 autorizado sobre AL01; TR01 vigente possui execução histórica íntegra anterior ao encerramento.

**Dados:** TR01 de AL01; execução em 12/10/2026 com EX01 em 20 kg; encerramento preparado para 14/10/2026, sem outro plano vigente.

1. Abrir TR01 como IN01 e confirmar seu encerramento.
2. Reabrir a consulta de treino de AL01.
3. Conferir o estado do plano e a execução anterior.

**Resultado esperado:** Deve deixar de apresentar TR01 como prescrição vigente e preservar os registros anteriores. A apresentação do motivo ou da data de encerramento depende dos campos definidos pelo projeto.

### CT07-05 Impedir publicação de plano incompleto

**Prioridade:** Alta

**Pré-condição:** IN01 autorizado sobre AL01; TR01 vigente deve continuar disponível se TR03 for rejeitado.

**Dados:** Nova prescrição TR03 com sessão A sem exercícios; demais campos exigidos preenchidos com dados válidos da base de testes.

1. Preparar TR03 com a sessão vazia e tentar publicar.
2. Verificar a indicação de incompletude e retornar à consulta de AL01.
3. Conferir qual plano está vigente na base.

**Resultado esperado:** Deve impedir a publicação da prescrição incompleta e informar o problema. TR01 deve permanecer vigente; eventual rascunho de TR03 não deve substituir a prescrição válida.

### CT07-06 Bloquear gestão de aluno não autorizado

**Prioridade:** Alta

**Pré-condição:** IN02 autenticado sem autorização sobre AL01; registrar conteúdo, estado e versão iniciais de TR01.

**Dados:** Aluno AL01; TR01; alteração tentada em EX01 para 99 kg; executar tentativas independentes de revisar, atribuir novo plano e encerrar.

1. Tentar abrir a gestão de AL01 com IN02.
2. Para cada operação indicada, tentar confirmar a ação pelo mecanismo de teste disponível.
3. Comparar vínculos, versões e estados com a base inicial.

**Resultado esperado:** Deve negar todas as operações e preservar TR01 integralmente. Nenhum plano adicional, nova autorização ou encerramento deve ser persistido para AL01.

### CT07-07 Restringir publicação ao perfil autorizado

**Prioridade:** Alta

**Pré-condição:** AL01 autenticado somente como aluno; registrar TR01 e seu histórico para comparação.

**Dados:** TR01 de AL01; tentativa de trocar a prescrição de EX01 para 50 kg por acesso direto à operação de publicação.

1. Tentar acessar a área de gestão de treinos como AL01.
2. Tentar publicar a alteração pelo mecanismo de teste disponível.
3. Conferir a prescrição vigente e suas versões.

**Resultado esperado:** O perfil de aluno deve ser impedido de publicar prescrições. Cargas prescritas, versões e histórico devem permanecer idênticos aos valores iniciais.

## UC08 Administrar cadastros, planos e aulas

AD01 autenticado como administrador em base isolada. Usar dados fictícios AL90, MO90, PL90, HO90 e AU90; campos obrigatórios e chaves únicas definidos no esquema do ambiente. Executar cada variação independentemente e restaurar a base.

### CT08-01 Executar CRUD válido nas cinco entidades

**Prioridade:** Alta

**Pré-condição:** AD01 acessa os cinco módulos; registros inexistentes, com referências válidas e sem dependências.

**Dados:** Variações (inicial → alterado): aluno AL90, Lia Teste → Lia Revisada, lia90@example.test; modalidade MO90, Alongamento → Mobilidade; plano PL90, Experimental → Revisado; horário HO90, 18:00 → 19:00; aula AU90, Sessão Teste → Sessão Revisada.

1. Para cada entidade, criar o registro e consultar seus detalhes.
2. Alterar um campo permitido e conferir após reabrir.
3. Excluir o registro sem dependentes e consultar novamente.

**Resultado esperado:** Em cada variação, criação, leitura, alteração e exclusão devem persistir corretamente; a lista deve refletir cada operação sem afetar registros externos ao cenário.

### CT08-02 Rejeitar ausência de dado obrigatório

**Prioridade:** Alta

**Pré-condição:** AD01 autenticado; identificar previamente um campo obrigatório de cada entidade conforme o esquema aprovado.

**Dados:** Variações independentes AL90, MO90, PL90, HO90 e AU90; preencher todos os campos com dados válidos, exceto o campo obrigatório escolhido.

1. Abrir a criação da entidade e deixar o campo selecionado vazio.
2. Tentar salvar e verificar a validação apresentada.
3. Pesquisar o identificador na lista e na base.

**Resultado esperado:** Deve indicar o dado obrigatório ausente e impedir a gravação incompleta em cada variação. Não deve criar registro parcial nem alterar referências existentes.

### CT08-03 Impedir registro duplicado

**Prioridade:** Alta

**Pré-condição:** AD01 autenticado; existe um registro por módulo; documentar a chave única de cada entidade.

**Dados:** Reutilizar a chave única de AL90, MO90, PL90, HO90 ou AU90 em novo cadastro; exemplo proposto para aluno: lia90@example.test, se e-mail for único.

1. Criar novo registro repetindo a chave do registro original.
2. Preencher os demais campos validamente e tentar salvar.
3. Contar os registros com a mesma chave e conferir o original.

**Resultado esperado:** Deve informar duplicidade e manter apenas o registro original íntegro. Nomes iguais só devem ser rejeitados quando constituírem chave única definida.

### CT08-04 Impedir exclusão de registro vinculado

**Prioridade:** Alta

**Pré-condição:** AD01 autenticado; preparar dependências previstas no modelo e registrar seus identificadores.

**Dados:** Exemplos de vínculos: aluno com matrícula, plano com matrícula, modalidade ou horário associado a aula, aula com reserva; usar exclusivamente registros fictícios isolados.

1. Selecionar um registro cuja dependência esteja ativa na base.
2. Solicitar e confirmar sua exclusão, quando houver confirmação.
3. Consultar novamente o registro e todas as dependências preparadas.

**Resultado esperado:** Deve impedir a exclusão por vínculo existente e informar a restrição. Registro principal e dependências devem permanecer íntegros, sem remoção em cascata ou referências órfãs.

### CT08-05 Negar manutenção para perfil não administrativo

**Prioridade:** Alta

**Pré-condição:** AL01 e IN01 autenticados sem perfil administrativo; registros fictícios existem para comparação.

**Dados:** Executar para aluno e instrutor as tentativas de criar AL91, alterar PL90 e excluir AU90; usar dados válidos nas operações.

1. Acessar a área administrativa com cada perfil indicado.
2. Tentar as operações diretamente pelo mecanismo de teste disponível.
3. Comparar listas e registros com o estado inicial.

**Resultado esperado:** Deve negar manutenção por esses perfis, inclusive acesso direto. Nenhum cadastro deve ser criado, alterado ou excluído pelas tentativas.

### CT08-06 Impedir alteração após encerramento da sessão

**Prioridade:** Alta

**Pré-condição:** AD01 abriu PL90; encerrar sua sessão em outra aba antes de confirmar alterações.

**Dados:** PL90 com nome Experimental; nova descrição digitada: Alteração após logout; sessão encerrada sem revogar ou alterar o cadastro de AD01.

1. Preparar a edição de PL90 na primeira aba.
2. Encerrar a sessão na segunda aba e tentar salvar na primeira.
3. Autenticar novamente e consultar PL90.

**Resultado esperado:** Deve exigir autenticação válida e impedir a alteração pela sessão encerrada. A descrição persistida deve permanecer igual à anterior ao teste.

### CT08-07 Validar referências de aula

**Prioridade:** Alta

**Pré-condição:** AD01 autenticado; AU90 tem modalidade e horário válidos; registrar seus vínculos iniciais.

**Dados:** Alterar, em variações independentes, a referência de modalidade para MO99 inexistente e de horário para HO99 inexistente na base preparada.

1. Abrir a edição de AU90 e preparar a referência inválida.
2. Tentar salvar pelo mecanismo disponível no ambiente de teste.
3. Reabrir AU90 e conferir seus vínculos persistidos.

**Resultado esperado:** Critério de integridade sugerido: deve rejeitar referências inexistentes sem atualização parcial. AU90 deve conservar modalidade e horário originais, sem criar cadastros implícitos.

### CT08-08 Cancelar edição preservando cadastro

**Prioridade:** Média

**Pré-condição:** AD01 autenticado; PL90 tem nome Experimental; registrar descrição inicial para comparação.

**Dados:** Nome digitado: Experimental revisado; descrição digitada: Alteração descartada; demais campos permanecem iguais aos valores armazenados previamente.

1. Abrir PL90 e modificar nome e descrição sem salvar.
2. Acionar Cancelar ou sair descartando explicitamente as alterações.
3. Reabrir a lista e os detalhes do plano.

**Resultado esperado:** Critério sugerido para a ação de descarte: deve manter nome e descrição originais, sem atualização parcial ou registro adicional. A lista deve continuar consistente com os detalhes persistidos.

## ONF Verificações transversais

### TNF01 Usabilidade dos fluxos

**Prioridade:** Média

**Pré-condição:** Versão integrada e participante que não recebeu treinamento.

**Dados:** Consultar plano, solicitar matrícula, reservar aula e consultar treino.

1. Apresentar somente os objetivos das tarefas e observar sua execução.
2. Registrar conclusão, pedidos de ajuda e compreensão das mensagens.

**Resultado esperado:** Cada tarefa é concluída sem orientação operacional do avaliador; mensagens de sucesso e erro permitem identificar o resultado e a próxima ação. Relacionado a ONF01.

### TNF02 Responsividade

**Prioridade:** Média

**Pré-condição:** Aplicação disponível com dados de todos os perfis.

**Dados:** Larguras de 360, 768, 1280 e 1920 px; zoom inicial 100%.

1. Percorrer páginas públicas, formulários, agenda, treino e gestão em cada largura.
2. Acionar os controles e verificar listas, mensagens e tabelas.

**Resultado esperado:** Conteúdo e ações permanecem acessíveis, sem sobreposição, corte ou rolagem horizontal indevida da página. Relacionado a ONF02.

### TNF03 Acessibilidade dos percursos

**Prioridade:** Alta

**Pré-condição:** Navegador com teclado, leitor de tela e analisador de contraste.

**Dados:** Percursos UC01 a UC08, incluindo validação de erros.

1. Percorrer controles por teclado e conferir foco, nomes acessíveis, rótulos, mensagens e alternativas textuais.
2. Medir contraste dos textos e registrar os elementos avaliados.

**Resultado esperado:** Ações operáveis por teclado, foco visível e sem aprisionamento; campos identificáveis. Contraste mínimo de texto comum 4,5:1 e texto grande 3:1, respeitadas as exceções da WCAG. Esta amostra não certifica conformidade integral. ONF03; referências W3C.

### TNF04 Tempo de carregamento público

**Prioridade:** Média

**Pré-condição:** Build de produção em homologação, rede móvel estável e dispositivo registrados.

**Dados:** Página inicial, planos e agenda; cinco carregamentos por página, sem cache.

1. Medir do início da navegação até o conteúdo principal estar visível e utilizável.
2. Registrar os cinco tempos, erros, dispositivo, latência e taxa de rede.

**Resultado esperado:** Cada medição é de até 3 segundos, sem erro de carregamento. A métrica e as cinco repetições são a operacionalização proposta neste plano para ONF04.

### TNF05 Proteção de sessão e entrada

**Prioridade:** Alta

**Pré-condição:** Backend, autenticação e banco de homologação disponíveis.

**Dados:** Perfis visitante, aluno, instrutor e administrador; entrada inválida e texto com marcação HTML.

1. Verificar HTTPS e repetir operações protegidas por perfil diretamente no servidor.
2. Inspecionar validação de entrada e armazenamento de senha sem expor valores; inserir marcação em campo textual.

**Resultado esperado:** Acesso segue o perfil e a propriedade do registro; entradas inválidas são recusadas, marcação não executa e senha não fica em texto puro. HTTPS presente nas rotas avaliadas. ONF05.

### TNF06 Correção e exclusão de dados

**Prioridade:** Alta

**Pré-condição:** Procedimento de privacidade e campos necessários definidos para homologação.

**Dados:** Conta fictícia AL02, com dados de contato e registros relacionados.

1. Conferir campos coletados contra a finalidade aprovada; corrigir um dado e reconsultar.
2. Solicitar exclusão pelo procedimento definido e verificar o tratamento dos vínculos e acessos.

**Resultado esperado:** Correção persiste; exclusão ou retenção justificada segue o procedimento registrado, sem exposição a outro usuário ou registros órfãos. Este teste funcional não representa auditoria jurídica. ONF06.

### TNF07 Compatibilidade entre navegadores

**Prioridade:** Média

**Pré-condição:** Mesma versão e massa restaurada entre execuções.

**Dados:** Chrome, Edge, Firefox e Safari estáveis disponíveis na homologação; registrar versões e sistemas.

1. Executar os fluxos de sucesso de UC01 a UC08 em cada navegador.
2. Comparar navegação, formulários, feedback, resultados e persistência.

**Resultado esperado:** Todos os percursos têm o mesmo resultado funcional e controles utilizáveis, sem erros específicos que impeçam a execução. ONF07.

### TNF08 Consistência de vagas e reservas

**Prioridade:** Alta

**Pré-condição:** Ambiente integrado com observação de transações e massa restaurável.

**Dados:** CT04-01, CT04-04, CT04-06, CT04-09 e CT04-10.

1. Executar a sequência indicada, restaurando a massa de cada caso.
2. Conferir reservas ativas, capacidade, vagas e mensagens após cada operação.

**Resultado esperado:** Ocupação entre zero e capacidade; vagas iguais à capacidade menos reservas ativas; no máximo uma reserva ativa por aluno e aula. Nenhum sucesso antes da gravação. ONF08.
