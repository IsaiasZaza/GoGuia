"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Compass, Loader2, MapPin, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { listarLocalizacoes } from "@/services/dominio";

interface LocalizacaoSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Texto da opção sem filtro. */
  placeholder?: string;
  /** Variante visual: "default" (pílula independente) ou "inline" (integrado à barra de busca da Home). */
  variant?: "default" | "inline";
}

function normalizar(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function LocalizacaoSelect({
  value,
  onChange,
  className,
  placeholder = "Todas as localizações",
  variant = "default",
}: LocalizacaoSelectProps) {
  const [open, setOpen] = useState(false);
  const [locais, setLocais] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [buscaInterna, setBuscaInterna] = useState("");

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    listarLocalizacoes()
      .then((data) => {
        if (ativo) setLocais(data.items ?? []);
      })
      .catch(() => {
        if (ativo) setLocais([]);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  // Mantém o valor vindo da URL visível mesmo que não esteja na lista.
  const opcoes = useMemo(() => {
    const base = value && !locais.includes(value) ? [value, ...locais] : locais;
    if (!buscaInterna.trim()) return base;
    const termo = normalizar(buscaInterna);
    return base.filter((item) => normalizar(item).includes(termo));
  }, [locais, value, buscaInterna]);

  const selecionar = (novoValor: string) => {
    onChange(novoValor);
    setOpen(false);
    setBuscaInterna("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(proximo) => {
        setOpen(proximo);
        if (!proximo) setBuscaInterna("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label="Filtrar por localização"
          className={cn(
            "group flex h-12 w-full items-center justify-between gap-2.5 px-3.5 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]",
            variant === "inline"
              ? "rounded-xl bg-slate-50/90 hover:bg-slate-100/90 sm:rounded-full"
              : "rounded-full border border-border/80 bg-white shadow-sm hover:border-[#F27420]/50 hover:shadow-md",
            open && variant === "default" && "border-[#F27420] ring-2 ring-[#F27420]/20",
            open && variant === "inline" && "bg-orange-50/60 ring-2 ring-[#F27420]/30",
            className
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                value
                  ? "bg-[#F27420] text-white"
                  : "bg-[#F27420]/12 text-[#F27420] group-hover:bg-[#F27420]/20"
              )}
            >
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span
              className={cn(
                "truncate",
                value ? "font-bold text-[#1F3A66]" : "font-medium text-slate-600"
              )}
            >
              {value || placeholder}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1">
            {value && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Limpar localização selecionada"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    onChange("");
                  }
                }}
                className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/80 hover:text-[#1F3A66]"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:text-[#1F3A66]",
                open && "rotate-180 text-[#F27420]"
              )}
            />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-[260px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl"
      >
        {locais.length > 3 && (
          <div className="relative mb-1.5 px-1 pt-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={buscaInterna}
              onChange={(event) => setBuscaInterna(event.target.value)}
              placeholder="Filtrar cidade ou estado..."
              aria-label="Filtrar lista de localizações"
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-[#F27420] focus:bg-white focus:outline-none"
            />
          </div>
        )}

        <div className="max-h-64 space-y-0.5 overflow-y-auto p-0.5" role="listbox" aria-label="Opções de localização">
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => selecionar("")}
            className={cn(
              "flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition-colors",
              !value
                ? "bg-[#1F3A66]/8 font-bold text-[#1F3A66]"
                : "font-medium text-slate-600 hover:bg-slate-100/80 hover:text-[#1F3A66]"
            )}
          >
            <span className="flex items-center gap-2.5 truncate">
              <Compass className={cn("h-4 w-4 shrink-0", !value ? "text-[#F27420]" : "text-slate-400")} />
              <span className="truncate">{placeholder}</span>
            </span>
            {!value && <Check className="h-4 w-4 shrink-0 text-[#F27420]" />}
          </button>

          <div className="my-1 border-t border-slate-100" />

          {carregando ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-[#F27420]" />
              <span>Carregando destinos...</span>
            </div>
          ) : opcoes.length === 0 ? (
            <div className="px-3 py-5 text-center text-xs text-muted-foreground">
              Nenhuma localização encontrada.
            </div>
          ) : (
            opcoes.map((local) => {
              const ativo = value === local;
              return (
                <button
                  key={local}
                  type="button"
                  role="option"
                  aria-selected={ativo}
                  onClick={() => selecionar(local)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition-colors",
                    ativo
                      ? "bg-[#F27420]/12 font-bold text-[#F27420]"
                      : "font-medium text-[#1F3A66] hover:bg-orange-50/70 hover:text-[#F27420]"
                  )}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <MapPin
                      className={cn(
                        "h-4 w-4 shrink-0",
                        ativo ? "text-[#F27420]" : "text-slate-400"
                      )}
                    />
                    <span className="truncate">{local}</span>
                  </span>
                  {ativo && <Check className="h-4 w-4 shrink-0 text-[#F27420]" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
