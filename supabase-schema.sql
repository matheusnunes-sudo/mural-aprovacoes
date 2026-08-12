-- Schema da tabela de aprovacoes. Rode no SQL Editor do Supabase.
create table if not exists aprovacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  curso text not null,
  faculdade text not null,
  cidade text,
  uf text,
  depoimento_original text not null,
  depoimento_corrigido text,
  foto_url text,
  comprovante_url text,
  status text not null default 'pendente',
  responsavel text,
  criado_em timestamptz not null default now()
);

-- Permite que o formulario publico insira, mas nao leia dados de terceiros.
alter table aprovacoes enable row level security;

create policy "inserir aprovacao publica"
  on aprovacoes for insert
  to anon with check (true);

-- Leitura/edicao pelo painel: na V2, restringir a usuarios autenticados.
create policy "ler e editar (MVP)"
  on aprovacoes for all
  to anon using (true) with check (true);
