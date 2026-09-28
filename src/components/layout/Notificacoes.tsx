"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { listarNotificacoes, marcarNotificacaoLida, type Notificacao } from "@/services/dominio";

function hora(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function Notificacoes() {
  const router = useRouter();
  const painel = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);
  const [items, setItems] = useState<Notificacao[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !localStorage.getItem("token")) return;
    const carregar = () =>
      listarNotificacoes()
        .then((data) => setItems(data.items))
        .catch(() => undefined);
    carregar();
    const timer = window.setInterval(carregar, 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (event: MouseEvent) => {
      if (!painel.current?.contains(event.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, [aberto]);

  const naoLidas = items.filter((item) => !item.lida).length;

  const abrirItem = (item: Notificacao) => {
    if (!item.lida) {
      marcarNotificacaoLida(item.id).catch(() => undefined);
      setItems((atual) => atual.map((notif) => (notif.id === item.id ? { ...notif, lida: true } : notif)));
    }
    setAberto(false);
    if (item.href) router.push(item.href);
  };

  return (
    <div className="relative" ref={painel}>
      <button
        type="button"
        aria-label="Avisos"
        onClick={() => setAberto((atual) => !atual)}
        className="relative rounded-full p-2.5 text-[#1F3A66] transition-colors hover:bg-[#F27420]/10 hover:text-[#F27420]"
      >
        <Bell className="h-5 w-5" />
        {naoLidas > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F27420] px-1 text-[10px] font-bold text-white">
            {naoLidas}
          </span>
        )}
      </button>
      {aberto && (
        <div className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-bold text-[#1F3A66]">Avisos</p>
            <p className="text-xs text-muted-foreground">
              {naoLidas === 0 ? "Tudo lido" : naoLidas === 1 ? "1 novo" : `${naoLidas} novos`}
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 && (
              <div className="px-6 py-10 text-center">
                <Bell className="mx-auto mb-2 h-6 w-6 text-[#F27420]" />
                <p className="text-sm font-medium text-[#1F3A66]">Nenhum aviso por aqui</p>
                <p className="mt-1 text-xs text-muted-foreground">Reservas, pagamentos e mensagens aparecem neste painel.</p>
              </div>
            )}
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => abrirItem(item)}
                className={`block w-full border-b px-4 py-3 text-left last:border-b-0 hover:bg-[#f4f4f6] ${item.lida ? "" : "bg-[#F27420]/5"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-[#1F3A66]">{item.titulo}</p>
                  {!item.lida && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F27420]" />}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.texto}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{hora(item.criadoEm)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
