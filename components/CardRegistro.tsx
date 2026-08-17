"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { GrupoAluno } from "@/lib/supabase";
import { legendaRegistro, legendaMaterias } from "@/lib/formato";
import { SeloAutorizacao } from "./SeloAutorizacao";
import { SeloStatus } from "./SeloStatus";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CardRegistro({
  grupo,
  onClick,
}: {
  grupo: GrupoAluno;
  onClick: () => void;
}) {
  // O envio mais recente representa o aluno na fila.
  const recente = grupo.registros[0];
  const varios = grupo.registros.length > 1;
  // Se qualquer envio do aluno não tem autorização, a fila precisa avisar.
  const algumSemAutorizacao = grupo.registros.some((r) => !r.autoriza_postagem);
  const materias = legendaMaterias(recente);
  const reduzMovimento = useReducedMotion();

  // min-w-0 no card: sem isso o item de grid não encolhe abaixo do próprio
  // min-content e um e-mail longo estoura a largura da tela no celular.
  return (
    <motion.button
      onClick={onClick}
      className="card flex w-full min-w-0 items-center gap-3 p-3 text-left transition-colors hover:border-line-strong sm:gap-4 sm:p-4"
      whileTap={reduzMovimento ? undefined : { scale: 0.985 }}
      whileHover={reduzMovimento ? undefined : { y: -2 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
    >
      <span className="bg-brand-500 text-label flex h-11 w-11 shrink-0 items-center justify-center rounded-pill font-semibold text-white sm:h-12 sm:w-12">
        {iniciais(grupo.nome)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-body truncate font-semibold">{grupo.nome}</span>
          {varios && (
            <span className="badge shrink-0 bg-surface-sunken text-ink-soft">
              {grupo.registros.length}
              <span className="ml-1 hidden sm:inline">envios</span>
            </span>
          )}
        </span>
        <span className="text-caption text-ink-soft mt-0.5 block truncate">
          {legendaRegistro(recente)}
        </span>
        {recente.selos.length > 0 ? (
          <span className="text-caption text-brand-600 block truncate">
            {recente.selos.join(" · ")}
          </span>
        ) : (
          <span className="text-caption text-ink-muted block truncate">
            {materias || grupo.email}
          </span>
        )}
      </span>

      {algumSemAutorizacao && (
        <span className="hidden shrink-0 sm:block">
          <SeloAutorizacao autoriza={false} />
        </span>
      )}

      <span className="shrink-0 sm:min-w-[7rem]">
        <SeloStatus status={recente.status} />
      </span>
    </motion.button>
  );
}
