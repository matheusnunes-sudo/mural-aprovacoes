// Selo de autorizacao de postagem. Quem nao autoriza precisa saltar aos
// olhos em qualquer visualizacao: e o aviso de "nao gaste design aqui".
export function SeloAutorizacao({ autoriza }: { autoriza: boolean }) {
  if (autoriza) {
    return (
      <span className="badge bg-success-bg text-success-fg">Autoriza post</span>
    );
  }
  return (
    <span className="badge bg-danger-bg text-danger-fg">Não autoriza</span>
  );
}
