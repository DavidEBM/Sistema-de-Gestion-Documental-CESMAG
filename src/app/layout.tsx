import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIGD - Gestión Documental",
  description: "Sistema Institucional de Gestión Documental",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
