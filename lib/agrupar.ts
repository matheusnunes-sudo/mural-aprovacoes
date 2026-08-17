import type { Registro, GrupoAluno } from "./supabase";

// O aluno pode enviar mais de um registro do mesmo tipo (uma segunda
// aprovacao, uma correcao dos acertos). Cada envio continua sendo uma linha
// propria — com status, autorizacao e selos proprios — mas o painel mostra os
// envios do mesmo email juntos, para a equipe nao tratar como duas pessoas.
//
// Agrupe SEMPRE depois de filtrar por tipo: acerto e aprovacao do mesmo aluno
// sao trabalhos diferentes e nao devem cair no mesmo card.
export function agruparPorEmail(registros: Registro[]): GrupoAluno[] {
  const porEmail = new Map<string, Registro[]>();

  for (const r of registros) {
    const atual = porEmail.get(r.email);
    if (atual) atual.push(r);
    else porEmail.set(r.email, [r]);
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
      registros: ordenada,
    });
  }

  // A ordem dos GRUPOS segue a ordem em que os alunos aparecem na entrada
  // (o Map preserva a ordem de insercao). Quem chama ja ordenou a lista do
  // jeito que quer — por acertos na semana do ENEM, por data nas aprovacoes —
  // e reordenar aqui jogaria esse trabalho fora.
  //
  // A ordem DENTRO do grupo e sempre o envio mais recente primeiro.
  return grupos;
}
