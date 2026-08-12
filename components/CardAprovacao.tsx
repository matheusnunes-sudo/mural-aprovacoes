"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { GrupoAluno, StatusAprovacao } from "@/lib/supabase";

const STATUS: Record<
  StatusAprovacao,
  { texto: string; classe: string }
> = {
  pendente: { texto: "Pendente", classe: "bg-warning-bg text-warning-fg" },
  design_pronto: { texto: "Design pronto", classe: "bg-info-bg text-info-fg" },
  postado: { texto: "Postado", classe: "bg-success-bg text-success-fg" },
};

function iniciais(nome: string) {
  return nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CardAprovacao({
  grupo,
  onClick,
}: {
  grupo: GrupoAluno;
  onClick: () => void;
}) {
  // O envio mais recente representa o aluno na fila.
  const recente = grupo.aprovacoes[0];
  const s = STATUS[recente.status];
  const varios = grupo.aprovacoes.length > 1;
  const reduzMovimento = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      className="card flex w-full items-center gap-3 p-3 text-left hover:border-line-strong transition-colors"
      whileTap={reduzMovimento ? undefined : { scale: 0.98 }}
      whileHover={reduzMovimento ? undefined : { y: -1 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-label text-brand-700">
        {iniciais(grupo.nome)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="flex items-center gap-2">
          <span className="text-body font-medium truncate">{grupo.nome}</span>
          {varios && (
            <span className="badge shrink-0 bg-surface-sunken text-ink-soft">
              {grupo.aprovacoes.length} depoimentos
            </span>
          )}
        </p>
        <p className="text-caption text-ink-soft truncate">
          {recente.curso} · {recente.faculdade} · {grupo.email}
        </p>
      </div>
      {recente.responsavel && (
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-caption text-ink-soft"
          title={`Responsavel: ${recente.responsavel}`}
        >
          {iniciais(recente.responsavel)}
        </span>
      )}
      <span className={`badge ${s.classe} min-w-[92px] shrink-0 justify-center`}>
        {s.texto}
      </span>
    </motion.button>
  );
}
