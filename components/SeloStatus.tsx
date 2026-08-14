import { ETAPAS } from "@/lib/supabase";
import type { StatusAprovacao } from "@/lib/supabase";

// Semaforo unico do processo: vermelho parado, amarelo em andamento, verde
// concluido. As mesmas cores pintam o selo, a coluna do Kanban e a linha da
// planilha — quem aprende num lugar le em todos.
//
// As classes precisam ser strings literais para o Tailwind gerar o CSS,
// por isso o mapa explicito em vez de montar o nome da classe na mao.
export const CORES_ETAPA: Record<
  StatusAprovacao,
  { selo: string; coluna: string; cabecalho: string; ponto: string }
> = {
  pendente: {
    selo: "bg-danger-bg text-danger-fg",
    coluna: "border-danger-fg/20 bg-danger-bg/40",
    cabecalho: "text-danger-fg",
    ponto: "bg-danger-fg",
  },
  design_pronto: {
    selo: "bg-warning-bg text-warning-fg",
    coluna: "border-warning-fg/20 bg-warning-bg/40",
    cabecalho: "text-warning-fg",
    ponto: "bg-warning-fg",
  },
  postado: {
    selo: "bg-success-bg text-success-fg",
    coluna: "border-success-fg/20 bg-success-bg/40",
    cabecalho: "text-success-fg",
    ponto: "bg-success-fg",
  },
};

export function tituloEtapa(status: StatusAprovacao) {
  return ETAPAS.find((e) => e.id === status)?.titulo ?? status;
}

export function SeloStatus({ status }: { status: StatusAprovacao }) {
  return (
    <span
      className={`badge gap-1.5 ${CORES_ETAPA[status].selo} justify-center`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-pill ${CORES_ETAPA[status].ponto}`}
        aria-hidden
      />
      {tituloEtapa(status)}
    </span>
  );
}
