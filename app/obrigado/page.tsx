import Link from "next/link";

export default function Obrigado() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="card p-7 text-center sm:p-9">
        <div className="bg-brand-500 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-pill text-white">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 13.5 10.5 18 20 8.5" />
          </svg>
        </div>
        <h1 className="text-display">Recebemos sua aprovação</h1>
        <p className="text-body text-ink-soft mt-3">
          Obrigado por compartilhar sua história. Nossa equipe vai preparar seu
          card para o mural em breve.
        </p>
        <Link href="/" className="btn-ghost mt-7">
          Enviar outra
        </Link>
      </div>
    </main>
  );
}
