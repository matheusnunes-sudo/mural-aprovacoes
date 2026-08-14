// Selo de autorizacao de postagem. Quem nao autoriza precisa saltar aos
// olhos em qualquer visualizacao: e o aviso de "nao gaste design aqui".
//
// Leva icone de proposito: as colunas do Kanban ja usam vermelho para
// "Pendente", entao a cor sozinha nao distinguiria os dois avisos.
export function SeloAutorizacao({
  autoriza,
  compacto,
}: {
  autoriza: boolean;
  compacto?: boolean;
}) {
  if (autoriza) {
    return (
      <span className="badge gap-1 bg-success-bg text-success-fg">
        <IconeOlho />
        {!compacto && "Autoriza post"}
      </span>
    );
  }
  return (
    <span className="badge gap-1 bg-danger-bg text-danger-fg">
      <IconeOlhoCortado />
      {!compacto && "Não autoriza"}
    </span>
  );
}

function IconeOlho() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 7s2.2-3.8 6-3.8S13 7 13 7s-2.2 3.8-6 3.8S1 7 1 7Z" />
      <circle cx="7" cy="7" r="1.6" />
    </svg>
  );
}

function IconeOlhoCortado() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.4 4.2C1.5 5.2 1 7 1 7s2.2 3.8 6 3.8c.9 0 1.7-.2 2.4-.5M11.7 9.5C12.6 8.6 13 7 13 7s-2.2-3.8-6-3.8c-.5 0-1 .1-1.4.2" />
      <path d="M1.8 1.8l10.4 10.4" />
    </svg>
  );
}
