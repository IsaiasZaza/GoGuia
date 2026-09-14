"use client";

import { Calendar, Clock, Users } from "lucide-react";
import { useState } from "react";
import GuidePanelLayout from "@/components/layout/GuidePanelLayout";
import SearchBar from "@/components/layout/SearchBar";
import { Badge } from "@/components/ui/badge";

type Status = "Concluido" | "Pendente" | "Cancelado";

interface Item {
  id: number;
  nome: string;
  roteiro: string;
  data: string;
  duracao: string;
  pessoas: number;
  status: Status;
  preco: number;
}

const items: Item[] = [
  { id: 1, nome: "João Pedro", roteiro: "Catedral da Fé", data: "10/04/2026", duracao: "1h", pessoas: 5, status: "Concluido", preco: 300 },
  { id: 2, nome: "Amanda", roteiro: "Catedral da Fé", data: "18/04/2026", duracao: "1h", pessoas: 3, status: "Pendente", preco: 180 },
  { id: 3, nome: "Caio", roteiro: "Catedral da Fé", data: "12/04/2026", duracao: "1h", pessoas: 5, status: "Cancelado", preco: 300 },
  { id: 4, nome: "Jordana", roteiro: "Catedral da Fé", data: "09/04/2026", duracao: "1h", pessoas: 2, status: "Concluido", preco: 120 },
];

const imgRoteiro = "/assets/Catedral_da_fe.webp";

function StatusBadge({ status }: { status: Status }) {
  const config = {
    Concluido: { className: "bg-green-500 text-white hover:bg-green-500", label: "Concluído" },
    Pendente: { className: "bg-amber-400 text-gray-900 hover:bg-amber-400", label: "Pendente" },
    Cancelado: { className: "bg-red-500 text-white hover:bg-red-500", label: "Cancelado" },
  }[status];

  return (
    <Badge className={`min-w-[120px] justify-center px-4 py-1.5 text-sm font-semibold ${config.className}`}>
      {config.label}
    </Badge>
  );
}

export default function TelaHistorico() {
  const [busca, setBusca] = useState("");

  const filtrados = items.filter(
    (i) =>
      i.nome.toLowerCase().includes(busca.toLowerCase()) ||
      i.roteiro.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <GuidePanelLayout activeTab="historico">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Histórico</h1>
          <p className="text-sm text-muted-foreground">Acompanhe passeios realizados e cancelados</p>
        </div>

        <SearchBar value={busca} onChange={setBusca} placeholder="Buscar por cliente ou roteiro..." />

        <ul className="flex flex-col gap-4">
          {filtrados.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-1 items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm md:grid-cols-[140px_1fr_auto]"
            >
              <img
                src={imgRoteiro}
                alt={item.roteiro}
                className="h-24 w-full rounded-lg object-cover md:h-[100px] md:w-[140px]"
              />
              <div className="flex flex-col gap-2">
                <div>
                  <strong className="block text-lg font-semibold">{item.nome}</strong>
                  <span className="text-base text-muted-foreground">{item.roteiro}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {item.data}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {item.duracao}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {item.pessoas} pessoas
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between gap-3 border-t border-border pt-3 md:flex-col md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <StatusBadge status={item.status} />
                <span className="text-lg font-bold text-green-600">R$ {item.preco}</span>
              </div>
            </li>
          ))}
        </ul>

        {filtrados.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Nenhum registro encontrado.</p>
        )}
      </div>
    </GuidePanelLayout>
  );
}
