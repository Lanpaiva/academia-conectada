"""Atualiza a documentação completa preservando a base e seus diagramas."""
from pathlib import Path
from copy import deepcopy
import json, re, argparse
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.section import WD_SECTION_START
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/entrega-2/academia-conectada-entrega-2.docx'
BASE=ROOT/'docs/entrega-2/base/academia-conectada-entrega-2-original.docx'
CATALOG=ROOT/'tests/manual/cenarios-de-teste.json'
NAMES=['Alan Araujo Paiva','Ian Ávila Guerra','Júlio de Moura Stelzer','Matheus Araujo dos Santos Nunes']
DATA=json.loads(CATALOG.read_text())
UCS=DATA['casos_de_uso']; NFS=DATA['transversais']
TOC=ROOT/'docs/entrega-2/base/paginacao-abnt.json'

def p(d,text='',style=None):
    return d.add_paragraph(text,style)

def h(d,text,level=1):
    return d.add_heading(text,level)

def label(d,key,text):
    x=p(d); x.add_run(key+': ').bold=True; x.add_run(text)
    x.paragraph_format.first_line_indent=Cm(0)
    return x

def table(d,headers,rows):
    t=d.add_table(rows=1,cols=len(headers))
    for row,values in [(t.rows[0],headers)]+[(t.add_row(),v) for v in rows]:
        for c,v in zip(row.cells,values): c.text=str(v)
    t.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
    return t

def numbered_quad(d,title,headers,rows):
    cap=p(d,'QUADRO_AUTO '+title);cap.paragraph_format.keep_with_next=True
    t=table(d,headers,rows)
    p(d,'Fonte: elaboração própria (2026).','Caption')
    return t

def case(d,t):
    title=f"{t['id']} {t['title']}"
    rows=[['Prioridade',t['priority']+' | Situação inicial: Não executado'],['Pré-condição',t['pre']],['Dados de teste',t['data']],
          ['Procedimento','\n'.join(f'{i}. {s}' for i,s in enumerate(t['steps'],1))],['Resultado esperado',t['expected']]]
    numbered_quad(d,title,['Campo','Especificação'],rows)

def section_number(section,start):
    x=section._sectPr.find(qn('w:pgNumType'))
    if x is None:x=OxmlElement('w:pgNumType');section._sectPr.append(x)
    x.set(qn('w:start'),str(start))

def centered(d,text,bold=False,before=0,after=0,style=None):
    x=p(d,text,style);x.alignment=WD_ALIGN_PARAGRAPH.CENTER
    x.paragraph_format.first_line_indent=Cm(0);x.paragraph_format.space_before=Pt(before);x.paragraph_format.space_after=Pt(after)
    for r in x.runs:r.bold=bold
    return x

def create():
    d=Document(BASE)
    if "Bibliography" not in d.styles: d.styles.add_style("Bibliography",WD_STYLE_TYPE.PARAGRAPH)
    # Retain the original body and relationships, including corrected images.
    body=d._element.body
    start=next(x._p for x in d.paragraphs if x.text=='1 Introdução' and x.style.name=='Heading 1')
    end=next(x._p for x in d.paragraphs if x.text=='12 Considerações finais' and x.style.name=='Heading 1')
    children=list(body); a=children.index(start); b=children.index(end)
    saved=[deepcopy(x) for x in children[a:b]]
    for x in list(body):
        if x.tag!=qn('w:sectPr'):body.remove(x)
    for s in d.sections:
        for x in list(s.header._element):s.header._element.remove(x)
        for x in list(s.footer._element):s.footer._element.remove(x)
    centered(d,'UNIVERSIDADE PRESBITERIANA MACKENZIE',True)
    centered(d,'ANÁLISE E DESENVOLVIMENTO DE SISTEMAS',True,after=48)
    for name in NAMES:centered(d,name.upper())
    centered(d,'ACADEMIA CONECTADA',True,before=100,style='Title')
    centered(d,'Documentação completa do projeto e planos de teste',True,after=140)
    centered(d,'São Paulo');centered(d,'2026')
    sec=d.add_section(WD_SECTION_START.NEW_PAGE);section_number(sec,1)
    for name in NAMES:centered(d,name.upper())
    centered(d,'ACADEMIA CONECTADA',True,before=70,style='Title')
    centered(d,'Documentação completa do projeto e planos de teste',True,after=55)
    nature=p(d,'Trabalho apresentado à Universidade Presbiteriana Mackenzie, no curso de Análise e Desenvolvimento de Sistemas, para a disciplina Prática Profissional em Análise e Desenvolvimento de Sistemas. Reúne a documentação do projeto e as atividades A4 Praticando e A4 Aplicando o conhecimento.')
    nature.paragraph_format.left_indent=Cm(8);nature.paragraph_format.first_line_indent=Cm(0);nature.paragraph_format.line_spacing=1
    centered(d,'Versão atualizada em 14 de outubro de 2026',before=35,after=70)
    centered(d,'São Paulo');centered(d,'2026')
    toc_title=centered(d,'SUMÁRIO',True);toc_title.paragraph_format.page_break_before=True
    toc_rows=[]
    headings=[re.sub(r'\s+',' ',''.join(x.itertext())) for x in []]
    from docx.text.paragraph import Paragraph
    for x in saved:
        if x.tag==qn('w:p'):
            para=Paragraph(x,d)
            if para.style.name=='Heading 1':headings.append(para.text.upper())
    headings+=['12 A4 PRATICANDO','13 A4 APLICANDO O CONHECIMENTO','14 CONSIDERAÇÕES FINAIS','REFERÊNCIAS']
    page_map=json.loads(TOC.read_text()) if TOC.exists() else {}
    for text in headings:
        x=p(d,text+'\t'+str(page_map.get(text,'')))
        x.paragraph_format.first_line_indent=Cm(0)
        x.paragraph_format.tab_stops.add_tab_stop(Cm(16),WD_TAB_ALIGNMENT.RIGHT,WD_TAB_LEADER.DOTS)
        x.paragraph_format.line_spacing=1.5;x.paragraph_format.space_after=Pt(0)
        toc_rows.append(x)
    sec=d.add_section(WD_SECTION_START.NEW_PAGE);section_number(sec,4)
    sec.header.is_linked_to_previous=False;sec.footer.is_linked_to_previous=False
    header=sec.header.paragraphs[0];header.alignment=WD_ALIGN_PARAGRAPH.RIGHT
    field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');header._p.append(field)
    for x in saved:body.insert(len(body)-1,x)
    h(d,'12 A4 PRATICANDO')
    p(d,'Esta atividade apresenta o plano de testes do UC04 Agendar ou cancelar aula. O objetivo é verificar reserva e liberação de vagas, elegibilidade do aluno, conflitos, duplicidade, prazo de cancelamento e integridade das transações. Os 11 cenários desta seção também integram o plano completo da seção 13.')
    label(d,'Ator','Aluno autenticado, com matrícula ativa, salvo nos cenários de exceção.')
    label(d,'Rastreabilidade','UC04 e OF04 Agenda de aulas; ONF05 Segurança e ONF08 Confiabilidade.')
    label(d,'Ambiente','Homologação isolada, com backend, autenticação e banco integrados. Contas AL01 e AL02 ativas; AL03 com matrícula inativa. Restaurar a massa antes de cada cenário e aplicar as alterações indicadas no caso.')
    label(d,'Dados básicos','AU01 e AU02 têm capacidade 10. AU01 começa com nove reservas de outros alunos, AU02 com dez. AU03 ocorre das 18h às 19h; AU04 das 18h30 às 19h30, no mesmo dia futuro D+2. Dados e contas são fictícios.')
    label(d,'Parâmetros','D é a data controlada da execução; T é a antecedência mínima de cancelamento; ε é a precisão do relógio. Registrar T e a inclusão ou exclusão do instante exato do limite antes de testar. O valor de T será definido pela política configurada da academia.')
    p(d,'Aplicam-se os critérios de preparação, execução, aprovação e registro definidos na seção 13. Todos os testes têm situação inicial Não executado. A interface atual é demonstrativa; os cenários de integração dependem da implementação dos serviços previstos.')
    for t in UCS[3]['tests']:case(d,t)
    h(d,'13 A4 APLICANDO O CONHECIMENTO')
    p(d,'O plano completo cobre os oito casos de uso, com 59 cenários funcionais e oito verificações transversais. Os 11 cenários de UC04 estão detalhados na seção 12; os outros 48 cenários e as verificações não funcionais constam nesta seção. A matriz a seguir permite localizar a cobertura sem duplicar procedimentos.')
    h(d,'13.1 Objetivo e escopo',2)
    p(d,'Verificar cadastro, acesso, consulta pública, matrícula, agenda, treinos, evolução e administração. A estratégia combina fluxo principal, classes válidas e inválidas, limites, autorização, transições de estado e falhas de integração. Pagamentos reais e testes de carga em produção não integram o escopo acadêmico.')
    p(d,'Os testes estão planejados e não representam resultados de execução. A revisão da interface demonstrativa não comprova autenticação, autorização ou persistência. Os casos cuja implementação ainda não permita execução devem permanecer Não executado ou ser registrados como Bloqueado em uma rodada de homologação.')
    h(d,'13.2 Ambiente e massa de dados',2)
    p(d,'Executar em ambiente local ou Preview de homologação, com banco isolado e dados fictícios. Registrar commit, URL, sistema operacional, navegador e versão, data e fuso America/Sao_Paulo. Usar navegador para testes manuais; ferramentas de integração podem controlar relógio, sincronizar requisições e injetar falhas. Playwright, Vitest e Testing Library são opções previstas para automação futura.')
    numbered_quad(d,'Massa de dados de homologação',['Código','Configuração'],[
        ['AL01 AL02 AL03','AL01 e AL02 têm contas habilitadas e matrícula ativa; AL03 tem conta habilitada e matrícula inativa. E-mails al01@example.test, al02@example.test e al03@example.test.'],
        ['IN01 IN02 AD01','IN01 pode acompanhar AL01; IN02 não tem essa autorização; AD01 é administrador.'],
        ['PL01 PL02','PL01 ativo por R$ 99,00/mês na massa fictícia; PL02 indisponível.'],
        ['TR01 TR02 TR03','TR01 vigente de AL01; TR02 vencido; TR03 incompleto. EX01 agachamento e EX02 remada. Configurações específicas estão nos casos.'],
        ['AU01 a AU04','Configuração descrita na seção 12. Restaurar ocupação e reservas antes de cada variação.'],
    ])
    p(d,'Antes da rodada, registrar campos obrigatórios, política de senha, incompatibilidade de matrículas, limites numéricos e política de cancelamento. Os dados específicos de cada cenário complementam ou substituem a massa básica. Reiniciar o cenário entre variações independentes; não usar dados pessoais reais.')
    h(d,'13.3 Critérios e organização da execução',2)
    for key,text in [
        ('Entrada','Versão identificada e acessível, serviços disponíveis, massa preparada, perfis verificados e parâmetros de negócio registrados. Sem essas condições, registrar bloqueio e motivo.'),
        ('Prioridade','Alta para perda de dados, acesso indevido, quebra de regra ou impedimento de fluxo; Média para consulta, apresentação e uso cotidiano.'),
        ('Responsabilidades','Um integrante prepara ambiente e dados; outro executa e registra; um revisor confere evidências. Distribuir funções entre os quatro integrantes, com revisão por pessoa diferente do executor.'),
        ('Sequência','Executar UC01 e UC02, depois UC03 e UC04, e então UC07, UC05, UC06 e UC08. Preparar dados dependentes antes de cada etapa. Fazer sucessos antes das exceções e repetir casos afetados após correções.'),
        ('Suspensão','Interromper diante de ambiente indisponível, massa inconsistente, exposição de dados ou defeito que invalide resultados seguintes. Corrigir a causa, restaurar dados e repetir o caso interrompido.'),
        ('Saída','Executar 100% do escopo e aprovar todos os casos de prioridade Alta, sem defeito crítico ou alto aberto nem bloqueios. Falhas de prioridade Média exigem correção ou aceite explícito, com justificativa registrada.'),
    ]:label(d,key,text)
    p(d,'Cobertura de execução = executados ÷ planejados; taxa de aprovação = aprovados ÷ executados. Registrar também bloqueados e não executados. Os indicadores só serão preenchidos com evidências reais. Mensagem de sucesso exige estado correto no servidor; em testes negativos, conferir ausência de alteração indevida.')
    h(d,'13.4 Matriz de rastreabilidade',2)
    numbered_quad(d,'Cobertura funcional',['Origem','Caso de uso','Cenários'],[[u['id']+' / OF'+u['id'][2:],u['title'],u['tests'][0]['id']+' a '+u['tests'][-1]['id']] for u in UCS])
    numbered_quad(d,'Cobertura não funcional',['Objetivo','Verificação'],[[f'ONF{i:02d} '+name,f'TNF{i:02d}'] for i,name in enumerate(['Usabilidade','Responsividade','Acessibilidade','Desempenho','Segurança','Privacidade','Compatibilidade','Confiabilidade'],1)])
    h(d,'13.5 Casos de teste funcionais',2)
    for u in UCS:
        h(d,'13.5.'+str(int(u['id'][2:]))+' '+u['id']+' '+u['title'],3)
        if u['id']=='UC04':p(d,'Executar CT04-01 a CT04-11 conforme a seção 12. Esses cenários fazem parte do total de 59 testes funcionais.');continue
        label(d,'Ator',u['actor']);p(d,u['objective']);label(d,'Base de execução',u['base'])
        for t in u['tests']:case(d,t)
    h(d,'13.6 Verificações transversais',2)
    p(d,'Aplicar as verificações à versão integrada. Para acessibilidade, os critérios de contraste e teclado seguem as orientações do W3C (s.d.a; s.d.b). Esta seleção não constitui certificação integral da WCAG nem auditoria jurídica de privacidade.')
    for t in NFS:case(d,t)
    h(d,'13.7 Evidências e gestão de defeitos',2)
    p(d,'Cada execução deverá registrar ID do cenário, versão, data, executor, ambiente, dados utilizados, resultado observado, situação, evidência e defeito associado. Usar Não executado, Aprovado, Reprovado ou Bloqueado. A aprovação exige todos os resultados esperados comprovados; qualquer divergência deve gerar registro de defeito.')
    p(d,'A ficha de execução disponível em tests/manual/registro-execucao.md permanece sem resultados. Anexar capturas e respostas relevantes sem senhas, tokens ou dados reais. Classificar defeitos como Crítico (exposição ou perda de dados), Alto (impede fluxo ou regra essencial), Médio (há alternativa) ou Baixo (apresentação sem bloqueio). Encerrar o defeito somente após reteste aprovado.')
    p(d,'Os principais riscos são backend ainda não integrado, regras de negócio não parametrizadas e resíduos de testes concorrentes. Mitigar com critérios de entrada, registro prévio dos parâmetros e restauração controlada da base. A entrega desta atividade é o plano; o relatório de execução será produzido na homologação.')
    h(d,'14 CONSIDERAÇÕES FINAIS')
    p(d,'A documentação reúne a modelagem do Academia Conectada, os protótipos, a interface demonstrativa e as duas atividades A4. O plano define cobertura rastreável dos oito casos de uso e oferece procedimentos para validar regras de negócio, permissões e consistência dos dados. As próximas etapas são implementar os serviços previstos e executar os cenários em homologação, registrando evidências e correções.')
    h(d,'REFERÊNCIAS')
    for text in [
        'GRUPO ACADEMIA CONECTADA. Academia Conectada: documentação e código do projeto. São Paulo, 2026. Disponível em: https://github.com/Lanpaiva/academia-conectada. Acesso em: 14 out. 2026.',
        'GRUPO ACADEMIA CONECTADA. A3 Praticando: diagrama de implantação da iteração 1. São Paulo, 29 set. 2026. Documento do projeto, arquivo docs/a3-praticando/academia-conectada-a3-diagrama-implantacao.docx.',
        'UNIVERSIDADE PRESBITERIANA MACKENZIE. A4 Praticando e A4 Aplicando o conhecimento. São Paulo, 2026. Enunciados da disciplina Prática Profissional em Análise e Desenvolvimento de Sistemas, ambiente virtual de aprendizagem.',
        'UNIVERSIDADE PRESBITERIANA MACKENZIE. Instruções para a estruturação dos textos de dissertação e tese do PPGEMN. São Paulo, 2025. Versão 1.0. Orientações gerais de apresentação acadêmica consultadas em 14 out. 2026.',
        'WORLD WIDE WEB CONSORTIUM. Understanding SC 1.4.3: Contrast Minimum. [S. l.], [s. d.]a. Disponível em: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html. Acesso em: 14 out. 2026.',
        'WORLD WIDE WEB CONSORTIUM. Understanding SC 2.1.1: Keyboard. [S. l.], [s. d.]b. Disponível em: https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html. Acesso em: 14 out. 2026.',
    ]:p(d,text,'Bibliography')
    normalize(d)
    # O sumário inclui todos os níveis usados e recebe páginas verificadas no PDF.
    all_heads=[x for x in d.paragraphs if x.style.name.startswith('Heading')]
    anchor=toc_rows[0]._p
    for item in all_heads:
        x=p(d,item.text+'\t'+str(page_map.get(item.text,'')))
        x.paragraph_format.first_line_indent=Cm(0)
        x.paragraph_format.left_indent=Cm(.4*(int(item.style.name[-1])-1))
        x.paragraph_format.alignment=WD_ALIGN_PARAGRAPH.LEFT
        x.paragraph_format.tab_stops.add_tab_stop(Cm(16),WD_TAB_ALIGNMENT.RIGHT,WD_TAB_LEADER.DOTS)
        x.paragraph_format.line_spacing=1.5;x.paragraph_format.space_after=Pt(0)
        anchor.addprevious(x._p)
    for x in toc_rows:x._p.getparent().remove(x._p)
    d.core_properties.title='Academia Conectada Documentação completa do projeto e planos de teste'
    d.core_properties.author='; '.join(NAMES)
    d.save(OUT)
    export_manual()
    print(OUT)

def normalize(d):
    for s in d.sections:
        s.page_width=Cm(21);s.page_height=Cm(29.7)
        s.top_margin=Cm(3);s.left_margin=Cm(3);s.bottom_margin=Cm(2);s.right_margin=Cm(2)
        s.header_distance=Cm(2);s.footer_distance=Cm(1)
    for name in ('Normal','Title','Subtitle','Heading 1','Heading 2','Heading 3','Caption','Bibliography'):
        st=d.styles[name];st.font.name='Arial';st.font.size=Pt(12);st.font.color.rgb=RGBColor(0,0,0)
        pf=st.paragraph_format;pf.line_spacing=1.5;pf.space_after=Pt(0);pf.space_before=Pt(0)
        for x in st.element.xpath('./w:pPr/w:pBdr'):x.getparent().remove(x)
    d.styles['Normal'].paragraph_format.first_line_indent=Cm(1.25)
    d.styles['Normal'].paragraph_format.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY
    for name in ('Heading 1','Heading 2','Heading 3'):
        pf=d.styles[name].paragraph_format;pf.first_line_indent=Cm(0);pf.alignment=WD_ALIGN_PARAGRAPH.LEFT
        pf.space_before=Pt(18);pf.space_after=Pt(18);pf.keep_with_next=True
        d.styles[name].font.bold=True
    d.styles['Title'].font.bold=True
    d.styles['Caption'].font.size=Pt(10)
    for name in ('Caption','Bibliography'):
        pf=d.styles[name].paragraph_format;pf.line_spacing=1;pf.first_line_indent=Cm(0);pf.alignment=WD_ALIGN_PARAGRAPH.LEFT
    d.styles['Bibliography'].paragraph_format.space_after=Pt(12)
    # Remove empty page-break paragraphs; headings control section pagination.
    for x in list(d.paragraphs):
        if not x.text.strip() and not x._p.xpath('.//w:drawing') and not x._p.xpath('./w:pPr/w:sectPr'):
            x._p.getparent().remove(x._p)
    body_start=False;quad=0;in_original=True
    for x in d.paragraphs:
        if x.text=='1 Introdução':body_start=True
        if not body_start:continue
        pf=x.paragraph_format
        pf.widow_control=True;pf.keep_together=True
        if x.style.name=='Heading 1':
            x.text=x.text.upper();pf.page_break_before=(x.text!='1 INTRODUÇÃO')
            if x.text.startswith('12 '):in_original=False
        if x.style.name=='Heading 2' and x.text.startswith('UC'):
            x.text='6.'+str(int(x.text[2:4]))+' '+x.text
        if x.text.startswith('13.7 '):pf.page_break_before=True
        if x.style.name.startswith('Heading'):
            pf.first_line_indent=Cm(0);pf.alignment=WD_ALIGN_PARAGRAPH.LEFT
        elif x._p.xpath('.//w:drawing'):
            pf.first_line_indent=Cm(0);pf.alignment=WD_ALIGN_PARAGRAPH.CENTER;pf.keep_with_next=True
        elif x.text.startswith('Tabela ') or x.text.startswith('QUADRO_AUTO'):
            quad+=1
            title=re.sub(r'^(Tabela \d+\s*-\s*|QUADRO_AUTO\s*)','',x.text)
            x.text=f'Quadro {quad} - {title}';x.style='Caption'
            pf.keep_with_next=True;pf.space_before=Pt(10);pf.space_after=Pt(5)
        elif x.text.startswith('Figura '):
            # ABNT figure title precedes the figure; source follows it.
            prev=x._p.getprevious()
            if prev is not None and prev.xpath('.//w:drawing'):
                prev.addprevious(x._p)
                source=OxmlElement('w:p');prev.addnext(source)
                from docx.text.paragraph import Paragraph
                sp=Paragraph(source,d);sp.text='Fonte: elaboração própria (2026).';sp.style='Caption'
            x.style='Caption';pf.keep_with_next=True;pf.space_after=Pt(5)
        elif x.text.startswith('Fonte:'):x.style='Caption';pf.space_after=Pt(10)
        elif x.style.name=='Normal':
            pf.line_spacing=1.5;pf.space_after=Pt(0)
            if not any(r.bold for r in x.runs):pf.first_line_indent=Cm(1.25)
            pf.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY
        for r in x.runs:
            r.font.name='Arial';r.font.color.rgb=RGBColor(0,0,0)
            r.font.size=Pt(10 if x.style.name=='Caption' else 12)
    # Reapply title style black and normal captions, keeping original figures.
    for pic in d.inline_shapes:
        factor=min(Cm(16)/pic.width,Cm(20)/pic.height,1)
        pic.width=int(pic.width*factor);pic.height=int(pic.height*factor)
    for t in d.tables:
        cols=len(t.columns); t.autofit=False
        is_case=t.cell(0,0).text=='Campo' and t.cell(0,1).text=='Especificação'
        widths=([3.0,13.0] if is_case or cols==2 else ([3,7,6] if cols==3 else [16/cols]*cols))
        for c,w in zip(t.columns,widths):c.width=Cm(w)
        for ri,row in enumerate(t.rows):
            pr=row._tr.get_or_add_trPr();pr.append(OxmlElement('w:cantSplit'))
            for ci,c in enumerate(row.cells):
                c.width=Cm(widths[ci]);tcpr=c._tc.get_or_add_tcPr()
                borders=OxmlElement('w:tcBorders')
                for side in ('top','left','bottom','right'):
                    b=OxmlElement('w:'+side);b.set(qn('w:val'),'single');b.set(qn('w:sz'),'4');b.set(qn('w:color'),'D9D9D9');borders.append(b)
                tcpr.append(borders)
                fill=tcpr.find(qn('w:shd'))
                if fill is None:fill=OxmlElement('w:shd');tcpr.append(fill)
                fill.set(qn('w:fill'),'EEEEEE' if ri==0 else 'FFFFFF')
                mar=OxmlElement('w:tcMar')
                for side in ('top','bottom','left','right'):
                    e=OxmlElement('w:'+side);e.set(qn('w:w'),'80');e.set(qn('w:type'),'dxa');mar.append(e)
                tcpr.append(mar)
                for para in c.paragraphs:
                    para.paragraph_format.first_line_indent=Cm(0);para.paragraph_format.line_spacing=1
                    para.paragraph_format.space_before=Pt(0);para.paragraph_format.space_after=Pt(0)
                    para.paragraph_format.alignment=WD_ALIGN_PARAGRAPH.LEFT
                    para.paragraph_format.keep_with_next=is_case
                    for r in para.runs:r.font.name='Arial';r.font.size=Pt(10);r.font.color.rgb=RGBColor(0,0,0);r.bold=ri==0
        if not t.rows[0]._tr.xpath('./w:trPr/w:tblHeader'):t.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
    # Preserve known RAs without an unfinished placeholder for the missing one.
    for t in d.tables:
        for row in t.rows:
            for c in row.cells:
                for x in c.paragraphs:
                    for r in x.runs:
                        r.text=r.text.replace('Pendente','Não informado').replace('Ian Avila','Ian Ávila').replace('Julio de Moura','Júlio de Moura')

def export_manual():
    lines=['# Planos de teste A4','', '59 cenários funcionais e 8 verificações transversais. Situação inicial de todos: **Não executado**.','',
           'Praticando: UC04 / CT04-01 a CT04-11. Aplicando o conhecimento: UC01 a UC08 e TNF01 a TNF08.','',
           'Documento completo e critérios de homologação: [PDF](../../docs/entrega-2/academia-conectada-entrega-2.pdf) e [DOCX](../../docs/entrega-2/academia-conectada-entrega-2.docx).','',
           'Estes arquivos especificam testes manuais e de integração planejados. Não constituem uma suíte automatizada executável nem evidência de aprovação da aplicação.','']
    for u in UCS+[dict(id='ONF',title='Verificações transversais',tests=NFS)]:
        lines += ['## '+u['id']+' '+u['title'],'']
        if 'base' in u:lines += [u['base'],'']
        for t in u['tests']:
            lines += ['### '+t['id']+' '+t['title'],'',f"**Prioridade:** {t['priority']}",'',f"**Pré-condição:** {t['pre']}",'',f"**Dados:** {t['data']}",'']
            lines += [f'{i}. {s}' for i,s in enumerate(t['steps'],1)]
            lines += ['', '**Resultado esperado:** '+t['expected'],'']
    (ROOT/'tests/manual/README.md').write_text('\n'.join(lines))
    registro=ROOT/'tests/manual/registro-execucao.md'
    if registro.exists():
        return  # Preservar resultados preenchidos em futuras rodadas de homologação.
    registro.write_text('''# Registro de execução

Modelo para preencher durante a homologação. Nenhum resultado foi registrado nesta entrega.

## Identificação da rodada

- Commit e URL do ambiente:
- Data, fuso, sistema e navegador:
- Executor e revisor:
- Parâmetros de negócio e massa restaurada:

## Ficha por cenário

- ID do cenário:
- Dados utilizados:
- Resultado observado:
- Situação: Não executado / Aprovado / Reprovado / Bloqueado
- Evidência:
- Defeito, severidade e responsável:
- Versão da correção e resultado do reteste:

## Consolidação

Registrar totais planejados, executados, aprovados, reprovados, bloqueados e não executados.
Cobertura = executados / planejados. Aprovação = aprovados / executados.
Usar somente dados e contas fictícios; não anexar senhas ou tokens.
''')

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--toc-from',type=Path,help='PDF renderizado para atualizar as páginas do sumário')
    args=parser.parse_args()
    if args.toc_from:
        from pypdf import PdfReader
        heads=[x.text for x in Document(OUT).paragraphs if x.style.name.startswith('Heading')]
        mapping={}
        for index,page in enumerate(PdfReader(args.toc_from).pages):
            if index<4:continue
            text=' '.join(page.extract_text().split())
            for title in heads:
                if ' '.join(title.split()) in text:mapping[title]=index
        if set(heads)-set(mapping):raise ValueError('Cabeçalhos ausentes no PDF')
        TOC.write_text(json.dumps(mapping,ensure_ascii=False,indent=2))
    create()
