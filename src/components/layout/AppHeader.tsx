"use client";

import { useEffect, useState } from "react";
import {
  Bookmark,
  CalendarCheck,
  ChevronDown,
  Clock,
  Compass,
  Home,
  List,
  LogIn,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  User,
  UserPlus,
  Wallet,
} from "lucide-react";
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
import { getStoredUser, isLoggedIn, loginUrl, logout, type AuthUser } from "@/services/auth";

export type NavPage = "home" | "favoritos" | "roteiros" | "chat" | "configuracoes";

interface AppHeaderProps {
  activePage?: NavPage;
  showNav?: boolean;
  showSearch?: boolean;
}

const navItems: { page: NavPage; icon: typeof Home; href: string; label: string; authOnly?: boolean }[] = [
  { page: "home", icon: Home, href: "/home", label: "Início" },
  { page: "roteiros", icon: Compass, href: "/roteiros", label: "Roteiros" },
  { page: "favoritos", icon: Bookmark, href: "/favoritos", label: "Favoritos" },
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

const atalhosAdmin: { href: string; label: string; icon: typeof Wallet }[] = [
  { href: "/admin", label: "Painel administrativo", icon: ShieldCheck },
  { href: "/roteiros", label: "Catálogo de roteiros", icon: List },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function AppHeader({ activePage, showNav = true }: AppHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoggedIn()) {
      setUser(getStoredUser());
    } else {
      setUser(null);
    }
  }, []);

  const atalhos = user?.tipo === "ADMIN" ? atalhosAdmin : user?.tipo === "GUIA" ? atalhosGuia : atalhosTurista;
  const primeiroNome = user?.nomeCompleto?.split(" ")[0] ?? "Minha Conta";

  const navegarFavoritos = () => {
    if (!isLoggedIn()) {
      router.push(loginUrl("/favoritos", "Entre para acessar seus passeios favoritos."));
      return;
    }
    router.push("/favoritos");
  };

  const navegarChat = () => {
    if (!isLoggedIn()) {
      router.push(loginUrl("/chat", "Entre para conversar com os guias."));
      return;
    }
    router.push("/chat");
  };

  const sair = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      router.push("/home");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]"
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
                onClick={() => (page === "favoritos" ? navegarFavoritos() : router.push(href))}
                aria-label={label}
                aria-current={activePage === page ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420] lg:px-4",
                  activePage === page
                    ? "bg-[#F27420]/12 text-[#F27420] shadow-xs"
                    : "text-[#1F3A66] hover:bg-muted hover:text-[#F27420]"
                )}
              >
                <Icon className={cn("h-4 w-4 md:h-5 md:w-5", activePage === page && page === "favoritos" && "fill-current")} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          {mounted && user ? (
            <>
              <Notificacoes />
              <button
                type="button"
                onClick={navegarChat}
                aria-label="Chat"
                className={cn(
                  "rounded-full p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]",
                  activePage === "chat"
                    ? "bg-[#F27420]/10 text-[#F27420]"
                    : "text-[#1F3A66] hover:bg-muted hover:text-[#F27420]"
                )}
              >
                <MessageSquare className="h-5 w-5" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full bg-[#F27420] font-bold text-white shadow-sm transition-all hover:bg-[#d65f15]">
                    {user.fotoUrl ? (
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
                    <p className="truncate text-sm font-bold text-[#1F3A66]">{user.nomeCompleto}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
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
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/login")}
                className="rounded-full font-bold text-[#1F3A66] hover:bg-[#1F3A66]/10 hover:text-[#1F3A66]"
              >
                <LogIn className="h-4 w-4" />
                <span>Entrar</span>
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/login?tab=cadastro")}
                className="rounded-full bg-[#F27420] font-bold text-white shadow-sm transition-all hover:bg-[#d65f15]"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Criar conta</span>
                <span className="sm:hidden">Cadastrar</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

