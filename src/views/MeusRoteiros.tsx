"use client";

import { useState } from "react";
import { Ban, Clock, DollarSign, Edit, Plus, Users } from "lucide-react";
import GuidePanelLayout from "@/components/layout/GuidePanelLayout";
import SearchBar from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const imgCatedral = "/assets/Catedral_da_fe.webp";

interface Roteiro {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  capacidade: number;
  preco: number;
  imageUrl: string;
  ativo: boolean;
}

export default function MeusRoteiros() {
  const [busca, setBusca] = useState("");

  const [roteiros, setRoteiros] = useState<Roteiro[]>([
    {
      id: "1",
      titulo: "Catedral da Fé",
      descricao:
        "Mergulho na fé, história e arquitetura da Catedral da Fé, um dos marcos mais impressionantes da cidade.",
      duracao: "1h",
      capacidade: 5,
      preco: 300,
      imageUrl: imgCatedral,
      ativo: true,
    },
    {
      id: "2",
      titulo: "Catedral da Fé",
      descricao:
        "Mergulho na fé, história e arquitetura da Catedral da Fé, um dos marcos mais impressionantes da cidade.",
      duracao: "1h",
      capacidade: 5,
      preco: 300,
      imageUrl: imgCatedral,
      ativo: true,
    },
    {
      id: "3",
      titulo: "Catedral da Fé",
      descricao:
        "Mergulho na fé, história e arquitetura da Catedral da Fé, um dos marcos mais impressionantes da cidade.",
      duracao: "1h",
      capacidade: 5,
      preco: 300,
      imageUrl: imgCatedral,
      ativo: true,
    },
    {
      id: "4",
      titulo: "Catedral da Fé",
      descricao:
        "Mergulho na fé, história e arquitetura da Catedral da Fé, um dos marcos mais impressionantes da cidade.",
      duracao: "1h",
      capacidade: 5,
      preco: 300,
      imageUrl: imgCatedral,
      ativo: false,
    },
  ]);

  const handleDesabilitar = (id: string) => {
    setRoteiros((prev) => prev.map((r) => (r.id === id ? { ...r, ativo: !r.ativo } : r)));
  };

  const roteirosFiltrados = roteiros.filter((r) =>
    r.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <GuidePanelLayout activeTab="roteiros">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Meus Roteiros</h1>
          <p className="text-sm text-muted-foreground">Gerencie os passeios que você oferece</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={busca} onChange={setBusca} placeholder="Buscar roteiros..." className="flex-1" />
          <Button className="shrink-0 bg-[#F27420] font-bold hover:bg-[#d65f15]">
            <Plus className="h-4 w-4" />
            Criar roteiro
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {roteirosFiltrados.map((roteiro) => (
            <article
              key={roteiro.id}
              className={`flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-opacity sm:flex-row ${
                roteiro.ativo ? "border-border opacity-100" : "border-border opacity-60"
              }`}
            >
              <div className="h-[110px] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-[160px]">
                <img src={roteiro.imageUrl} alt={roteiro.titulo} className="h-full w-full object-cover" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-bold">{roteiro.titulo}</h3>
                    {!roteiro.ativo && (
                      <Badge variant="secondary" className="text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {roteiro.descricao}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {roteiro.duracao}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> {roteiro.capacidade} pessoas
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                    <DollarSign className="h-3.5 w-3.5" /> R$ {roteiro.preco}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-row gap-2 sm:w-[130px] sm:flex-col">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Edit className="h-3.5 w-3.5" /> Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDesabilitar(roteiro.id)}
                  className="flex-1 border-red-200 text-xs text-red-500 hover:bg-red-50"
                >
                  <Ban className="h-3.5 w-3.5" />
                  {roteiro.ativo ? "Desabilitar" : "Habilitar"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </GuidePanelLayout>
  );
}
