"use client";

import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GuideTab = "roteiros" | "agendamentos" | "historico";

interface GuidePanelLayoutProps {
  children: React.ReactNode;
  activeTab: GuideTab;
}

const tabs: { id: GuideTab; label: string; href: string; icon: typeof MapPin }[] = [
  { id: "roteiros", label: "Meus Roteiros", href: "/meus-roteiros", icon: MapPin },
  { id: "agendamentos", label: "Agendamentos", href: "/gestao-agendamentos", icon: Calendar },
  { id: "historico", label: "Histórico", href: "/historico", icon: Clock },
];

export default function GuidePanelLayout({ children, activeTab }: GuidePanelLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f6] font-sans text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white px-4 py-3 shadow-sm md:px-8">
        <button type="button" onClick={() => router.push("/home")} className="rounded-lg hover:opacity-80">
          <Logo />
        </button>
        <Button
          onClick={() => router.push("/configuracoes")}
          className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
        >
          <User className="h-4 w-4" />
          Minha Conta
        </Button>
      </header>

      <div className="mx-auto flex w-full max-w-[1300px] flex-1 flex-col gap-6 p-4 md:flex-row md:p-6">
        <aside className="h-fit w-full shrink-0 rounded-xl bg-[#1F3A66] p-4 md:w-[220px]">
          <p className="mb-3 px-2 text-xs font-bold uppercase tracking-widest text-white/60">
            Painel Guia
          </p>
          <nav className="flex flex-row gap-1 md:flex-col">
            {tabs.map(({ id, label, href, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => router.push(href)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors md:justify-start",
                  activeTab === id
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline md:inline">{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
