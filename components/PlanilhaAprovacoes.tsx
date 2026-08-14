"use client";

import { ETAPAS } from "@/lib/supabase";
import type { Aprovacao, StatusAprovacao } from "@/lib/supabase";
import { SeloAutorizacao } from "./SeloAutorizacao";
import { CORES_ETAPA, tituloEtapa } from "./SeloStatus";

const COLUNAS = [
  "Nome",
  "E-mail",
  "Curso",
  "Faculdade",
  "Status",
  "Autoriza post",
  "Selos",
  "Enviado em",
];

function dataHora(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Escapa um valor para CSV: aspas dobradas e o campo inteiro entre aspas.
function celulaCsv(valor: string | number | boolean) {
  return `"${String(valor).replace(/"/g, '""')}"`;
}

// Visualizacao densa, estilo planilha. Só o status é editável direto na
// linha. A autorização NÃO é: ela é a resposta do aluno, e um clique errado
// numa grade densa exporia alguém que não autorizou. Para mudá-la, abra o
// detalhe (clique no nome) e confirme.
export function PlanilhaAprovacoes({
  aprovacoes,
  onAbrir,
  onAtualizar,
}: {
  aprovacoes: Aprovacao[];
  onAbrir: (email: string) => void;
  onAtualizar: (id: string, patch: Partial<Aprovacao>) => void;
}) {
  function exportarCsv() {
    const linhas = [
      COLUNAS.map(celulaCsv).join(","),
      ...aprovacoes.map((a) =>
        [
          celulaCsv(a.nome),
          celulaCsv(a.email),
          celulaCsv(a.curso),
          celulaCsv(a.faculdade),
          celulaCsv(tituloEtapa(a.status)),
          celulaCsv(a.autoriza_postagem ? "Sim" : "Não"),
          celulaCsv(a.selos.join("; ")),
          celulaCsv(dataHora(a.criado_em)),
        ].join(",")
      ),
    ].join("\n");

    // BOM no inicio para o Excel abrir os acentos corretamente.
    const blob = new Blob([`﻿${linhas}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aprovacoes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-ink-soft">
          {aprovacoes.length} depoimento{aprovacoes.length === 1 ? "" : "s"} ·
          clique no nome para abrir
        </p>
        <button className="btn-ghost py-2" onClick={exportarCsv}>
          Exportar CSV
        </button>
      </div>

      {/* A tabela rola dentro do próprio container; a página nunca rola na
          horizontal. */}
      <div className="overflow-x-auto rounded-card border border-line bg-surface-card">
        <table className="w-full min-w-[58rem] border-collapse">
          <thead>
            <tr className="bg-surface-sunken">
              {COLUNAS.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="text-caption text-ink-soft whitespace-nowrap border-b border-line px-3 py-2.5 text-left font-medium"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {aprovacoes.map((a) => (
              <tr
                key={a.id}
                className="group border-b border-line transition-colors last:border-0 hover:bg-surface-sunken/60"
              >
                <td className="whitespace-nowrap px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onAbrir(a.email)}
                    className="text-body font-medium underline-offset-2 hover:underline"
                  >
                    {a.nome}
                  </button>
                </td>
                <td className="text-caption text-ink-soft whitespace-nowrap px-3 py-2">
                  {a.email}
                </td>
                <td className="text-body whitespace-nowrap px-3 py-2">
                  {a.curso}
                </td>
                <td className="text-body whitespace-nowrap px-3 py-2">
                  {a.faculdade}
                </td>
                <td className="px-3 py-2">
                  <select
                    className={`text-caption rounded-pill border-0 px-2.5 py-1 font-medium outline-none focus:ring-2 focus:ring-brand-500 ${
                      CORES_ETAPA[a.status].selo
                    }`}
                    value={a.status}
                    onChange={(e) =>
                      onAtualizar(a.id, {
                        status: e.target.value as StatusAprovacao,
                      })
                    }
                    aria-label={`Status de ${a.nome}`}
                  >
                    {ETAPAS.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.titulo}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  {/* Só leitura de propósito — ver comentário no topo. */}
                  <SeloAutorizacao autoriza={a.autoriza_postagem} />
                </td>
                <td className="px-3 py-2">
                  {a.selos.length > 0 ? (
                    <span className="text-caption text-ink-soft">
                      {a.selos.join(" · ")}
                    </span>
                  ) : (
                    <span className="text-caption text-ink-muted">—</span>
                  )}
                </td>
                <td className="text-caption text-ink-soft whitespace-nowrap px-3 py-2 tabular-nums">
                  {dataHora(a.criado_em)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {aprovacoes.length === 0 && (
          <p className="text-body text-ink-muted py-10 text-center">
            Nenhuma aprovação com esses filtros.
          </p>
        )}
      </div>
    </div>
  );
}
