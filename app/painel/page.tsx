"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { supabase, supabaseConfigurado, ETAPAS, TIPOS } from "@/lib/supabase";
import type { Registro, TipoRegistro } from "@/lib/supabase";
import { agruparPorEmail } from "@/lib/agrupar";
import { ordenarPorAcertos, ordenarPorRecentes } from "@/lib/formato";
import { registrosMock } from "@/lib/mock";
import { PainelHeader } from "@/components/PainelHeader";
import type { AbaPainel } from "@/components/PainelHeader";
import { CardRegistro } from "@/components/CardRegistro";
import { DetalheAluno } from "@/components/DetalheAluno";
import { Checklists } from "@/components/Checklists";
import { KanbanRegistros } from "@/components/KanbanRegistros";
import { PlanilhaRegistros } from "@/components/PlanilhaRegistros";
import { ModalFigma } from "@/components/ModalFigma";

// Senha simples só para demonstração (V1). A troca por auth real do
// Supabase está documentada no README como próximo passo.
const SENHA_DEMO = process.env.NEXT_PUBLIC_SENHA_PAINEL || "assaad2026";

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

  // A aba diz o momento do ano (acertos do ENEM ou aprovações do SISU) —
  // são trabalhos diferentes e nunca se misturam na mesma tela.
  const [aba, setAba] = useState<AbaPainel>("aprovacao");
  const [visao, setVisao] = useState<Visao>("lista");
  const [dados, setDados] = useState<Registro[]>([]);
  // Guarda o e-mail, não o objeto: assim o detalhe sempre reflete os dados
  // atuais do aluno depois de uma edição.
  const [emailAberto, setEmailAberto] = useState<string | null>(null);
  const [figmaAberto, setFigmaAberto] = useState(false);
  const [fCurso, setFCurso] = useState("");
  const [fFac, setFFac] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fAutoriza, setFAutoriza] = useState("");
  const [ordem, setOrdem] = useState<"acertos" | "recentes">("acertos");
  const reduzMovimento = useReducedMotion();

  useEffect(() => {
    async function carregar() {
      if (supabaseConfigurado && supabase) {
        const { data } = await supabase
          .from("aprovacoes")
          .select("*")
          .order("criado_em", { ascending: false });
        setDados((data as Registro[]) || []);
      } else {
        setDados(registrosMock);
      }
    }
    if (autorizado) carregar();
  }, [autorizado]);

  const tipo: TipoRegistro = aba === "acerto" ? "acerto" : "aprovacao";
  const doTipo = useMemo(
    () => dados.filter((d) => d.tipo === tipo),
    [dados, tipo]
  );

  const cursos = useMemo(
    () => Array.from(new Set(doTipo.map((d) => d.curso).filter(Boolean))),
    [doTipo]
  );
  const faculdades = useMemo(
    () => Array.from(new Set(doTipo.map((d) => d.faculdade).filter(Boolean))),
    [doTipo]
  );

  const filtrados = doTipo.filter(
    (d) =>
      (tipo !== "aprovacao" || !fCurso || d.curso === fCurso) &&
      (tipo !== "aprovacao" || !fFac || d.faculdade === fFac) &&
      (!fStatus || d.status === fStatus) &&
      (!fAutoriza ||
        (fAutoriza === "sim" ? d.autoriza_postagem : !d.autoriza_postagem))
  );

  // Na semana do ENEM a equipe posta os melhores primeiro, então a ordem
  // padrão é por acertos. Nas aprovações, o mais recente é o que interessa.
  // A ordem é sempre explícita aqui — `agruparPorEmail` só preserva a que
  // receber.
  const ordenados =
    tipo === "acerto" && ordem === "acertos"
      ? ordenarPorAcertos(filtrados)
      : ordenarPorRecentes(filtrados);

  // A lista agrupa por aluno; Kanban e planilha trabalham envio a envio,
  // porque status, autorização e selos pertencem ao registro.
  const grupos = agruparPorEmail(ordenados);
  const grupoAberto = grupos.find((g) => g.email === emailAberto) || null;

  function atualizar(id: string, patch: Partial<Registro>) {
    setDados((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    if (supabaseConfigurado && supabase) {
      supabase.from("aprovacoes").update(patch).eq("id", id);
    }
  }

  function trocarAba(nova: AbaPainel) {
    setAba(nova);
    // Filtros de um momento não fazem sentido no outro.
    setFCurso("");
    setFFac("");
    setEmailAberto(null);
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

  const rotuloTipo = TIPOS.find((t) => t.id === tipo)!;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PainelHeader
        aba={aba}
        onAba={trocarAba}
        alunos={agruparPorEmail(doTipo).length}
        pendentes={doTipo.filter((d) => d.status === "pendente").length}
        semAutorizacao={doTipo.filter((d) => !d.autoriza_postagem).length}
      />

      {aba !== "checklists" && (
        <>
          <p className="text-caption text-ink-muted mb-4">
            {rotuloTipo.descricao}
          </p>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* Seletor de visualização. */}
            <div className="inline-flex gap-1 rounded-pill bg-surface-sunken p-1">
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

            <button
              className="btn-ghost py-2 sm:ml-auto"
              onClick={() => setFigmaAberto(true)}
            >
              Enviar para o Figma
            </button>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <span className="text-label text-ink-soft sm:mr-1">Filtros</span>

            {tipo === "aprovacao" ? (
              <>
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
              </>
            ) : (
              <select
                className="field sm:w-auto"
                value={ordem}
                onChange={(e) =>
                  setOrdem(e.target.value as "acertos" | "recentes")
                }
                aria-label="Ordenar registros"
              >
                <option value="acertos">Mais acertos primeiro</option>
                <option value="recentes">Mais recentes primeiro</option>
              </select>
            )}

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
                <CardRegistro
                  key={g.email}
                  grupo={g}
                  onClick={() => setEmailAberto(g.email)}
                />
              ))}
              {grupos.length === 0 && <Vazio />}
            </div>
          )}

          {visao === "kanban" && (
            <KanbanRegistros
              registros={ordenados}
              onAbrir={setEmailAberto}
              onAtualizar={atualizar}
            />
          )}

          {visao === "planilha" && (
            <PlanilhaRegistros
              registros={ordenados}
              tipo={tipo}
              onAbrir={setEmailAberto}
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
            onFechar={() => setEmailAberto(null)}
            onAtualizar={atualizar}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {figmaAberto && (
          <ModalFigma
            key="figma"
            registros={ordenados}
            tipo={tipo}
            onFechar={() => setFigmaAberto(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function Vazio() {
  return (
    <p className="text-body text-ink-muted py-10 text-center">
      Nenhum registro com esses filtros.
    </p>
  );
}
