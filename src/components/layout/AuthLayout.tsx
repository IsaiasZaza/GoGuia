"use client";

import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  logoHref?: string;
}

export default function AuthLayout({ children, logoHref = "/login" }: AuthLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="border-b border-border px-6 py-4">
        <button
          type="button"
          onClick={() => router.push(logoHref)}
          className="rounded-lg transition-opacity hover:opacity-80"
          aria-label="Voltar"
        >
          <Logo />
        </button>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
