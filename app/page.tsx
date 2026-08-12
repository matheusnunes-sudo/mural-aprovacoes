"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, supabaseConfigurado } from "@/lib/supabase";

export default function FormularioAluno() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "",
    curso: "",
    faculdade: "",
    cidade: "",
    uf: "",
    depoimento: "",
  });

  function set(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function enviar() {
    setErro(null);
    if (!form.nome || !form.curso || !form.faculdade || !form.depoimento) {
      setErro("Preencha nome, curso, faculdade e depoimento.");
      return;
    }
    setEnviando(true);

    if (supabaseConfigurado && supabase) {
      const { error } = await supabase.from("aprovacoes").insert({
        nome: form.nome,
        curso: form.curso,
        faculdade: form.faculdade,
        cidade: form.cidade,
        uf: form.uf,
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

        <div className="grid grid-cols-2 gap-4">
          <Campo label="Cidade">
            <input
              className="field"
              value={form.cidade}
              onChange={(e) => set("cidade", e.target.value)}
              placeholder="Salvador"
            />
          </Campo>
          <Campo label="Estado">
            <input
              className="field"
              value={form.uf}
              onChange={(e) => set("uf", e.target.value.toUpperCase())}
              maxLength={2}
              placeholder="BA"
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

        <div className="rounded-control bg-surface-sunken p-4 text-caption text-ink-soft">
          O upload de foto e comprovante entra na V2 (depende do Supabase
          Storage). No MVP, a equipe anexa manualmente.
        </div>

        {erro && (
          <p className="text-caption text-warning-fg">{erro}</p>
        )}

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
