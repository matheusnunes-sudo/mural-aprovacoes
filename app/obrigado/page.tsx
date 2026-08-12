import Link from "next/link";

export default function Obrigado() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <div className="card p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-success-fg text-2xl">
          ✓
        </div>
        <h1 className="text-title">Recebemos sua aprovacao</h1>
        <p className="text-body text-ink-soft mt-2">
          Obrigado por compartilhar sua historia. Nossa equipe vai preparar seu
          card para o mural em breve.
        </p>
        <Link href="/" className="btn-ghost mt-6 inline-flex">
          Enviar outra
        </Link>
      </div>
    </main>
  );
}
