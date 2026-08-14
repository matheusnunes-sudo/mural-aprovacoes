# Mural de Aprovacoes - Assaad Educacao (MVP)

App para coletar depoimentos/aprovacoes de alunos e gerenciar a producao dos
posts do mural. Este e o MVP (V1) para validacao. O objetivo e servir de base
para os times de IA e TI evoluirem.

## O que ja funciona

- Formulario publico do aluno (`/`), com email validado e autorizacao de post
- Painel da equipe (`/painel`) com senha simples de demonstracao
- Tres visualizacoes das aprovacoes: **lista**, **Kanban** por etapa e
  **planilha** (com exportacao CSV)
- Filtros por curso, faculdade, status e autorizacao de postagem
- Envios do mesmo email aparecem agrupados como um aluno so
- Detalhe do aluno com correcao de depoimento por IA (edicao destravada no lapis)
- Selos ("1º lugar", "Bolsa integral") que o designer aplica na arte
- Checklists de postagens e designs do dia
- Previa da integracao com o Figma (**demonstracao visual**, nao envia nada)
- Tema claro e escuro (segue o sistema, com botao para trocar)
- Roda com dados de exemplo mesmo sem backend configurado

Atencao: os campos de foto e comprovante sao demonstracao. O arquivo aparece
na tela mas nao e salvo em lugar nenhum ate o Supabase Storage entrar (ver
roadmap no `CLAUDE.md`).

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencher as chaves (opcional para demo)
npm run dev
```

Abra http://localhost:3000 (formulario) e http://localhost:3000/painel
(senha padrao: `assaad2026`).

Sem chaves configuradas, o app usa dados mock e a correcao roda em "modo demo".
Com as chaves, usa Supabase e a IA de verdade.

## Configurar o backend real

1. Crie um projeto no Supabase e rode `supabase-schema.sql` no SQL Editor.
2. Copie URL e anon key para `.env.local`.
3. Pegue uma `ANTHROPIC_API_KEY` no console da Anthropic.
4. (Opcional) troque `NEXT_PUBLIC_SENHA_PAINEL`.

## Deploy na Vercel

1. Suba este repo no GitHub da empresa.
2. Em vercel.com, "Import Project" apontando pro repo.
3. Configure as variaveis de ambiente (as mesmas do `.env.local`).
4. Deploy. A cada push na branch principal, a Vercel republica.

## Arquitetura e roadmap

Ver `CLAUDE.md` (contexto para o Claude Code) e `docs/design-system.md`
(padrao visual). Proximos passos estao listados no fim do `CLAUDE.md`:
auth real, upload de imagens, export para o plugin Sheets to Figma,
notificacoes e relatorios.

## Nota de produto

A correcao por IA nunca altera o sentido do depoimento (o prompt reforca isso)
e todo depoimento passa por revisao humana no painel antes de virar post.
