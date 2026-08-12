# Design system - Mural de Aprovacoes

Este documento e a fonte da verdade do padrao visual. Os tokens vivem em
`tailwind.config.ts` e as classes de componente em `app/globals.css`.

## Referencias e o que herdamos de cada uma

- ClickUp: densidade de informacao organizada, cartoes com hairline sutil,
  badges de status coloridos mas discretos, filtros no topo da lista.
- Apple (HIG): clareza acima de decoracao, hierarquia por tipografia e
  espacamento (nao por caixas pesadas), sombras suaves, cantos generosos.
- Plataforma Assaad: a marca. Trocar `brand.*` nos tokens pelo hex oficial.

## Tokens (resumo)

Superficies em escala de elevacao:
- `surface-canvas` (#F7F7F8) fundo da pagina
- `surface-card` (#FFFFFF) cartoes
- `surface-sunken` (#F0F0F2) campos e areas rebaixadas

Texto:
- `ink` primario / `ink-soft` secundario / `ink-muted` dicas

Linhas: `line` (hairline) / `line-strong` (enfase no hover)

Marca: `brand-50 / 100 / 500 / 600 / 700` (TROCAR pelo azul oficial Assaad)

Estados: `warning`, `success`, `info` (cada um com `.bg` e `.fg`)

## Regras

1. Nunca hardcode cor ou espacamento. Use tokens.
2. Cantos: `rounded-card` (14px) para cartoes, `rounded-control` (10px) para
   controles.
3. Sombras so quando funcionais (`shadow-card`, `shadow-pop`).
4. Tipografia pela escala: `text-display / title / body / label / caption`.
5. Sentence case em labels e botoes. Verbo primeiro nos botoes ("Salvar
   depoimento", nao "Enviar").
6. Sem gradientes decorativos, sem sombras pesadas, sem emoji na UI.

## Como estender o padrao

Precisa de um componente novo? Adicione a classe em `@layer components` no
`globals.css` usando tokens existentes. Precisa de uma cor nova? Adicione ao
`tailwind.config.ts` primeiro, depois use. O token e lei; instrucao solta em
chat e fragil.
