"use client";

import { useState } from "react";
import { Plus, Search, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const imgPanteao = "/assets/Excursao_Guiada.jpg";

interface Passeio {
  id: string;
  titulo: string;
  descricao: string;
  imageUrl: string;
}

const TITULO_PADRAO = "Panteão Pátria Liberdade";
const DESCRICAO_PADRAO =
  "Um espaço moderno e imponente, marcado por arquitetura única com formas angulares e contemporâneas. Ideal para quem aprecia design inovador e busca um ponto turístico diferenciado.";

const FAVORITOS_INICIAIS: Passeio[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  titulo: TITULO_PADRAO,
  descricao: DESCRICAO_PADRAO,
  imageUrl: imgPanteao,
}));

function ModalBusca({
  onClose,
  onAdicionar,
}: {
  onClose: () => void;
  onAdicionar: (p: Passeio) => void;
}) {
  const [busca, setBusca] = useState("");

  const resultados = Array.from({ length: 3 }, (_, i) => ({
    id: String(10 + i),
    titulo: TITULO_PADRAO,
    descricao: DESCRICAO_PADRAO,
    imageUrl: imgPanteao,
  })).filter((p) => busca === "" || p.titulo.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-[600px] overflow-hidden shadow-2xl animate-fade-in">
        <div className="relative border-b p-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center overflow-hidden rounded-lg bg-[#1F3A66]">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar pelo nome ou local..."
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-white/60 outline-none"
            />
            <button type="button" className="px-4 py-2.5 text-white/80 hover:text-white">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto p-5">
          {resultados.map((passeio) => (
            <div
              key={passeio.id}
              className="flex items-start gap-4 rounded-xl border-2 border-[#F27420] p-3"
            >
              <img
                src={passeio.imageUrl}
                alt={passeio.titulo}
                className="mt-1 h-16 w-16 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 text-sm font-bold">{passeio.titulo}</h4>
                <p className="text-xs leading-relaxed text-muted-foreground">{passeio.descricao}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAdicionar(passeio);
                  onClose();
                }}
                className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F27420] transition-colors hover:bg-[#d65f15]"
                aria-label="Adicionar aos favoritos"
              >
                <Star className="h-5 w-5 fill-white text-white" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-5 pt-0">
          <Button onClick={onClose} className="w-full rounded-xl bg-[#F27420] font-bold hover:bg-[#d65f15]">
            Voltar
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function Favoritos() {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [favoritos, setFavoritos] = useState<Passeio[]>(FAVORITOS_INICIAIS);

  const handleDesfavoritar = (id: string) => {
    setFavoritos((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAdicionar = (passeio: Passeio) => {
    setFavoritos((prev) => [...prev, { ...passeio, id: String(Date.now()) }]);
  };

  const favoritosFiltrados = favoritos.filter((f) =>
    f.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f6] font-sans">
      <AppHeader activePage="favoritos" />

      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 p-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Favoritos</h1>
          <p className="text-sm text-muted-foreground">Passeios salvos para consultar depois</p>
        </div>

        <SearchBar value={busca} onChange={setBusca} placeholder="Buscar favoritos..." />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoritosFiltrados.map((favorito) => (
            <Card key={favorito.id} className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex gap-3 p-4">
                <img
                  src={favorito.imageUrl}
                  alt={favorito.titulo}
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-bold">{favorito.titulo}</h3>
                  <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {favorito.descricao}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDesfavoritar(favorito.id)}
                      className="text-xs"
                    >
                      Remover
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push("/roteiros")}
                      className="flex-1 bg-[#F27420] text-xs font-bold hover:bg-[#d65f15]"
                    >
                      Abrir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#F27420] p-6 text-[#F27420] transition-colors hover:bg-orange-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F27420]">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold">Adicionar favorito</span>
          </button>
        </div>

        {favoritosFiltrados.length === 0 && busca && (
          <p className="text-center text-sm text-muted-foreground">
            Nenhum favorito encontrado para &quot;{busca}&quot;.
          </p>
        )}
      </main>

      {modalAberto && (
        <ModalBusca onClose={() => setModalAberto(false)} onAdicionar={handleAdicionar} />
      )}
    </div>
  );
}
