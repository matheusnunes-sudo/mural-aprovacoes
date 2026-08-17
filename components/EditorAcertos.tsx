"use client";

import { MATERIAS, MAXIMO_POR_DIA, totalAcertos } from "@/lib/supabase";
import type { Acertos, Materia } from "@/lib/supabase";

// O aluno manda os acertos para o expert (WhatsApp, DM), e o expert lança
// aqui. Por isso tudo e editavel no painel e nada vem do formulario publico.
//
// Dia 1 e dia 2 sao independentes das materias de proposito: as vezes o aluno
// so manda "fiz 82 no primeiro dia" e a abertura por materia nunca chega.
export function EditorAcertos({
  acertos,
  onMudar,
}: {
  acertos: Acertos | null;
  onMudar: (a: Acertos) => void;
}) {
  const atual: Acertos = acertos ?? { dia1: null, dia2: null, materias: {} };
  const total = totalAcertos(atual);

  function mudarDia(dia: "dia1" | "dia2", valor: string) {
    onMudar({ ...atual, [dia]: limitar(valor, MAXIMO_POR_DIA) });
  }

  function mudarMateria(id: Materia, valor: string, maximo: number) {
    const n = limitar(valor, maximo);
    const materias = { ...atual.materias };
    if (n == null) delete materias[id];
    else materias[id] = n;
    onMudar({ ...atual, materias });
  }

  return (
    <div className="rounded-control border border-line bg-surface-sunken/50 p-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label">Acertos na prova</p>
        <span className="text-caption text-ink-muted tabular-nums">
          {total == null ? "não informado" : `${total} no total`}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <CampoNumero
          rotulo="Dia 1"
          dica={`0 a ${MAXIMO_POR_DIA}`}
          valor={atual.dia1}
          onMudar={(v) => mudarDia("dia1", v)}
        />
        <CampoNumero
          rotulo="Dia 2"
          dica={`0 a ${MAXIMO_POR_DIA}`}
          valor={atual.dia2}
          onMudar={(v) => mudarDia("dia2", v)}
        />
      </div>

      <p className="text-caption text-ink-soft mt-4">
        Por matéria (opcional — usado nos posts de área)
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {MATERIAS.map((m) => (
          <CampoNumero
            key={m.id}
            rotulo={m.titulo}
            dica={`dia ${m.dia} · 0 a ${m.total}`}
            valor={atual.materias[m.id] ?? null}
            onMudar={(v) => mudarMateria(m.id, v, m.total)}
          />
        ))}
      </div>
    </div>
  );
}

// Vazio vira null (não é zero: "não informado" e "acertou nenhuma" são
// coisas diferentes). Acima do teto, corta no teto.
function limitar(valor: string, maximo: number): number | null {
  const limpo = valor.trim();
  if (limpo === "") return null;
  const n = Number(limpo);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(maximo, Math.round(n)));
}

function CampoNumero({
  rotulo,
  dica,
  valor,
  onMudar,
}: {
  rotulo: string;
  dica: string;
  valor: number | null;
  onMudar: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-caption text-ink-soft block">{rotulo}</span>
      <input
        type="number"
        inputMode="numeric"
        className="field mt-1 py-2 tabular-nums"
        value={valor ?? ""}
        onChange={(e) => onMudar(e.target.value)}
        placeholder={dica}
        aria-label={`${rotulo} — ${dica}`}
      />
    </label>
  );
}
