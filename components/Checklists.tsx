"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Item = { id: string; texto: string; feito: boolean; responsavel: string };

const postagensIniciais: Item[] = [
  { id: "p1", texto: "Card Julia Santos - Instagram", feito: true, responsavel: "Matheus" },
  { id: "p2", texto: "Story Pedro Lima", feito: false, responsavel: "Gabriel" },
  { id: "p3", texto: "Reels aprovados UFBA", feito: false, responsavel: "Pedro" },
];

const designsIniciais: Item[] = [
  { id: "d1", texto: "Template base aprovacao 2026", feito: true, responsavel: "Matheus" },
  { id: "d2", texto: "Card Ana Costa", feito: false, responsavel: "Gabriel" },
  { id: "d3", texto: "Ajuste manual Rafael Souza", feito: false, responsavel: "Matheus" },
];

export function Checklists({ responsaveis }: { responsaveis: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Coluna titulo="Postagens do dia" inicial={postagensIniciais} responsaveis={responsaveis} />
      <Coluna titulo="Designs do dia" inicial={designsIniciais} responsaveis={responsaveis} />
    </div>
  );
}

function Coluna({
  titulo,
  inicial,
  responsaveis,
}: {
  titulo: string;
  inicial: Item[];
  responsaveis: string[];
}) {
  const [itens, setItens] = useState(inicial);
  const [novo, setNovo] = useState("");
  const feitos = itens.filter((i) => i.feito).length;

  function toggle(id: string) {
    setItens((is) => is.map((i) => (i.id === id ? { ...i, feito: !i.feito } : i)));
  }
  function setResp(id: string, r: string) {
    setItens((is) => is.map((i) => (i.id === id ? { ...i, responsavel: r } : i)));
  }
  function adicionar() {
    if (!novo.trim()) return;
    setItens((is) => [
      ...is,
      { id: crypto.randomUUID(), texto: novo.trim(), feito: false, responsavel: responsaveis[0] },
    ]);
    setNovo("");
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-label">{titulo}</h3>
        <span className="text-caption text-ink-soft">
          {feitos}/{itens.length}
        </span>
      </div>

      <ul className="space-y-1">
        <AnimatePresence initial={false}>
          {itens.map((i) => (
            <motion.li
              key={i.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="flex items-center gap-2 border-b border-line py-2 last:border-0"
            >
              <input
                type="checkbox"
                checked={i.feito}
                onChange={() => toggle(i.id)}
                className="h-4 w-4 accent-brand-600"
              />
              <span
                className={`flex-1 text-body transition-colors duration-200 ${
                  i.feito ? "text-ink-muted line-through" : ""
                }`}
              >
                {i.texto}
              </span>
              <select
                className="rounded-control border border-line bg-surface-card px-2 py-1 text-caption"
                value={i.responsavel}
                onChange={(e) => setResp(i.id, e.target.value)}
              >
                {responsaveis.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-3 flex gap-2">
        <input
          className="field"
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionar()}
          placeholder="Adicionar tarefa"
        />
        <button className="btn-ghost" onClick={adicionar}>
          Add
        </button>
      </div>
    </div>
  );
}
