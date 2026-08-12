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
  responsavel: string | null;
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
