"use client";

import { useMemo, useState } from "react";
import { Estrelas, rotuloNota } from "@/components/AvaliacaoEstrelas";
import { cn } from "@/lib/utils";
import type { AvaliacoesRoteiro } from "@/services/dominio";

type Ordem = "recentes" | "melhores" | "piores";

const ORDENS: { id: Ordem; label: string }[] = [
  { id: "recentes", label: "Mais recentes" },
  { id: "melhores", label: "Melhor nota" },
  { id: "piores", label: "Pior nota" },
];

interface AvaliacoesSecaoProps {
  avaliacoes: AvaliacoesRoteiro | null;
  notaFallback: number;
  totalFallback: number;
}

export default function AvaliacoesSecao({ avaliacoes, notaFallback, totalFallback }: AvaliacoesSecaoProps) {
  const [filtroNota, setFiltroNota] = useState<number | null>(null);
  const [ordem, setOrdem] = useState<Ordem>("recentes");

  const nota = avaliacoes?.notaMedia ?? notaFallback;
  const total = avaliacoes?.total ?? totalFallback;
  const comentariosApi = avaliacoes?.comentarios;

  // A API devolve a distribuição de 5 estrelas para 1. Associamos cada linha à sua nota.
  const linhas = (avaliacoes?.distribuicao ?? []).map((item, indice) => ({
    ...item,
    estrelas: 5 - indice,
    percentual: total > 0 ? Math.round((item.quantidade / total) * 100) : 0,
  }));

  const visiveis = useMemo(() => {
    const comentarios = comentariosApi ?? [];
    const lista = filtroNota ? comentarios.filter((item) => item.nota === filtroNota) : [...comentarios];
    if (ordem === "melhores") lista.sort((a, b) => b.nota - a.nota);
    if (ordem === "piores") lista.sort((a, b) => a.nota - b.nota);
    if (ordem === "recentes") lista.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    return lista;
  }, [comentariosApi, filtroNota, ordem]);

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm" aria-labelledby="titulo-avaliacoes">
      <h2 id="titulo-avaliacoes" className="text-lg font-bold text-[#1F3A66]">
        Avaliações de quem já fez este passeio
      </h2>

      {total === 0 ? (
        <p className="mt-3 rounded-xl bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground">
          Este roteiro ainda não recebeu avaliações. Quem fizer o passeio poderá contar como foi.
        </p>
      ) : (
        <div className="mt-5 grid gap-8 md:grid-cols-[280px_1fr]">
          <div>
            <div className="rounded-2xl bg-[#1F3A66]/5 p-5 text-center">
              <p className="text-5xl font-extrabold text-[#1F3A66]">
                {nota.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                <span className="text-lg font-semibold text-muted-foreground"> / 5</span>
              </p>
              <Estrelas nota={nota} tamanho="h-6 w-6" className="mt-2" />
              <p className="mt-2 font-bold text-[#F27420]">{rotuloNota(nota)}</p>
              <p className="text-sm text-muted-foreground">
                Baseado em {total} {total === 1 ? "avaliação" : "avaliações"}
              </p>
            </div>

            <ul className="mt-4 space-y-1.5" aria-label="Distribuição das notas">
              {linhas.map((linha) => (
                <li key={linha.estrelas}>
                  <button
                    type="button"
                    disabled={linha.quantidade === 0}
                    onClick={() => setFiltroNota(filtroNota === linha.estrelas ? null : linha.estrelas)}
                    aria-pressed={filtroNota === linha.estrelas}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-muted disabled:cursor-default disabled:hover:bg-transparent",
                      filtroNota === linha.estrelas && "bg-[#F27420]/10"
                    )}
                  >
                    <span className="w-14 shrink-0 text-left font-semibold text-[#1F3A66]">
                      {linha.estrelas} {linha.estrelas === 1 ? "estrela" : "estrelas"}
                    </span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-[#F27420]"
                        style={{ width: `${linha.percentual}%` }}
                      />
                    </span>
                    <span className="w-16 shrink-0 text-right text-muted-foreground">
                      {linha.percentual}% ({linha.quantidade})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por nota">
                <button
                  type="button"
                  onClick={() => setFiltroNota(null)}
                  aria-pressed={filtroNota === null}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                    filtroNota === null
                      ? "border-[#1F3A66] bg-[#1F3A66] text-white"
                      : "border-border text-[#1F3A66] hover:bg-muted"
                  )}
                >
                  Todas
                </button>
                {linhas
                  .filter((linha) => linha.quantidade > 0)
                  .map((linha) => (
                    <button
                      key={linha.estrelas}
                      type="button"
                      onClick={() => setFiltroNota(filtroNota === linha.estrelas ? null : linha.estrelas)}
                      aria-pressed={filtroNota === linha.estrelas}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        filtroNota === linha.estrelas
                          ? "border-[#1F3A66] bg-[#1F3A66] text-white"
                          : "border-border text-[#1F3A66] hover:bg-muted"
                      )}
                    >
                      {linha.estrelas} ★
                    </button>
                  ))}
              </div>

              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Ordenar por
                <select
                  value={ordem}
                  onChange={(event) => setOrdem(event.target.value as Ordem)}
                  className="rounded-md border border-input bg-background px-2 py-1.5 text-xs font-semibold text-[#1F3A66]"
                >
                  {ORDENS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <ul className="divide-y divide-border">
              {visiveis.map((comentario) => (
                <li key={comentario.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1F3A66]/10 text-sm font-bold text-[#1F3A66]">
                      {comentario.autor.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#1F3A66]">{comentario.autor}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comentario.criadoEm).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-0.5">
                      <Estrelas nota={comentario.nota} />
                      <span className="text-xs font-semibold text-[#F27420]">{rotuloNota(comentario.nota)}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{comentario.texto}</p>
                </li>
              ))}
              {visiveis.length === 0 && (
                <li className="py-6 text-center text-sm text-muted-foreground">
                  Nenhuma avaliação com essa nota.{" "}
                  <button type="button" onClick={() => setFiltroNota(null)} className="font-semibold text-[#F27420] hover:underline">
                    Ver todas
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
