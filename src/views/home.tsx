"use client";

import { Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const imgVinicola = "/assets/Vinicola.jpg";
const imgCatedral = "/assets/Catedral_da_fe.webp";
const imgPanteao = "/assets/Excursao_Guiada.jpg";
const imgHero = "/assets/hero.jpg";

export default function Home() {
  const router = useRouter();

  const passeios = [
    { id: 1, titulo: "Passeio Vinícola Brasília", autor: "Marcelo Oliveira", nota: 4.9, img: imgVinicola },
    { id: 2, titulo: "Catedral da Fé", autor: "Samuel Dantas", nota: 5.0, img: imgCatedral },
    { id: 3, titulo: "Panteão Pátria Liberdade", autor: "Laura Dias", nota: 4.9, img: imgPanteao },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans">
      <AppHeader activePage="home" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F3A66]/90 via-[#1F3A66]/70 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <h2 className="mb-4 max-w-xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
            Para onde você quer ir?
          </h2>
          <p className="mb-8 max-w-lg text-base text-white/85 md:text-lg">
            Encontre os melhores guias da região para passeios turísticos inesquecíveis.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/roteiros")}
            className="rounded-full bg-[#F27420] px-8 font-bold hover:bg-[#d65f15]"
          >
            Explorar roteiros
          </Button>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-foreground">Bem-vindo ao GoGuia!</h3>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Conectamos você a guias experientes para descobrir destinos incríveis com segurança e conforto.
          </p>
        </div>

        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h4 className="text-xl font-bold text-foreground">Você pode gostar</h4>
              <p className="text-sm text-muted-foreground">Passeios bem avaliados</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/roteiros")}
              className="text-[#F27420] hover:text-[#d65f15]"
            >
              Ver todos →
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {passeios.map((passeio) => (
              <Card
                key={passeio.id}
                className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                onClick={() => router.push("/home/tela-avaliacao")}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={passeio.img}
                    alt={passeio.titulo}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-transform hover:scale-110"
                    aria-label="Favoritar"
                  >
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h5 className="mb-2 text-center font-bold">{passeio.titulo}</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{passeio.autor}</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#F27420]">
                      {passeio.nota}
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
