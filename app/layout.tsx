import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TemaToggle } from "@/components/TemaToggle";

export const metadata: Metadata = {
  title: "Mural de Aprovações | Assaad Educação",
  description: "Colete depoimentos e aprovações dos alunos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // A cor da barra do navegador acompanha o tema.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F2F7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
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
        {/* Fixo em todas as paginas, sempre no mesmo canto. */}
        <TemaToggle />
        {children}
      </body>
    </html>
  );
}
