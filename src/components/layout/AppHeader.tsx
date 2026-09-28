"use client";

import { useEffect, useState } from "react";
import { Bookmark, CalendarCheck, ChevronDown, Clock, Home, List, LogOut, MessageSquare, Settings, User, Wallet } from "lucide-react";
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

export type NavPage = "home" | "favoritos" | "roteiros" | "chat" | "configuracoes";

interface AppHeaderProps {
  activePage?: NavPage;
  showNav?: boolean;
  showSearch?: boolean;
}

const navItems: { page: NavPage; icon: typeof Home; href: string; label: string }[] = [
  { page: "home", icon: Home, href: "/home", label: "Início" },
  { page: "favoritos", icon: Bookmark, href: "/favoritos", label: "Favoritos" },
  { page: "roteiros", icon: List, href: "/roteiros", label: "Roteiros" },
];

const atalhosTurista: { href: string; label: string; icon: typeof Wallet }[] = [
  { href: "/agendamentos", label: "Meus agendamentos", icon: CalendarCheck },
  { href: "/carteira", label: "Minha carteira", icon: Wallet },
  { href: "/favoritos", label: "Favoritos", icon: Bookmark },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const atalhosGuia: { href: string; label: string; icon: typeof Wallet }[] = [
  { href: "/meus-roteiros", label: "Meus roteiros", icon: List },
  { href: "/gestao-agendamentos", label: "Agendamentos", icon: CalendarCheck },
  { href: "/carteira/guia", label: "Minha carteira", icon: Wallet },
  { href: "/historico", label: "Histórico", icon: Clock },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function AppHeader({ activePage, showNav = true }: AppHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const atalhos = user?.tipo === "GUIA" ? atalhosGuia : atalhosTurista;
  const primeiroNome = user?.nomeCompleto?.split(" ")[0] ?? "Minha Conta";

  const sair = async () => {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b border-border bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm md:px-8">
      <button
        type="button"
        onClick={() => router.push("/home")}
        className="rounded-lg transition-opacity hover:opacity-80"
        aria-label="Ir para início"
      >
        <Logo />
      </button>

      {showNav && (
        <nav className="flex items-center gap-1 md:gap-2" aria-label="Navegação principal">
          {navItems.map(({ page, icon: Icon, href, label }) => (
            <button
              key={page}
              type="button"
              onClick={() => router.push(href)}
              aria-label={label}
              aria-current={activePage === page ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full px-2.5 py-2.5 text-sm font-semibold transition-colors lg:px-4",
                activePage === page
                  ? "bg-[#F27420]/10 text-[#F27420]"
                  : "text-[#1F3A66] hover:bg-muted hover:text-[#F27420]"
              )}
            >
              <Icon className={cn("h-5 w-5", activePage === page && page === "favoritos" && "fill-current")} />
              <span className="hidden lg:inline">{label}</span>
            </button>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-2 md:gap-3">
        <Notificacoes />
        <button
          type="button"
          onClick={() => router.push("/chat")}
          aria-label="Chat"
          className={cn(
            "rounded-full p-2.5 transition-colors",
            activePage === "chat"
              ? "bg-[#F27420]/10 text-[#F27420]"
              : "text-muted-foreground hover:bg-muted hover:text-[#F27420]"
          )}
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
              <span className="hidden max-w-[120px] truncate sm:inline">{primeiroNome}</span>
              <ChevronDown className="h-4 w-4 opacity-80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="space-y-0.5">
              <p className="truncate text-sm font-bold text-[#1F3A66]">{user?.nomeCompleto ?? "Minha conta"}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user?.email ?? ""}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {atalhos.map(({ href, label, icon: Icon }) => (
              <DropdownMenuItem key={href} onSelect={() => router.push(href)} className="cursor-pointer gap-2">
                <Icon className="h-4 w-4 text-[#1F3A66]" />
                {label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={sair} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
