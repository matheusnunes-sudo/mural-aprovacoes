"use client";

import { motion } from "framer-motion";

export function PainelHeader({
  aba,
  onAba,
  alunos,
  pendentes,
  semAutorizacao,
}: {
  aba: "fila" | "checklists";
  onAba: (a: "fila" | "checklists") => void;
  alunos: number;
  pendentes: number;
  semAutorizacao: number;
}) {
  return (
    <header className="mb-6">
      {/* pr-14: espaço para o botão de tema, que é fixo no canto. */}
      <div className="pr-14">
        <p className="text-label text-brand-600 font-semibold">
          Assaad Educação
        </p>
        <h1 className="text-display mt-1">Mural de aprovações</h1>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
        <Metrica label="Alunos" valor={alunos} />
        <Metrica label="Pendentes" valor={pendentes} destaque />
        <Metrica label="Sem autorização" valor={semAutorizacao} alerta />
      </div>

      {/* Abas em pílula: o indicador desliza entre as posições. */}
      <nav className="glass mt-6 inline-flex w-full gap-1 rounded-pill p-1 sm:w-auto">
        <Tab ativo={aba === "fila"} onClick={() => onAba("fila")}>
          Aprovações
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
  alerta,
}: {
  label: string;
  valor: number;
  destaque?: boolean;
  alerta?: boolean;
}) {
  const cor = destaque
    ? "bg-brand-500 text-white"
    : alerta && valor > 0
      ? "bg-danger-bg text-danger-fg border border-transparent"
      : "border border-line bg-surface-card text-ink";

  return (
    <div className={`rounded-control px-3 py-2.5 sm:px-4 sm:py-3 ${cor}`}>
      <p
        className={`text-caption ${
          destaque ? "text-white/75" : alerta && valor > 0 ? "" : "text-ink-soft"
        }`}
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
