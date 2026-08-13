import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mural de Aprovacoes | Assaad Educacao",
  description: "Colete depoimentos e aprovacoes dos alunos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // A cor da barra do navegador acompanha o tema.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E8E8ED" },
    { media: "(prefers-color-scheme: dark)", color: "#08080B" },
  ],
};

// Roda antes da primeira pintura: sem isso o app pisca claro antes de virar
// escuro. Le a escolha salva e, se nao houver, segue o sistema.
const scriptTema = `
(function () {
  try {
    var salvo = localStorage.getItem("tema");
    var sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (salvo === "escuro" || (!salvo && sistemaEscuro)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="ambient" aria-hidden />
        {children}
      </body>
    </html>
  );
}
