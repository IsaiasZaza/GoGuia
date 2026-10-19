"use client";

import { useEffect, useState } from "react";
import { Clock, Heart, MapPin, Search, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { textoNota } from "@/components/AvaliacaoEstrelas";
import AppHeader from "@/components/layout/AppHeader";
import LocalizacaoSelect from "@/components/layout/LocalizacaoSelect";
import { Button } from "@/components/ui/button";
import { useRequireLogin } from "@/hooks/use-require-login";
import { Card, CardContent } from "@/components/ui/card";
import { desfavoritar, favoritar, formatBRL, listarRoteiros, type RoteiroListaItem } from "@/services/dominio";

const imgHero = "/assets/hero.jpg";

export default function Home() {
  const router = useRouter();
  const exigirLogin = useRequireLogin();
  const [passeios, setPasseios] = useState<RoteiroListaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [localFiltro, setLocalFiltro] = useState("");
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([listarRoteiros({ destaque: true }).catch(() => ({ items: [] })), listarRoteiros({})])
      .then(([destaques, todos]) => {
        const ids = new Set(destaques.items.map((item) => item.id));
        const complemento = todos.items.filter((item) => !ids.has(item.id));
        setPasseios([...destaques.items, ...complemento].slice(0, 6));
      })
      .catch(() => setPasseios([]))
      .finally(() => setCarregando(false));
  }, []);

  const buscar = () => {
    const params = new URLSearchParams();
    if (busca.trim()) params.set("q", busca.trim());
    if (localFiltro) params.set("local", localFiltro);
    const texto = params.toString();
    router.push(texto ? `/roteiros?${texto}` : "/roteiros");
  };

  const alternarFavorito = (id: string) => {
    if (exigirLogin({ motivo: "Entre para salvar passeios nos favoritos.", tipos: ["TURISTA"] }) !== "ok") return;
    const proximo = !favoritos[id];
    setFavoritos((atual) => ({ ...atual, [id]: proximo }));
    const acao = proximo ? favoritar(id) : desfavoritar(id);
    acao.catch(() => setFavoritos((atual) => ({ ...atual, [id]: !proximo })));
  };

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans">
      <AppHeader activePage="home" />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imgHero})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F3A66]/90 via-[#1F3A66]/70 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <h2 className="mb-4 max-w-xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
            Para onde você quer ir?
          </h2>
          <p className="mb-8 max-w-lg text-base text-white/85 md:text-lg">
            Encontre os melhores guias da região para passeios turísticos inesquecíveis.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              buscar();
            }}
            className="flex max-w-3xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Busque por cidade, roteiro ou guia"
                aria-label="Buscar roteiros"
                className="h-12 w-full rounded-full border-0 bg-white pl-11 pr-4 text-sm shadow-lg outline-none ring-[#F27420] focus:ring-2"
              />
            </div>
            <LocalizacaoSelect value={localFiltro} onChange={setLocalFiltro} className="sm:w-[240px]" />
            <Button type="submit" size="lg" className="h-12 rounded-full bg-[#F27420] px-8 font-bold hover:bg-[#d65f15]">
              Buscar
            </Button>
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-[#1F3A66]">Bem-vindo ao GoGuia!</h3>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Conectamos você a guias experientes para descobrir destinos incríveis com segurança e conforto.
          </p>
        </div>

        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h4 className="text-xl font-bold text-[#1F3A66]">Você pode gostar</h4>
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

          {carregando ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-[300px] animate-pulse rounded-xl bg-white" />
              ))}
            </div>
          ) : passeios.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <p className="font-bold text-[#1F3A66]">Nenhum roteiro publicado ainda</p>
              <p className="mt-1 text-sm text-muted-foreground">Assim que os guias publicarem, os passeios aparecem aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {passeios.map((passeio) => (
                <Card
                  key={passeio.id}
                  className="group flex cursor-pointer flex-col overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => router.push(`/home/tela-avaliacao?id=${passeio.id}`)}
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={passeio.imageUrl || imgHero}
                      alt={passeio.titulo}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        alternarFavorito(passeio.id);
                      }}
                      className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-transform hover:scale-110"
                      aria-label={favoritos[passeio.id] ? "Remover dos favoritos" : "Salvar nos favoritos"}
                      aria-pressed={Boolean(favoritos[passeio.id])}
                    >
                      <Heart
                        className={`h-4 w-4 ${favoritos[passeio.id] ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                      />
                    </button>
                  </div>
                  <CardContent className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold leading-snug text-[#1F3A66]">{passeio.titulo}</h5>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#F27420]">
                        <Star className="h-3 w-3 fill-current" />
                        {textoNota(passeio.notaMedia, passeio.totalAvaliacoes)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {passeio.local}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {passeio.duracao}
                      </span>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <span className="truncate text-xs text-muted-foreground">{passeio.guia.nomeCompleto}</span>
                      <span className="font-bold text-[#1F3A66]">{formatBRL(passeio.preco)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
