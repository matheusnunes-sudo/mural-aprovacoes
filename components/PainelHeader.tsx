"use client";

import { motion } from "framer-motion";
import { TIPOS } from "@/lib/supabase";

export type AbaPainel = "acerto" | "aprovacao" | "checklists";

export function PainelHeader({
  aba,
  onAba,
  alunos,
  pendentes,
  semAutorizacao,
}: {
  aba: AbaPainel;
  onAba: (a: AbaPainel) => void;
  alunos: number;
  pendentes: number;
  semAutorizacao: number;
}) {
  const emRegistros = aba !== "checklists";

  return (
    <header className="mb-6">
      {/* pr-14: espaço para o botão de tema, que é fixo no canto. */}
      <div className="pr-14">
        <p className="text-label text-brand-600 font-semibold">
          Assaad Educação
        </p>
        <h1 className="text-display mt-1">Mural de aprovações</h1>
      </div>

      {emRegistros && (
        <div className="mt-5 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
          <Metrica label="Alunos" valor={alunos} />
          <Metrica label="Pendentes" valor={pendentes} destaque />
          <Metrica label="Sem autorização" valor={semAutorizacao} alerta />
        </div>
      )}

      {/* Três abas: os dois momentos do ano + o checklist do dia. No celular
          a barra rola em vez de espremer os rótulos. */}
      <nav className="glass mt-6 flex gap-1 overflow-x-auto rounded-pill p-1 sm:inline-flex sm:overflow-visible">
        {TIPOS.map((t) => (
          <Tab
            key={t.id}
            ativo={aba === t.id}
            titulo={t.descricao}
            onClick={() => onAba(t.id)}
          >
            {t.titulo}
          </Tab>
        ))}
        <Tab
          ativo={aba === "checklists"}
          onClick={() => onAba("checklists")}
        >
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
  titulo,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={titulo}
      className={`relative shrink-0 whitespace-nowrap rounded-pill px-4 py-2 text-label transition-colors ${
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
