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
import { Interruptor } from "@/components/Interruptor";

export default function FormularioAluno() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroEmail, setErroEmail] = useState<string | null>(null);
  const [autoriza, setAutoriza] = useState(true);
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

  // Validação inline: avisa ao sair do campo, não só no envio.
  function validarEmail() {
    if (!form.email.trim()) {
      setErroEmail(null);
      return;
    }
    setErroEmail(emailValido(form.email) ? null : "E-mail inválido.");
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
      setErro("Preencha nome, e-mail, curso, faculdade e depoimento.");
      return;
    }
    if (!emailValido(form.email)) {
      setErroEmail("E-mail inválido.");
      setErro("Confira o e-mail antes de enviar.");
      return;
    }
    setEnviando(true);

    if (supabaseConfigurado && supabase) {
      // Os arquivos escolhidos ainda não são enviados: foto_url e
      // comprovante_url ficam nulos até o Supabase Storage entrar (V2).
      const { error } = await supabase.from("aprovacoes").insert({
        nome: form.nome,
        email: normalizarEmail(form.email),
        curso: form.curso,
        faculdade: form.faculdade,
        depoimento_original: form.depoimento,
        autoriza_postagem: autoriza,
        status: "pendente",
      });
      if (error) {
        setErro("Não foi possível enviar. Tente novamente.");
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
      {/* pr-14: espaço para o botão de tema, que é fixo no canto. */}
      <motion.header
        className="mb-8 pr-14"
        initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
      >
        <p className="text-label text-brand-600 font-semibold">
          Assaad Educação
        </p>
        <h1 className="text-hero mt-2">Conte sua aprovação</h1>
        <p className="text-body text-ink-soft mt-3 max-w-md">
          Sua história inspira quem ainda está estudando. Preencha abaixo e
          nossa equipe cuida do resto.
        </p>
      </motion.header>

      <motion.div
        className="card space-y-5 p-5 sm:p-7"
        initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.08 }}
      >
        <Campo label="Nome completo" obrigatorio>
          <input
            className="field"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            placeholder="Como você quer aparecer no mural"
          />
        </Campo>

        <Campo label="E-mail" obrigatorio>
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
            <span className="text-caption text-danger-fg mt-1.5 block">
              {erroEmail}
            </span>
          ) : (
            <span className="text-caption text-ink-muted mt-1.5 block">
              Use o mesmo e-mail se quiser enviar outra aprovação depois.
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
            placeholder="Conte como foi sua jornada até a aprovação."
          />
        </Campo>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <CampoUpload
            label="Sua foto"
            accept="image/*"
            dica="JPG ou PNG, até 5 MB"
          />
          <CampoUpload
            label="Comprovante de aprovação"
            accept="image/*,application/pdf"
            dica="Print, foto ou PDF, até 5 MB"
          />
        </div>

        {/* Consentimento explícito. Sem isso a equipe não produz o card. */}
        <div className="rounded-control border border-line bg-surface-sunken/60 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-label">Autorizo a publicação</p>
              <p className="text-caption text-ink-soft mt-1">
                A Assaad pode publicar meu nome, minha foto e meu depoimento
                nas redes sociais e no mural.
              </p>
            </div>
            <Interruptor
              ligado={autoriza}
              onMudar={setAutoriza}
              rotulo="Autorizo a publicação do meu depoimento"
            />
          </div>
          {!autoriza && (
            <p className="text-caption text-ink-muted mt-3">
              Sem a autorização seu depoimento ainda chega até nós, mas não
              vira post.
            </p>
          )}
        </div>

        {erro && <p className="text-caption text-danger-fg">{erro}</p>}

        <button
          className="btn-primary w-full py-3"
          onClick={enviar}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar minha aprovação"}
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
        {obrigatorio && <span className="text-brand-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
