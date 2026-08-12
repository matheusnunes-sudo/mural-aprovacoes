"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Aprovacao, GrupoAluno, StatusAprovacao } from "@/lib/supabase";

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
  // Qual dos envios do aluno esta em revisao. 0 = mais recente.
  const [indice, setIndice] = useState(0);
  const aprovacao = grupo.aprovacoes[indice] ?? grupo.aprovacoes[0];
  const varios = grupo.aprovacoes.length > 1;

  const reduzMovimento = useReducedMotion();
  const materializar = reduzMovimento
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
      };

  return (
    <motion.div
      className="scrim fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <motion.div
        className="card w-full max-w-2xl p-6 shadow-pop"
        {...materializar}
        transition={{ type: "spring", bounce: reduzMovimento ? 0 : 0.15, duration: 0.35 }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-title">{grupo.nome}</h2>
            <p className="text-caption text-ink-soft truncate">
              {aprovacao.curso} · {aprovacao.faculdade} · {grupo.email}
            </p>
          </div>
          <motion.button
            onClick={onFechar}
            whileTap={reduzMovimento ? undefined : { scale: 0.9 }}
            className="shrink-0 text-ink-muted hover:text-ink text-xl leading-none"
            aria-label="Fechar"
          >
            ×
          </motion.button>
        </div>

        {varios && (
          <div className="mb-5">
            <p className="text-caption text-ink-muted mb-2">
              Este aluno enviou {grupo.aprovacoes.length} depoimentos com o
              mesmo email.
            </p>
            <div className="flex flex-wrap gap-1 rounded-control bg-surface-sunken p-1">
              {grupo.aprovacoes.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setIndice(i)}
                  className={`relative rounded-[7px] px-3 py-1.5 text-label transition-colors ${
                    i === indice ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {i === indice && (
                    <motion.span
                      layoutId="envio-selecionado"
                      className="absolute inset-0 rounded-[7px] bg-surface-card shadow-card"
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

        {/* key remonta a revisao ao trocar de envio, zerando o estado local. */}
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

  // Correcao automatica ao abrir, se ainda nao houver versao corrigida.
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
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-label text-ink-soft">Status</label>
        <select
          className="field w-auto"
          value={aprovacao.status}
          onChange={(e) =>
            onAtualizar(aprovacao.id, {
              status: e.target.value as StatusAprovacao,
            })
          }
        >
          <option value="pendente">Pendente</option>
          <option value="design_pronto">Design pronto</option>
          <option value="postado">Postado</option>
        </select>

        <label className="text-label text-ink-soft">Responsavel</label>
        <select
          className="field w-auto"
          value={aprovacao.responsavel || ""}
          onChange={(e) =>
            onAtualizar(aprovacao.id, { responsavel: e.target.value })
          }
        >
          <option value="">Sem responsavel</option>
          {responsaveis.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="mb-2 flex items-center gap-2">
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
          <div className="rounded-control bg-surface-sunken p-3 text-body text-ink-soft">
            {aprovacao.depoimento_original}
          </div>
        </div>
        <div>
          <p className="text-caption text-ink-muted mb-1.5">
            Corrigido (editavel)
          </p>
          <textarea
            className="field min-h-[140px] resize-y"
            value={carregando ? "Corrigindo..." : corrigido}
            disabled={carregando}
            onChange={(e) => setCorrigido(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          className="btn-ghost"
          onClick={() => corrigir("emocionante")}
          disabled={carregando}
        >
          Regerar com tom emocionante
        </button>
        <button className="btn-primary ml-auto" onClick={salvar}>
          Salvar depoimento
        </button>
      </div>
    </>
  );
}
