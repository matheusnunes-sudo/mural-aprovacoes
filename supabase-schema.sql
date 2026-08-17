-- Schema da tabela de registros. Rode no SQL Editor do Supabase.
--
-- A tabela guarda os DOIS momentos do ano, separados pela coluna `tipo`:
--   'acerto'    semana do ENEM, o aluno manda quantas questoes acertou
--   'aprovacao' depois do SISU, o aluno passou num curso/faculdade
-- Os campos de um tipo ficam nulos/vazios no outro.
create table if not exists aprovacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  -- Identifica o aluno. Nao e unique de proposito: o mesmo aluno manda
  -- acertos em novembro e aprovacao em janeiro, e pode reenviar cada um.
  email text not null,
  tipo text not null default 'aprovacao'
    check (tipo in ('acerto', 'aprovacao')),

  -- Só em 'aprovacao'
  curso text not null default '',
  faculdade text not null default '',

  -- Só em 'acerto'. Dia 1 e dia 2 vao de 0 a 90; cada materia, de 0 a 45.
  -- `acertos_materias` guarda { "linguagens": 40, "matematica": 42, ... } e
  -- pode vir vazio: as vezes o aluno so manda o total do dia.
  acertos_dia1 smallint check (acertos_dia1 between 0 and 90),
  acertos_dia2 smallint check (acertos_dia2 between 0 and 90),
  acertos_materias jsonb not null default '{}',

  depoimento_original text not null,
  depoimento_corrigido text,
  foto_url text,
  comprovante_url text,
  status text not null default 'pendente',
  -- O aluno autorizou publicar? Quem nao autoriza nao entra na producao.
  autoriza_postagem boolean not null default true,
  -- Selos que o designer aplica na arte (ex.: '1º lugar').
  selos text[] not null default '{}',
  criado_em timestamptz not null default now()
);

-- O painel filtra por tipo e agrupa por email; o indice cobre os dois.
create index if not exists aprovacoes_tipo_email_idx on aprovacoes (tipo, email);

-- Migracoes a partir de versoes anteriores do MVP:
--   alter table aprovacoes add column if not exists email text;
--   update aprovacoes set email = '' where email is null;
--   alter table aprovacoes alter column email set not null;
--   alter table aprovacoes
--     add column if not exists autoriza_postagem boolean not null default true;
--   alter table aprovacoes
--     add column if not exists selos text[] not null default '{}';
--   alter table aprovacoes
--     add column if not exists tipo text not null default 'aprovacao';
--   alter table aprovacoes add column if not exists acertos_dia1 smallint;
--   alter table aprovacoes add column if not exists acertos_dia2 smallint;
--   alter table aprovacoes
--     add column if not exists acertos_materias jsonb not null default '{}';
-- As colunas cidade/uf e responsavel sairam do produto. Se existirem, podem
-- ficar (sao nullable) — o app simplesmente nao le nem escreve nelas.

-- Permite que o formulario publico insira, mas nao leia dados de terceiros.
alter table aprovacoes enable row level security;

create policy "inserir aprovacao publica"
  on aprovacoes for insert
  to anon with check (true);

-- Leitura/edicao pelo painel: na V2, restringir a usuarios autenticados.
create policy "ler e editar (MVP)"
  on aprovacoes for all
  to anon using (true) with check (true);
