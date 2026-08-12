"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Aprovacao, StatusAprovacao } from "@/lib/supabase";

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
  aprovacao,
  onClick,
}: {
  aprovacao: Aprovacao;
  onClick: () => void;
}) {
  const s = STATUS[aprovacao.status];
  const reduzMovimento = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      className="card flex w-full items-center gap-3 p-3 text-left hover:border-line-strong transition-colors"
      whileTap={reduzMovimento ? undefined : { scale: 0.98 }}
      whileHover={reduzMovimento ? undefined : { y: -1 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-label text-brand-700">
        {iniciais(aprovacao.nome)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium truncate">{aprovacao.nome}</p>
        <p className="text-caption text-ink-soft truncate">
          {aprovacao.curso} · {aprovacao.faculdade} · {aprovacao.cidade}
        </p>
      </div>
      {aprovacao.responsavel && (
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-sunken text-caption text-ink-soft"
          title={`Responsavel: ${aprovacao.responsavel}`}
        >
          {iniciais(aprovacao.responsavel)}
        </span>
      )}
      <span className={`badge ${s.classe} min-w-[92px] justify-center`}>
        {s.texto}
      </span>
    </motion.button>
  );
}
