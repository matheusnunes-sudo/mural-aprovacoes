# Design system - Mural de Aprovacoes

Este documento e a fonte da verdade do padrao visual. Os tokens vivem em
`app/globals.css` (CSS variables) e sao expostos ao Tailwind em
`tailwind.config.ts`. As classes de componente ficam no `@layer components`
do `globals.css`.

## Referencias e o que herdamos de cada uma

- Apple (HIG + Designing Fluid Interfaces): clareza acima de decoracao,
  hierarquia por tipografia e espacamento, materiais translucidos, movimento
  fisico e interrompivel. Ver `APPLE_DESIGN_SKILL.md` na raiz.
- Soft UI / glassmorphism (refs do cliente): cantos muito generosos,
  superficies de vidro, brilho ambiente de fundo, gradiente quente-para-frio
  como assinatura, tipografia bold com tracking apertado.
- ClickUp: densidade de informacao organizada, badges de status discretos,
  filtros no topo da lista.
- Plataforma Assaad: a marca. Trocar `--brand-*` nos tokens pelo hex oficial.

## Dois temas

O app tem tema claro e escuro. A regra: **componente nunca sabe em que tema
esta**. Ele usa o token; o token muda de valor.

- Tokens de tema claro em `:root`, de tema escuro em `.dark`.
- A classe `.dark` e aplicada por um script inline em `app/layout.tsx`, antes
  da primeira pintura (sem isso o app pisca claro antes de virar escuro).
- Sem escolha salva, segue o sistema. Com escolha, `localStorage.tema`
  (`"claro"` / `"escuro"`) manda. O componente `TemaToggle` faz a troca.
- Cores em canais RGB (`--ink: 16 16 20`) para o Tailwind poder aplicar
  opacidade sobre o token (`bg-surface-card/60`).

Nunca escreva cor literal (`#fff`, `bg-white`, `text-black`) num componente:
ela quebra em um dos dois temas. A unica excecao e texto sobre o gradiente
da marca, que e escuro nos dois temas — ali `text-white` esta correto.

## Tokens

Superficies em escala de elevacao: `surface-canvas` (fundo da pagina),
`surface-card` (cartoes), `surface-sunken` (campos e areas rebaixadas).

Texto: `ink` primario / `ink-soft` secundario / `ink-muted` dicas /
`ink-inverse` sobre fundo solido invertido.

Linhas: `line` (hairline) / `line-strong` (enfase).

Marca: `brand-50/100/500/600/700`.

Gradiente-assinatura: `accent-warm` (laranja) -> `accent-mid` (coral) ->
`accent-cool` (indigo). Use pela classe utilitaria `bg-brand` (fundo) ou
`text-gradient` (texto), nunca remontando o `linear-gradient` na mao.

Estados: `warning`, `success`, `info` (cada um com `.bg` e `.fg`).

## Classes de componente

- `.card` - superficie solida, para conteudo que precisa de leitura firme.
- `.glass` - superficie translucida com blur, para chrome flutuante e cards
  da fila. **Nunca empilhe vidro sobre vidro**: a legibilidade colapsa.
- `.ambient` - brilho de fundo (uma instancia por pagina, no layout).
- `.btn` / `.btn-primary` (pilula com gradiente) / `.btn-ghost` / `.btn-quiet`.
- `.field` - inputs, selects e textareas.
- `.badge` - pilula de status.
- `.scrim` - fundo escuro + blur atras de modal.
- `.text-gradient` - texto pintado pelo gradiente.

## Regras

1. Nunca hardcode cor ou espacamento. Use tokens.
2. Cantos: `rounded-card` (24px) para cartoes, `rounded-control` (14px) para
   campos, `rounded-pill` para botoes, badges e avatares.
3. Sombras vem de token (`shadow-card`, `shadow-pop`) porque a receita muda
   entre os temas.
4. Tipografia pela escala: `text-hero / display / title / body / label /
   caption`. O tracking ja vem embutido em cada tier — nao adicione
   `tracking-*` solto.
5. Escala em `rem`, nao `px`, para respeitar o tamanho de fonte do usuario.
6. Sentence case em labels e botoes. Verbo primeiro nos botoes ("Salvar
   depoimento", nao "Enviar").
7. Gradiente e assinatura, nao papel de parede: use em um elemento de
   destaque por tela (CTA principal, metrica em foco, avatar, titulo). Tela
   com gradiente em tudo perde a hierarquia.
8. Sem emoji na UI. Icones sao SVG inline com `stroke="currentColor"`, para
   herdarem a cor do tema.

## Movimento (Apple / fluid interfaces)

Usamos `framer-motion` para o que e tocado ou arrastado; CSS puro
(`transition-colors`) para o resto.

1. **Resposta no toque, nao na soltura.** `.btn` tem `active:scale-[0.97]`
   via CSS. Elementos com gesto continuo usam `whileTap`.
2. **Springs, nao duracao fixa.** Sempre
   `{ type: "spring", bounce, duration }`. Sem overshoot (`bounce: 0`) como
   padrao; bounce leve (`0.15-0.2`) so quando o gesto tem momentum.
3. **Consistencia espacial.** O que entra por um caminho sai pelo mesmo.
   Indicadores (abas, envio selecionado) usam `layoutId` para deslizar entre
   posicoes em vez de trocar de cor abruptamente.
4. **`prefers-reduced-motion`.** Checar `useReducedMotion()` antes de aplicar
   scale/position; nesse caso, cair para fade de opacidade.
5. **`prefers-reduced-transparency` e `prefers-contrast`.** Ja tratados no fim
   do `globals.css`: o vidro vira solido e o brilho ambiente desaparece.
6. **Foco visivel.** `:focus-visible` tem anel proprio na cor da marca. Nunca
   remover sem repor: e a unica pista de posicao para quem navega por teclado.

## Responsividade

Mobile-first. Testado em 375, 768 e 1280.

- `min-w-0` em item de grid ou flex que contem texto truncavel. Sem isso o
  item nao encolhe abaixo do proprio `min-content` e estoura a tela no
  celular (foi exatamente o bug dos checklists).
- Nada de scroll horizontal na pagina. Conteudo largo (seletor de envios)
  rola dentro do proprio container com `overflow-x-auto`.
- Filtros e pares de campos empilham no celular (`grid-cols-1 sm:...`).
- Alvos de toque com no minimo ~44px de altura.

## Como estender o padrao

Componente novo? Adicione a classe em `@layer components` no `globals.css`
usando tokens existentes. Cor nova? Adicione a variavel nos **dois** temas
(`:root` e `.dark`) e exponha no `tailwind.config.ts` antes de usar. O token
e lei; instrucao solta em chat e fragil.
