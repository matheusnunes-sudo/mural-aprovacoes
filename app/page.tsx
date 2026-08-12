"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  supabase,
  supabaseConfigurado,
  emailValido,
  normalizarEmail,
} from "@/lib/supabase";
import { CampoUpload } from "@/components/CampoUpload";

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
    if (!form.nome || !form.email || !form.curso || !form.faculdade || !form.depoimento) {
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
    <main className="mx-auto max-w-xl px-5 py-12">
      <header className="mb-8">
        <p className="text-label text-brand-600">Assaad Educacao</p>
        <h1 className="text-display mt-1">Conte sua aprovacao</h1>
        <p className="text-body text-ink-soft mt-2">
          Sua historia inspira quem ainda esta estudando. Preencha abaixo e
          nossa equipe cuida do resto.
        </p>
      </header>

      <div className="card p-6 space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
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
            className="field min-h-[120px] resize-y"
            value={form.depoimento}
            onChange={(e) => set("depoimento", e.target.value)}
            placeholder="Conte como foi sua jornada ate a aprovacao."
          />
        </Campo>

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

        {erro && <p className="text-caption text-warning-fg">{erro}</p>}

        <button
          className="btn-primary w-full justify-center"
          onClick={enviar}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar minha aprovacao"}
        </button>
      </div>
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
      <span className="text-label text-ink-soft mb-1.5 block">
        {label}
        {obrigatorio && <span className="text-brand-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
