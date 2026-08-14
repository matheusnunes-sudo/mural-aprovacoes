"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Confirmacao para acoes que doem se acontecerem sem querer.
// Usar com parcimonia: diálogo em tudo treina a pessoa a clicar sem ler.
//
// Sem AnimatePresence de proposito. Aninhado dentro de outro modal, o
// AnimatePresence terminava a animacao de saida mas nao desmontava o no —
// que ficava invisivel por cima da tela, engolindo todos os cliques. Um
// desmonte comum do React e garantido; a animacao de saida nao vale o risco.
export function ConfirmarDialogo({
  aberto,
  titulo,
  descricao,
  textoConfirmar,
  perigo,
  onConfirmar,
  onCancelar,
}: {
  aberto: boolean;
  titulo: string;
  descricao: string;
  textoConfirmar: string;
  perigo?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  const reduzMovimento = useReducedMotion();

  useEffect(() => {
    if (!aberto) return;
    function onTecla(e: KeyboardEvent) {
      if (e.key === "Escape") onCancelar();
    }
    window.addEventListener("keydown", onTecla);
    return () => window.removeEventListener("keydown", onTecla);
  }, [aberto, onCancelar]);

  if (!aberto) return null;

  return (
    <motion.div
      className="scrim fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => e.target === e.currentTarget && onCancelar()}
      role="alertdialog"
      aria-modal
      aria-label={titulo}
    >
      <motion.div
        className="card w-full max-w-sm p-6 shadow-pop"
        initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0, duration: 0.25 }}
      >
        <h2 className="text-title">{titulo}</h2>
        <p className="text-body text-ink-soft mt-2">{descricao}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button className="btn-ghost" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            className={perigo ? "btn btn-perigo" : "btn-primary"}
            onClick={onConfirmar}
            autoFocus
          >
            {textoConfirmar}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
