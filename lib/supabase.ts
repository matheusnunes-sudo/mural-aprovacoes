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

export type StatusAprovacao = "pendente" | "design_pronto" | "postado";

// Etapas do processo, na ordem em que acontecem. E a fonte da ordem das
// colunas do Kanban e das opcoes de status em todo o painel.
//
// O `tom` e um semaforo: vermelho = parado, amarelo = em andamento,
// verde = concluido. As classes ficam nos componentes porque o Tailwind
// precisa das strings literais para gerar o CSS.
export const ETAPAS: {
  id: StatusAprovacao;
  titulo: string;
  tom: "vermelho" | "amarelo" | "verde";
}[] = [
  { id: "pendente", titulo: "Pendente", tom: "vermelho" },
  { id: "design_pronto", titulo: "Design pronto", tom: "amarelo" },
  { id: "postado", titulo: "Postado", tom: "verde" },
];

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

export type Aprovacao = {
  id: string;
  nome: string;
  // Chave que identifica o aluno. Dois envios com o mesmo email sao
  // agrupados no painel (ver lib/agrupar.ts). Guardar sempre normalizado.
  email: string;
  curso: string;
  faculdade: string;
  depoimento_original: string;
  depoimento_corrigido: string | null;
  foto_url: string | null;
  comprovante_url: string | null;
  status: StatusAprovacao;
  // O aluno autorizou publicar o depoimento? Quem nao autoriza NAO deve
  // entrar na producao de design — e o filtro mais importante do painel.
  autoriza_postagem: boolean;
  // Selos que o designer deve aplicar na arte (ex.: "1º lugar"). Definidos
  // pela equipe antes de mandar para o design.
  selos: string[];
  criado_em: string;
};

// Um aluno (identificado pelo email) e todos os depoimentos que ele enviou.
export type GrupoAluno = {
  email: string;
  nome: string;
  // Mais recente primeiro.
  aprovacoes: Aprovacao[];
};

export function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

export function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
