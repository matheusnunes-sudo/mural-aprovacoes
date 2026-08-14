"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Aprovacao } from "@/lib/supabase";

// MVP VISUAL da integração com o Figma. Nada é enviado para lugar nenhum:
// a conexão, o arquivo e a geração são simulados com timers, só para a
// equipe ver o fluxo e opinar antes de existir integração de verdade.
//
// Quando for implementar: o caminho real é a API de plugins do Figma (ou o
// plugin "Sheets to Figma"), casando nome de campo com nome de layer —
// exatamente o mapeamento mostrado aqui.

type Estado = "desconectado" | "conectando" | "conectado" | "gerando" | "pronto";

const MAPEAMENTO = [
  { campo: "nome", layer: "#nome", exemplo: "Júlia Santos" },
  { campo: "curso", layer: "#curso", exemplo: "Medicina" },
  { campo: "faculdade", layer: "#faculdade", exemplo: "UFBA" },
  { campo: "depoimento_corrigido", layer: "#depoimento", exemplo: "O Assaad mudou minha vida…" },
  { campo: "selos[]", layer: "#selo-1, #selo-2", exemplo: "1º lugar" },
  { campo: "foto_url", layer: "#foto", exemplo: "(imagem do aluno)" },
];

export function ModalFigma({
  aprovacoes,
  onFechar,
}: {
  aprovacoes: Aprovacao[];
  onFechar: () => void;
}) {
  const [estado, setEstado] = useState<Estado>("desconectado");
  const reduzMovimento = useReducedMotion();

  // Só entra na arte quem autorizou e já tem texto revisado.
  const elegiveis = aprovacoes.filter(
    (a) => a.autoriza_postagem && a.depoimento_corrigido
  );
  const bloqueadosSemAutorizacao = aprovacoes.filter(
    (a) => !a.autoriza_postagem
  ).length;
  const bloqueadosSemTexto = aprovacoes.filter(
    (a) => a.autoriza_postagem && !a.depoimento_corrigido
  ).length;

  useEffect(() => {
    function onTecla(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", onTecla);
    return () => window.removeEventListener("keydown", onTecla);
  }, [onFechar]);

  function conectar() {
    setEstado("conectando");
    setTimeout(() => setEstado("conectado"), 1100);
  }

  function gerar() {
    setEstado("gerando");
    setTimeout(() => setEstado("pronto"), 1400);
  }

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
      aria-label="Enviar para o Figma"
    >
      <motion.div
        className="card w-full max-w-2xl p-5 shadow-pop sm:p-7"
        initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduzMovimento ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", bounce: reduzMovimento ? 0 : 0.15, duration: 0.35 }}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-title">Enviar para o Figma</h2>
              <span className="badge bg-warning-bg text-warning-fg">
                Demonstração
              </span>
            </div>
            <p className="text-caption text-ink-soft mt-1">
              Prévia de como a integração vai funcionar. Nada é enviado ainda.
            </p>
          </div>
          <button
            onClick={onFechar}
            className="text-ink-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-surface-sunken transition-colors hover:text-ink"
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Passo 1 — conexão */}
        <section className="mb-4 rounded-control border border-line p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-label">1. Conta do Figma</p>
              <p className="text-caption text-ink-soft mt-0.5">
                {estado === "desconectado" && "Nenhuma conta conectada."}
                {estado === "conectando" && "Abrindo autorização do Figma…"}
                {estado !== "desconectado" && estado !== "conectando" && (
                  <>
                    Conectado · arquivo{" "}
                    <span className="text-ink font-medium">
                      Mural Assaad 2026
                    </span>
                  </>
                )}
              </p>
            </div>
            {estado === "desconectado" ? (
              <button className="btn-primary shrink-0" onClick={conectar}>
                Conectar ao Figma
              </button>
            ) : estado === "conectando" ? (
              <span className="badge shrink-0 bg-surface-sunken text-ink-soft">
                Conectando…
              </span>
            ) : (
              <span className="badge shrink-0 bg-success-bg text-success-fg">
                Conectado
              </span>
            )}
          </div>
        </section>

        {/* Passo 2 — o que entra */}
        <section className="mb-4 rounded-control border border-line p-4">
          <p className="text-label">2. O que vai virar arte</p>
          <p className="text-title mt-2 tabular-nums">
            {elegiveis.length}{" "}
            <span className="text-body text-ink-soft font-normal">
              {elegiveis.length === 1 ? "card" : "cards"} prontos para gerar
            </span>
          </p>

          <ul className="text-caption text-ink-soft mt-3 space-y-1">
            {bloqueadosSemAutorizacao > 0 && (
              <li className="flex items-start gap-2">
                <span className="bg-danger-fg mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill" aria-hidden />
                {bloqueadosSemAutorizacao} fora por{" "}
                <span className="text-danger-fg font-medium">
                  não autorizar publicação
                </span>
              </li>
            )}
            {bloqueadosSemTexto > 0 && (
              <li className="flex items-start gap-2">
                <span className="bg-warning-fg mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill" aria-hidden />
                {bloqueadosSemTexto} sem depoimento revisado
              </li>
            )}
            {bloqueadosSemAutorizacao === 0 && bloqueadosSemTexto === 0 && (
              <li>Todos os depoimentos filtrados estão prontos.</li>
            )}
          </ul>
        </section>

        {/* Passo 3 — mapeamento campo -> layer */}
        <section className="mb-5 rounded-control border border-line p-4">
          <p className="text-label">3. De onde cada texto vem</p>
          <p className="text-caption text-ink-soft mt-0.5">
            No template do Figma, a layer precisa ter exatamente este nome.
          </p>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse">
              <thead>
                <tr>
                  <th className="text-caption text-ink-muted border-b border-line px-2 py-1.5 text-left font-medium">
                    Campo no painel
                  </th>
                  <th className="text-caption text-ink-muted border-b border-line px-2 py-1.5 text-left font-medium">
                    Layer no Figma
                  </th>
                  <th className="text-caption text-ink-muted border-b border-line px-2 py-1.5 text-left font-medium">
                    Exemplo
                  </th>
                </tr>
              </thead>
              <tbody>
                {MAPEAMENTO.map((m) => (
                  <tr key={m.campo} className="border-b border-line last:border-0">
                    <td className="text-caption px-2 py-1.5 font-mono">
                      {m.campo}
                    </td>
                    <td className="text-caption text-brand-600 px-2 py-1.5 font-mono">
                      {m.layer}
                    </td>
                    <td className="text-caption text-ink-soft max-w-[12rem] truncate px-2 py-1.5">
                      {m.exemplo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
          {estado === "pronto" && (
            <p className="text-caption text-success-fg">
              {elegiveis.length} cards criados no Figma (simulado).
            </p>
          )}
          <button
            className="btn-primary sm:ml-auto"
            onClick={gerar}
            disabled={
              estado === "desconectado" ||
              estado === "conectando" ||
              estado === "gerando" ||
              elegiveis.length === 0
            }
          >
            {estado === "gerando"
              ? "Gerando…"
              : estado === "pronto"
                ? "Gerar novamente"
                : `Gerar ${elegiveis.length} cards`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
