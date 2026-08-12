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
  curso: string;
  faculdade: string;
  cidade: string;
  uf: string;
  depoimento_original: string;
  depoimento_corrigido: string | null;
  foto_url: string | null;
  comprovante_url: string | null;
  status: StatusAprovacao;
  responsavel: string | null;
  criado_em: string;
};
