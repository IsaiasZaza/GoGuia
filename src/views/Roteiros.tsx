"use client";

import { useState } from "react";
import { Clock, Heart, Map, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const imgBikeBrasilia = "/assets/bike_Eixo_Monumental.jpg";
const imgAngra = "/assets/Angra.jpg";
const imgPaulista = "/assets/Av_Paulista.jpg";
const imgFazendinhaDF = "/assets/fazendinha_df.jpg";
const imgHipismoBrasilia = "/assets/hipismo.jpg";

interface TourItem {
  id: string;
  title: string;
  description: string;
  location: string;
  guideName: string;
  price: number;
  duration: string;
  distance: string;
  imageUrl: string;
  category: "lazer" | "cultural" | "rural";
}

const CATEGORIES = ["TUDO", "Lazer", "Cultural", "Rural"] as const;

export default function RoteirosScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("TUDO");
  const [searchQuery, setSearchQuery] = useState("");

  const tours: TourItem[] = [
    {
      id: "1",
      title: "Bike Tour do Eixo Monumental - Brasília",
      description:
        "Conheça parte do projeto urbanístico de Lúcio Costa e obras de Oscar Niemeyer, um dos maiores arquitetos de todos os tempos.",
      location: "Brasília / DF",
      guideName: "Pedro Marcos França",
      price: 180.0,
      duration: "3 h",
      distance: "15 Km",
      category: "cultural",
      imageUrl: imgBikeBrasilia,
    },
    {
      id: "2",
      title: "Um Dia no Rio - City Tour Completo",
      description:
        "Principais pontos turísticos do Rio de Janeiro em um roteiro único e dinâmico, com conforto, segurança e guia credenciado.",
      location: "Rio de Janeiro / RJ",
      guideName: "Carlos Alberto Lima",
      price: 300.0,
      duration: "8 h",
      distance: "45 Km",
      category: "lazer",
      imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=500",
    },
    {
      id: "3",
      title: "Excursão de Dia Inteiro a Angra dos Reis e Ilha Grande",
      description:
        "Explore dois dos destinos mais paradisíacos do Brasil, onde o mar azul cristalino encontra a mata atlântica exuberante.",
      location: "Angra dos Reis / RJ",
      guideName: "Mariana Costa Reis",
      price: 250.0,
      duration: "10 h",
      distance: "120 Km",
      category: "lazer",
      imageUrl: imgAngra,
    },
    {
      id: "4",
      title: "Passeio a Pé pela Avenida Paulista",
      description:
        "Desvende as histórias da avenida mais famosa do Brasil em um tour guiado cheio de curiosidades e cultura.",
      location: "São Paulo / SP",
      guideName: "Fernanda Souza",
      price: 90.0,
      duration: "2 h",
      distance: "4 Km",
      category: "cultural",
      imageUrl: imgPaulista,
    },
    {
      id: "5",
      title: "Centro Hípico Lago Sul - Brasília",
      description:
        "Cavalgada inesquecível por trilhas exclusivas com paisagens deslumbrantes, ideal para iniciantes e experientes.",
      location: "Brasília / DF",
      guideName: "Ricardo Silveira",
      price: 150.0,
      duration: "2 h",
      distance: "8 Km",
      category: "rural",
      imageUrl: imgHipismoBrasilia,
    },
    {
      id: "6",
      title: "Fazenda Azul",
      description:
        "Passeio pela fazenda Azul com cachoeiras, animais exóticos e um excelente piquenique ao ar livre.",
      location: "Planaltina / DF",
      guideName: "Antônio Bezerra",
      price: 120.0,
      duration: "5 h",
      distance: "12 Km",
      category: "rural",
      imageUrl: imgFazendinhaDF,
    },
  ];

  const filteredTours = tours.filter((tour) => {
    const matchesCategory =
      selectedCategory === "TUDO" || tour.category === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    return (
      matchesCategory &&
      (tour.title.toLowerCase().includes(q) || tour.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f6] font-sans">
      <AppHeader activePage="roteiros" />

      <div className="mx-auto flex w-full max-w-[1300px] flex-1 flex-col gap-6 p-4 md:flex-row md:p-6">
        <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto md:w-[200px] md:flex-col md:pt-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-bold transition-all",
                  isSelected
                    ? "bg-[#F27420] text-white shadow-sm"
                    : "text-[#1F3A66] hover:bg-white/80"
                )}
              >
                {cat}
              </button>
            );
          })}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-5">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar pelo nome ou local..."
          />

          <div className="flex flex-col gap-4">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <article
                  key={tour.id}
                  className="group flex flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row"
                >
                  <div className="relative h-[170px] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-[260px]">
                    <img
                      src={tour.imageUrl}
                      alt={tour.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      className="absolute left-2 top-2 rounded-full bg-white/90 p-1.5 shadow-md transition-colors hover:bg-white"
                      aria-label="Favoritar"
                    >
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h2 className="truncate text-lg font-bold text-foreground md:text-xl">
                        {tour.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {tour.description}
                      </p>
                      <div className="mt-3 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F3A66]">
                          <MapPin className="h-3.5 w-3.5" />
                          {tour.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          {tour.guideName}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-border pt-4 sm:w-[140px] sm:flex-col sm:items-end sm:justify-between sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                    <div className="flex items-center gap-2 rounded bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {tour.duration}
                      <span>/</span>
                      <Map className="h-3 w-3" />
                      {tour.distance}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#1F3A66]">R$</div>
                      <div className="text-2xl font-black text-[#1F3A66]">
                        {tour.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <Button
                        onClick={() => router.push("/home/tela-avaliacao")}
                        className="mt-2 w-full bg-[#1F3A66] font-bold hover:bg-[#152847]"
                      >
                        Ver
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
                <p className="font-medium text-muted-foreground">
                  Nenhum roteiro encontrado para os filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
