"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Registro, TipoRegistro } from "@/lib/supabase";
import { gerarCsv, baixarCsv, nomeArquivoCsv } from "@/lib/csv";

const ATALHOS = [10, 25, 50, 100];

// Exportacao com quantidade escolhida, em vez de "tudo ou nada".
// Exporta os PRIMEIROS N na ordem que esta na tela — que ja e a ordem util
// (mais acertos na semana do ENEM, mais recentes nas aprovacoes). Assim
// "exportar 20" entrega os 20 que a equipe ia postar primeiro, nao 20
// aleatorios.
export function ExportarCsv({
  registros,
  tipo,
}: {
  registros: Registro[];
  tipo: TipoRegistro;
}) {
  const [aberto, setAberto] = useState(false);
  const [personalizado, setPersonalizado] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const gatilho = useRef<HTMLButtonElement>(null);
  const reduzMovimento = useReducedMotion();

  const total = registros.length;

  useEffect(() => {
    if (!aberto) return;
    function onClique(e: MouseEvent) {
      if (!container.current?.contains(e.target as Node)) setAberto(false);
    }
    function onTecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAberto(false);
        gatilho.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClique);
    document.addEventListener("keydown", onTecla);
    return () => {
      document.removeEventListener("mousedown", onClique);
      document.removeEventListener("keydown", onTecla);
    };
  }, [aberto]);

  function exportar(quantidade: number) {
    const n = Math.max(1, Math.min(total, Math.floor(quantidade)));
    baixarCsv(gerarCsv(registros.slice(0, n), tipo), nomeArquivoCsv(tipo, n, total));
    setAberto(false);
    setPersonalizado("");
  }

  const numeroPersonalizado = Number(personalizado);
  const personalizadoValido =
    personalizado.trim() !== "" &&
    Number.isFinite(numeroPersonalizado) &&
    numeroPersonalizado >= 1;

  return (
    <div ref={container} className="relative">
      <button
        ref={gatilho}
        type="button"
        onClick={() => setAberto((v) => !v)}
        disabled={total === 0}
        aria-haspopup="menu"
        aria-expanded={aberto}
        className="btn-ghost py-2 disabled:opacity-40"
      >
        <IconeDownload />
        Exportar CSV
        <motion.span
          className="text-ink-soft"
          animate={{ rotate: aberto ? 180 : 0 }}
          transition={reduzMovimento ? { duration: 0 } : { duration: 0.18 }}
        >
          <IconeChevron />
        </motion.span>
      </button>

      {/* Render condicional, nao AnimatePresence — ver Dropdown.tsx e a
          regra em docs/design-system.md. */}
      {aberto && (
        <motion.div
          role="menu"
            aria-label="Quantidade a exportar"
            initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            className="card absolute right-0 z-30 mt-1.5 w-64 p-2 shadow-pop"
          >
            <p className="text-caption text-ink-muted px-2 pb-1.5 pt-1">
              Exporta os primeiros, na ordem da tela
            </p>

            {ATALHOS.filter((n) => n < total).map((n) => (
              <button
                key={n}
                type="button"
                role="menuitem"
                onClick={() => exportar(n)}
                className="text-label text-ink-soft flex w-full items-center justify-between rounded-control px-3 py-2 text-left transition-colors hover:bg-surface-sunken hover:text-ink"
              >
                Primeiros {n}
              </button>
            ))}

            <button
              type="button"
              role="menuitem"
              onClick={() => exportar(total)}
              className="text-label flex w-full items-center justify-between rounded-control px-3 py-2 text-left font-medium transition-colors hover:bg-surface-sunken"
            >
              Todos
              <span className="text-caption text-ink-muted tabular-nums">
                {total}
              </span>
            </button>

            <div className="mt-1 border-t border-line pt-2">
              <label className="text-caption text-ink-muted block px-2 pb-1.5">
                Outra quantidade
              </label>
              <div className="flex gap-1.5 px-1 pb-1">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={total}
                  value={personalizado}
                  onChange={(e) => setPersonalizado(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && personalizadoValido) {
                      e.preventDefault();
                      exportar(numeroPersonalizado);
                    }
                  }}
                  placeholder={`1 a ${total}`}
                  aria-label={`Quantidade personalizada, de 1 a ${total}`}
                  className="field min-w-0 py-1.5 tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => exportar(numeroPersonalizado)}
                  disabled={!personalizadoValido}
                  className="btn-primary shrink-0 px-3 py-1.5"
                >
                  Ir
                </button>
              </div>
            </div>
        </motion.div>
      )}
    </div>
  );
}

function IconeDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 1.5v7M4 5.8 7 8.8l3-3" />
      <path d="M2 9.5v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2" />
    </svg>
  );
}

function IconeChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}
