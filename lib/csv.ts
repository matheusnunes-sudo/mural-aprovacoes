import { MATERIAS, totalAcertos } from "./supabase";
import type { Registro, TipoRegistro } from "./supabase";
import { tituloEtapa } from "./etapas";

export function dataCurta(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// As colunas do meio mudam com o tipo: aprovacao mostra curso/faculdade,
// acerto mostra o placar da prova. A tabela e o CSV usam a MESMA definicao,
// senao um dia divergem e o arquivo exportado deixa de bater com a tela.
export function colunasTabela(tipo: TipoRegistro): string[] {
  const meio =
    tipo === "aprovacao"
      ? ["Curso", "Faculdade"]
      : ["Dia 1", "Dia 2", "Total", ...MATERIAS.map((m) => m.curto)];
  return [
    "Nome",
    "E-mail",
    ...meio,
    "Status",
    "Autoriza post",
    "Selos",
    "Enviado em",
  ];
}

export function celulasMeio(r: Registro): (string | number)[] {
  if (r.tipo === "aprovacao") return [r.curso, r.faculdade];
  return [
    r.acertos?.dia1 ?? "",
    r.acertos?.dia2 ?? "",
    totalAcertos(r.acertos) ?? "",
    ...MATERIAS.map((m) => r.acertos?.materias[m.id] ?? ""),
  ];
}

// Escapa um valor para CSV: aspas dobradas e o campo inteiro entre aspas.
function celula(valor: string | number | boolean) {
  return `"${String(valor).replace(/"/g, '""')}"`;
}

export function gerarCsv(registros: Registro[], tipo: TipoRegistro): string {
  return [
    colunasTabela(tipo).map(celula).join(","),
    ...registros.map((r) =>
      [
        celula(r.nome),
        celula(r.email),
        ...celulasMeio(r).map(celula),
        celula(tituloEtapa(r.status)),
        celula(r.autoriza_postagem ? "Sim" : "Não"),
        celula(r.selos.join("; ")),
        celula(dataCurta(r.criado_em)),
      ].join(",")
    ),
  ].join("\n");
}

// Nome do arquivo. Existe porque colar "s" no `tipo` gerava "aprovacaos":
// plural de palavra em -ao nao se resolve com concatenacao.
export function nomeArquivoCsv(
  tipo: TipoRegistro,
  quantidade: number,
  total: number
) {
  const base = tipo === "acerto" ? "acertos-enem" : "aprovacoes";
  const recorte = quantidade >= total ? "todos" : String(quantidade);
  return `${base}-${recorte}-${new Date().toISOString().slice(0, 10)}.csv`;
}

export function baixarCsv(conteudo: string, nome: string) {
  // BOM no inicio para o Excel abrir os acentos corretamente.
  const blob = new Blob([`﻿${conteudo}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}
