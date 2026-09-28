"use client";

import { useEffect, useState } from "react";
import { Heart, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { desfavoritar, favoritar, listarFavoritos, listarRoteiros, type Favorito } from "@/services/dominio";

interface Passeio {
  id: string;
  titulo: string;
  descricao: string;
  imageUrl: string;
}

function ModalBusca({
  jaSalvos,
  onClose,
  onAdicionar,
}: {
  jaSalvos: string[];
  onClose: () => void;
  onAdicionar: (p: Passeio) => void;
}) {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Passeio[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCarregando(true);
      listarRoteiros({ q: busca })
        .then((data) =>
          setResultados(
            data.items.map((item) => ({
              id: item.id,
              titulo: item.titulo,
              descricao: item.descricao,
              imageUrl: item.imageUrl || "",
            }))
          )
        )
        .catch(() => setResultados([]))
        .finally(() => setCarregando(false));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [busca]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1F3A66]/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F3A66]">Salvar um roteiro</h2>
            <p className="text-sm text-muted-foreground">Busque pelo nome ou pelo local do passeio.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-[#f4f4f6] px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Bike Tour, Brasília, trilha..."
              className="h-11 flex-1 bg-transparent text-sm outline-none"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-5">
          {carregando &&
            [0, 1, 2].map((item) => (
              <div key={item} className="h-24 animate-pulse rounded-2xl bg-muted" />
            ))}

          {!carregando &&
            resultados.map((passeio) => {
              const salvo = jaSalvos.includes(passeio.id);
              return (
                <article
                  key={passeio.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3"
                >
                  <img
                    src={passeio.imageUrl || "/assets/hero.jpg"}
                    alt=""
                    className="h-20 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-[#1F3A66]">{passeio.titulo}</h4>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {passeio.descricao}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={salvo}
                    onClick={() => {
                      if (salvo) return;
                      onAdicionar(passeio);
                    }}
                    className={
                      salvo
                        ? "shrink-0 rounded-full bg-green-100 font-bold text-green-700 hover:bg-green-100"
                        : "shrink-0 rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
                    }
                  >
                    <Heart className={`h-4 w-4 ${salvo ? "fill-current" : ""}`} />
                    {salvo ? "Salvo" : "Salvar"}
                  </Button>
                </article>
              );
            })}

          {!carregando && resultados.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border px-4 py-12 text-center">
              <p className="font-bold text-[#1F3A66]">Nenhum roteiro encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {busca ? `Não achamos nada para “${busca}”.` : "Os passeios do catálogo aparecem aqui."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Favoritos() {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [favoritos, setFavoritos] = useState<Passeio[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarFavoritos()
      .then((data) =>
        setFavoritos(
          data.items.map((item: Favorito) => ({
            id: item.roteiroId,
            titulo: item.titulo,
            descricao: item.descricao,
            imageUrl: item.imageUrl || "",
          }))
        )
      )
      .catch(() => setFavoritos([]))
      .finally(() => setCarregando(false));
  }, []);

  const handleDesfavoritar = (id: string) => {
    desfavoritar(id)
      .then(() => setFavoritos((prev) => prev.filter((f) => f.id !== id)))
      .catch(() => undefined);
  };

  const handleAdicionar = (passeio: Passeio) => {
    if (favoritos.some((item) => item.id === passeio.id)) return;
    favoritar(passeio.id)
      .then(() => setFavoritos((prev) => (prev.some((item) => item.id === passeio.id) ? prev : [...prev, passeio])))
      .catch(() => undefined);
  };

  const favoritosFiltrados = favoritos.filter((f) =>
    f.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f6] font-sans">
      <AppHeader activePage="favoritos" />

      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A66]">Meus favoritos</h1>
            <p className="text-sm text-muted-foreground">
              {carregando
                ? "Carregando os passeios salvos..."
                : favoritos.length === 0
                ? "Passeios que você quer fazer depois"
                : `${favoritos.length} ${favoritos.length === 1 ? "passeio salvo" : "passeios salvos"}`}
            </p>
          </div>
          <Button
            onClick={() => setModalAberto(true)}
            className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <SearchBar value={busca} onChange={setBusca} placeholder="Buscar nos favoritos..." />

        {carregando && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        )}

        {!carregando && favoritosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoritosFiltrados.map((favorito) => (
              <article
                key={favorito.id}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => router.push(`/home/tela-avaliacao?id=${favorito.id}`)}
                  className="relative block h-44 w-full overflow-hidden bg-muted"
                  aria-label={`Abrir ${favorito.titulo}`}
                >
                  <img
                    src={favorito.imageUrl || "/assets/hero.jpg"}
                    alt={favorito.titulo}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#1F3A66]/50 to-transparent" />
                </button>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold leading-snug text-[#1F3A66]">{favorito.titulo}</h3>
                    <button
                      type="button"
                      onClick={() => handleDesfavoritar(favorito.id)}
                      className="shrink-0 rounded-full bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100"
                      aria-label="Remover dos favoritos"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {favorito.descricao}
                  </p>
                  <Button
                    onClick={() => router.push(`/home/tela-avaliacao?id=${favorito.id}`)}
                    className="w-full rounded-full bg-[#1F3A66] font-bold hover:bg-[#152847]"
                  >
                    Ver roteiro
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!carregando && favoritosFiltrados.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F27420]/10 text-[#F27420]">
              <Heart className="h-6 w-6" />
            </div>
            <p className="font-bold text-[#1F3A66]">
              {busca ? "Nenhum favorito para esta busca" : "Você ainda não salvou nenhum passeio"}
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {busca
                ? `Não achamos “${busca}” na sua lista. Tente outro nome ou adicione um roteiro novo.`
                : "Toque no coração no catálogo ou adicione um roteiro aqui para consultar depois."}
            </p>
            <Button
              onClick={() => (busca ? setBusca("") : setModalAberto(true))}
              className="mt-5 rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
            >
              {busca ? "Limpar busca" : "Adicionar favorito"}
            </Button>
          </div>
        )}
      </main>

      {modalAberto && (
        <ModalBusca
          jaSalvos={favoritos.map((item) => item.id)}
          onClose={() => setModalAberto(false)}
          onAdicionar={handleAdicionar}
        />
      )}
    </div>
  );
}
