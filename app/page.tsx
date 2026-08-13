"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  supabase,
  supabaseConfigurado,
  emailValido,
  normalizarEmail,
} from "@/lib/supabase";
import { CampoUpload } from "@/components/CampoUpload";
import { TemaToggle } from "@/components/TemaToggle";

export default function FormularioAluno() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroEmail, setErroEmail] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    curso: "",
    faculdade: "",
    depoimento: "",
  });
  const reduzMovimento = useReducedMotion();

  function set(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // Validacao inline: avisa ao sair do campo, nao so no envio.
  function validarEmail() {
    if (!form.email.trim()) {
      setErroEmail(null);
      return;
    }
    setErroEmail(emailValido(form.email) ? null : "Email invalido.");
  }

  async function enviar() {
    setErro(null);
    if (
      !form.nome ||
      !form.email ||
      !form.curso ||
      !form.faculdade ||
      !form.depoimento
    ) {
      setErro("Preencha nome, email, curso, faculdade e depoimento.");
      return;
    }
    if (!emailValido(form.email)) {
      setErroEmail("Email invalido.");
      setErro("Confira o email antes de enviar.");
      return;
    }
    setEnviando(true);

    if (supabaseConfigurado && supabase) {
      // Os arquivos escolhidos ainda nao sao enviados: foto_url e
      // comprovante_url ficam nulos ate o Supabase Storage entrar (V2).
      const { error } = await supabase.from("aprovacoes").insert({
        nome: form.nome,
        email: normalizarEmail(form.email),
        curso: form.curso,
        faculdade: form.faculdade,
        depoimento_original: form.depoimento,
        status: "pendente",
      });
      if (error) {
        setErro("Nao foi possivel enviar. Tente novamente.");
        setEnviando(false);
        return;
      }
    } else {
      // Modo demo sem backend: apenas simula o envio.
      await new Promise((r) => setTimeout(r, 600));
    }

    router.push("/obrigado");
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-14">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-label text-gradient font-semibold">
          Assaad Educacao
        </p>
        <TemaToggle />
      </div>

      <motion.header
        className="mb-8"
        initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
      >
        <h1 className="text-hero">
          Conte sua <span className="text-gradient">aprovacao</span>
        </h1>
        <p className="text-body text-ink-soft mt-3 max-w-md">
          Sua historia inspira quem ainda esta estudando. Preencha abaixo e
          nossa equipe cuida do resto.
        </p>
      </motion.header>

      <motion.div
        className="glass space-y-5 p-5 sm:p-7"
        initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.08 }}
      >
        <Campo label="Nome completo" obrigatorio>
          <input
            className="field"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            placeholder="Como voce quer aparecer no mural"
          />
        </Campo>

        <Campo label="Email" obrigatorio>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            className="field"
            value={form.email}
            onChange={(e) => {
              set("email", e.target.value);
              if (erroEmail) setErroEmail(null);
            }}
            onBlur={validarEmail}
            placeholder="voce@email.com"
          />
          {erroEmail ? (
            <span className="text-caption text-warning-fg mt-1.5 block">
              {erroEmail}
            </span>
          ) : (
            <span className="text-caption text-ink-muted mt-1.5 block">
              Use o mesmo email se quiser enviar outra aprovacao depois.
            </span>
          )}
        </Campo>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Campo label="Curso" obrigatorio>
            <input
              className="field"
              value={form.curso}
              onChange={(e) => set("curso", e.target.value)}
              placeholder="Medicina"
            />
          </Campo>
          <Campo label="Faculdade" obrigatorio>
            <input
              className="field"
              value={form.faculdade}
              onChange={(e) => set("faculdade", e.target.value)}
              placeholder="UFBA"
            />
          </Campo>
        </div>

        <Campo label="Seu depoimento" obrigatorio>
          <textarea
            className="field min-h-[7.5rem] resize-y"
            value={form.depoimento}
            onChange={(e) => set("depoimento", e.target.value)}
            placeholder="Conte como foi sua jornada ate a aprovacao."
          />
        </Campo>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <CampoUpload
            label="Sua foto"
            accept="image/*"
            dica="JPG ou PNG, ate 5 MB"
          />
          <CampoUpload
            label="Comprovante de aprovacao"
            accept="image/*,application/pdf"
            dica="Print, foto ou PDF, ate 5 MB"
          />
        </div>

        {erro && <p className="text-caption text-warning-fg">{erro}</p>}

        <button
          className="btn-primary w-full py-3"
          onClick={enviar}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar minha aprovacao"}
        </button>
      </motion.div>
    </main>
  );
}

function Campo({
  label,
  children,
  obrigatorio,
}: {
  label: string;
  children: React.ReactNode;
  obrigatorio?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-label text-ink-soft mb-2 block">
        {label}
        {obrigatorio && <span className="text-accent-mid"> *</span>}
      </span>
      {children}
    </label>
  );
}
