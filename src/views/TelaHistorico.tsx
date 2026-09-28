"use client";

import { Calendar, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import GuidePanelLayout from "@/components/layout/GuidePanelLayout";
import SearchBar from "@/components/layout/SearchBar";
import { Badge } from "@/components/ui/badge";
import { formatBRL, labelStatus, listarReservasGuia, type ReservaGuiaItem, type StatusReserva } from "@/services/dominio";

type Status = StatusReserva;

function dataBr(iso: string) {
  const data = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: Status }) {
  const config =
    status === "CONCLUIDA" || status === "CONFIRMADA"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : status === "PENDENTE" || status === "AGUARDANDO_PAGAMENTO"
      ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
      : "bg-red-100 text-red-700 hover:bg-red-100";

  return <Badge className={config}>{labelStatus(status)}</Badge>;
}

export default function TelaHistorico() {
  const [busca, setBusca] = useState("");
  const [items, setItems] = useState<ReservaGuiaItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarReservasGuia("historico")
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setCarregando(false));
  }, []);

  const filtrados = items.filter(
    (i) =>
      i.cliente.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
      i.roteiro.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <GuidePanelLayout activeTab="historico">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A66]">Histórico</h1>
          <p className="text-sm text-muted-foreground">Passeios concluídos, recusados e cancelados</p>
        </div>

        <SearchBar value={busca} onChange={setBusca} placeholder="Buscar por cliente ou roteiro..." />

        {carregando && (
          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-xl border border-border bg-white" />
            ))}
          </div>
        )}

        <ul className="flex flex-col gap-4">
          {!carregando &&
            filtrados.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm md:grid-cols-[auto_1fr_auto]"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#1F3A66]/10 text-sm font-bold text-[#1F3A66]">
                {item.cliente.fotoUrl ? (
                  <img src={item.cliente.fotoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  item.cliente.nomeCompleto.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <strong className="block font-bold text-[#1F3A66]">{item.cliente.nomeCompleto}</strong>
                  <span className="text-sm text-muted-foreground">{item.roteiro}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {dataBr(item.data)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {item.horario}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {item.quantidade} {item.quantidade === 1 ? "pessoa" : "pessoas"}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between gap-3 border-t border-border pt-3 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <StatusBadge status={item.status} />
                <span className="text-lg font-bold text-[#1F3A66]">{formatBRL(item.total)}</span>
              </div>
            </li>
          ))}
        </ul>

        {!carregando && filtrados.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-white px-6 py-14 text-center">
            <p className="font-bold text-[#1F3A66]">
              {busca ? "Nenhum registro para esta busca" : "Nenhum passeio no histórico"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {busca
                ? "Tente outro nome de cliente ou roteiro."
                : "Passeios concluídos e cancelados aparecem aqui."}
            </p>
          </div>
        )}
      </div>
    </GuidePanelLayout>
  );
}
