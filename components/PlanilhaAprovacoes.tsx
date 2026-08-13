"use client";

import { ETAPAS } from "@/lib/supabase";
import type { Aprovacao, StatusAprovacao } from "@/lib/supabase";
import { Interruptor } from "./Interruptor";

const COLUNAS = [
  "Nome",
  "E-mail",
  "Curso",
  "Faculdade",
  "Status",
  "Autoriza post",
  "Responsável",
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

// Visualizacao densa, estilo planilha. Status e autorizacao sao editaveis
// direto na linha; o resto vem do aluno e e somente leitura.
export function PlanilhaAprovacoes({
  aprovacoes,
  responsaveis,
  onAtualizar,
}: {
  aprovacoes: Aprovacao[];
  responsaveis: string[];
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
          celulaCsv(
            ETAPAS.find((e) => e.id === a.status)?.titulo ?? a.status
          ),
          celulaCsv(a.autoriza_postagem ? "Sim" : "Não"),
          celulaCsv(a.responsavel ?? ""),
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
          uma linha por envio
        </p>
        <button className="btn-ghost py-2" onClick={exportarCsv}>
          Exportar CSV
        </button>
      </div>

      {/* A tabela rola dentro do próprio container; a página nunca rola na
          horizontal. */}
      <div className="overflow-x-auto rounded-card border border-line bg-surface-card">
        <table className="w-full min-w-[56rem] border-collapse">
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
                className={`border-b border-line last:border-0 transition-colors hover:bg-surface-sunken/50 ${
                  a.autoriza_postagem ? "" : "bg-danger-bg/30"
                }`}
              >
                <td className="text-body whitespace-nowrap px-3 py-2 font-medium">
                  {a.nome}
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
                    className="text-caption text-ink rounded-control border border-line bg-surface-card px-2 py-1 outline-none focus:border-brand-500"
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
                  <Interruptor
                    ligado={a.autoriza_postagem}
                    onMudar={(v) => onAtualizar(a.id, { autoriza_postagem: v })}
                    rotulo={`${a.nome} autoriza a publicação`}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    className="text-caption text-ink rounded-control border border-line bg-surface-card px-2 py-1 outline-none focus:border-brand-500"
                    value={a.responsavel || ""}
                    onChange={(e) =>
                      onAtualizar(a.id, { responsavel: e.target.value })
                    }
                    aria-label={`Responsável por ${a.nome}`}
                  >
                    <option value="">—</option>
                    {responsaveis.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
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
