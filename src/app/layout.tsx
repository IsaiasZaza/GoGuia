import type { Metadata } from "next";
import { FetchAuthProvider } from "@/components/providers/FetchAuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoGuia",
  description: "Encontre os melhores guias da região",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <FetchAuthProvider>{children}</FetchAuthProvider>
      </body>
    </html>
  );
}
