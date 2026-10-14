# Documentação completa do Academia Conectada

Atualização de 14 de outubro de 2026 com as atividades A4 incorporadas à Entrega 2.

- [PDF para entrega](academia-conectada-entrega-2.pdf)
- [DOCX editável](academia-conectada-entrega-2.docx)
- [Planos de teste em Markdown](../../tests/manual/README.md)
- [Cenários estruturados](../../tests/manual/cenarios-de-teste.json)
- [Modelo de registro de execução](../../tests/manual/registro-execucao.md)

## Conteúdo

As seções 1 a 11 preservam o conteúdo do projeto e suas nove figuras.
A seção 12 apresenta A4 Praticando, com 11 cenários do UC04.
A seção 13 apresenta A4 Aplicando o conhecimento: 59 cenários funcionais no total,
incluindo os 11 da seção 12, e oito verificações transversais.

Todos os cenários estão planejados, com situação inicial **Não executado**.
Os arquivos não constituem uma suíte automatizada nem resultados de homologação.

## Apresentação acadêmica

Papel A4, margens superior/esquerda de 3 cm e inferior/direita de 2 cm,
Arial 12, texto com espaçamento 1,5 e recuo de primeira linha de 1,25 cm.
Quadros, fontes e legendas usam tamanho menor e espaçamento simples.
Capa, folha de rosto, sumário, títulos, referências e paginação superior foram
organizados conforme as orientações de apresentação acadêmica do Mackenzie.

## Manutenção

`scripts/update_project_abnt.py` preserva o documento anterior armazenado em
`base/academia-conectada-entrega-2-original.docx`, incorpora os cenários de
`tests/manual/cenarios-de-teste.json` e gera o DOCX completo e o catálogo Markdown.

Após alterações, gerar o DOCX, renderizar com o renderer de documentos, executar
`python scripts/update_project_abnt.py --toc-from CAMINHO_DO_PDF_RENDERIZADO`
e renderizar novamente. Conferir a paginação do sumário e todas as páginas antes
de substituir o PDF final. A base histórica deve ser mantida sem alterações.
