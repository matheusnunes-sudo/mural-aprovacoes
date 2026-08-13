-- Schema da tabela de aprovacoes. Rode no SQL Editor do Supabase.
create table if not exists aprovacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  -- Identifica o aluno. Nao e unique de proposito: o mesmo aluno pode
  -- enviar mais de um depoimento, e o painel agrupa os envios por email.
  email text not null,
  curso text not null,
  faculdade text not null,
  depoimento_original text not null,
  depoimento_corrigido text,
  foto_url text,
  comprovante_url text,
  status text not null default 'pendente',
  responsavel text,
  -- O aluno autorizou publicar? Quem nao autoriza nao entra na producao.
  autoriza_postagem boolean not null default true,
  criado_em timestamptz not null default now()
);

-- O painel lista agrupando por email; o indice mantem isso barato.
create index if not exists aprovacoes_email_idx on aprovacoes (email);

-- Se a tabela ja existia sem a coluna email (versao anterior do MVP):
--   alter table aprovacoes add column if not exists email text;
--   update aprovacoes set email = '' where email is null;
--   alter table aprovacoes alter column email set not null;
-- E sem a coluna de autorizacao:
--   alter table aprovacoes
--     add column if not exists autoriza_postagem boolean not null default true;
-- As colunas cidade/uf sairam do formulario na V1. Se existirem, podem
-- ficar (sao nullable) ate a definicao final das perguntas.

-- Permite que o formulario publico insira, mas nao leia dados de terceiros.
alter table aprovacoes enable row level security;

create policy "inserir aprovacao publica"
  on aprovacoes for insert
  to anon with check (true);

-- Leitura/edicao pelo painel: na V2, restringir a usuarios autenticados.
create policy "ler e editar (MVP)"
  on aprovacoes for all
  to anon using (true) with check (true);
