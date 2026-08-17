import { MATERIAS, totalAcertos } from "./supabase";
import type { Registro } from "./supabase";

// Linha que identifica o registro numa lista. Muda com o tipo: uma aprovacao
// e "curso na faculdade"; um acerto e o placar da prova.
export function legendaRegistro(r: Registro): string {
  if (r.tipo === "aprovacao") {
    return [r.curso, r.faculdade].filter(Boolean).join(" · ") || "—";
  }
  const total = totalAcertos(r.acertos);
  if (total == null) return "Sem acertos informados";

  const partes: string[] = [`${total} acertos`];
  const d1 = r.acertos?.dia1;
  const d2 = r.acertos?.dia2;
  if (d1 != null && d2 != null) partes.push(`${d1} + ${d2}`);
  else if (d1 != null) partes.push(`${d1} no dia 1`);
  else if (d2 != null) partes.push(`${d2} no dia 2`);

  return partes.join(" · ");
}

// "Ling. 40 · Hum. 42 · Nat. 37 · Mat. 42" — só as materias preenchidas.
export function legendaMaterias(r: Registro): string {
  if (r.tipo !== "acerto" || !r.acertos) return "";
  return MATERIAS.filter((m) => r.acertos!.materias[m.id] != null)
    .map((m) => `${m.curto} ${r.acertos!.materias[m.id]}`)
    .join(" · ");
}

// Mais recente primeiro. E a ordem natural das aprovacoes: quem acabou de
// passar e o proximo post.
export function ordenarPorRecentes(registros: Registro[]): Registro[] {
  return [...registros].sort(
    (a, b) => +new Date(b.criado_em) - +new Date(a.criado_em)
  );
}

// Ordena acertos do maior para o menor: a equipe posta os melhores primeiro.
// Quem nao informou acerto vai para o fim.
export function ordenarPorAcertos(registros: Registro[]): Registro[] {
  return [...registros].sort((a, b) => {
    const ta = totalAcertos(a.acertos);
    const tb = totalAcertos(b.acertos);
    if (ta == null && tb == null) return 0;
    if (ta == null) return 1;
    if (tb == null) return -1;
    return tb - ta;
  });
}
