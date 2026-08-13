"use client";

import { motion } from "framer-motion";
import { TemaToggle } from "./TemaToggle";

export function PainelHeader({
  aba,
  onAba,
  alunos,
  pendentes,
}: {
  aba: "fila" | "checklists";
  onAba: (a: "fila" | "checklists") => void;
  alunos: number;
  pendentes: number;
}) {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-label text-gradient font-semibold">
            Assaad Educacao
          </p>
          <h1 className="text-display mt-1">Mural de aprovacoes</h1>
        </div>
        <TemaToggle />
      </div>

      {/* Metricas: no celular ocupam a largura, lado a lado. */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-xs">
        <Metrica label="Alunos" valor={alunos} />
        <Metrica label="Pendentes" valor={pendentes} destaque />
      </div>

      {/* Abas em pilula de vidro: o indicador desliza entre as posicoes. */}
      <nav className="glass mt-6 inline-flex w-full gap-1 rounded-pill p-1 sm:w-auto">
        <Tab ativo={aba === "fila"} onClick={() => onAba("fila")}>
          Aprovacoes
        </Tab>
        <Tab ativo={aba === "checklists"} onClick={() => onAba("checklists")}>
          Checklist do dia
        </Tab>
      </nav>
    </header>
  );
}

function Metrica({
  label,
  valor,
  destaque,
}: {
  label: string;
  valor: number;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-control px-4 py-3 ${
        destaque
          ? "bg-brand text-white"
          : "border border-line bg-surface-card text-ink"
      }`}
    >
      <p
        className={`text-caption ${destaque ? "text-white/75" : "text-ink-soft"}`}
      >
        {label}
      </p>
      <p className="text-title mt-0.5 tabular-nums">{valor}</p>
    </div>
  );
}

function Tab({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 whitespace-nowrap rounded-pill px-4 py-2 text-label transition-colors sm:flex-none ${
        ativo ? "text-ink" : "text-ink-soft hover:text-ink"
      }`}
    >
      {ativo && (
        <motion.span
          layoutId="tab-indicador"
          className="absolute inset-0 rounded-pill bg-surface-card shadow-card"
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
