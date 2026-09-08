# Mural de Aprovacoes - Assaad Educacao

App para coletar depoimentos e aprovacoes de alunos e gerenciar a producao
de posts do mural (a maior prova social da empresa).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS com design tokens (ver `tailwind.config.ts`)
- Supabase (Postgres + Storage + Auth) para dados, imagens e login
- SDK Anthropic (`@anthropic-ai/sdk`) para correcao de depoimentos

## Comandos

- `npm install` - instala dependencias
- `npm run dev` - roda local em http://localhost:3000
- `npm run build` - build de producao
- Deploy: Vercel (importar o repo, configurar variaveis de ambiente)

## Estrutura

- `app/page.tsx` - formulario publico do aluno
- `app/painel/page.tsx` - painel admin (fila, detalhe, checklists)
- `app/api/corrigir/route.ts` - correcao de depoimento via IA
- `components/` - componentes do painel (fila, Kanban, planilha, detalhe)
- `lib/supabase.ts` - cliente, tipos, `TIPOS`, `ETAPAS`, `MATERIAS`
- `lib/agrupar.ts` - agrupa os envios do mesmo email em um aluno so
- `lib/formato.ts` - legendas e ordenacoes que mudam com o tipo
- `lib/mock.ts` - dados de exemplo (usados quando o Supabase nao esta configurado)

## Dois momentos do ano (o conceito central)

O mural tem duas campanhas por ano, com dados diferentes, e o painel as separa
em abas — elas nunca se misturam na mesma tela:

1. **Acertos do ENEM** (`tipo: "acerto"`) — semana da prova. Sai o gabarito
   oficial, o aluno corrige, manda ao expert quantas questoes acertou, e vira
   post de "X acertos no dia 1 / dia 2", as vezes aberto por materia. **Nao
   existe curso nem faculdade ainda.** O expert lanca os numeros no proprio
   painel (o formulario publico nao pede acertos).
2. **Aprovações** (`tipo: "aprovacao"`) — depois do SISU. O aluno passou, e o
   post e do curso/faculdade.

O MESMO aluno costuma aparecer nos dois, com o mesmo email: acertos em
novembro, aprovacao em janeiro. Por isso **filtre por tipo antes de agrupar
por email** — sao trabalhos diferentes.

O que os dois compartilham: aluno, autorizacao de postagem, selos, etapa
(pendente -> design pronto -> postado) e depoimento. Por isso vivem na mesma
tabela, separados pela coluna `tipo`.

Na aba de acertos a ordem padrao e **maior numero de acertos primeiro** — e
assim que a equipe escolhe quem postar. `agruparPorEmail` NAO reordena nada:
preserva a ordem que recebe, e quem chama ordena de proposito.

## Modelo de dados

Cada linha de `aprovacoes` e UM envio, com status proprio.
O `email` identifica o aluno e nao e unico: se a pessoa mandar um segundo
depoimento com o mesmo email, vira uma nova linha e o painel mostra os dois
juntos no mesmo card (`agruparPorEmail`). Nunca deduplique por email no
insert — o historico de envios importa.

`autoriza_postagem` e a regra de negocio mais importante do painel: aluno que
nao autoriza NAO deve entrar na producao de design. Por isso ele aparece
marcado em vermelho na fila, no Kanban e na planilha, tem filtro proprio e
uma metrica no topo. Ao criar qualquer visualizacao nova, mostre esse estado.

As etapas do processo vivem em `ETAPAS` (`lib/supabase.ts`) — a ordem ali e a
ordem das colunas do Kanban e das opcoes de status. Adicionar uma etapa e
editar esse array + uma entrada em `CORES_ETAPA` (`components/SeloStatus.tsx`),
nao caçar strings pelo codigo.

`selos` sao os carimbos que o designer aplica na arte ("1º lugar"). A equipe
define no detalhe do aluno ANTES de marcar como design pronto — por isso o
bloco fica no topo do modal, nao escondido no fim.

A fila agrupa por aluno; Kanban e planilha trabalham envio a envio, porque
status e autorizacao pertencem ao depoimento, nao a pessoa.

## Regras de design (IMPORTANTE)

O padrao visual e prioridade alta. Antes de criar ou alterar UI, leia
`docs/design-system.md`. Nunca use cores ou espacamentos soltos: use SEMPRE
os tokens do Tailwind (`bg-surface-card`, `text-ink-soft`, `rounded-card`,
etc).

O app tem **tema claro e escuro**. Por isso: nunca escreva cor literal
(`#fff`, `bg-white`, `text-black`) num componente — ela quebra em um dos dois
temas. Cor nova exige a variavel nos dois temas em `app/globals.css`.

Referencias: Apple (HIG + fluid interfaces, ver `APPLE_DESIGN_SKILL.md`),
ClickUp e a Plataforma Assaad. Fundo liso, **sem gradiente decorativo**, um
unico azul de acento reservado ao que e interativo ou esta em foco, cantos
generosos e tipografia bold com tracking apertado.

Todo texto de interface e em portugues **com acentuacao correta**. So
identificadores de codigo ficam em ASCII.

Layout e mobile-first e testado em 375 / 768 / 1280. Cuidado com o bug
classico: item de grid/flex com texto truncavel precisa de `min-w-0`.

## Regra de negocio critica

A correcao de depoimento por IA NUNCA pode alterar o sentido, os fatos ou os
nomes de curso/faculdade. O prompt em `app/api/corrigir/route.ts` reforca
isso. Todo depoimento passa por revisao humana no painel antes de virar post.

## Acoes sensiveis

`autoriza_postagem` so muda com confirmacao (`ConfirmarDialogo`), e **nunca**
e editavel direto na planilha: numa grade densa um clique errado exporia um
aluno que nao autorizou. Para mudar, abra o detalhe e confirme.

Mesma logica no depoimento corrigido: ele nasce travado e so vira editavel
depois de clicar no lapis. Texto ja revisado nao deve mudar sem intencao.

## Volume de demonstracao

`NEXT_PUBLIC_DEMO_VOLUME=80` completa os dados mock com registros gerados
(`lib/gerar-exemplos.ts`) para ver o painel cheio. Sem a variavel, ficam so os
casos curados. O gerador e **deterministico** (PRNG com semente fixa) de
proposito: o mesmo dataset em todo build, senao print e bug nao sao
reproduziveis. Nada disso e usado quando o Supabase esta configurado.

Testar com volume nao e capricho — 80 registros revelaram tres defeitos que 6
escondiam, todos corrigidos: coluna do Kanban de 4000px que levava o cabecalho
da etapa para fora da tela, lista com 10 telas de scroll, e cabecalho da
planilha desaparecendo no scroll. **Ao criar visualizacao nova, teste com
volume antes de considerar pronta.**

## Integracao com o Figma

`components/ModalFigma.tsx` e um **MVP visual**: conexao, arquivo e geracao
sao simulados com timers e nada sai do app. Serve para a equipe validar o
fluxo antes de existir integracao real. O mapeamento campo -> layer mostrado
ali e o contrato pretendido (nome do campo = nome da layer no template),
igual ao plugin "Sheets to Figma".

## Proximos passos (roadmap, nao feito no MVP)

1. Auth real do Supabase (hoje ha uma senha unica de demonstracao)
2. Ligar o upload no Supabase Storage. A interface ja existe
   (`components/CampoUpload.tsx`), mas e so demonstracao: o arquivo fica no
   navegador e NAO e enviado. Falta subir pro Storage e gravar a URL em
   `foto_url` / `comprovante_url` no insert de `app/page.tsx`.
3. Export dos dados no formato do plugin "Sheets to Figma" (nomes de coluna =
   nomes de layer no template Figma) para gerar cards em lote
4. Notificacoes de tarefa por responsavel
5. Relatorios (aprovados por curso/faculdade/periodo)
