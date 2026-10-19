"use client";

import { useEffect, useState } from "react";
import { Clock, Heart, Map, MapPin, Star, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { textoNota } from "@/components/AvaliacaoEstrelas";
import LocalizacaoSelect from "@/components/layout/LocalizacaoSelect";
import SearchBar from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { useRequireLogin } from "@/hooks/use-require-login";
import { cn } from "@/lib/utils";
import { desfavoritar, favoritar, formatBRL, listarRoteiros, type RoteiroListaItem } from "@/services/dominio";

const CATEGORIES = ["TUDO", "Lazer", "Cultural", "Rural"] as const;

export default function RoteirosScreen() {
  const router = useRouter();
  const exigirLogin = useRequireLogin();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("TUDO");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [localFiltro, setLocalFiltro] = useState(searchParams.get("local") || "");
  const [tours, setTours] = useState<RoteiroListaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const categoria = selectedCategory === "TUDO" ? undefined : selectedCategory.toLowerCase();
    setCarregando(true);
    const timer = window.setTimeout(() => {
      listarRoteiros({ q: searchQuery, local: localFiltro, categoria })
        .then((data) => setTours(data.items))
        .catch(() => setTours([]))
        .finally(() => setCarregando(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [selectedCategory, searchQuery, localFiltro]);

  // Reflete os filtros na URL para poder compartilhar e voltar para a mesma busca.
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (localFiltro) params.set("local", localFiltro);
    const texto = params.toString();
    window.history.replaceState(null, "", texto ? `/roteiros?${texto}` : "/roteiros");
  }, [searchQuery, localFiltro]);

  const alternarFavorito = (id: string) => {
    if (exigirLogin({ motivo: "Entre para salvar passeios nos favoritos.", tipos: ["TURISTA"] }) !== "ok") return;
    const proximo = !favoritos[id];
    setFavoritos((atual) => ({ ...atual, [id]: proximo }));
    const acao = proximo ? favoritar(id) : desfavoritar(id);
    acao.catch(() => setFavoritos((atual) => ({ ...atual, [id]: !proximo })));
  };

  const abrir = (id: string) => router.push(`/home/tela-avaliacao?id=${id}`);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f6] font-sans">
      <AppHeader activePage="roteiros" />

      <div className="mx-auto flex w-full max-w-[1300px] flex-1 flex-col gap-6 p-4 md:flex-row md:p-6">
        <aside className="flex h-fit shrink-0 flex-row gap-2 overflow-x-auto rounded-2xl bg-[#1F3A66] p-2 md:w-[210px] md:flex-col">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-bold transition-all",
                  isSelected ? "bg-white text-[#1F3A66]" : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat === "TUDO" ? "Todos" : cat}
              </button>
            );
          })}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar pelo nome ou local..."
              className="flex-1"
            />
            <LocalizacaoSelect value={localFiltro} onChange={setLocalFiltro} className="md:w-[260px]" />
          </div>

          {!carregando && tours.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {tours.length} {tours.length === 1 ? "roteiro encontrado" : "roteiros encontrados"}
            </p>
          )}

          <div className="flex flex-col gap-4">
            {carregando &&
              [0, 1, 2].map((item) => (
                <div key={item} className="h-[200px] animate-pulse rounded-xl border border-border bg-white" />
              ))}

            {!carregando &&
              tours.map((tour) => (
                <article
                  key={tour.id}
                  onClick={() => abrir(tour.id)}
                  className="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row"
                >
                  <div className="relative h-[190px] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-[280px]">
                    <img
                      src={tour.imageUrl || "/assets/hero.jpg"}
                      alt={tour.titulo}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      className="absolute left-2 top-2 rounded-full bg-white/90 p-1.5 shadow-md transition-colors hover:bg-white"
                      aria-label={favoritos[tour.id] ? "Remover dos favoritos" : "Salvar nos favoritos"}
                      aria-pressed={Boolean(favoritos[tour.id])}
                      onClick={(event) => {
                        event.stopPropagation();
                        alternarFavorito(tour.id);
                      }}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          favoritos[tour.id] ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="truncate text-lg font-bold text-[#1F3A66] md:text-xl">{tour.titulo}</h2>
                        <span
                          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-[#F27420]"
                          title={
                            tour.totalAvaliacoes > 0
                              ? `Nota ${tour.notaMedia} de 5, com ${tour.totalAvaliacoes} avaliações`
                              : "Ainda sem avaliações"
                          }
                        >
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {textoNota(tour.notaMedia, tour.totalAvaliacoes)}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {tour.descricao}
                      </p>
                      <div className="mt-3 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F3A66]">
                          <MapPin className="h-3.5 w-3.5" />
                          {tour.local}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          {tour.guia.nomeCompleto}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-border pt-4 sm:w-[150px] sm:flex-col sm:items-end sm:justify-between sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                    <div className="flex items-center gap-2 rounded bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {tour.duracao}
                      <span>/</span>
                      <Map className="h-3 w-3" />
                      {tour.distancia}
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-semibold uppercase text-muted-foreground">por pessoa</div>
                      <div className="text-2xl font-black text-[#1F3A66]">{formatBRL(tour.preco)}</div>
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          abrir(tour.id);
                        }}
                        className="mt-2 w-full rounded-full bg-[#1F3A66] font-bold hover:bg-[#152847]"
                      >
                        Ver roteiro
                      </Button>
                    </div>
                  </div>
                </article>
              ))}

            {!carregando && tours.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
                <p className="font-bold text-[#1F3A66]">Nenhum roteiro encontrado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? `Não achamos nada para "${searchQuery}". Tente outra busca, localização ou categoria.`
                    : localFiltro
                    ? `Ainda não há roteiros em ${localFiltro} nesta categoria.`
                    : "Mude a categoria para ver outros passeios."}
                </p>
                {(searchQuery || localFiltro || selectedCategory !== "TUDO") && (
                  <Button
                    variant="outline"
                    className="mt-4 rounded-full"
                    onClick={() => {
                      setSearchQuery("");
                      setLocalFiltro("");
                      setSelectedCategory("TUDO");
                    }}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
