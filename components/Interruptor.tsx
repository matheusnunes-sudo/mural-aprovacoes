"use client";

import { motion, useReducedMotion } from "framer-motion";

// Interruptor no estilo iOS: trilho em pilula e bolinha que desliza.
// Usa role="switch" para leitores de tela anunciarem ligado/desligado.
export function Interruptor({
  ligado,
  onMudar,
  rotulo,
}: {
  ligado: boolean;
  onMudar: (v: boolean) => void;
  rotulo: string;
}) {
  const reduzMovimento = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={() => onMudar(!ligado)}
      className={`relative inline-flex h-7 w-[3.25rem] shrink-0 items-center rounded-pill
                  border border-transparent px-0.5 transition-colors ${
                    ligado ? "bg-brand-500" : "bg-line-strong"
                  }`}
    >
      <motion.span
        className="h-6 w-6 rounded-pill bg-white shadow-card"
        animate={{ x: ligado ? 22 : 0 }}
        transition={
          reduzMovimento
            ? { duration: 0 }
            : { type: "spring", bounce: 0.2, duration: 0.3 }
        }
      />
    </button>
  );
}
