"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ETAPAS } from "@/lib/supabase";
import type { Registro, StatusRegistro } from "@/lib/supabase";
import { legendaRegistro, legendaMaterias } from "@/lib/formato";
import { SeloAutorizacao } from "./SeloAutorizacao";
import { CORES_ETAPA } from "./SeloStatus";

// Cada envio (não cada aluno) é um card: o status pertence ao registro,
// não à pessoa.
//
// Duas formas de mover um card de etapa: arrastar entre colunas, e os botões
// ‹ › do card. Os botões são o caminho principal — funcionam no teclado, no
// toque e em qualquer navegador; o arrastar é um extra para quem usa mouse.
export function KanbanRegistros({
  registros,
  onAbrir,
  onAtualizar,
}: {
  registros: Registro[];
  onAbrir: (email: string) => void;
  onAtualizar: (id: string, patch: Partial<Registro>) => void;
}) {
  // Guarda o elemento de cada coluna para descobrir onde o card foi solto.
  const colunas = useRef<Partial<Record<StatusRegistro, HTMLDivElement>>>({});
  const arrastou = useRef(false);
  const [alvo, setAlvo] = useState<StatusRegistro | null>(null);
  const reduzMovimento = useReducedMotion();

  function colunaEmbaixo(x: number, y: number): StatusRegistro | null {
    for (const etapa of ETAPAS) {
      const el = colunas.current[etapa.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return etapa.id;
      }
    }
    return null;
  }

  function mover(r: Registro, direcao: -1 | 1) {
    const i = ETAPAS.findIndex((e) => e.id === r.status);
    const proxima = ETAPAS[i + direcao];
    if (proxima) onAtualizar(r.id, { status: proxima.id });
  }

  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {ETAPAS.map((etapa, indiceEtapa) => {
        const daEtapa = registros.filter((r) => r.status === etapa.id);
        const destacada = alvo === etapa.id;
        const cores = CORES_ETAPA[etapa.id];

        return (
          <div
            key={etapa.id}
            ref={(el) => {
              if (el) colunas.current[etapa.id] = el;
            }}
            className={`w-[17rem] shrink-0 snap-start rounded-card border p-3 transition-colors sm:w-auto sm:flex-1 ${
              destacada ? "border-brand-500 bg-brand-500/10" : cores.coluna
            }`}
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span
                className={`h-2 w-2 shrink-0 rounded-pill ${cores.ponto}`}
                aria-hidden
              />
              <h3 className={`text-label font-semibold ${cores.cabecalho}`}>
                {etapa.titulo}
              </h3>
              <span
                className={`text-caption ml-auto tabular-nums ${cores.cabecalho}`}
              >
                {daEtapa.length}
              </span>
            </div>

            {/* Scroll interno na coluna: com dezenas de cards, uma coluna
                de 4000px levava o cabecalho da etapa para fora da tela e
                tornava o arrasto entre colunas impraticavel. O quadro
                inteiro cabe em uma tela e cada coluna rola por dentro. */}
            <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
              {daEtapa.map((r) => {
                const materias = legendaMaterias(r);
                return (
                  <motion.article
                    key={r.id}
                    layout
                    drag={!reduzMovimento}
                    dragSnapToOrigin
                    dragElastic={0.12}
                    onDragStart={() => {
                      arrastou.current = true;
                    }}
                    onDrag={(e) => {
                      const ev = e as PointerEvent;
                      setAlvo(colunaEmbaixo(ev.clientX, ev.clientY));
                    }}
                    onDragEnd={(e) => {
                      const ev = e as PointerEvent;
                      const destino = colunaEmbaixo(ev.clientX, ev.clientY);
                      if (destino && destino !== r.status) {
                        onAtualizar(r.id, { status: destino });
                      }
                      setAlvo(null);
                      // Solta o travamento do clique no próximo tick, senão o
                      // clique que encerra o arrasto abriria o detalhe.
                      setTimeout(() => {
                        arrastou.current = false;
                      }, 0);
                    }}
                    whileDrag={{ scale: 1.03, zIndex: 30 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                    className="card p-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (!arrastou.current) onAbrir(r.email);
                      }}
                      className="block w-full text-left"
                    >
                      <p className="text-body truncate font-semibold">
                        {r.nome}
                      </p>
                      <p className="text-caption text-ink-soft mt-0.5 truncate">
                        {legendaRegistro(r)}
                      </p>
                      {materias && (
                        <p className="text-caption text-ink-muted truncate">
                          {materias}
                        </p>
                      )}
                      {r.selos.length > 0 && (
                        <p className="text-caption text-brand-600 mt-1.5 truncate">
                          {r.selos.join(" · ")}
                        </p>
                      )}
                    </button>

                    <div className="mt-2.5 flex items-center gap-1.5">
                      {/* Só a exceção aparece: "autoriza" é o caso normal e um
                          selo verde em quase todo card vira ruído. */}
                      {!r.autoriza_postagem && (
                        <SeloAutorizacao autoriza={false} />
                      )}

                      <div className="ml-auto flex shrink-0 gap-0.5">
                        <BotaoMover
                          direcao={-1}
                          desabilitado={indiceEtapa === 0}
                          rotulo={`Mover ${r.nome} para ${
                            ETAPAS[indiceEtapa - 1]?.titulo ?? ""
                          }`}
                          onClick={() => mover(r, -1)}
                        />
                        <BotaoMover
                          direcao={1}
                          desabilitado={indiceEtapa === ETAPAS.length - 1}
                          rotulo={`Mover ${r.nome} para ${
                            ETAPAS[indiceEtapa + 1]?.titulo ?? ""
                          }`}
                          onClick={() => mover(r, 1)}
                        />
                      </div>
                    </div>
                  </motion.article>
                );
              })}

              {daEtapa.length === 0 && (
                <p className="text-caption text-ink-muted px-1 py-6 text-center">
                  Nada aqui.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BotaoMover({
  direcao,
  desabilitado,
  rotulo,
  onClick,
}: {
  direcao: -1 | 1;
  desabilitado: boolean;
  rotulo: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desabilitado}
      aria-label={rotulo}
      title={rotulo}
      className="text-ink-soft flex h-7 w-7 items-center justify-center rounded-control transition-colors hover:bg-surface-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        style={direcao === -1 ? { transform: "scaleX(-1)" } : undefined}
      >
        <path d="M5 2.5 9.5 7 5 11.5" />
      </svg>
    </button>
  );
}
