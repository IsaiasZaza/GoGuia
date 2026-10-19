"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Star } from "lucide-react";
import { rotuloNota } from "@/components/AvaliacaoEstrelas";
import AppHeader from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { formatBRL, perfilGuiaPublico, type PerfilGuia } from "@/services/dominio";

export default function PerfilGuiaPublico() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilGuia | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    perfilGuiaPublico(params.id)
      .then(setPerfil)
      .catch(() => setErro("Quando o perfil estiver publicado, a bio e os roteiros aparecem aqui."));
  }, [params.id]);

  const lugar = perfil ? [perfil.cidade, perfil.estado].filter(Boolean).join(" / ") : "";

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans">
      <AppHeader />
      <main className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
        {!perfil && !erro && <p className="text-sm text-muted-foreground">Carregando perfil...</p>}
        {erro && (
          <div className="rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
            <p className="text-lg font-bold text-[#1F3A66]">Perfil indisponível</p>
            <p className="mt-2 text-sm text-muted-foreground">{erro}</p>
          </div>
        )}
        {perfil && (
          <>
            <section className="overflow-hidden rounded-3xl bg-[#1F3A66] text-white shadow-sm">
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-2xl font-bold ring-4 ring-white/20">
                  {perfil.fotoUrl ? (
                    <img src={perfil.fotoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    perfil.nomeCompleto.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#F27420]">Guia local</p>
                  <h1 className="mt-1 text-3xl font-bold">{perfil.nomeCompleto}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                    <MapPin className="h-4 w-4" />
                    {lugar || "Cidade não informada"}
                    {perfil.idiomas.length > 0 ? ` · ${perfil.idiomas.join(", ")}` : ""}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                    <Star className="h-4 w-4 fill-[#F27420] text-[#F27420]" />
                    {perfil.totalAvaliacoes > 0
                      ? `${perfil.notaMedia.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} · ${perfil.totalAvaliacoes} ${
                          perfil.totalAvaliacoes === 1 ? "avaliação" : "avaliações"
                        } · ${rotuloNota(perfil.notaMedia)}`
                      : "Sem avaliações ainda"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#1F3A66]">Sobre</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {perfil.bio || "Este guia ainda não escreveu uma bio."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-bold text-[#1F3A66]">Roteiros</h2>
              {perfil.roteiros.map((roteiro) => (
                <article key={roteiro.id} className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-sm sm:flex-row sm:items-center">
                  <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-40">
                    {roteiro.imageUrl && <img src={roteiro.imageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1 px-1">
                    <h3 className="truncate font-bold text-[#1F3A66]">{roteiro.titulo}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{roteiro.descricao}</p>
                    <p className="mt-2 text-sm font-bold text-[#F27420]">{formatBRL(roteiro.preco)} · {roteiro.duracao}</p>
                  </div>
                  <Button
                    className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
                    onClick={() => router.push(`/home/tela-avaliacao?id=${roteiro.id}`)}
                  >
                    Ver roteiro
                  </Button>
                </article>
              ))}
              {perfil.roteiros.length === 0 && (
                <div className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center text-sm text-muted-foreground">
                  Nenhum roteiro ativo no momento.
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
