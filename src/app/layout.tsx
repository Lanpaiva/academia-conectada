import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academia Conectada",
  description:
    "Sistema web para gestao de alunos, planos, treinos e aulas de uma academia."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
