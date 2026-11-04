"""Gera a revisão A5 preservando o corpo completo e as figuras da entrega A4."""
from pathlib import Path
import json,re,argparse
from docx import Document
from docx.shared import Cm,Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH,WD_TAB_ALIGNMENT,WD_TAB_LEADER
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/a5/academia-conectada-a5-especificacao.docx'
PAGES=ROOT/'docs/a5/assets/paginacao.json'

def add(d,text="",style=None):return d.add_paragraph(text,style)
def h(d,text,level=1):return d.add_heading(text,level)
QUAD=76
def table(d,headers,rows):
 global QUAD
 QUAD+=1
 titles={77:'Referências de versionamento da A5',78:'Escopo entregue por caso de uso',79:'Estrutura física de persistência',80:'Regras da Iteração 2',81:'Resultados de validação'}
 cap=add(d,f'Quadro {QUAD} - {titles[QUAD]}','Caption');cap.paragraph_format.keep_with_next=True
 t=d.add_table(rows=1,cols=len(headers))
 for row,vals in [(t.rows[0],headers)]+[(t.add_row(),v) for v in rows]:
  for c,v in zip(row.cells,vals):c.text=str(v)
 add(d,'Fonte: elaboração própria (2026).','Caption')
 return t

def build():
 d=Document(ROOT/'docs/a5/assets/base-a4.docx')
 ps=d.paragraphs
 # Capa com reprodução integral do cabeçalho institucional fornecido.
 for p in ps[:6]:p._p.getparent().remove(p._p)
 cover=d.paragraphs[0]
 p=cover.insert_paragraph_before();p.add_run().add_picture(str(ROOT/'docs/a5/assets/cabecalho-mackenzie.png'),width=Cm(16));p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.first_line_indent=Cm(0)
 cover.paragraph_format.space_before=Pt(75)
 for p in d.paragraphs:
  if p.text=='Documentação completa do projeto e planos de teste':p.text='Especificação revisada e atualizada • Iteração 2\nA5 Praticando e A5 Aplicando o conhecimento';p.paragraph_format.space_after=Pt(85)
  if p.text=='MATHEUS ARAUJO DOS SANTOS NUNES':
   e=OxmlElement('w:p');p._p.addnext(e);np=Paragraph(e,d);np.text='LUIZ FELIPE MANTOVANI';np.alignment=WD_ALIGN_PARAGRAPH.CENTER;np.paragraph_format.first_line_indent=Cm(0)
  if p.text.startswith('Trabalho apresentado'):p.text='Trabalho apresentado à Universidade Presbiteriana Mackenzie, no curso de Análise e Desenvolvimento de Sistemas, para a disciplina Prática Profissional em Análise e Desenvolvimento de Sistemas. Reúne a especificação completa, os planos de teste A4 e a implementação e o controle de versão da Iteração 2, referentes às atividades A5 Praticando e A5 Aplicando o conhecimento.'
  if p.text.startswith('Versão atualizada'):p.text='Versão 2.0 • 4 de novembro de 2026';p.paragraph_format.space_after=Pt(30)
 # Mantém os RAs previamente associados e não infere o RA do novo integrante.
 row=d.tables[0].add_row()
 for c,v in zip(row.cells,['5','Luiz Felipe Mantovani','Não informado']):c.text=v
 changes={
 'Além da documentação, foi desenvolvida':'A Iteração 1 apresentou a interface demonstrativa, identificada pela tag v1. A Iteração 2, identificada pela tag v2, implementa matrícula, reservas de aulas e registros de treino com validações no servidor e persistência SQLite. As seções 14 e 15 registram o versionamento, o escopo entregue, a execução local e as evidências. A identidade acadêmica AL01 é compartilhada; autenticação real e gestão administrativa permanecem previstas para etapas futuras.',
 'O projeto Academia Conectada propõe':'O projeto Academia Conectada propõe um sistema web para apoiar a rotina de uma academia, centralizando informações de alunos, planos, aulas, reservas, treinos e evolução. Esta revisão preserva a especificação funcional, a modelagem, os protótipos e os planos de teste das entregas anteriores, atualizando o estado da implementação para a Iteração 2.',
 'A interface inicial foi implementada':'A interface da Iteração 2 utiliza Next.js, React, TypeScript e Tailwind CSS. Os fluxos de matrícula, reserva, cancelamento e registro de treino comunicam-se com GET/POST /api/academia e gravam em SQLite. A aplicação exibe estados de carregamento, confirmação e erro, e recupera registros após recarregar a página. O quadro desta seção registra a interface histórica da Iteração 1; a interface atual aparece na seção 15.6.',
 'Aplicam-se os critérios de preparação':'Aplicam-se os critérios de preparação, execução, aprovação e registro definidos na seção 13. Este catálogo A4 mantém sua situação inicial Não executado; a seção 15 apresenta separadamente as verificações realmente executadas sobre o subconjunto implementado na Iteração 2. Cenários com autenticação e perfis ainda dependem de implementação.',
 'Os testes estão planejados e não representam':'O catálogo A4 corresponde ao plano de homologação do sistema completo. Não se presume aprovação integral a partir dos testes da Iteração 2. Os resultados da automação de serviço e do fluxo de navegador são apresentados separadamente na seção 15.5; autenticação, autorização, administração e demais funções futuras permanecem sem validação de execução.',
 'Os principais riscos são backend':'Os principais riscos remanescentes são a ausência de autenticação e isolamento por usuário, funcionalidades futuras ainda não implementadas e resíduos de dados entre testes. A Iteração 2 integra serviço e banco para o recorte definido na seção 15. A homologação completa deve usar identidades reais de teste, ambientes isolados e critérios de entrada do plano A4.',
 }
 for p in d.paragraphs:
  for prefix,new in changes.items():
   if p.text.startswith(prefix):p.text=new;break
  if p.text.startswith('URL da aplicação:'):p.text='URL histórica da Iteração 1: https://academia-conectada.vercel.app. A Iteração 2 é executada localmente conforme a seção 15.4.'
  if p.text.startswith('Quadro 5 -'):p.text='Quadro 5 - Rastreabilidade histórica da interface demonstrativa da Iteração 1'
  if 'quatro integrantes' in p.text:p.text=p.text.replace('quatro integrantes','cinco integrantes')
  if 'Playwright, Vitest e Testing Library são opções' in p.text:p.text=p.text.replace('Playwright, Vitest e Testing Library são opções previstas para automação futura.','Na Iteração 2, node:test valida o serviço e Playwright apoia a verificação do navegador. As demais ferramentas são alternativas futuras.')
 # Explicita o caráter planejado dos modelos anteriores, sem apagar figuras.
 for prefix in ['3 OBJETIVOS FUNCIONAIS','9 MODELO DE DOMÍNIO','10 DIAGRAMA DE CLASSES','11 DIAGRAMAS DE SEQUÊNCIA']:
  head=next(p for p in d.paragraphs if p.style.name=='Heading 1' and p.text.startswith(prefix))
  e=OxmlElement('w:p');head._p.addnext(e);Paragraph(e,d).text='Esta seção descreve o sistema completo planejado. Na Iteração 2, a realização desse modelo limita-se ao recorte de matrícula, aulas e treinos indicado na seção 15; a estrutura física SQLite e o serviço atualmente executáveis são descritos em 15.2.'
 # Substitui apenas a conclusão e as referências; conserva as seções 1 a 13 completas.
 start=next(p._p for p in d.paragraphs if p.style.name=='Heading 1' and p.text.startswith('14 '))
 refs=[p.text for p in d.paragraphs if p.style.name=='Bibliography']
 nodes=list(d._element.body);idx=nodes.index(start)
 for e in nodes[idx:]:
  if e.tag!=qn('w:sectPr'):d._element.body.remove(e)
 h(d,'14 A5 PRATICANDO')
 add(d,'O exercício utiliza o repositório https://github.com/Lanpaiva/academia-conectada. A branch principal histórica chama-se main. Para reproduzir o nome exigido pelo enunciado, master foi criada a partir de origin/main e recebeu a documentação A4 antes da identificação da Iteração 1. A branch iteracao2 foi criada a partir de master, mantida após o merge e disponibilizada para conferência.')
 h(d,'14.1 Identificação das versões',2)
 table(d,['Elemento','Correspondência'],[
 ['v1','Tag anotada no commit b73b765e6290aa3074dc1fe6a1cbf97f88d512ea: interface demonstrativa da Iteração 1 e documentação A4.'],
 ['iteracao2','Branch criada a partir de master no estado v1; contém o exercício de dois arquivos e a implementação da Iteração 2.'],
 ['02fc160','Commit 02fc16027a6f51b052df5f0c28e09e5a6931beb3: altera exatamente README.md e src/app/layout.tsx.'],
 ['master / v2','Merge com dois pais de iteracao2 em master. A tag anotada v2 identifica a entrega final, incluindo código, testes e especificação.']])
 add(d,'No README.md, a modificação do exercício incluiu Luiz Felipe Mantovani na equipe. Em src/app/layout.tsx, foi corrigida a acentuação de “gestão” nos metadados da aplicação. Esses dois arquivos foram alterados no mesmo commit; os commits seguintes implementam o escopo funcional aprovado para a Iteração 2.')
 h(d,'14.2 Conferência no repositório',2)
 add(d,'O professor pode abrir as tags e a branch no GitHub ou executar os comandos abaixo. O grafo deve apresentar o merge em master, com iteracao2 preservada. O teste de ancestralidade deve terminar com código 0. A tag v1 não foi movida para o código da Iteração 2.')
 for line in ['git fetch origin --tags','git show v1 --no-patch','git show --stat 02fc160','git log --graph --oneline --decorate origin/master origin/iteracao2','git show v2 --no-patch','git merge-base --is-ancestor origin/iteracao2 origin/master']:add(d,line,'Code A5')
 h(d,'15 A5 APLICANDO O CONHECIMENTO')
 add(d,'A entrega reúne a especificação revisada e o código-fonte da Iteração 2 identificado por v2. O incremento substitui as interações locais dos fluxos selecionados por operações persistidas no servidor. O README.md apresenta os integrantes, pré-requisitos, instalação no macOS e no Windows, configuração, execução, demonstração, testes e solução de problemas.')
 h(d,'15.1 Escopo e rastreabilidade da implementação',2)
 table(d,['Caso de uso','Entrega na Iteração 2','Limite atual'],[
 ['UC02 / OF02','Consulta de três planos e quatro aulas, preços e vagas.','Catálogo acadêmico inicial; sem editor administrativo.'],
 ['UC03 / OF03','Matrícula com nome, e-mail, aceite, plano e protocolo persistido.','Ativação imediata acadêmica, sem pagamento; aluno AL01 fixo.'],
 ['UC04 / OF04','Reserva e cancelamento, capacidade, duplicidade, conflitos e prazo.','Ocupação inicial fictícia; sem gestão de agenda por administrador.'],
 ['UC05 / OF05','Consulta da sessão de treino com três exercícios.','Prescrição fixa, sem atribuição individual por instrutor.'],
 ['UC06 / OF06','Registro de exercícios, carga realizada, observação e histórico.','Sem gráficos de evolução ou edição de registros.'],
 ['UC01, UC07 e UC08','Permanecem na especificação e no plano A4.','Login, perfis, gestão de treinos e administração não implementados.']])
 add(d,'O aluno AL01 é fixado pelo adaptador HTTP. A instância é compartilhada e não representa autenticação ou autorização multiusuário. A execução de referência ocorre em 127.0.0.1, com dados fictícios. Os objetivos de segurança, privacidade e compatibilidade do projeto completo não são considerados integralmente atendidos por este incremento.')
 h(d,'15.2 Arquitetura executável e dados',2)
 add(d,'O navegador renderiza src/app/page.tsx e envia JSON para src/app/api/academia/route.ts. O adaptador invoca Academy, em src/lib/academia.ts, que aplica as regras e acessa SQLite pelo módulo node:sqlite do Node.js. A resposta inclui o estado atualizado, que substitui o estado exibido. O banco reside em data/academia.sqlite, ou no caminho definido em ACADEMIA_DB_PATH.')
 table(d,['Tabela','Dados e restrições principais'],[
 ['plans','Identificador, nome, preço inteiro em centavos, descrição e indicador de disponibilidade.'],
 ['classes','Identificador, professor, início/fim, capacidade e ocupação inicial fictícia; fim posterior ao início.'],
 ['enrollments','Aluno como chave primária; plano como chave estrangeira; protocolo único; nome, e-mail e data.'],
 ['reservations','Chave composta aluno/aula, referências à matrícula e à aula; data da reserva.'],
 ['workouts','Identificador, aluno, chave de envio, conteúdo JSON e data; unicidade aluno/chave de envio.']])
 add(d,'As gravações usam transações BEGIN IMMEDIATE, chaves estrangeiras e rollback em caso de falha. A reserva conta a ocupação inicial e as reservas efetivamente gravadas dentro da mesma transação. O modo WAL e o tempo de espera de cinco segundos reduzem conflitos entre conexões locais. Os testes verificam duas conexões disputando a última vaga e a recuperação após reabrir o arquivo.')
 add(d,'A agenda é criada uma única vez, dois dias à frente da primeira inicialização, e não muda ao reiniciar. Bike indoor e Funcional se sobrepõem; Pilates começa lotada e Alongamento tem uma vaga. Os horários são exibidos no fuso de São Paulo. A prescrição contém Leg press, Supino reto e Remada baixa. A carga realizada integra o histórico sem alterar a prescrição.')
 add(d,'A implantação de referência da v2 exige processo Node e disco persistente local. A demonstração anteriormente publicada na Vercel corresponde à Iteração 1. A solução futura com PostgreSQL/Neon, autenticação e implantação integrada permanece planejada; arquivos SQLite locais de funções serverless não são usados como persistência desta entrega.')
 h(d,'15.3 Regras de negócio e contrato HTTP',2)
 table(d,['Regra','Comportamento validado'],[
 ['Matrícula','Nome até 100 caracteres, e-mail válido até 200, plano disponível e aceite verdadeiro. Mesmo plano conserva protocolo; outro plano é recusado.'],
 ['Reserva','Exige matrícula; recusa aula inexistente, iniciada, lotada, repetida ou sobreposta. Aulas consecutivas são permitidas.'],
 ['Cancelamento','Antecedência maior ou igual a 2 horas. Repetição sem reserva não libera vagas adicionais.'],
 ['Treino','Um a três exercícios conhecidos, sem duplicação; carga numérica finita entre 0 e 500 kg inclusive; observação até 500 caracteres.'],
 ['Reenvio','Mesma chave e conteúdo do treino retornam o registro existente; mesma chave com outro conteúdo é recusada.'],
 ['Integridade','Falha dentro de transação reverte alterações; reiniciar preserva registros no mesmo arquivo.']])
 add(d,'GET /api/academia retorna planos, aulas, matrícula, prescrição, histórico, relógio do servidor e janela de cancelamento. POST /api/academia recebe action: enroll, reserve, cancel ou workout. O aluno não é selecionável pelo corpo da requisição. Valores monetários e capacidades são consultados no banco, sem confiar no navegador.')
 add(d,'O adaptador aceita objeto JSON de até 8 KB e verifica a origem quando enviada. Retornos: 200 (sucesso), 400 (JSON ou operação inválidos), 403 (matrícula ausente ou origem divergente), 404 (item inexistente), 409 (conflito), 413 (corpo excedido), 415 (formato), 422 (campos inválidos) e 500 (falha inesperada). Essa verificação de origem não substitui autenticação.')
 h(d,'15.4 Instalação e execução local',2)
 add(d,'Pré-requisitos: Git e Node.js 24 LTS, versão 24.13.0 ou superior da série 24, com npm. No Terminal do macOS ou PowerShell do Windows, execute:')
 for line in ['git clone --branch v2 https://github.com/Lanpaiva/academia-conectada.git','cd academia-conectada','npm ci','npm run dev']:add(d,line,'Code A5')
 add(d,'Acesse http://127.0.0.1:3000. Nenhuma credencial é necessária; o servidor cria as tabelas e a massa inicial na primeira consulta. Opcionalmente copie .env.example para .env.local e ajuste ACADEMIA_DB_PATH para um caminho gravável. Reinicie após modificar a configuração. Para usar outra porta: npm run dev -- --port 3001.')
 add(d,'Para validar a execução de produção, encerre o desenvolvimento com Ctrl+C, execute npm run build e depois npm start. O banco é preservado se o caminho permanecer igual. Para recomeçar a demonstração com datas futuras, encerre o processo e renomeie a pasta data inteira para uma cópia de segurança, preservando também os arquivos auxiliares SQLite. O README detalha os procedimentos por sistema operacional.')
 add(d,'Roteiro: selecionar plano; preencher dados fictícios e aceitar os termos; confirmar matrícula; reservar Bike indoor; tentar Funcional e observar a recusa por conflito; registrar Leg press com 35 kg; recarregar e conferir protocolo, reserva e histórico; cancelar a reserva dentro do prazo. A cobrança não é executada.')
 h(d,'15.5 Validação e evidências',2)
 add(d,'A verificação foi realizada em 4 de novembro de 2026, no macOS, com Node.js 24.22.1, TypeScript, ESLint e Chrome automatizado. Os testes de serviço utilizam bases temporárias isoladas, relógio controlado e dados fictícios. O navegador usa uma base SQLite de homologação separada. Os resultados estão registrados em docs/a5/validacao.md.')
 table(d,['Verificação','Resultado'],[
 ['node:test','28 testes aprovados: matrícula, reservas, conflito, cancelamento, treino, limites, rollback, persistência e concorrência.'],
 ['Contrato HTTP','7 verificações aprovadas: origem local/externa, formato, JSON, array, tamanho e campos inválidos.'],
 ['TypeScript / ESLint','Verificação de tipos e lint aprovados, sem erros.'],
 ['Build de produção','Compilação Next.js aprovada.'],
 ['Navegador → API → SQLite','Matrícula, reserva, conflito, treino, persistência na recarga e cancelamento aprovados.'],
 ['Layout responsivo','Sem transbordamento horizontal nas larguras 360, 768, 1280 e 1920 px no Chrome.']])
 add(d,'Durante a integração foram corrigidos a verificação de origem em acesso por 127.0.0.1 e o reaproveitamento de instâncias de classes após hot reload. O fluxo foi repetido após as correções. A passagem da automação não equivale à execução dos 59 cenários funcionais e oito verificações transversais da A4. Cenários de perfis, gestão, auditoria de acessibilidade e compatibilidade entre navegadores continuam pendentes no plano completo.')
 for line in ['npm test','npm run lint','npm run typecheck','npm run build']:add(d,line,'Code A5')
 h(d,'15.6 Interface e persistência observadas',2)
 for number,id,title in [(10,'matricula','Matrícula confirmada e protocolo persistido'),(11,'aulas','Agenda com reserva confirmada e disponibilidade'),(12,'treino','Registro do treino e histórico recuperado após recarga')]:
  cap=add(d,f'Figura {number} - {title}','Caption');cap.paragraph_format.keep_with_next=True
  p=add(d);p.add_run().add_picture(str(ROOT/f'docs/a5/assets/tela-{id}.png'),width=Cm(16));p.paragraph_format.first_line_indent=Cm(0);p.paragraph_format.keep_with_next=True
  add(d,'Fonte: aplicação Academia Conectada, execução local da Iteração 2 (2026).','Caption')
 h(d,'16 CONSIDERAÇÕES FINAIS')
 add(d,'A Iteração 2 entrega uma aplicação local com matrícula, reservas e registros de treino persistidos e validados no servidor. O controle de versão mantém v1, iteracao2, o merge em master e v2 para rastrear as duas atividades A5. A documentação completa conserva requisitos, modelagem e planos A4 e distingue a implementação efetiva das funcionalidades futuras. As próximas etapas são autenticação, isolamento por usuário, perfis de instrutor e administrador, evolução individual e homologação integral do catálogo de testes.')
 h(d,'REFERÊNCIAS')
 for text in refs:
  add(d,text,'Bibliography')
 for text in ['UNIVERSIDADE PRESBITERIANA MACKENZIE. A5 Praticando e A5 Aplicando o conhecimento. São Paulo, 2026. Enunciados da disciplina Prática Profissional em Análise e Desenvolvimento de Sistemas, ambiente virtual de aprendizagem. Acesso em: 4 nov. 2026.','NODE.JS. SQLite. [S. l.], 2026. Disponível em: https://nodejs.org/api/sqlite.html. Acesso em: 4 nov. 2026.','NEXT.JS. Route Handlers. [S. l.], 2026. Disponível em: https://nextjs.org/docs/app/getting-started/route-handlers. Acesso em: 4 nov. 2026.']:add(d,text,'Bibliography')
 # Atualiza o sumário com todos os níveis e páginas verificadas após renderização.
 pars=d.paragraphs;toc=next(p for p in pars if p.text=='SUMÁRIO');end=next(p for p in pars if p.style.name=='Heading 1')
 node=toc._p.getnext()
 while node is not None and node!=end._p:
  nxt=node.getnext()
  if not node.xpath('./w:pPr/w:sectPr'):node.getparent().remove(node)
  node=nxt
 anchor=end._p.getprevious();page_map=json.loads(PAGES.read_text()) if PAGES.exists() else {}
 for item in [p for p in d.paragraphs if p.style.name.startswith('Heading')]:
  p=add(d,item.text+'\t'+str(page_map.get(item.text,'')));p.paragraph_format.first_line_indent=Cm(0);p.paragraph_format.left_indent=Cm(.4*(int(item.style.name[-1])-1));p.paragraph_format.alignment=WD_ALIGN_PARAGRAPH.LEFT;p.paragraph_format.line_spacing=1.5;p.paragraph_format.space_after=Pt(0);p.paragraph_format.tab_stops.add_tab_stop(Cm(16),WD_TAB_ALIGNMENT.RIGHT,WD_TAB_LEADER.DOTS);anchor.addprevious(p._p)
 format_doc(d)
 d.core_properties.title='Academia Conectada — Especificação revisada — Iteração 2 — A5'
 d.core_properties.author='Alan Araujo Paiva; Ian Ávila Guerra; Júlio de Moura Stelzer; Matheus Araujo dos Santos Nunes; Luiz Felipe Mantovani'
 d.save(OUT);print(OUT)

def format_doc(d):
 for s in d.sections:
  s.page_width=Cm(21);s.page_height=Cm(29.7);s.top_margin=Cm(3);s.left_margin=Cm(3);s.bottom_margin=Cm(2);s.right_margin=Cm(2)
 # Pré-textuais contados a partir da folha de rosto, corpo continua a contagem.
 pg=d.sections[-1]._sectPr.find(qn('w:pgNumType'))
 if pg is not None:d.sections[-1]._sectPr.remove(pg)
 if 'Code A5' not in d.styles:
  st=d.styles.add_style('Code A5',1);st.font.name='Courier New';st.font.size=Pt(9);st.paragraph_format.line_spacing=1;st.paragraph_format.first_line_indent=Cm(0);st.paragraph_format.space_after=Pt(5)
 inbody=False
 for p in d.paragraphs:
  if p.text=='1 INTRODUÇÃO' and p.style.name=='Heading 1':inbody=True
  if not inbody:continue
  pf=p.paragraph_format;pf.widow_control=True
  if p.style.name=='Heading 1':pf.page_break_before=p.text!='1 INTRODUÇÃO'
  if p.style.name.startswith('Heading'):pf.keep_with_next=True
  if p.style.name=='Normal':pf.line_spacing=1.5;pf.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY;pf.first_line_indent=Cm(1.25)
  if p._p.xpath('.//w:drawing'):pf.first_line_indent=Cm(0);pf.alignment=WD_ALIGN_PARAGRAPH.CENTER
 for pic in d.inline_shapes:
  scale=min(1,Cm(16)/pic.width,Cm(19)/pic.height);pic.width=int(pic.width*scale);pic.height=int(pic.height*scale)
 for t in d.tables:
  widths=([3,13] if len(t.columns)==2 else [3,7,6]);t.autofit=False
  for c,w in zip(t.columns,widths):c.width=Cm(w)
  for i,row in enumerate(t.rows):
   pr=row._tr.get_or_add_trPr()
   if pr.find(qn('w:cantSplit')) is None:pr.append(OxmlElement('w:cantSplit'))
   for c,w in zip(row.cells,widths):
    c.width=Cm(w)
    tcp=c._tc.get_or_add_tcPr()
    if tcp.find(qn('w:tcBorders')) is None:
     borders=OxmlElement('w:tcBorders')
     for side in ['top','bottom','left','right']:
      b=OxmlElement('w:'+side);b.set(qn('w:val'),'single');b.set(qn('w:sz'),'4');b.set(qn('w:color'),'D9D9D9');borders.append(b)
     tcp.append(borders)
    if tcp.find(qn('w:shd')) is None:
     sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'EEEEEE' if i==0 else 'FFFFFF');tcp.append(sh)
    if tcp.find(qn('w:tcMar')) is None:
     mar=OxmlElement('w:tcMar')
     for side in ['top','bottom','left','right']:
      e=OxmlElement('w:'+side);e.set(qn('w:w'),'80');e.set(qn('w:type'),'dxa');mar.append(e)
     tcp.append(mar)
    for p in c.paragraphs:
     p.paragraph_format.first_line_indent=Cm(0);p.paragraph_format.line_spacing=1;p.paragraph_format.space_after=Pt(0);p.paragraph_format.alignment=WD_ALIGN_PARAGRAPH.LEFT
     for r in p.runs:r.font.name='Arial';r.font.size=Pt(10);r.bold=i==0
  if not t.rows[0]._tr.xpath('./w:trPr/w:tblHeader'):t.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--toc-from',type=Path);args=parser.parse_args()
 if args.toc_from:
  from pypdf import PdfReader
  d=Document(OUT);heads=[p.text for p in d.paragraphs if p.style.name.startswith('Heading')];pages={}
  norm=lambda x:re.sub(r'\s+',' ',x).strip()
  reader=PdfReader(args.toc_from)
  for i,page in enumerate(reader.pages):
   txt=norm(page.extract_text())
   if i<4:continue
   for head in heads:
    if head not in pages and norm(head) in txt:pages[head]=i
  PAGES.write_text(json.dumps(pages,ensure_ascii=False,indent=2))
 # Estilo usado durante a autoria precisa existir antes de add_paragraph.
 original=Document
 def with_style(path):
  d=original(path)
  if 'Code A5' not in d.styles:
   st=d.styles.add_style('Code A5',1);st.font.name='Courier New';st.font.size=Pt(9);st.paragraph_format.line_spacing=1;st.paragraph_format.first_line_indent=Cm(0);st.paragraph_format.space_after=Pt(5)
  return d
 Document=with_style
 build()
