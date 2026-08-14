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
- `lib/supabase.ts` - cliente, tipos, `ETAPAS` e validacao de email
- `lib/agrupar.ts` - agrupa os envios do mesmo email em um aluno so
- `lib/mock.ts` - dados de exemplo (usados quando o Supabase nao esta configurado)

## Modelo de dados

Cada linha de `aprovacoes` e UM envio, com status e responsavel proprios.
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
