"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Flag, Heart, Languages, MapPin, Route, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { Estrelas } from "@/components/AvaliacaoEstrelas";
import AvaliacoesSecao from "@/components/AvaliacoesSecao";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRequireLogin } from "@/hooks/use-require-login";
import { getApiErrorMessage } from "@/services/auth";
import {
  avaliacoesRoteiro,
  denunciarRoteiro,
  desfavoritar,
  detalheRoteiro,
  favoritar,
  formatBRL,
  type AvaliacoesRoteiro,
  type RoteiroDetalhe,
} from "@/services/dominio";

export default function TelaAvaliacao() {
  const router = useRouter();
  const exigirLogin = useRequireLogin();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const [roteiro, setRoteiro] = useState<RoteiroDetalhe | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacoesRoteiro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [favorito, setFavorito] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [denunciaAberta, setDenunciaAberta] = useState(false);
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (!id) return;
    detalheRoteiro(id)
      .then(setRoteiro)
      .catch(() => setRoteiro(null))
      .finally(() => setCarregando(false));
    avaliacoesRoteiro(id).then(setAvaliacoes).catch(() => setAvaliacoes(null));
  }, [id]);

  const alternarFavorito = () => {
    if (!id) return;
    const resultado = exigirLogin({ motivo: "Entre para salvar este passeio nos favoritos.", tipos: ["TURISTA"] });
    if (resultado === "tipo-invalido") setAviso("Somente contas de turista podem usar favoritos.");
    if (resultado !== "ok") return;
    const proximo = !favorito;
    setFavorito(proximo);
    const acao = proximo ? favoritar(id) : desfavoritar(id);
    acao.catch(() => setFavorito(!proximo));
  };

  const reservar = () => {
    const resultado = exigirLogin({
      motivo: "Entre para reservar este passeio.",
      voltarPara: `/home/tela-avaliacao/detalhes?id=${id}`,
      tipos: ["TURISTA"],
    });
    if (resultado === "tipo-invalido") {
      setAviso("Somente contas de turista podem reservar passeios.");
      return;
    }
    if (resultado === "ok") router.push(`/home/tela-avaliacao/detalhes?id=${id}`);
  };

  const abrirDenuncia = () => {
    if (exigirLogin({ motivo: "Entre para denunciar este roteiro." }) === "ok") setDenunciaAberta(true);
  };

  const enviarDenuncia = () => {
    if (!id || !motivo.trim()) return;
    denunciarRoteiro(id, motivo.trim())
      .then(() => {
        setAviso("Denúncia enviada. Vamos analisar.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        setDenunciaAberta(false);
        setMotivo("");
      })
      .catch((error) => setAviso(getApiErrorMessage(error, "Não foi possível denunciar.")));
  };

  const nota = avaliacoes?.notaMedia ?? roteiro?.notaMedia ?? 0;
  const totalAvaliacoes = avaliacoes?.total ?? roteiro?.totalAvaliacoes ?? 0;

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#f4f4f6] font-sans">
        <AppHeader />
        <main className="mx-auto w-full max-w-[1100px] space-y-6 p-4 md:p-6">
          <div className="h-[320px] animate-pulse rounded-2xl bg-white" />
          <div className="h-40 animate-pulse rounded-2xl bg-white" />
        </main>
      </div>
    );
  }

  if (!roteiro) {
    return (
      <div className="min-h-screen bg-[#f4f4f6] font-sans">
        <AppHeader />
        <main className="mx-auto w-full max-w-[600px] p-6">
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
            <p className="font-bold text-[#1F3A66]">Roteiro não encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">Ele pode ter saído do ar. Veja outras opções no catálogo.</p>
            <Button onClick={() => router.push("/roteiros")} className="mt-4 rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]">
              Ver roteiros
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1100px] space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm text-muted-foreground">
            <button type="button" onClick={() => router.push("/roteiros")} className="hover:underline">
              Catálogo
            </button>
            <span className="mx-1">/</span>
            <span className="font-semibold text-[#F27420]">{roteiro.titulo}</span>
          </p>
          <Button variant="outline" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {aviso && (
          <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {aviso}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm">
            <img
              src={roteiro.imageUrl || "/assets/hero.jpg"}
              alt={roteiro.titulo}
              className="h-[280px] w-full object-cover md:h-[380px]"
            />
            <button
              type="button"
              onClick={alternarFavorito}
              aria-label={favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
              aria-pressed={favorito}
              className="absolute right-4 top-4 rounded-full bg-white/95 p-3 shadow-md transition-transform hover:scale-105"
            >
              <Heart className={`h-5 w-5 ${favorito ? "fill-red-500 text-red-500" : "text-[#1F3A66]"}`} />
            </button>
          </div>

          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div>
              <Badge className="mb-3 bg-[#1F3A66]/10 capitalize text-[#1F3A66] hover:bg-[#1F3A66]/10">
                {roteiro.categoria}
              </Badge>
              <h1 className="text-2xl font-bold leading-tight text-[#1F3A66] md:text-3xl">{roteiro.titulo}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => router.push(`/guias/${roteiro.guia.id}`)}
                  className="font-semibold text-[#1F3A66] hover:underline"
                >
                  {roteiro.guia.nomeCompleto}
                </button>
                <a
                  href="#titulo-avaliacoes"
                  className="inline-flex items-center gap-1.5 font-bold text-[#F27420] hover:underline"
                  aria-label={
                    totalAvaliacoes > 0
                      ? `Nota ${nota} com ${totalAvaliacoes} avaliações. Ver avaliações`
                      : "Sem avaliações ainda"
                  }
                >
                  <Estrelas nota={nota} />
                  {totalAvaliacoes > 0
                    ? `${nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} · ${totalAvaliacoes} ${
                        totalAvaliacoes === 1 ? "avaliação" : "avaliações"
                      }`
                    : "Sem avaliações ainda"}
                </a>
              </div>
            </div>

            <p className="leading-relaxed text-muted-foreground">{roteiro.descricao}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <span className="inline-flex items-center gap-2 text-[#1F3A66]">
                <MapPin className="h-4 w-4 text-[#F27420]" />
                {roteiro.local}
              </span>
              <span className="inline-flex items-center gap-2 text-[#1F3A66]">
                <Clock className="h-4 w-4 text-[#F27420]" />
                {roteiro.duracao}
              </span>
              <span className="inline-flex items-center gap-2 text-[#1F3A66]">
                <Route className="h-4 w-4 text-[#F27420]" />
                {roteiro.distancia}
              </span>
              <span className="inline-flex items-center gap-2 text-[#1F3A66]">
                <Users className="h-4 w-4 text-[#F27420]" />
                até {roteiro.capacidade} pessoas
              </span>
              {roteiro.idioma && (
                <span className="inline-flex items-center gap-2 text-[#1F3A66]">
                  <Languages className="h-4 w-4 text-[#F27420]" />
                  {roteiro.idioma}
                </span>
              )}
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">por pessoa</p>
                <p className="text-3xl font-bold text-[#F27420]">{formatBRL(roteiro.preco)}</p>
              </div>
              <Button
                size="lg"
                onClick={reservar}
                className="rounded-full bg-[#F27420] px-8 font-bold hover:bg-[#d65f15]"
              >
                Reservar agora
              </Button>
            </div>
          </div>
        </div>

        {(roteiro.incluso?.length > 0 || roteiro.politicaCancelamento?.length > 0) && (
          <div className="grid gap-6 md:grid-cols-2">
            {roteiro.incluso?.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="mb-3 font-bold text-[#1F3A66]">O que está incluso</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {roteiro.incluso.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F27420]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {roteiro.politicaCancelamento?.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="mb-3 font-bold text-[#1F3A66]">Política de cancelamento</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {roteiro.politicaCancelamento.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F3A66]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        <AvaliacoesSecao avaliacoes={avaliacoes} notaFallback={nota} totalFallback={totalAvaliacoes} />

        <div className="pb-6">
          {denunciaAberta ? (
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <h3 className="font-bold text-[#1F3A66]">Denunciar este roteiro</h3>
              <p className="mt-1 text-sm text-muted-foreground">Conte o que aconteceu. Nossa equipe analisa cada denúncia.</p>
              <Textarea
                value={motivo}
                onChange={(event) => setMotivo(event.target.value)}
                rows={3}
                placeholder="Descreva o problema"
                className="mt-3"
              />
              <div className="mt-3 flex gap-2">
                <Button onClick={enviarDenuncia} disabled={!motivo.trim()} className="bg-[#1F3A66] hover:bg-[#152847]">
                  Enviar denúncia
                </Button>
                <Button variant="ghost" onClick={() => setDenunciaAberta(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={abrirDenuncia}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-red-600"
            >
              <Flag className="h-4 w-4" />
              Denunciar este roteiro
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
