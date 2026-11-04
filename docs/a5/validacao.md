# Validação da Iteração 2 — A5

Rodada de 4 de novembro de 2026, macOS, Node.js 24.22.1, Chrome em contexto isolado e endereço local. Versão de entrega: tag `v2`. Os arquivos desta pasta integram a mesma tag que o código avaliado.

## Resultados

| Verificação | Resultado | Evidência |
| --- | --- | --- |
| Serviço, regras e persistência | 28 aprovados; zero falhas | [Saída do runner](evidencias/testes-dominio.txt) |
| Adaptador HTTP | 7 verificações aprovadas | [Códigos observados](evidencias/qualidade.txt), [script reproduzível](../../tests/http/check-http.mjs) |
| ESLint / TypeScript | Código de saída 0 | [Registro](evidencias/qualidade.txt) |
| Produção Next.js | Compilação aprovada | [Saída](evidencias/build-producao.txt) |
| Fluxo completo no Chrome | Aprovado, sem erros JavaScript | [Registro](evidencias/navegador.json) |
| Layout | Sem transbordamento horizontal em 360, 768, 1280 e 1920 px | [Registro](evidencias/navegador.json) |

## Fluxo observado

1. Aceite dos termos e confirmação de matrícula pelo navegador; servidor gravou protocolo e matrícula.
2. Reserva de Bike indoor, com atualização da disponibilidade.
3. Tentativa de Funcional recusada por sobreposição, com resposta de conflito.
4. Registro de Leg press com carga realizada de 35 kg e observação fictícia.
5. Recarga da página recuperou matrícula, reserva e exatamente um treino do SQLite.
6. Cancelamento de Bike indoor liberou a vaga; consulta HTTP confirmou ausência da reserva e manutenção do treino.
7. Verificação das quatro larguras e ausência de erros de execução JavaScript.

O fluxo foi verificado em desenvolvimento e repetido na compilação de produção com uma base de homologação nova. Foram corrigidos a comparação de origem local no Next.js e o cache de instâncias durante hot reload. A produção foi compilada novamente após a correção.

Capturas: [matrícula](assets/tela-matricula.png), [agenda](assets/tela-aulas.png), [treino](assets/tela-treino.png), [desktop](assets/tela-iteracao2-desktop.png) e [mobile](assets/tela-iteracao2-mobile.png).

## Cobertura e limites

Os testes automatizados usam SQLite em memória ou arquivos temporários próprios, relógio controlado, erro de transação injetado e duas conexões em workers concorrentes disputando a última vaga. Incluem reabertura do banco, limites inclusivos de carga e cancelamento e idempotência dos envios.

A interface usa o aluno acadêmico compartilhado AL01. Não há aprovação de autenticação, autorização por perfil, gestão administrativa, privacidade integral, acessibilidade integral, desempenho sob carga ou compatibilidade em outros navegadores. Os 59 cenários funcionais e oito verificações transversais da A4 continuam sendo um plano para o sistema completo; não foram marcados integralmente como executados.

## Reprodução

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

Com a aplicação aberta em outro terminal, `node tests/http/check-http.mjs` verifica sete respostas sem gravar dados. O endereço padrão é `http://127.0.0.1:3000`; `TEST_BASE_URL` permite outra porta. Para a verificação visual, siga o roteiro do README em uma base nova de demonstração. O teste automatizado de reabertura usa base temporária e não depende de apagar o banco da aplicação.

## Versionamento para conferência

- `v1`: commit `b73b765e6290aa3074dc1fe6a1cbf97f88d512ea`.
- Exercício de dois arquivos: commit `02fc16027a6f51b052df5f0c28e09e5a6931beb3`, com `README.md` e `src/app/layout.tsx`.
- Desenvolvimento: `iteracao2`, criada a partir de `master` no estado `v1`.
- Integração: merge com dois pais em `master`, sem excluir `iteracao2`.
- Entrega final: tag anotada `v2` sobre o merge.

A especificação contém o cabeçalho institucional fornecido, os cinco integrantes, a modelagem completa anterior, os planos A4 e as seções próprias das duas atividades A5. A apresentação usa papel A4, margens superior/esquerda de 3 cm e inferior/direita de 2 cm, fonte Arial 12 no corpo, entrelinhas 1,5, referências e quadros em espaço simples, sumário e paginação conferidos no PDF.
