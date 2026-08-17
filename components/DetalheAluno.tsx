"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ETAPAS } from "@/lib/supabase";
import type { GrupoAluno, Registro, StatusRegistro } from "@/lib/supabase";
import { legendaRegistro } from "@/lib/formato";
import { Interruptor } from "./Interruptor";
import { EditorSelos } from "./EditorSelos";
import { EditorAcertos } from "./EditorAcertos";
import { ConfirmarDialogo } from "./ConfirmarDialogo";

function dataCurta(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function DetalheAluno({
  grupo,
  onFechar,
  onAtualizar,
}: {
  grupo: GrupoAluno;
  onFechar: () => void;
  onAtualizar: (id: string, patch: Partial<Registro>) => void;
}) {
  // Qual dos envios do aluno está em revisão. 0 = mais recente.
  const [indice, setIndice] = useState(0);
  const registro = grupo.registros[indice] ?? grupo.registros[0];
  const varios = grupo.registros.length > 1;

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
      aria-label={`Registros de ${grupo.nome}`}
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
              {legendaRegistro(registro)}
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
              Este aluno enviou {grupo.registros.length} vezes com o mesmo
              e-mail.
            </p>
            <div className="flex gap-1 overflow-x-auto rounded-pill bg-surface-sunken p-1">
              {grupo.registros.map((r, i) => (
                <button
                  key={r.id}
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
                    {dataCurta(r.criado_em)} ·{" "}
                    {r.tipo === "aprovacao" ? r.faculdade : "acertos"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* key remonta a revisão ao trocar de envio, zerando o estado local. */}
        <RevisaoRegistro
          key={registro.id}
          registro={registro}
          onFechar={onFechar}
          onAtualizar={onAtualizar}
        />
      </motion.div>
    </motion.div>
  );
}

function RevisaoRegistro({
  registro,
  onFechar,
  onAtualizar,
}: {
  registro: Registro;
  onFechar: () => void;
  onAtualizar: (id: string, patch: Partial<Registro>) => void;
}) {
  const [corrigido, setCorrigido] = useState(
    registro.depoimento_corrigido || ""
  );
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [modo, setModo] = useState<string | null>(null);
  const [confirmandoAutorizacao, setConfirmandoAutorizacao] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  async function corrigir() {
    setCarregando(true);
    try {
      const res = await fetch("/api/corrigir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depoimento: registro.depoimento_original }),
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
    if (!registro.depoimento_corrigido) corrigir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ao entrar em edição, o cursor já vai para o texto.
  useEffect(() => {
    if (editando) areaRef.current?.focus();
  }, [editando]);

  function salvar() {
    onAtualizar(registro.id, { depoimento_corrigido: corrigido });
    onFechar();
  }

  const autorizado = registro.autoriza_postagem;

  return (
    <>
      {/* Autorização vem primeiro: sem ela, o resto do trabalho não acontece. */}
      <div
        className={`mb-4 flex items-center justify-between gap-4 rounded-control border p-3.5 ${
          autorizado
            ? "border-line bg-surface-sunken/50"
            : "border-transparent bg-danger-bg"
        }`}
      >
        <div className="min-w-0">
          <p className={`text-label ${autorizado ? "" : "text-danger-fg"}`}>
            {autorizado ? "Autoriza a publicação" : "Não autoriza a publicação"}
          </p>
          <p
            className={`text-caption mt-0.5 ${
              autorizado ? "text-ink-soft" : "text-danger-fg/80"
            }`}
          >
            {autorizado
              ? "Pode virar card e ir para as redes."
              : "Não produza design para este registro."}
          </p>
        </div>
        <Interruptor
          ligado={autorizado}
          // Nunca muda direto: é a resposta do aluno, não uma preferência
          // da equipe. Trocar sem querer expõe alguém que não autorizou.
          onMudar={() => setConfirmandoAutorizacao(true)}
          rotulo="Autorização de publicação"
        />
      </div>

      {/* Só na semana do ENEM: o expert lança aqui o que o aluno mandou. */}
      {registro.tipo === "acerto" && (
        <div className="mb-4">
          <EditorAcertos
            acertos={registro.acertos}
            onMudar={(acertos) => onAtualizar(registro.id, { acertos })}
          />
        </div>
      )}

      <div className="mb-5">
        <EditorSelos
          selos={registro.selos}
          onMudar={(selos) => onAtualizar(registro.id, { selos })}
        />
      </div>

      <label className="mb-5 block">
        <span className="text-label text-ink-soft mb-1.5 block">Status</span>
        <select
          className="field sm:w-auto"
          value={registro.status}
          onChange={(e) =>
            onAtualizar(registro.id, {
              status: e.target.value as StatusRegistro,
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
            {registro.depoimento_original}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="text-caption text-ink-muted">Corrigido</p>
            {/* Fica travado por padrão: o texto já vem revisado e uma
                edição sem querer passaria batida. */}
            <button
              type="button"
              onClick={() => setEditando((v) => !v)}
              disabled={carregando}
              aria-pressed={editando}
              className={`flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-caption transition-colors disabled:opacity-40 ${
                editando
                  ? "bg-brand-500 text-white"
                  : "text-ink-soft hover:bg-surface-sunken hover:text-ink"
              }`}
            >
              <IconeLapis />
              {editando ? "Editando" : "Editar"}
            </button>
          </div>

          {editando ? (
            <textarea
              ref={areaRef}
              className="field min-h-[8.75rem] resize-y"
              value={corrigido}
              onChange={(e) => setCorrigido(e.target.value)}
              onBlur={() => setEditando(false)}
            />
          ) : (
            <div className="text-body rounded-control border border-line bg-surface-card p-3.5 min-h-[8.75rem] whitespace-pre-wrap">
              {carregando ? (
                <span className="text-ink-muted">Corrigindo...</span>
              ) : (
                corrigido || (
                  <span className="text-ink-muted">Sem versão corrigida.</span>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn-primary" onClick={salvar}>
          Salvar depoimento
        </button>
      </div>

      <ConfirmarDialogo
        aberto={confirmandoAutorizacao}
        titulo={
          autorizado ? "Marcar como não autorizado?" : "Marcar como autorizado?"
        }
        descricao={
          autorizado
            ? `${registro.nome} deixará de aparecer para produção de design e não deve virar post.`
            : `Confirme que ${registro.nome} autorizou publicar nome, foto e depoimento. Marcar sem autorização real expõe o aluno.`
        }
        textoConfirmar={autorizado ? "Sim, remover" : "Sim, autorizar"}
        perigo={!autorizado}
        onConfirmar={() => {
          onAtualizar(registro.id, { autoriza_postagem: !autorizado });
          setConfirmandoAutorizacao(false);
        }}
        onCancelar={() => setConfirmandoAutorizacao(false)}
      />
    </>
  );
}

function IconeLapis() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.6 2.1a1.4 1.4 0 0 1 2 2L5 10.7l-2.6.7.7-2.6 6.5-6.7Z" />
    </svg>
  );
}
