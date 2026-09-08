import { ETAPAS } from "./supabase";
import type { StatusRegistro } from "./supabase";

// Fica separado de components/SeloStatus.tsx porque lib/csv.ts precisa do
// titulo da etapa e nao deve depender de componente de UI.
export function tituloEtapa(status: StatusRegistro) {
  return ETAPAS.find((e) => e.id === status)?.titulo ?? status;
}
