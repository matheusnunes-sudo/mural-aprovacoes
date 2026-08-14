import type { Aprovacao, GrupoAluno } from "./supabase";

// O aluno pode enviar mais de um depoimento (uma segunda aprovacao, uma
// versao corrigida da historia). Cada envio continua sendo uma linha
// propria — com status, autorizacao e selos proprios — mas o painel mostra os
// envios do mesmo email juntos, para a equipe nao tratar como duas pessoas.
export function agruparPorEmail(aprovacoes: Aprovacao[]): GrupoAluno[] {
  const porEmail = new Map<string, Aprovacao[]>();

  for (const a of aprovacoes) {
    const chave = a.email;
    const atual = porEmail.get(chave);
    if (atual) atual.push(a);
    else porEmail.set(chave, [a]);
  }

  const grupos: GrupoAluno[] = [];
  for (const [email, lista] of porEmail) {
    const ordenada = [...lista].sort(
      (a, b) => +new Date(b.criado_em) - +new Date(a.criado_em)
    );
    grupos.push({
      email,
      // O nome do envio mais recente ganha: e como o aluno se apresenta hoje.
      nome: ordenada[0].nome,
      aprovacoes: ordenada,
    });
  }

  // Grupos ordenados pelo envio mais recente de cada aluno.
  return grupos.sort(
    (a, b) =>
      +new Date(b.aprovacoes[0].criado_em) -
      +new Date(a.aprovacoes[0].criado_em)
  );
}
