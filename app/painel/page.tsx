"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { supabase, supabaseConfigurado, ETAPAS } from "@/lib/supabase";
import type { Aprovacao } from "@/lib/supabase";
import { agruparPorEmail } from "@/lib/agrupar";
import { aprovacoesMock, responsaveis } from "@/lib/mock";
import { PainelHeader } from "@/components/PainelHeader";
import { CardAprovacao } from "@/components/CardAprovacao";
import { DetalheAluno } from "@/components/DetalheAluno";
import { Checklists } from "@/components/Checklists";
import { KanbanAprovacoes } from "@/components/KanbanAprovacoes";
import { PlanilhaAprovacoes } from "@/components/PlanilhaAprovacoes";

// Senha simples só para demonstração (V1). A troca por auth real do
// Supabase está documentada no README como próximo passo.
const SENHA_DEMO = process.env.NEXT_PUBLIC_SENHA_PAINEL || "assaad2026";

type Aba = "fila" | "checklists";
type Visao = "lista" | "kanban" | "planilha";

const VISOES: { id: Visao; titulo: string }[] = [
  { id: "lista", titulo: "Lista" },
  { id: "kanban", titulo: "Kanban" },
  { id: "planilha", titulo: "Planilha" },
];

export default function Painel() {
  const [autorizado, setAutorizado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);

  const [aba, setAba] = useState<Aba>("fila");
  const [visao, setVisao] = useState<Visao>("lista");
  const [dados, setDados] = useState<Aprovacao[]>([]);
  // Guarda o e-mail, não o objeto: assim o detalhe sempre reflete os dados
  // atuais do aluno depois de uma edição.
  const [emailAberto, setEmailAberto] = useState<string | null>(null);
  const [fCurso, setFCurso] = useState("");
  const [fFac, setFFac] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fAutoriza, setFAutoriza] = useState("");
  const reduzMovimento = useReducedMotion();

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
      (!fStatus || d.status === fStatus) &&
      (!fAutoriza ||
        (fAutoriza === "sim" ? d.autoriza_postagem : !d.autoriza_postagem))
  );

  // A lista agrupa por aluno; Kanban e planilha trabalham envio a envio,
  // porque status e autorização pertencem ao depoimento, não à pessoa.
  const grupos = agruparPorEmail(filtrados);
  const grupoAberto = grupos.find((g) => g.email === emailAberto) || null;

  function atualizar(id: string, patch: Partial<Aprovacao>) {
    setDados((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    if (supabaseConfigurado && supabase) {
      supabase.from("aprovacoes").update(patch).eq("id", id);
    }
  }

  function entrar() {
    if (senha === SENHA_DEMO) setAutorizado(true);
    else setErroSenha(true);
  }

  if (!autorizado) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 py-10">
        <motion.div
          className="card p-6 sm:p-7"
          initial={reduzMovimento ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        >
          <p className="text-label text-brand-600 font-semibold">
            Assaad Educação
          </p>
          <h1 className="text-display mt-1">Painel da equipe</h1>
          <p className="text-body text-ink-soft mb-5 mt-2">
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
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            placeholder="Senha"
          />
          {erroSenha && (
            <p className="text-caption text-danger-fg mt-2">Senha incorreta.</p>
          )}
          <button className="btn-primary mt-4 w-full py-3" onClick={entrar}>
            Entrar
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PainelHeader
        aba={aba}
        onAba={setAba}
        alunos={agruparPorEmail(dados).length}
        pendentes={dados.filter((d) => d.status === "pendente").length}
        semAutorizacao={dados.filter((d) => !d.autoriza_postagem).length}
      />

      {aba === "fila" && (
        <>
          {/* Seletor de visualização. */}
          <div className="mb-4 inline-flex gap-1 rounded-pill bg-surface-sunken p-1">
            {VISOES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVisao(v.id)}
                className={`relative rounded-pill px-4 py-1.5 text-label transition-colors ${
                  visao === v.id ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {visao === v.id && (
                  <motion.span
                    layoutId="visao-indicador"
                    className="absolute inset-0 rounded-pill bg-surface-card shadow-card"
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  />
                )}
                <span className="relative">{v.titulo}</span>
              </button>
            ))}
          </div>

          <div className="mb-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <span className="text-label text-ink-soft sm:mr-1">Filtros</span>
            <select
              className="field sm:w-auto"
              value={fCurso}
              onChange={(e) => setFCurso(e.target.value)}
              aria-label="Filtrar por curso"
            >
              <option value="">Todos os cursos</option>
              {cursos.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              className="field sm:w-auto"
              value={fFac}
              onChange={(e) => setFFac(e.target.value)}
              aria-label="Filtrar por faculdade"
            >
              <option value="">Toda faculdade</option>
              {faculdades.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <select
              className="field sm:w-auto"
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              aria-label="Filtrar por status"
            >
              <option value="">Todos os status</option>
              {ETAPAS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.titulo}
                </option>
              ))}
            </select>
            <select
              className="field sm:w-auto"
              value={fAutoriza}
              onChange={(e) => setFAutoriza(e.target.value)}
              aria-label="Filtrar por autorização de postagem"
            >
              <option value="">Autoriza post: todos</option>
              <option value="sim">Autoriza post: sim</option>
              <option value="nao">Autoriza post: não</option>
            </select>
          </div>

          {visao === "lista" && (
            <div className="grid gap-3">
              {grupos.map((g) => (
                <CardAprovacao
                  key={g.email}
                  grupo={g}
                  onClick={() => setEmailAberto(g.email)}
                />
              ))}
              {grupos.length === 0 && <Vazio />}
            </div>
          )}

          {visao === "kanban" && (
            <KanbanAprovacoes
              aprovacoes={filtrados}
              onAbrir={setEmailAberto}
              onAtualizar={atualizar}
            />
          )}

          {visao === "planilha" && (
            <PlanilhaAprovacoes
              aprovacoes={filtrados}
              responsaveis={responsaveis}
              onAtualizar={atualizar}
            />
          )}
        </>
      )}

      {aba === "checklists" && <Checklists />}

      <AnimatePresence>
        {grupoAberto && (
          <DetalheAluno
            key={grupoAberto.email}
            grupo={grupoAberto}
            responsaveis={responsaveis}
            onFechar={() => setEmailAberto(null)}
            onAtualizar={atualizar}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function Vazio() {
  return (
    <p className="text-body text-ink-muted py-10 text-center">
      Nenhuma aprovação com esses filtros.
    </p>
  );
}
