"use client";

import { ETAPAS, MATERIAS, totalAcertos } from "@/lib/supabase";
import type { Registro, StatusRegistro, TipoRegistro } from "@/lib/supabase";
import { SeloAutorizacao } from "./SeloAutorizacao";
import { CORES_ETAPA, tituloEtapa } from "./SeloStatus";

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

// As colunas do meio mudam com o tipo: aprovação mostra curso/faculdade,
// acerto mostra o placar da prova.
function colunas(tipo: TipoRegistro): string[] {
  const meio =
    tipo === "aprovacao"
      ? ["Curso", "Faculdade"]
      : ["Dia 1", "Dia 2", "Total", ...MATERIAS.map((m) => m.curto)];
  return ["Nome", "E-mail", ...meio, "Status", "Autoriza post", "Selos", "Enviado em"];
}

function celulasMeio(r: Registro): (string | number)[] {
  if (r.tipo === "aprovacao") return [r.curso, r.faculdade];
  const t = totalAcertos(r.acertos);
  return [
    r.acertos?.dia1 ?? "",
    r.acertos?.dia2 ?? "",
    t ?? "",
    ...MATERIAS.map((m) => r.acertos?.materias[m.id] ?? ""),
  ];
}

// Visualizacao densa, estilo planilha. Só o status é editável direto na
// linha. A autorização NÃO é: ela é a resposta do aluno, e um clique errado
// numa grade densa exporia alguém que não autorizou. Para mudá-la, abra o
// detalhe (clique no nome) e confirme.
export function PlanilhaRegistros({
  registros,
  tipo,
  onAbrir,
  onAtualizar,
}: {
  registros: Registro[];
  tipo: TipoRegistro;
  onAbrir: (email: string) => void;
  onAtualizar: (id: string, patch: Partial<Registro>) => void;
}) {
  const cabecalhos = colunas(tipo);

  function exportarCsv() {
    const linhas = [
      cabecalhos.map(celulaCsv).join(","),
      ...registros.map((r) =>
        [
          celulaCsv(r.nome),
          celulaCsv(r.email),
          ...celulasMeio(r).map(celulaCsv),
          celulaCsv(tituloEtapa(r.status)),
          celulaCsv(r.autoriza_postagem ? "Sim" : "Não"),
          celulaCsv(r.selos.join("; ")),
          celulaCsv(dataHora(r.criado_em)),
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
    a.download = `${tipo}s-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-ink-soft">
          {registros.length} registro{registros.length === 1 ? "" : "s"} ·
          clique no nome para abrir
        </p>
        <button className="btn-ghost py-2" onClick={exportarCsv}>
          Exportar CSV
        </button>
      </div>

      {/* A tabela rola dentro do proprio container, nos dois eixos: a pagina
          nunca rola na horizontal, e com dezenas de linhas o cabecalho
          continua visivel (sticky) em vez de sumir no scroll. */}
      <div className="max-h-[70vh] overflow-auto rounded-card border border-line bg-surface-card">
        <table className="w-full min-w-[58rem] border-collapse">
          <thead>
            <tr className="bg-surface-sunken">
              {cabecalhos.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="text-caption text-ink-soft sticky top-0 z-10 whitespace-nowrap border-b border-line bg-surface-sunken px-3 py-2.5 text-left font-medium"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr
                key={r.id}
                className="border-b border-line transition-colors last:border-0 hover:bg-surface-sunken/60"
              >
                <td className="whitespace-nowrap px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onAbrir(r.email)}
                    className="text-body font-medium underline-offset-2 hover:underline"
                  >
                    {r.nome}
                  </button>
                </td>
                <td className="text-caption text-ink-soft whitespace-nowrap px-3 py-2">
                  {r.email}
                </td>

                {r.tipo === "aprovacao" ? (
                  <>
                    <td className="text-body whitespace-nowrap px-3 py-2">
                      {r.curso}
                    </td>
                    <td className="text-body whitespace-nowrap px-3 py-2">
                      {r.faculdade}
                    </td>
                  </>
                ) : (
                  <>
                    <CelulaNumero valor={r.acertos?.dia1 ?? null} />
                    <CelulaNumero valor={r.acertos?.dia2 ?? null} />
                    <CelulaNumero valor={totalAcertos(r.acertos)} forte />
                    {MATERIAS.map((m) => (
                      <CelulaNumero
                        key={m.id}
                        valor={r.acertos?.materias[m.id] ?? null}
                      />
                    ))}
                  </>
                )}

                <td className="px-3 py-2">
                  <select
                    className={`text-caption rounded-pill border-0 px-2.5 py-1 font-medium outline-none focus:ring-2 focus:ring-brand-500 ${
                      CORES_ETAPA[r.status].selo
                    }`}
                    value={r.status}
                    onChange={(e) =>
                      onAtualizar(r.id, {
                        status: e.target.value as StatusRegistro,
                      })
                    }
                    aria-label={`Status de ${r.nome}`}
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
                  <SeloAutorizacao autoriza={r.autoriza_postagem} />
                </td>
                <td className="px-3 py-2">
                  {r.selos.length > 0 ? (
                    <span className="text-caption text-ink-soft">
                      {r.selos.join(" · ")}
                    </span>
                  ) : (
                    <span className="text-caption text-ink-muted">—</span>
                  )}
                </td>
                <td className="text-caption text-ink-soft whitespace-nowrap px-3 py-2 tabular-nums">
                  {dataHora(r.criado_em)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {registros.length === 0 && (
          <p className="text-body text-ink-muted py-10 text-center">
            Nenhum registro com esses filtros.
          </p>
        )}
      </div>
    </div>
  );
}

function CelulaNumero({ valor, forte }: { valor: number | null; forte?: boolean }) {
  return (
    <td
      className={`whitespace-nowrap px-3 py-2 tabular-nums ${
        forte ? "text-body font-semibold" : "text-body"
      }`}
    >
      {valor ?? <span className="text-ink-muted">—</span>}
    </td>
  );
}
