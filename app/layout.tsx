import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mural de Aprovacoes | Assaad Educacao",
  description: "Colete depoimentos e aprovacoes dos alunos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Inter via Google Fonts (opcional). Cai para fonte do sistema
            se a rede nao estiver disponivel no ambiente. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
