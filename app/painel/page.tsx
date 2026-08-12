"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigurado } from "@/lib/supabase";
import type { Aprovacao, StatusAprovacao } from "@/lib/supabase";
import { aprovacoesMock, responsaveis } from "@/lib/mock";
import { PainelHeader } from "@/components/PainelHeader";
import { CardAprovacao } from "@/components/CardAprovacao";
import { DetalheAluno } from "@/components/DetalheAluno";
import { Checklists } from "@/components/Checklists";

// Senha simples so para demonstracao (V1). A troca por auth real do
// Supabase esta documentada no README como proximo passo.
const SENHA_DEMO =
  process.env.NEXT_PUBLIC_SENHA_PAINEL || "assaad2026";

type Aba = "fila" | "checklists";

export default function Painel() {
  const [autorizado, setAutorizado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);

  const [aba, setAba] = useState<Aba>("fila");
  const [dados, setDados] = useState<Aprovacao[]>([]);
  const [selecionado, setSelecionado] = useState<Aprovacao | null>(null);
  const [fCurso, setFCurso] = useState("");
  const [fFac, setFFac] = useState("");
  const [fStatus, setFStatus] = useState("");

  useEffect(() => {
    async function carregar() {
      if (supabaseConfigurado && supabase) {
        const { data } = await supabase
          .from("aprovacoes")
          .select("*")
          .order("criado_em", { ascending: false });
        setDados((data as Aprovacao[]) || []);
      } else {
        setDados(aprovacoesMock);
      }
    }
    if (autorizado) carregar();
  }, [autorizado]);

  const cursos = useMemo(
    () => Array.from(new Set(dados.map((d) => d.curso))),
    [dados]
  );
  const faculdades = useMemo(
    () => Array.from(new Set(dados.map((d) => d.faculdade))),
    [dados]
  );

  const filtrados = dados.filter(
    (d) =>
      (!fCurso || d.curso === fCurso) &&
      (!fFac || d.faculdade === fFac) &&
      (!fStatus || d.status === fStatus)
  );

  function atualizar(id: string, patch: Partial<Aprovacao>) {
    setDados((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    setSelecionado((s) => (s && s.id === id ? { ...s, ...patch } : s));
    if (supabaseConfigurado && supabase) {
      supabase.from("aprovacoes").update(patch).eq("id", id);
    }
  }

  if (!autorizado) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm items-center px-5">
        <div className="card w-full p-6">
          <h1 className="text-title">Painel da equipe</h1>
          <p className="text-body text-ink-soft mt-1 mb-4">
            Digite a senha de acesso.
          </p>
          <input
            type="password"
            className="field"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErroSenha(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (senha === SENHA_DEMO) setAutorizado(true);
                else setErroSenha(true);
              }
            }}
            placeholder="Senha"
          />
          {erroSenha && (
            <p className="text-caption text-warning-fg mt-2">Senha incorreta.</p>
          )}
          <button
            className="btn-primary mt-4 w-full justify-center"
            onClick={() =>
              senha === SENHA_DEMO ? setAutorizado(true) : setErroSenha(true)
            }
          >
            Entrar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <PainelHeader
        aba={aba}
        onAba={setAba}
        total={dados.length}
        pendentes={dados.filter((d) => d.status === "pendente").length}
      />

      {aba === "fila" && (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-label text-ink-soft">Filtros</span>
            <select className="field w-auto" value={fCurso} onChange={(e) => setFCurso(e.target.value)}>
              <option value="">Todos os cursos</option>
              {cursos.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select className="field w-auto" value={fFac} onChange={(e) => setFFac(e.target.value)}>
              <option value="">Toda faculdade</option>
              {faculdades.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <select className="field w-auto" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
              <option value="">Todos status</option>
              <option value="pendente">Pendente</option>
              <option value="design_pronto">Design pronto</option>
              <option value="postado">Postado</option>
            </select>
          </div>

          <div className="grid gap-3">
            {filtrados.map((a) => (
              <CardAprovacao key={a.id} aprovacao={a} onClick={() => setSelecionado(a)} />
            ))}
            {filtrados.length === 0 && (
              <p className="text-body text-ink-muted py-8 text-center">
                Nenhuma aprovacao com esses filtros.
              </p>
            )}
          </div>
        </>
      )}

      {aba === "checklists" && <Checklists responsaveis={responsaveis} />}

      {selecionado && (
        <DetalheAluno
          aprovacao={selecionado}
          responsaveis={responsaveis}
          onFechar={() => setSelecionado(null)}
          onAtualizar={atualizar}
        />
      )}
    </main>
  );
}
