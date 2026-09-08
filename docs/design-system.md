# Design system - Mural de Aprovacoes

Este documento e a fonte da verdade do padrao visual. Os tokens vivem em
`app/globals.css` (CSS variables) e sao expostos ao Tailwind em
`tailwind.config.ts`. As classes de componente ficam no `@layer components`
do `globals.css`.

## Referencias e o que herdamos de cada uma

- Apple (HIG + Designing Fluid Interfaces): clareza acima de decoracao,
  hierarquia por tipografia e espacamento, materiais translucidos, movimento
  fisico e interrompivel. Ver `APPLE_DESIGN_SKILL.md` na raiz.
- Apple, na paleta: fundo liso, sem gradiente decorativo, hierarquia por
  elevacao e hairline, e UM azul de acento (system blue) reservado ao que e
  interativo ou esta em foco. Cantos generosos e tipografia bold com tracking
  apertado.
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

Marca: `brand-50/100/500/600/700` — o azul de acento, unica cor de destaque.

Estados: `warning`, `success`, `info`, `danger` (cada um com `.bg` e `.fg`).
`danger` e reservado a falta de autorizacao de postagem.

## Classes de componente

- `.card` - superficie solida, o padrao para conteudo.
- `.glass` - superficie levemente translucida com blur, so para chrome
  flutuante (barra de abas). **Nunca empilhe vidro sobre vidro.**
- `.btn` / `.btn-primary` (azul solido) / `.btn-ghost` / `.btn-quiet`.
- `.field` - inputs, selects e textareas.
- `.badge` - pilula de status.
- `.scrim` - fundo escuro + blur atras de modal.

## Semaforo do processo

As etapas tem uma cor fixa, definida em `CORES_ETAPA`
(`components/SeloStatus.tsx`): **Pendente = vermelho**, **Design pronto =
amarelo**, **Postado = verde**. A mesma cor pinta o selo de status, o fundo
da coluna do Kanban e a pilula da planilha — quem aprende num lugar le em
todos. Nunca invente outra cor de status fora desse mapa.

O selo de autorizacao tambem usa vermelho, entao ele leva **icone** (olho
cortado): cor sozinha nao distinguiria "pendente" de "nao autoriza".

## Usabilidade (referencia: ClickUp)

- **Alvo de clique generoso.** Acao repetida o dia inteiro nao pode exigir
  mira: no checklist a linha inteira marca a tarefa, nao so a caixinha.
- **Mostre a excecao, nao a regra.** No Kanban so aparece o selo de quem
  **nao** autoriza; carimbar "autoriza" em quase todo card vira ruido.
- **Editar onde e seguro.** A planilha edita status inline (barato de
  desfazer) e trata autorizacao como so leitura (caro de errar).
- **Estado sempre visivel**: contador por coluna, barra de progresso no
  checklist, metrica de "sem autorizacao" no topo.

## Regras

1. Nunca hardcode cor ou espacamento. Use tokens.
2. Cantos: `rounded-card` (20px) para cartoes, `rounded-control` (12px) para
   campos, `rounded-pill` para botoes, badges e avatares.
3. Sombras vem de token (`shadow-card`, `shadow-pop`) porque a receita muda
   entre os temas.
4. Tipografia pela escala: `text-hero / display / title / body / label /
   caption`. O tracking ja vem embutido em cada tier — nao adicione
   `tracking-*` solto.
5. Escala em `rem`, nao `px`, para respeitar o tamanho de fonte do usuario.
6. Sentence case em labels e botoes. Verbo primeiro nos botoes ("Salvar
   depoimento", nao "Enviar").
7. **Sem gradiente decorativo.** O fundo e liso. O azul de acento e reservado
   ao que e interativo ou esta em foco (CTA, metrica em destaque, avatar,
   item selecionado); pintar tudo de azul destroi a hierarquia igual.
8. Sem emoji na UI. Icones sao SVG inline com `stroke="currentColor"`, para
   herdarem a cor do tema.
9. Todo texto de interface e em portugues **com acentuacao correta**. So
   identificadores de codigo (variaveis, chaves, ids) ficam em ASCII.

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
   do `globals.css`: o vidro vira solido.
7. **Nenhuma acao pode existir so no arrasto.** Arrastar nao funciona no
   teclado e e fragil no toque. O Kanban move card por botoes `‹ ›`; o
   arrasto e um extra. Toda interacao por gesto precisa de um equivalente
   clicavel.
8. **Nao use `AnimatePresence` em menu, dropdown ou dialogo.** Use render
   condicional (`if (!aberto) return null`) com animacao so de entrada.
   Aconteceu duas vezes: o `AnimatePresence` termina a animacao de saida mas
   nao desmonta o no, que fica invisivel por cima do conteudo com
   `pointer-events: auto` e engole todos os cliques. `key` no filho direto
   **nao** resolve. Ver `ConfirmarDialogo`, `Dropdown` e `ExportarCsv`.
   Sintoma: `aria-expanded="false"` mas o no ainda no DOM.
   `AnimatePresence` continua valido para o que e filho direto da pagina
   (modal de detalhe, modal do Figma) — ali funciona.
6. **Foco visivel.** `:focus-visible` tem anel proprio na cor da marca. Nunca
   remover sem repor: e a unica pista de posicao para quem navega por teclado.

## Volume

Layout que funciona com 6 registros pode quebrar com 80. Regras que sairam do
teste de volume:

- **Coluna de Kanban rola por dentro** (`max-h-[60vh] overflow-y-auto`), com o
  cabecalho da etapa fora do container que rola. Sem isso a coluna cresce
  indefinidamente, o cabecalho sai da tela e o arrasto fica impraticavel.
- **Tabela densa rola por dentro nos dois eixos** com `<th>` em
  `sticky top-0`. Cabecalho que desaparece no scroll torna 80 linhas ilegiveis.
- **Lista longa e paginada** em lotes (25), com o restante num botao. Dez telas
  de scroll sem ponto de parada nao se navega.
- Rode com `NEXT_PUBLIC_DEMO_VOLUME=80` antes de considerar uma visualizacao
  pronta.

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
