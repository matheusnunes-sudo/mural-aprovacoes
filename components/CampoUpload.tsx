"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// DEMONSTRACAO: o arquivo escolhido fica apenas no navegador (preview local)
// e nao e enviado a lugar nenhum. Para persistir de verdade, ligar no
// Supabase Storage e gravar a URL em foto_url / comprovante_url.
// Ver roadmap no CLAUDE.md.

const TAMANHO_MAX = 5 * 1024 * 1024; // 5 MB

export function CampoUpload({
  label,
  accept,
  dica,
  onArquivo,
}: {
  label: string;
  accept: string;
  dica: string;
  onArquivo?: (arquivo: File | null) => void;
}) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduzMovimento = useReducedMotion();

  // Preview so faz sentido para imagem; PDF aparece como cartao de arquivo.
  useEffect(() => {
    if (!arquivo || !arquivo.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(arquivo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [arquivo]);

  function receber(f: File | undefined | null) {
    if (!f) return;
    if (f.size > TAMANHO_MAX) {
      setErro("Arquivo maior que 5 MB. Escolha um menor.");
      return;
    }
    setErro(null);
    setArquivo(f);
    onArquivo?.(f);
  }

  function limpar() {
    setArquivo(null);
    setErro(null);
    onArquivo?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="text-label text-ink-soft mb-1.5 block">{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => receber(e.target.files?.[0])}
      />

      <AnimatePresence mode="wait" initial={false}>
        {!arquivo ? (
          <motion.button
            key="zona"
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastando(false);
              receber(e.dataTransfer.files?.[0]);
            }}
            whileTap={reduzMovimento ? undefined : { scale: 0.99 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className={`flex w-full flex-col items-center justify-center gap-1 rounded-control border border-dashed px-4 py-6 text-center transition-colors ${
              arrastando
                ? "border-brand-500 bg-brand-50"
                : "border-line-strong bg-surface-sunken hover:border-brand-500"
            }`}
          >
            <IconeUpload />
            <span className="text-label text-ink">
              Escolher arquivo ou arrastar aqui
            </span>
            <span className="text-caption text-ink-muted">{dica}</span>
          </motion.button>
        ) : (
          <motion.div
            key="arquivo"
            initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduzMovimento ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="flex items-center gap-3 rounded-control border border-line bg-surface-card p-2.5"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-ink-soft">
                <IconeArquivo />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="text-body block truncate">{arquivo.name}</span>
              <span className="text-caption text-ink-muted">
                {(arquivo.size / 1024).toFixed(0)} KB
              </span>
            </span>
            <motion.button
              type="button"
              onClick={limpar}
              whileTap={reduzMovimento ? undefined : { scale: 0.9 }}
              className="rounded-control px-2.5 py-1.5 text-label text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              Remover
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {erro && <p className="text-caption text-warning-fg mt-1.5">{erro}</p>}
    </div>
  );
}

function IconeUpload() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink-muted mb-0.5"
      aria-hidden
    >
      <path d="M10 13V3.5M10 3.5 6.5 7M10 3.5 13.5 7" />
      <path d="M3.5 13v2.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V13" />
    </svg>
  );
}

function IconeArquivo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11.5 2.5H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6z" />
      <path d="M11.5 2.5V6H15" />
    </svg>
  );
}
