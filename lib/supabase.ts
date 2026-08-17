import { createClient } from "@supabase/supabase-js";

// Cliente Supabase. As chaves vem das variaveis de ambiente (ver .env.example).
// Enquanto o Supabase real nao esta configurado, o app usa os dados mock
// de lib/mock.ts para permanecer demonstravel.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(url && anonKey);

export const supabase = supabaseConfigurado
  ? createClient(url as string, anonKey as string)
  : null;

// ---------------------------------------------------------------------------
// Dois momentos do ano, dois tipos de post — e dados completamente diferentes:
//
//   "acerto"    Semana do ENEM. Sai o gabarito, o aluno corrige e manda quantas
//               questoes acertou. Vira post de "X acertos no dia 1/dia 2", as
//               vezes aberto por materia. Nao existe curso nem faculdade ainda.
//   "aprovacao" Depois do SISU. O aluno passou, e o post e do curso/faculdade.
//
// Os dois vivem na mesma tabela porque compartilham tudo que importa para a
// producao (aluno, autorizacao, selos, etapa, depoimento). O `tipo` separa.
// ---------------------------------------------------------------------------
export type TipoRegistro = "acerto" | "aprovacao";

export const TIPOS: { id: TipoRegistro; titulo: string; descricao: string }[] = [
  {
    id: "acerto",
    titulo: "Acertos do ENEM",
    descricao: "Semana da prova, logo depois do gabarito oficial",
  },
  {
    id: "aprovacao",
    titulo: "Aprovações",
    descricao: "Depois do resultado do SISU",
  },
];

export type StatusRegistro = "pendente" | "design_pronto" | "postado";

// Etapas do processo, na ordem em que acontecem. E a fonte da ordem das
// colunas do Kanban e das opcoes de status em todo o painel.
//
// O `tom` e um semaforo: vermelho = parado, amarelo = em andamento,
// verde = concluido. As classes ficam nos componentes porque o Tailwind
// precisa das strings literais para gerar o CSS.
export const ETAPAS: {
  id: StatusRegistro;
  titulo: string;
  tom: "vermelho" | "amarelo" | "verde";
}[] = [
  { id: "pendente", titulo: "Pendente", tom: "vermelho" },
  { id: "design_pronto", titulo: "Design pronto", tom: "amarelo" },
  { id: "postado", titulo: "Postado", tom: "verde" },
];

// As quatro areas do ENEM. Cada uma tem 45 questoes; dia 1 e dia 2 tem 90.
export type Materia =
  | "linguagens"
  | "humanas"
  | "natureza"
  | "matematica";

export const MATERIAS: {
  id: Materia;
  titulo: string;
  curto: string;
  dia: 1 | 2;
  total: number;
}[] = [
  { id: "linguagens", titulo: "Linguagens", curto: "Ling.", dia: 1, total: 45 },
  { id: "humanas", titulo: "Ciências Humanas", curto: "Hum.", dia: 1, total: 45 },
  { id: "natureza", titulo: "Ciências da Natureza", curto: "Nat.", dia: 2, total: 45 },
  { id: "matematica", titulo: "Matemática", curto: "Mat.", dia: 2, total: 45 },
];

export const MAXIMO_POR_DIA = 90;

// O aluno as vezes manda so o total do dia, as vezes abre por materia — por
// isso tudo e opcional e nada e derivado a forca.
export type Acertos = {
  dia1: number | null;
  dia2: number | null;
  materias: Partial<Record<Materia, number>>;
};

// Selos sugeridos. A equipe pode escrever qualquer outro texto — estes sao
// so os atalhos mais usados.
export const SELOS_SUGERIDOS = [
  "1º lugar",
  "1ª chamada",
  "Nota 1000 na redação",
  "Bolsa integral",
  "Segunda aprovação",
  "Ampla concorrência",
];

export type Registro = {
  id: string;
  nome: string;
  // Chave que identifica o aluno. Dois envios com o mesmo email sao
  // agrupados no painel (ver lib/agrupar.ts). Guardar sempre normalizado.
  // O MESMO aluno costuma aparecer nos dois tipos: manda os acertos em
  // novembro e a aprovacao em janeiro.
  email: string;
  tipo: TipoRegistro;
  // Só em "aprovacao" — em "acerto" ficam vazios.
  curso: string;
  faculdade: string;
  // Só em "acerto" — em "aprovacao" fica null.
  acertos: Acertos | null;
  depoimento_original: string;
  depoimento_corrigido: string | null;
  foto_url: string | null;
  comprovante_url: string | null;
  status: StatusRegistro;
  // O aluno autorizou publicar o depoimento? Quem nao autoriza NAO deve
  // entrar na producao de design — e o filtro mais importante do painel.
  autoriza_postagem: boolean;
  // Selos que o designer deve aplicar na arte (ex.: "1º lugar"). Definidos
  // pela equipe antes de mandar para o design.
  selos: string[];
  criado_em: string;
};

// Um aluno (identificado pelo email) e todos os registros que ele enviou
// dentro de um tipo.
export type GrupoAluno = {
  email: string;
  nome: string;
  // Mais recente primeiro.
  registros: Registro[];
};

// Soma dos dois dias. Null quando o aluno nao mandou nenhum dos dois.
export function totalAcertos(acertos: Acertos | null): number | null {
  if (!acertos) return null;
  if (acertos.dia1 == null && acertos.dia2 == null) return null;
  return (acertos.dia1 ?? 0) + (acertos.dia2 ?? 0);
}

export function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

export function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
