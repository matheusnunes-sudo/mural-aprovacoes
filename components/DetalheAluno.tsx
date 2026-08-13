"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ETAPAS } from "@/lib/supabase";
import type { Aprovacao, GrupoAluno, StatusAprovacao } from "@/lib/supabase";
import { Interruptor } from "./Interruptor";

function dataCurta(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function DetalheAluno({
  grupo,
  responsaveis,
  onFechar,
  onAtualizar,
}: {
  grupo: GrupoAluno;
  responsaveis: string[];
  onFechar: () => void;
  onAtualizar: (id: string, patch: Partial<Aprovacao>) => void;
}) {
  // Qual dos envios do aluno está em revisão. 0 = mais recente.
  const [indice, setIndice] = useState(0);
  const aprovacao = grupo.aprovacoes[indice] ?? grupo.aprovacoes[0];
  const varios = grupo.aprovacoes.length > 1;

  const reduzMovimento = useReducedMotion();
  const materializar = reduzMovimento
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 12 },
      };

  // Esc fecha: nunca prender o usuário dentro do modal.
  useEffect(() => {
    function onTecla(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", onTecla);
    return () => window.removeEventListener("keydown", onTecla);
  }, [onFechar]);

  return (
    <motion.div
      className="scrim fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 py-6 sm:p-4 sm:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      role="dialog"
      aria-modal
      aria-label={`Depoimentos de ${grupo.nome}`}
    >
      <motion.div
        className="card w-full max-w-2xl p-5 shadow-pop sm:p-7"
        {...materializar}
        transition={{
          type: "spring",
          bounce: reduzMovimento ? 0 : 0.15,
          duration: 0.35,
        }}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-title">{grupo.nome}</h2>
            <p className="text-caption text-ink-soft mt-0.5 truncate">
              {aprovacao.curso} · {aprovacao.faculdade}
            </p>
            <p className="text-caption text-ink-muted truncate">{grupo.email}</p>
          </div>
          <motion.button
            onClick={onFechar}
            whileTap={reduzMovimento ? undefined : { scale: 0.9 }}
            className="text-ink-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-surface-sunken transition-colors hover:text-ink"
            aria-label="Fechar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </motion.button>
        </div>

        {varios && (
          <div className="mb-5">
            <p className="text-caption text-ink-muted mb-2">
              Este aluno enviou {grupo.aprovacoes.length} depoimentos com o
              mesmo e-mail.
            </p>
            <div className="flex gap-1 overflow-x-auto rounded-pill bg-surface-sunken p-1">
              {grupo.aprovacoes.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setIndice(i)}
                  className={`relative shrink-0 whitespace-nowrap rounded-pill px-3.5 py-1.5 text-label transition-colors ${
                    i === indice ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {i === indice && (
                    <motion.span
                      layoutId="envio-selecionado"
                      className="absolute inset-0 rounded-pill bg-surface-card shadow-card"
                      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                    />
                  )}
                  <span className="relative">
                    {dataCurta(a.criado_em)} · {a.faculdade}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* key remonta a revisão ao trocar de envio, zerando o estado local. */}
        <RevisaoDepoimento
          key={aprovacao.id}
          aprovacao={aprovacao}
          responsaveis={responsaveis}
          onFechar={onFechar}
          onAtualizar={onAtualizar}
        />
      </motion.div>
    </motion.div>
  );
}

function RevisaoDepoimento({
  aprovacao,
  responsaveis,
  onFechar,
  onAtualizar,
}: {
  aprovacao: Aprovacao;
  responsaveis: string[];
  onFechar: () => void;
  onAtualizar: (id: string, patch: Partial<Aprovacao>) => void;
}) {
  const [corrigido, setCorrigido] = useState(
    aprovacao.depoimento_corrigido || ""
  );
  const [carregando, setCarregando] = useState(false);
  const [modo, setModo] = useState<string | null>(null);

  async function corrigir(tom?: string) {
    setCarregando(true);
    try {
      const res = await fetch("/api/corrigir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depoimento: aprovacao.depoimento_original,
          tom,
        }),
      });
      const json = await res.json();
      if (json.corrigido) {
        setCorrigido(json.corrigido);
        setModo(json.modo);
      }
    } finally {
      setCarregando(false);
    }
  }

  // Correção automática ao abrir, se ainda não houver versão corrigida.
  useEffect(() => {
    if (!aprovacao.depoimento_corrigido) corrigir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function salvar() {
    onAtualizar(aprovacao.id, { depoimento_corrigido: corrigido });
    onFechar();
  }

  return (
    <>
      {/* Autorização vem primeiro: sem ela, o resto do trabalho não acontece. */}
      <div
        className={`mb-5 flex items-center justify-between gap-4 rounded-control border p-3.5 ${
          aprovacao.autoriza_postagem
            ? "border-line bg-surface-sunken/60"
            : "border-transparent bg-danger-bg"
        }`}
      >
        <div className="min-w-0">
          <p
            className={`text-label ${
              aprovacao.autoriza_postagem ? "" : "text-danger-fg"
            }`}
          >
            {aprovacao.autoriza_postagem
              ? "Autoriza a publicação"
              : "Não autoriza a publicação"}
          </p>
          <p
            className={`text-caption mt-0.5 ${
              aprovacao.autoriza_postagem ? "text-ink-soft" : "text-danger-fg/80"
            }`}
          >
            {aprovacao.autoriza_postagem
              ? "Pode virar card e ir para as redes."
              : "Não produza design para este depoimento."}
          </p>
        </div>
        <Interruptor
          ligado={aprovacao.autoriza_postagem}
          onMudar={(v) => onAtualizar(aprovacao.id, { autoriza_postagem: v })}
          rotulo="Autorização de publicação"
        />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-label text-ink-soft mb-1.5 block">Status</span>
          <select
            className="field"
            value={aprovacao.status}
            onChange={(e) =>
              onAtualizar(aprovacao.id, {
                status: e.target.value as StatusAprovacao,
              })
            }
          >
            {ETAPAS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.titulo}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-label text-ink-soft mb-1.5 block">
            Responsável
          </span>
          <select
            className="field"
            value={aprovacao.responsavel || ""}
            onChange={(e) =>
              onAtualizar(aprovacao.id, { responsavel: e.target.value })
            }
          >
            <option value="">Sem responsável</option>
            {responsaveis.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className="text-label">Depoimento</span>
        {modo === "ia" && (
          <span className="badge bg-info-bg text-info-fg">
            Corrigido pela IA
          </span>
        )}
        {modo === "demo" && (
          <span className="badge bg-surface-sunken text-ink-soft">
            Modo demo (sem chave)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-caption text-ink-muted mb-1.5">Original</p>
          <div className="text-body text-ink-soft rounded-control bg-surface-sunken p-3.5">
            {aprovacao.depoimento_original}
          </div>
        </div>
        <div>
          <p className="text-caption text-ink-muted mb-1.5">
            Corrigido (editável)
          </p>
          <textarea
            className="field min-h-[8.75rem] resize-y"
            value={carregando ? "Corrigindo..." : corrigido}
            disabled={carregando}
            onChange={(e) => setCorrigido(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        <button
          className="btn-ghost"
          onClick={() => corrigir("emocionante")}
          disabled={carregando}
        >
          Regerar com tom emocionante
        </button>
        <button className="btn-primary sm:ml-auto" onClick={salvar}>
          Salvar depoimento
        </button>
      </div>
    </>
  );
}
