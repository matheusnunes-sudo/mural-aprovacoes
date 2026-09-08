"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type OpcaoDropdown = { valor: string; rotulo: string };

// Dropdown em pilula, no lugar do <select> nativo: o nativo nao aceita
// icone, nao segue os tokens de tema e abre um menu do sistema operacional
// que ignora o resto do design.
//
// Acessibilidade coberta: navega por setas, Home/End, Escape fecha, Tab
// fecha, clique fora fecha, e o foco volta para o gatilho ao fechar.
export function Dropdown({
  rotulo,
  icone,
  valor,
  opcoes,
  onMudar,
}: {
  rotulo: string;
  icone?: React.ReactNode;
  valor: string;
  opcoes: OpcaoDropdown[];
  onMudar: (valor: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [emFoco, setEmFoco] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const gatilho = useRef<HTMLButtonElement>(null);
  const reduzMovimento = useReducedMotion();

  const atual = opcoes.find((o) => o.valor === valor) ?? opcoes[0];
  const indiceAtual = Math.max(0, opcoes.findIndex((o) => o.valor === valor));

  function abrir() {
    setEmFoco(indiceAtual);
    setAberto(true);
  }

  function fechar(devolverFoco = true) {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }

  function escolher(v: string) {
    onMudar(v);
    fechar();
  }

  // Clique fora fecha. Sem devolver foco: quem clicou fora quer ir pra la.
  useEffect(() => {
    if (!aberto) return;
    function onClique(e: MouseEvent) {
      if (!container.current?.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", onClique);
    return () => document.removeEventListener("mousedown", onClique);
  }, [aberto]);

  function onTecla(e: React.KeyboardEvent) {
    if (!aberto) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      fechar();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setEmFoco((i) => (i + 1) % opcoes.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setEmFoco((i) => (i - 1 + opcoes.length) % opcoes.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setEmFoco(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setEmFoco(opcoes.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      escolher(opcoes[emFoco].valor);
    } else if (e.key === "Tab") {
      setAberto(false);
    }
  }

  return (
    <div ref={container} className="relative">
      <button
        ref={gatilho}
        type="button"
        onClick={() => (aberto ? fechar() : abrir())}
        onKeyDown={onTecla}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={`${rotulo}: ${atual?.rotulo ?? ""}`}
        className={`flex w-full items-center gap-2 rounded-pill border bg-surface-card px-3.5 py-2 text-label transition-colors sm:w-auto ${
          aberto
            ? "border-brand-500 text-ink"
            : "border-line text-ink hover:bg-surface-sunken"
        }`}
      >
        {icone && <span className="text-ink-soft shrink-0">{icone}</span>}
        <span className="truncate">{atual?.rotulo}</span>
        <motion.span
          className="text-ink-soft ml-auto shrink-0 sm:ml-1"
          animate={{ rotate: aberto ? 180 : 0 }}
          transition={reduzMovimento ? { duration: 0 } : { duration: 0.18 }}
        >
          <IconeChevron />
        </motion.span>
      </button>

      {/* Render condicional em vez de AnimatePresence: aninhado assim, o
          AnimatePresence terminava a animacao de saida mas nao desmontava o
          no, que ficava invisivel sobre o conteudo engolindo cliques. Ver a
          regra em docs/design-system.md. Sem animacao de saida, o desmonte
          do React e garantido. */}
      {aberto && (
        <motion.ul
          role="listbox"
          aria-label={rotulo}
          initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          className="card absolute left-0 z-30 mt-1.5 max-h-64 min-w-full overflow-y-auto p-1 shadow-pop"
        >
          {opcoes.map((o, i) => {
              const selecionado = o.valor === valor;
              return (
                <li key={o.valor}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selecionado}
                    onClick={() => escolher(o.valor)}
                    onMouseEnter={() => setEmFoco(i)}
                    className={`flex w-full items-center gap-2 whitespace-nowrap rounded-control px-3 py-2 text-left text-label transition-colors ${
                      i === emFoco ? "bg-surface-sunken" : ""
                    } ${selecionado ? "text-ink font-medium" : "text-ink-soft"}`}
                  >
                    <span className="w-3.5 shrink-0 text-brand-600">
                      {selecionado && <IconeCheck />}
                    </span>
                    {o.rotulo}
                  </button>
                </li>
              );
            })}
        </motion.ul>
      )}
    </div>
  );
}

function IconeChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

function IconeCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 7.5 5.5 10.5 11.5 4" />
    </svg>
  );
}
