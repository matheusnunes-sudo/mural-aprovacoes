"use client";

export function PainelHeader({
  aba,
  onAba,
  total,
  pendentes,
}: {
  aba: "fila" | "checklists";
  onAba: (a: "fila" | "checklists") => void;
  total: number;
  pendentes: number;
}) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-brand-600">Assaad Educacao</p>
          <h1 className="text-display mt-1">Mural de aprovacoes</h1>
        </div>
        <div className="flex gap-3">
          <Metrica label="Total" valor={total} />
          <Metrica label="Pendentes" valor={pendentes} />
        </div>
      </div>

      <nav className="mt-5 flex gap-1 border-b border-line">
        <Tab ativo={aba === "fila"} onClick={() => onAba("fila")}>
          Aprovacoes
        </Tab>
        <Tab ativo={aba === "checklists"} onClick={() => onAba("checklists")}>
          Checklist do dia
        </Tab>
      </nav>
    </header>
  );
}

function Metrica({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="rounded-control bg-surface-sunken px-4 py-2 text-center">
      <p className="text-caption text-ink-soft">{label}</p>
      <p className="text-title">{valor}</p>
    </div>
  );
}

function Tab({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-2.5 text-label transition-colors ${
        ativo
          ? "border-brand-600 text-brand-600"
          : "border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
