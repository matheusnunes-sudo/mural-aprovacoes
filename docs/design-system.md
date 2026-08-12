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

## Movimento (Apple / fluid interfaces)

Baseado no `SKILL.md` de design da Apple. Usamos `framer-motion` para o que
e tocado ou arrastado; CSS puro (`transition-colors`) para o resto.

1. **Resposta no toque, nao na soltura.** Botoes usam `.btn` (active:scale
   0.97 via CSS). Elementos com gesto continuo (cards, modal) usam
   `whileTap` do framer-motion.
2. **Springs, nao duracao fixa.** Todo spring usa a forma
   `{ type: "spring", bounce, duration }`. Sem overshoot (`bounce: 0`) como
   padrao; bounce leve (`~0.15-0.2`) so quando o gesto tem momentum (ex.:
   sheet que "materializa").
3. **Overlays sao material, nao caixa opaca.** Use a classe `.scrim`
   (`bg-black/40 backdrop-blur-[2px]`) atras de qualquer modal/sheet.
4. **Consistencia espacial.** O que entra por um caminho sai pelo mesmo
   (ver `DetalheAluno`: materializa com scale+opacity, fecha com o
   reverso). Indicadores de aba usam `layoutId` para deslizar entre
   posicoes em vez de trocar de cor abruptamente (ver `PainelHeader`).
5. **`prefers-reduced-motion`.** Sempre checar `useReducedMotion()` do
   framer-motion antes de aplicar scale/position; nesse caso, cai para
   fade de opacidade simples. A classe `.btn` ja neutraliza o
   `active:scale` via media query em `globals.css`.
6. **Tracking por tamanho.** `letterSpacing` ja esta embutido em cada
   tier de `fontSize` no `tailwind.config.ts` (negativo em `display`/
   `title`, positivo em `label`/`caption`). Nao sobrescreva com classes
   `tracking-*` soltas.
