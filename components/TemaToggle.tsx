"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Alterna claro/escuro e lembra a escolha. Enquanto o usuario nao escolher,
// o app segue o sistema (a decisao inicial acontece no script de layout.tsx).
export function TemaToggle() {
  const [escuro, setEscuro] = useState(false);
  const [montado, setMontado] = useState(false);
  const reduzMovimento = useReducedMotion();

  useEffect(() => {
    setEscuro(document.documentElement.classList.contains("dark"));
    setMontado(true);
  }, []);

  function alternar() {
    const proximo = !escuro;
    setEscuro(proximo);
    document.documentElement.classList.toggle("dark", proximo);
    try {
      localStorage.setItem("tema", proximo ? "escuro" : "claro");
    } catch {
      // Sem localStorage (navegacao privada): a troca vale so nesta sessao.
    }
  }

  return (
    <motion.button
      onClick={alternar}
      whileTap={reduzMovimento ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-ink-soft transition-colors hover:text-ink"
      aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"}
      title={escuro ? "Usar tema claro" : "Usar tema escuro"}
    >
      {/* Antes de montar nao sabemos o tema: um placeholder evita o icone
          errado aparecer por um frame. */}
      {montado ? escuro ? <IconeSol /> : <IconeLua /> : <span className="h-5 w-5" />}
    </motion.button>
  );
}

function IconeSol() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="10" cy="10" r="3.6" />
      <path d="M10 2.2v1.6M10 16.2v1.6M2.2 10h1.6M16.2 10h1.6M4.5 4.5l1.1 1.1M14.4 14.4l1.1 1.1M15.5 4.5l-1.1 1.1M5.6 14.4l-1.1 1.1" />
    </svg>
  );
}

function IconeLua() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" />
    </svg>
  );
}
