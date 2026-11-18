"""Gera relatório e roteiro A6 a partir das evidências reais e do plano A4."""
from pathlib import Path
import json, re, hashlib, shutil
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/a6'
EV = OUT / 'evidencias'
PLAN = ROOT / 'tests/manual/cenarios-de-teste.json'
URL = 'https://academia-conectada.vercel.app'
REPO = 'https://github.com/Lanpaiva/academia-conectada'
TAG = REPO + '/tree/a6-final'
COMMIT = 'c869472f45a268cd59ac64c28b90a54e0e364339'
HEADER = ROOT / 'docs/a5/assets/cabecalho-mackenzie.png'
plan = json.loads(PLAN.read_text())
service = json.loads((EV / 'servico.json').read_text())
browser = json.loads((EV / 'navegador.json').read_text())
checks = service['results'] + browser['results']
assert len(checks) == 33 and all(x['status'] == 'Aprovado' for x in checks)
assert not browser['errors']
assert '7 verificações HTTP aprovadas.' in (EV/'http-publico.txt').read_text()
assert '# pass 28' in (EV/'regressao-v2.tap').read_text()

reasons = {
 'UC01': 'Cadastro de conta, autenticação, perfis e recuperação de senha não implementados. O cookie identifica uma demonstração, sem autenticar pessoa.',
 'UC02': 'Catálogo parcial disponível; perfil autenticado, filtros, modalidades como cadastro próprio e canais de contato/localização não implementados conforme a A4.',
 'UC03': 'Há matrícula demonstrativa para AL01 fixo, mas não existem contas autenticadas AL01/AL02/AL03 e os estados de homologação do plano original.',
 'UC04': 'Há reserva e cancelamento demonstrativos, mas a base original exige alunos autenticados e massa de múltiplos alunos. A ocupação inicial atual é sintética.',
 'UC05': 'Apenas uma Sessão A fixa está disponível; não existem prescrição individual, duas sessões, autoria por instrutor, expiração e autorização por aluno.',
 'UC06': 'Registro e histórico demonstrativos disponíveis; faltam identidade autenticada, prescrição individual versionada, edição de repetições, medidas e gráficos exigidos no conjunto A4.',
 'UC07': 'Gestão de treinos pelo instrutor, publicação e atribuição individual não implementadas.',
 'UC08': 'Área administrativa, CRUD de cadastros e controle de acesso por perfil não implementados.',
 'TNF01': 'Participante sem treinamento não disponível; automação não substitui a observação de usabilidade prevista.',
 'TNF02': 'Áreas de instrutor e gestão ausentes. A6-B10 verifica somente a interface implementada em quatro larguras.',
 'TNF03': 'Percursos UC01 a UC08 indisponíveis e amostra com leitor de tela e contraste não executada.',
 'TNF04': 'Dispositivo e rede móvel estável exigidos não disponíveis na execução registrada. Não há cinco medições por página nesse ambiente.',
 'TNF05': 'Autenticação, perfis e armazenamento de senhas ausentes. HTTPS e validação HTTP isolados não atendem todo o critério.',
 'TNF06': 'Conta AL02 e procedimento de correção/exclusão de dados pessoais não implementados.',
 'TNF07': 'Execução registrada somente em Chrome 157; áreas completas e matriz Edge, Firefox e Safari não disponíveis.',
 'TNF08': 'Sequência integral depende de CT04-09 com dois alunos autenticados. Ensaios com AL01 fixo e ocupação sintética não atendem essa precondição.',
}
specific = {
 'CT02-02':'Filtro do catálogo não implementado.',
 'CT02-03':'Localização e canal de contato da massa original não implementados; tampouco existe consulta autenticada.',
 'CT02-04':'Encaminhamento de contato não implementado; seleção de plano para matrícula existe, sem autenticação.',
 'CT02-05':'A6-B11 comprovou vazio, falha e recuperação do catálogo de planos com respostas controladas. Modalidades como catálogo próprio, também mencionadas no cenário original, não estão implementadas; aprovação integral não atribuída.',
 'CT04-09':'Não existem dois alunos autenticados disputando a mesma aula. A6-B13 verifica dois pedidos da mesma demonstração; os testes locais de workers não criam perfis autenticados.',
 'CT04-11':'Não existem perfis de aluno, instrutor e administrador para a matriz de autorização original.',
 'CT05-01':'A6-S15 e A6-B06 consultam uma sessão fixa. A4 exige duas sessões de prescrição individual.',
 'CT06-03':'Limites de carga verificados no recorte A6; repetições não são editáveis, e a identidade autenticada da base A4 não existe.',
 'CT06-06':'Não há revisão de prescrição por instrutor. Preservar a carga fixa original não comprova esse fluxo completo.',
 'CT06-07':'Segundo contexto isolado de demonstração não equivale a autorização entre duas contas de aluno.',
 'CT06-08':'Medidas corporais e gráficos de evolução não implementados.'
}
baseline = []
for group in plan['casos_de_uso']:
 for case in group['tests']:
  linked = [c['id'] for c in checks if case['id'] in c['source'] or group['id'] in c['source']]
  baseline.append(dict(case, group=group['id'], status='Bloqueado', reason=specific.get(case['id'],reasons[group['id']]), evidence=linked))
for case in plan['transversais']:
 baseline.append(dict(case, group='TNF',status='Bloqueado',reason=reasons[case['id']],evidence=[c['id'] for c in checks if case['id'] in c['source']]))
assert len(baseline) == 67 and len({c['id'] for c in baseline}) == 67
a6_approved = sum(c['status'] == 'Aprovado' for c in checks)
a4_approved = sum(c['status'] == 'Aprovado' for c in baseline)
a4_failed = sum(c['status'] == 'Reprovado' for c in baseline)
a4_blocked = sum(c['status'] == 'Bloqueado' for c in baseline)
metrics = {
 'date':'2026-11-18', 'originalA4':{'planned':len(baseline),'approved':a4_approved,'failed':a4_failed,'blocked':a4_blocked,'notReviewed':0,'integralExecutionPercent':100*(a4_approved+a4_failed)/len(baseline),'blockedPercent':100*a4_blocked/len(baseline),'approvalAmongExecuted':None},
 'operationalA6':{'planned':33,'executed':len(checks),'approved':a6_approved,'failed':len(checks)-a6_approved,'blocked':0,'executionPercent':100*len(checks)/33,'approvalPercent':100*a6_approved/len(checks),'failurePercent':100*(len(checks)-a6_approved)/len(checks)},
 'regression':{'executed':28,'approved':28,'failed':0},'publicHttp':{'executed':7,'approved':7,'failed':0},
 'originalUseCases':{'planned':8,'withPartialImplementation':5,'fullyValidated':0},
 'note':'Ensaios sobrepostos não são somados como casos A4 únicos. Bloqueado significa impossibilidade de execução integral; evidências parciais são preservadas em A6-S/A6-B.'
}
(EV/'metricas.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2)+'\n')
(EV/'resultados-a4.json').write_text(json.dumps(baseline,ensure_ascii=False,indent=2)+'\n')
audit = ROOT/'tmp/a6/audit-final.json'
if audit.exists(): shutil.copyfile(audit,EV/'auditoria-producao.json')

def text(d, value, style=None, bold=False):
 p = d.add_paragraph(style=style)
 r = p.add_run(value); r.bold = bold
 return p

def heading(d, value, level=1):
 p=d.add_paragraph(value, f'Heading {level}')
 return p

def link(d, label, url):
 p=d.add_paragraph(style='Small A6'); p.paragraph_format.keep_with_next=False
 h=OxmlElement('w:hyperlink'); h.set(qn('r:id'),d.part.relate_to(url,RT.HYPERLINK,is_external=True))
 r=OxmlElement('w:r'); pr=OxmlElement('w:rPr'); color=OxmlElement('w:color');color.set(qn('w:val'),'000000');pr.append(color)
 u=OxmlElement('w:u');u.set(qn('w:val'),'single');pr.append(u);r.append(pr)
 t=OxmlElement('w:t'); t.text=label; r.append(t);h.append(r);p._p.append(h)
 return p

def table(d, headers, rows, widths):
 t=d.add_table(rows=1,cols=len(headers)); t.autofit=False
 for i,w in enumerate(widths):t.columns[i].width=Cm(w)
 for i,h in enumerate(headers):t.rows[0].cells[i].text=h
 rep=OxmlElement('w:tblHeader'); t.rows[0]._tr.get_or_add_trPr().append(rep)
 for values in rows:
  for i,v in enumerate(values):
   if i==0:row=t.add_row()
   row.cells[i].text=str(v)
 borders=OxmlElement('w:tblBorders')
 for edge in ['top','left','bottom','right','insideH','insideV']:
  e=OxmlElement('w:'+edge);e.set(qn('w:val'),'single');e.set(qn('w:sz'),'4');e.set(qn('w:color'),'D9D9D9');borders.append(e)
 t._tbl.tblPr.append(borders)
 for ri,row in enumerate(t.rows):
  cant=OxmlElement('w:cantSplit');row._tr.get_or_add_trPr().append(cant)
  for ci,c in enumerate(row.cells):
   c.width=Cm(widths[ci]);c.vertical_alignment=1
   tc=c._tc.get_or_add_tcPr(); margins=OxmlElement('w:tcMar')
   for side in ['top','left','bottom','right']:
    e=OxmlElement('w:'+side);e.set(qn('w:w'),'85');e.set(qn('w:type'),'dxa');margins.append(e)
   tc.append(margins)
   if ri==0:
    sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'EAEAEA');tc.append(sh)
   for p in c.paragraphs:
    p.style='Small A6';p.paragraph_format.space_after=Pt(2)
    for r in p.runs:r.bold=(ri==0)
 text(d,'Fonte: elaboração do grupo (2026).','Caption')
 return t

def doc(title, subtitle):
 d=Document();s=d.sections[0]
 for border in list(d.styles.element.iter(qn('w:pBdr'))): border.getparent().remove(border)
 s.page_width=Cm(21);s.page_height=Cm(29.7);s.top_margin=Cm(3);s.left_margin=Cm(3);s.right_margin=Cm(2);s.bottom_margin=Cm(2)
 s.header_distance=Cm(1.5);s.footer_distance=Cm(1.25);s.different_first_page_header_footer=True
 for name in ['Normal','Title','Subtitle','Heading 1','Heading 2','Heading 3','Caption']:
  st=d.styles[name];st.font.name='Arial';st.font.color.rgb=RGBColor(0,0,0)
 normal=d.styles['Normal'];normal.font.size=Pt(12);normal.paragraph_format.line_spacing=1.5
 normal.paragraph_format.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY;normal.paragraph_format.first_line_indent=Cm(1.25);normal.paragraph_format.space_after=Pt(6)
 for name,size in [('Title',16),('Subtitle',12),('Heading 1',12),('Heading 2',12),('Heading 3',11)]:
  st=d.styles[name];st.font.size=Pt(size);st.font.bold=True;st.paragraph_format.first_line_indent=Cm(0);st.paragraph_format.alignment=WD_ALIGN_PARAGRAPH.LEFT;st.paragraph_format.space_before=Pt(12);st.paragraph_format.space_after=Pt(8);st.paragraph_format.keep_with_next=True
 for name,size in [('Small A6',10),('Case A6',10),('Code A6',9)]:
  st=d.styles.add_style(name,1);st.font.name='Arial' if name!='Code A6' else 'Courier New';st.font.size=Pt(size);st.font.color.rgb=RGBColor(0,0,0);pf=st.paragraph_format;pf.line_spacing=1;pf.space_after=Pt(4);pf.first_line_indent=Cm(0);pf.alignment=WD_ALIGN_PARAGRAPH.LEFT
 d.styles['Caption'].font.size=Pt(10);d.styles['Caption'].font.italic=False;d.styles['Caption'].paragraph_format.first_line_indent=Cm(0);d.styles['Caption'].paragraph_format.line_spacing=1
 hp=s.header.paragraphs[0];hp.alignment=WD_ALIGN_PARAGRAPH.RIGHT
 fld=OxmlElement('w:fldSimple');fld.set(qn('w:instr'),'PAGE');hp._p.append(fld)
 d.core_properties.author='Grupo Academia Conectada';d.core_properties.title=title
 p=d.add_paragraph();p.paragraph_format.first_line_indent=Cm(0);p.add_run().add_picture(str(HEADER),width=Cm(16))
 p=text(d,'ACADEMIA CONECTADA','Title');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
 p=text(d,title,'Title');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
 p=text(d,subtitle,'Subtitle');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
 text(d,'Prática Profissional em Análise e Desenvolvimento de Sistemas. Entrega acadêmica do grupo, referente às atividades A6 Praticando e A6 Aplicando conhecimento.','Normal')
 p=text(d,'São Paulo\n2026');p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.first_line_indent=Cm(0)
 d.add_page_break()
 return d

def page(d,title):
 heading(d,title)

d=doc('Relatório de execução dos testes','Plano A4 e resultados da versão A6')
heading(d,'1 Objetivo e conclusão')
text(d,'Este relatório registra a execução de verificações sobre a versão A6 da Academia Conectada, disponibiliza o acesso para avaliação e mantém a rastreabilidade com os 67 cenários do plano A4. Foram aprovadas 33 verificações do recorte operacional A6, 28 testes de regressão e sete verificações HTTP públicas, apresentados como conjuntos distintos.')
text(d,'O resultado sustenta a demonstração dos fluxos implementados de catálogo, matrícula, reservas, consulta de treino e histórico. Não representa homologação integral da especificação A4: todos os 67 cenários originais apresentam algum impedimento para execução completa, embora vários tenham partes verificadas. Cadastro de conta, autenticação, perfis de instrutor e administrador e outros critérios continuam pendentes. O apêndice conserva o conteúdo original e explicita cada impedimento.')
text(d,'A entrega reúne o plano com resultados e métricas solicitado no Praticando e no Aplicando conhecimento. O vídeo de oito minutos deve ser gravado pelo grupo usando o roteiro complementar; seu link precisa acompanhar a submissão. O roteiro, por si só, não substitui o vídeo.')
heading(d,'1.1 Acesso para avaliação',2)
link(d,URL,URL);link(d,REPO,REPO);link(d,'Versão documental e testes da entrega A6',TAG)
text(d,'Autenticação: não requerida nesta versão. Não há usuário e senha de acesso. Ao abrir a URL, o navegador recebe uma demonstração própria com o aluno fictício AL01. Para testar, clique em Nova demonstração, escolha Essencial, mantenha Aluno de Demonstração e al01@example.test, aceite os termos e confirme a matrícula.')
text(d,'Disponibilidade requerida: de 18/11/2026 a 02/12/2026, considerando entrega em 18/11. A publicação está ativa e usa armazenamento persistente privado. A verificação realizada comprova acesso na data do ensaio, sem comprovar antecipadamente duas semanas de operação. O grupo deve manter o projeto e o armazenamento ativos durante todo o período; se entregar em outra data, contar 14 dias a partir dela.')
text(d,'Vídeo demonstrativo: gravação e publicação pelo grupo pendentes. O link deve ser informado junto ao PDF no AVA ou inserido neste documento antes da exportação final. Duração requerida: oito minutos; cobrir todos os fluxos disponíveis, conforme o roteiro complementar.')

page(d,'2 Escopo implementado e ambiente')
table(d,['Caso de uso','Fluxo demonstrável','Limite da versão'],[
 ['UC02','Consultar planos, valores e agenda','Sem filtros, cadastro próprio de modalidades ou canais de contato.'],
 ['UC03','Matrícula, termos e protocolo','AL01 demonstrativo; ativação imediata sem pagamento e sem conta.'],
 ['UC04','Reserva e cancelamento com validações','Ocupação inicial sintética; sem disputa entre contas reais.'],
 ['UC05','Consultar exercícios da Sessão A','Prescrição fixa; sem atribuição ou revisão por instrutor.'],
 ['UC06','Registrar carga, observação e histórico','Sem medidas corporais, gráficos ou edição de repetições.'],
 ['UC01, UC07, UC08','Não implementados','Autenticação, gestão de treinos e administração pendentes.']],[2.4,6.3,7.3])
text(d,'Cada navegador mantém um identificador aleatório em cookie HttpOnly, SameSite Strict e Secure em HTTPS. Esse identificador separa as demonstrações, mas não autentica uma pessoa. Abrir outra janela anônima cria outro ambiente. O botão Nova demonstração cria uma identidade nova; os dados antigos não são apagados, mas deixam de ser selecionados pelo navegador.')
text(d,'Na execução local, os arquivos SQLite ficam na subpasta demonstracoes do diretório configurado por ACADEMIA_DB_PATH. Na publicação, snapshots SQLite são armazenados em Vercel Blob privado. O arquivo temporário da função serve apenas ao processamento. As gravações verificam a versão do objeto por ETag e repetem operações em caso de concorrência. A6-B13 verificou o conflito na URL pública. A solução é um ambiente acadêmico de baixo volume, sem homologação de carga elevada ou de segurança multiusuário.')
table(d,['Item','Registro'],[
 ['Data','18/11/2026; horários completos em UTC nos arquivos JSON.'],
 ['Código publicado',COMMIT],['Plataforma','Next.js 16.4.6, Node.js 24; produção Vercel em HTTPS.'],
 ['Execução do serviço',service['node']+'; '+service['executedAt']],
 ['Execução pública','Chrome '+browser['browser']+'; '+browser['executedAt']],
 ['Dados','Exclusivamente fictícios; Essencial R$ 99,00; AL01 fixo por demonstração.'],
 ['Agenda','Criada dois dias à frente de cada demonstração. Nova demonstração renova a massa.'],
 ['Evidência de publicação','publicacao.json: estado READY e alias público.']],[4,12])

page(d,'3 Método e critérios de avaliação')
text(d,'O plano A4 foi mantido como referência, sem substituir seus critérios por condições mais simples. Para cada cenário, foram examinados objetivo, precondições, dados, passos e resultado esperado. Quando falta uma precondição ou uma parte do fluxo, a execução integral é classificada como Bloqueado e a evidência parcial recebe identificador próprio A6-S ou A6-B.')
text(d,'Aprovado significa que todas as asserções do ensaio identificado foram satisfeitas. Reprovado significa execução concluída com divergência observada. Bloqueado significa impossibilidade de executar integralmente o cenário. Não executado seria um cenário viável ainda não iniciado. A triagem identificou bloqueios nos 67 cenários A4; isso não significa 67 falhas detectadas em execução.')
text(d,'O recorte A6 usa 20 verificações de serviço e 13 de navegador. Os ensaios de serviço usam bases isoladas e relógio controlado, permitindo testar fronteiras temporais e rollback. Os ensaios de navegador executam a URL pública, verificam o estado retornado pela API, recarregam a página e testam isolamento de demonstrações. Falha de resposta, catálogo vazio e erro 503 são injetados de forma controlada; não foram indisponibilidades espontâneas do serviço.')
text(d,'A6-B13 dispara dois pedidos simultâneos da mesma demonstração à última vaga. O resultado esperado é um sucesso HTTP 200, um conflito HTTP 409, uma reserva e ocupação 10/10. O ensaio não substitui CT04-09, que exige dois alunos autenticados. Da mesma forma, A6-B08 comprova separação de contextos de navegador, sem certificar autorização por perfil.')
text(d,'Critérios de entrada do recorte: aplicação acessível, versão identificada, massa fictícia restaurável e ferramentas instaladas. Critério de saída do recorte: 33 asserções aprovadas, ausência de erro de página no navegador e evidências salvas. Critério de saída do plano integral A4: todos os cenários viáveis executados e critérios atendidos; não alcançado nesta versão.')
heading(d,'3.1 Reproduzir os testes',2)
for cmd in ['git clone --branch a6-final https://github.com/Lanpaiva/academia-conectada.git','cd academia-conectada','npm ci','npm test','npm run test:a6','npm run lint','npm run typecheck','npx playwright install chromium']:
 text(d,cmd,'Code A6')
text(d,'Para o navegador público no macOS/Linux:','Small A6')
text(d,'TEST_BASE_URL=https://academia-conectada.vercel.app \\\nA6_OUTPUT=tmp/reexecucao npm run test:browser','Code A6')
text(d,'No PowerShell, defina $env:TEST_BASE_URL e $env:A6_OUTPUT antes de executar npm run test:browser. Para testar localmente, execute npm run build e npm start em outro terminal e use TEST_BASE_URL=http://127.0.0.1:3000. O teste HTTP usa node tests/http/check-http.mjs com a mesma variável de URL. Use diretório próprio para preservar as evidências entregues.','Small A6')

page(d,'4 Métricas calculadas')
text(d,'As métricas abaixo têm fórmulas e denominadores explícitos. Constituem o conjunto de acompanhamento adotado pelo grupo. Os nomes específicos das métricas mencionadas no vídeo da Aula 6 não foram confirmados; não se atribui a ele esta seleção. As medidas separam completude da especificação e aprovação dos ensaios realmente executados.')
table(d,['Métrica','Cálculo','Resultado'],[
 ['Execução integral A4','(aprovados + reprovados) / planejados × 100 = 0 / 67 × 100','0%'],
 ['Bloqueio integral A4','bloqueados / planejados × 100 = 67 / 67 × 100','100%'],
 ['Aprovação entre executados A4','0 / 0; nenhum cenário integralmente executável','Não calculável'],
 ['Execução do recorte A6','33 / 33 × 100','100%'],
 ['Aprovação do recorte A6','33 / 33 × 100','100%'],
 ['Reprovação do recorte A6','0 / 33 × 100','0%'],
 ['Regressão','28 aprovados / 28 executados × 100','100%'],
 ['Contrato HTTP público','7 aprovados / 7 executados × 100','100%'],
 ['Casos de uso com implementação parcial','5 / 8 × 100','62,5%'],
 ['Casos de uso integralmente homologados','0 / 8 × 100','0%']],[6,7,3])
text(d,'Os 33 ensaios A6, os 28 testes de regressão e os sete testes HTTP se sobrepõem em regras e camadas. Portanto, não são somados para afirmar cobertura de 68 cenários distintos nem para aprovar os 67 cenários A4. Cobertura de código, taxa de defeitos por linha, desempenho móvel e disponibilidade de 14 dias não foram medidos e não recebem valores estimados.')
text(d,'A auditoria npm audit --omit=dev registrou zero vulnerabilidades conhecidas reportadas nas dependências de produção, após atualização das versões. Essa consulta pontual não é certificação de segurança e não cobre todos os riscos da aplicação. Os totais e o cálculo reproduzível estão em evidencias/metricas.json e scripts/build_a6_delivery.py.')

page(d,'5 Resultados dos ensaios executados')
text(d,'Os identificadores A6-S referem-se à camada de serviço; A6-B, ao navegador e à API da publicação. A coluna de origem indica relação com a A4, sem afirmar equivalência integral. Todos os resultados abaixo são aprovados no escopo descrito.')
for label,data in [('5.1 Verificações de serviço',service['results']),('5.2 Verificações na publicação',browser['results'])]:
 heading(d,label,2)
 table(d,['Ensaio e origem','Resultado observado'],[[c['id']+'\n'+c['source']+'\n'+c['title'],c['observed']] for c in data],[5.3,10.7])
heading(d,'5.3 Contrato HTTP e qualidade',2)
text(d,'As sete verificações públicas obtiveram: origem permitida com operação inválida 400; origem externa 403; tipo de conteúdo incorreto 415; JSON inválido 400; array no corpo 400; corpo acima de 8 KB 413; campos inválidos 422. Nenhuma delas constitui teste de login ou autorização por perfil.')
text(d,'A regressão concluiu 28 testes aprovados e zero reprovados. ESLint e TypeScript concluíram sem erros na revisão final. A compilação publicada terminou com estado READY. Arquivos de saída e metadados estão em evidencias; a auditoria de produção registrou zero vulnerabilidades conhecidas reportadas.')

page(d,'6 Evidências visuais e integridade')
for filename,caption in [('matricula.png','Figura 1 - Matrícula confirmada e protocolo na aplicação publicada'),('aulas.png','Figura 2 - Agenda e estados de reserva'),('treino.png','Figura 3 - Prescrição e histórico de treino')]:
 text(d,caption,'Caption').paragraph_format.keep_with_next=True
 from PIL import Image
 im=Image.open(EV/filename);w,h=im.size
 maxw=16;maxh=15
 p=d.add_paragraph();p.paragraph_format.first_line_indent=Cm(0);p.paragraph_format.keep_with_next=True
 p.add_run().add_picture(str(EV/filename),width=Cm(min(maxw,maxh*w/h)))
 text(d,'Fonte: execução automatizada do grupo na URL pública, 18 nov. 2026.','Caption')
text(d,'As capturas correspondem ao fluxo bem-sucedido antes dos ensaios posteriores de perda de resposta e concorrência. Os arquivos JSON registram a sequência completa. O manifesto SHA-256 identifica os arquivos de evidência e o plano original utilizados; qualquer reexecução deve gerar evidências em outra pasta.')
link(d,'Evidências da entrega no repositório',REPO+'/tree/a6-final/docs/a6/evidencias')

page(d,'7 Pendências e encaminhamento')
text(d,'A publicação permite avaliar os fluxos demonstrativos, com persistência entre requisições. Para homologar o plano integral A4, é necessário implementar contas, login e perfis; completar catálogo, contato e filtros; disponibilizar prescrições individuais e gestão por instrutor; implementar administração, medidas e evolução; preparar contas e massa de teste conforme a A4; e executar a matriz de acessibilidade, usabilidade, desempenho móvel e navegadores.')
text(d,'As correções desta entrega incluem a mensagem de catálogo vazio, o armazenamento persistente da demonstração na publicação e a atualização das dependências de produção. Cada alteração foi verificada por ensaios ou pela auditoria indicada. Não há histórico completo e normalizado de defeitos anteriores; por isso não se calcula densidade de defeitos nem taxa de remoção com base em suposições.')
text(d,'O grupo deve gravar o vídeo de oito minutos com o roteiro fornecido, publicá-lo com acesso pelo link e testar a permissão em janela anônima. O link da aplicação já está neste relatório; o link do vídeo ainda deve acompanhar a entrega. Não é necessário anexar código Python para substituir a demonstração: o enunciado solicita plano e resultados, URL e acesso, e link do vídeo. O repositório fornece código e evidências complementares.')
text(d,'Para a janela de avaliação, manter o projeto Vercel e o Blob ativos até 02/12/2026, conferir a URL e os fluxos após eventuais mudanças e usar Nova demonstração se as aulas anteriores tiverem expirado. Não há monitoramento contínuo contratado ou configurado por este relatório. No Fórum Geral, o enunciado prevê até 36 horas para responder a cada questionamento recebido pelo grupo.')
heading(d,'Referências')
for t in [
 'ACADEMIA CONECTADA. Plano de testes A4. São Paulo, 2026. Repositório do projeto, tests/manual/cenarios-de-teste.json. Versão preservada no apêndice A.',
 'ACADEMIA CONECTADA. Código e evidências da entrega A6. São Paulo, 2026. Disponível em: '+TAG+'. Acesso em: 18 nov. 2026.',
 'UNIVERSIDADE PRESBITERIANA MACKENZIE. Guia Mackenzie de trabalhos acadêmicos. 2. ed. atual. São Paulo: Editora Mackenzie, 2021. Disponível em: https://www.mackenzie.br/fileadmin/ARQUIVOS/Public/top/midias_noticias/editora/2021/Guia_Mackenzie_2021_final.pdf. Acesso em: 18 nov. 2026.',
 'VERCEL. Using the Blob SDK. Disponível em: https://vercel.com/docs/vercel-blob/using-blob-sdk. Acesso em: 18 nov. 2026.'
]: text(d,t,'Small A6')

heading(d,'Apêndice A Plano original e rastreabilidade').paragraph_format.page_break_before=True
text(d,'Este apêndice reproduz os 67 cenários A4 com prioridade, precondições, dados, passos e resultado esperado. O registro A6 foi acrescentado sem alterar o critério original. “Bloqueado” refere-se à execução integral; quando há evidência parcial, os identificadores relacionados permitem consultar os ensaios aprovados da seção 5. As relações por UC indicam apoio ao fluxo, sem correspondência de todos os passos.')
byid={c['id']:c for c in baseline}
for group in plan['casos_de_uso']+[{'id':'TNF','title':'Testes transversais','tests':plan['transversais']}]:
 heading(d,group['id']+' '+group['title'],2)
 for key,label in [('actor','Ator'),('objective','Objetivo'),('base','Base original')]:
  if key in group:text(d,label+': '+group[key],'Case A6')
 for original in group['tests']:
  c=byid[original['id']]
  p=heading(d,c['id']+' '+c['title'],3)
  lines=[('Prioridade',c['priority']),('Precondições',c['pre']),('Dados',c['data']),('Passos',' '.join(str(i+1)+'. '+v for i,v in enumerate(c['steps']))),('Resultado esperado',c['expected']),('Registro A6',c['status']+'. '+c['reason']),('Evidência parcial',', '.join(c['evidence']) or 'Nenhuma evidência de execução do cenário completo.')]
  for i,(label,value) in enumerate(lines):
   p=d.add_paragraph(style='Case A6');p.add_run(label+': ').bold=True;p.add_run(value);p.paragraph_format.keep_with_next=i<len(lines)-1
  p.paragraph_format.space_after=Pt(10)
d.save(OUT/'academia-conectada-a6-relatorio.docx')

r=doc('Roteiro da demonstração em vídeo','Falas e ações para oito minutos')
content=(OUT/'roteiro-video.md').read_text().splitlines()
for line in content[3:]:
 if not line.strip():continue
 if line.startswith('## '):heading(r,line[3:].replace('—',''),1)
 else:
  p=r.add_paragraph()
  p.paragraph_format.first_line_indent=Cm(0)
  p.paragraph_format.keep_together=True
  if line.startswith('**Ação:**'):p.paragraph_format.keep_with_next=True
  for i,part in enumerate(re.split(r'\*\*(.*?)\*\*',line)):
   run=p.add_run(part.replace('`',''));run.bold=bool(i%2)
r.save(OUT/'academia-conectada-a6-roteiro.docx')

manifest={}
for p in sorted(EV.iterdir()):
 if p.is_file() and p.name!='manifesto-sha256.json':manifest[p.name]=hashlib.sha256(p.read_bytes()).hexdigest()
manifest['../../../tests/manual/cenarios-de-teste.json']=hashlib.sha256(PLAN.read_bytes()).hexdigest()
(EV/'manifesto-sha256.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Documentos gerados; 67 cenários originais e 33 ensaios A6 registrados.')
