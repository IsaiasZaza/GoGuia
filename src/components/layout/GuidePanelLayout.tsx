"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronDown, Clock, LogOut, MapPin, MessageSquare, Settings, User, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Notificacoes from "@/components/layout/Notificacoes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getStoredUser, logout, type AuthUser } from "@/services/auth";

export type GuideTab = "roteiros" | "agendamentos" | "carteira" | "historico";

interface GuidePanelLayoutProps {
  children: React.ReactNode;
  activeTab: GuideTab;
}

const tabs: { id: GuideTab; label: string; href: string; icon: typeof MapPin }[] = [
  { id: "roteiros", label: "Meus Roteiros", href: "/meus-roteiros", icon: MapPin },
  { id: "agendamentos", label: "Agendamentos", href: "/gestao-agendamentos", icon: Calendar },
  { id: "carteira", label: "Carteira", href: "/carteira/guia", icon: Wallet },
  { id: "historico", label: "Histórico", href: "/historico", icon: Clock },
];

export default function GuidePanelLayout({ children, activeTab }: GuidePanelLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const sair = async () => {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f6] font-sans text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 shadow-sm md:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/home")} className="rounded-lg hover:opacity-80" aria-label="Ir para o site">
            <Logo />
          </button>
          <span className="hidden rounded-full bg-[#1F3A66] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white sm:inline">
            Guia
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Notificacoes />
          <button
            type="button"
            onClick={() => router.push("/chat")}
            aria-label="Chat"
            className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-[#F27420]"
          >
            <MessageSquare className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]">
                {user?.fotoUrl ? (
                  <img src={user.fotoUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {user?.nomeCompleto?.split(" ")[0] ?? "Minha Conta"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-80" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="space-y-0.5">
                <p className="truncate text-sm font-bold text-[#1F3A66]">{user?.nomeCompleto ?? "Minha conta"}</p>
                <p className="truncate text-xs font-normal text-muted-foreground">{user?.email ?? ""}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push("/configuracoes")} className="cursor-pointer gap-2">
                <Settings className="h-4 w-4 text-[#1F3A66]" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/home")} className="cursor-pointer gap-2">
                <MapPin className="h-4 w-4 text-[#1F3A66]" />
                Ver o site
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={sair} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                    ? "bg-white text-[#1F3A66]"
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
