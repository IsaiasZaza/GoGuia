"use client";

import { Bookmark, Home, List, MessageSquare, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export default function AppHeader({ activePage, showNav = true }: AppHeaderProps) {
  const router = useRouter();

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
                "rounded-full p-2.5 transition-colors",
                activePage === page
                  ? "bg-[#F27420]/10 text-[#F27420]"
                  : "text-[#1F3A66] hover:bg-muted hover:text-[#F27420]"
              )}
            >
              <Icon className={cn("h-5 w-5", activePage === page && page === "favoritos" && "fill-current")} />
            </button>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-3">
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
        <Button
          onClick={() => router.push("/configuracoes")}
          className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Minha Conta</span>
        </Button>
      </div>
    </header>
  );
}
