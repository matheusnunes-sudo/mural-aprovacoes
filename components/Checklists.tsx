"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Item = { id: string; texto: string; feito: boolean };

const postagensIniciais: Item[] = [
  { id: "p1", texto: "Card Júlia Santos - Instagram", feito: true },
  { id: "p2", texto: "Story Pedro Lima", feito: false },
  { id: "p3", texto: "Reels aprovados UFBA", feito: false },
];

const designsIniciais: Item[] = [
  { id: "d1", texto: "Template base aprovação 2026", feito: true },
  { id: "d2", texto: "Card Ana Costa", feito: false },
  { id: "d3", texto: "Ajuste manual Rafael Souza", feito: false },
];

export function Checklists() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Coluna titulo="Postagens do dia" inicial={postagensIniciais} />
      <Coluna titulo="Designs do dia" inicial={designsIniciais} />
    </div>
  );
}

function Coluna({ titulo, inicial }: { titulo: string; inicial: Item[] }) {
  const [itens, setItens] = useState(inicial);
  const [novo, setNovo] = useState("");
  const feitos = itens.filter((i) => i.feito).length;
  const progresso = itens.length ? (feitos / itens.length) * 100 : 0;
  const reduzMovimento = useReducedMotion();

  function toggle(id: string) {
    setItens((is) =>
      is.map((i) => (i.id === id ? { ...i, feito: !i.feito } : i))
    );
  }
  function adicionar() {
    if (!novo.trim()) return;
    setItens((is) => [
      ...is,
      { id: crypto.randomUUID(), texto: novo.trim(), feito: false },
    ]);
    setNovo("");
  }

  // min-w-0: sem isso o item de grid não encolhe abaixo do próprio
  // min-content e a coluna estoura a largura da tela no celular.
  return (
    <div className="card min-w-0 p-5 sm:p-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h3 className="text-label font-semibold">{titulo}</h3>
        <span className="text-caption text-ink-soft tabular-nums">
          {feitos}/{itens.length}
        </span>
      </div>

      {/* Barra de progresso: status visível sem precisar contar os itens. */}
      <div className="mb-4 h-1.5 overflow-hidden rounded-pill bg-surface-sunken">
        <motion.div
          className="bg-brand-500 h-full rounded-pill"
          initial={false}
          animate={{ width: `${progresso}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        />
      </div>

      <ul>
        <AnimatePresence initial={false}>
          {itens.map((i) => (
            <motion.li
              key={i.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="flex items-center gap-3 border-b border-line py-2.5 last:border-0"
            >
              <motion.button
                onClick={() => toggle(i.id)}
                whileTap={reduzMovimento ? undefined : { scale: 0.85 }}
                transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                role="checkbox"
                aria-checked={i.feito}
                aria-label={i.texto}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  i.feito
                    ? "bg-brand-500 border-transparent text-white"
                    : "border-line-strong bg-surface-card hover:border-brand-500"
                }`}
              >
                {i.feito && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2.5 6.5 5 9l4.5-5.5" />
                  </svg>
                )}
              </motion.button>

              <span
                className={`text-body min-w-0 flex-1 truncate transition-colors duration-200 ${
                  i.feito ? "text-ink-muted line-through" : ""
                }`}
              >
                {i.texto}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-4 flex gap-2">
        <input
          className="field min-w-0"
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionar()}
          placeholder="Adicionar tarefa"
        />
        <button
          className="btn-ghost shrink-0 px-4"
          onClick={adicionar}
          aria-label="Adicionar tarefa"
        >
          Add
        </button>
      </div>
    </div>
  );
}
