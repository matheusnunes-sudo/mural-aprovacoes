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
- `components/` - componentes do painel
- `lib/supabase.ts` - cliente e tipos
- `lib/mock.ts` - dados de exemplo (usados quando o Supabase nao esta configurado)

## Regras de design (IMPORTANTE)

O padrao visual e prioridade alta. Antes de criar ou alterar UI, leia
`docs/design-system.md`. Nunca use cores ou espacamentos soltos: use SEMPRE
os tokens do Tailwind (`bg-surface-card`, `text-ink-soft`, `rounded-card`,
etc). As referencias sao ClickUp, Apple (HIG) e a Plataforma Assaad:
superficies limpas, hairlines sutis, cantos generosos, tipografia legivel,
sombras suaves e funcionais. Sem gradientes decorativos.

## Regra de negocio critica

A correcao de depoimento por IA NUNCA pode alterar o sentido, os fatos ou os
nomes de curso/faculdade. O prompt em `app/api/corrigir/route.ts` reforca
isso. Todo depoimento passa por revisao humana no painel antes de virar post.

## Proximos passos (roadmap, nao feito no MVP)

1. Auth real do Supabase (hoje ha uma senha unica de demonstracao)
2. Upload de foto e comprovante via Supabase Storage
3. Export dos dados no formato do plugin "Sheets to Figma" (nomes de coluna =
   nomes de layer no template Figma) para gerar cards em lote
4. Notificacoes de tarefa por responsavel
5. Relatorios (aprovados por curso/faculdade/periodo)
