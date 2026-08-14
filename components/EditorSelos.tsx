"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SELOS_SUGERIDOS } from "@/lib/supabase";

// Selos que o designer aplica na arte. A equipe define aqui ANTES de mandar
// para o design — por isso o bloco fica no topo do detalhe, junto da
// autorizacao, e nao escondido no fim.
export function EditorSelos({
  selos,
  onMudar,
}: {
  selos: string[];
  onMudar: (selos: string[]) => void;
}) {
  const [novo, setNovo] = useState("");
  const reduzMovimento = useReducedMotion();

  // Sugestoes que o aluno ainda nao tem viram atalhos de um clique.
  const disponiveis = SELOS_SUGERIDOS.filter((s) => !selos.includes(s));

  function adicionar(texto: string) {
    const limpo = texto.trim();
    if (!limpo || selos.includes(limpo)) return;
    onMudar([...selos, limpo]);
    setNovo("");
  }

  function remover(texto: string) {
    onMudar(selos.filter((s) => s !== texto));
  }

  return (
    <div className="rounded-control border border-line bg-surface-sunken/50 p-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label">Selos para a arte</p>
        <span className="text-caption text-ink-muted">
          {selos.length === 0 ? "nenhum" : `${selos.length} selecionado${selos.length > 1 ? "s" : ""}`}
        </span>
      </div>
      <p className="text-caption text-ink-soft mt-1">
        O designer aplica estes selos no card. Defina antes de marcar como
        design pronto.
      </p>

      {selos.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          <AnimatePresence initial={false}>
            {selos.map((s) => (
              <motion.li
                key={s}
                layout
                initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduzMovimento ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0, duration: 0.2 }}
              >
                <span className="badge gap-1 bg-brand-500 py-1.5 pl-3 pr-1.5 text-white">
                  {s}
                  <button
                    type="button"
                    onClick={() => remover(s)}
                    aria-label={`Remover selo ${s}`}
                    className="flex h-4 w-4 items-center justify-center rounded-pill transition-colors hover:bg-white/25"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" />
                    </svg>
                  </button>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {disponiveis.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {disponiveis.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => adicionar(s)}
                className="badge border border-dashed border-line-strong text-ink-soft transition-colors hover:border-brand-500 hover:text-ink"
              >
                + {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex gap-2">
        <input
          className="field min-w-0 py-2"
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionar(novo);
            }
          }}
          placeholder="Outro selo"
          aria-label="Escrever um selo"
        />
        <button
          type="button"
          className="btn-ghost shrink-0 px-4 py-2"
          onClick={() => adicionar(novo)}
          disabled={!novo.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
}
