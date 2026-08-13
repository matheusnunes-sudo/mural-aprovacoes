"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { GrupoAluno, StatusAprovacao } from "@/lib/supabase";

const STATUS: Record<StatusAprovacao, { texto: string; classe: string }> = {
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

  // min-w-0 no card: sem isso o item de grid nao encolhe abaixo do proprio
  // min-content e um email longo estoura a largura da tela no celular.
  return (
    <motion.button
      onClick={onClick}
      className="glass group flex w-full min-w-0 items-center gap-3 p-3 text-left transition-colors sm:gap-4 sm:p-4"
      whileTap={reduzMovimento ? undefined : { scale: 0.985 }}
      whileHover={reduzMovimento ? undefined : { y: -2 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
    >
      <span className="bg-brand text-label flex h-11 w-11 shrink-0 items-center justify-center rounded-pill font-semibold text-white sm:h-12 sm:w-12">
        {iniciais(grupo.nome)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-body truncate font-semibold">{grupo.nome}</span>
          {varios && (
            <span className="badge shrink-0 bg-surface-sunken text-ink-soft">
              {grupo.aprovacoes.length}
              <span className="ml-1 hidden sm:inline">depoimentos</span>
            </span>
          )}
        </span>
        <span className="text-caption text-ink-soft mt-0.5 block truncate">
          {recente.curso} · {recente.faculdade}
        </span>
        <span className="text-caption text-ink-muted block truncate">
          {grupo.email}
        </span>
      </span>

      {recente.responsavel && (
        <span
          className="text-caption text-ink-soft hidden h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-surface-sunken sm:flex"
          title={`Responsavel: ${recente.responsavel}`}
        >
          {iniciais(recente.responsavel)}
        </span>
      )}

      <span
        className={`badge ${s.classe} shrink-0 justify-center sm:min-w-[6rem]`}
      >
        {s.texto}
      </span>
    </motion.button>
  );
}
