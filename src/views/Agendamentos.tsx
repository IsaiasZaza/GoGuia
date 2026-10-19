"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  Languages,
  MapPin,
  Minus,
  Plus,
  Route,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import Mapa from "@/components/Mapa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequireLogin } from "@/hooks/use-require-login";
import { getApiErrorMessage } from "@/services/auth";
import {
  criarReserva,
  detalheRoteiro,
  disponibilidadeRoteiro,
  formatBRL,
  type HorarioDisponivel,
  type RoteiroDetalhe,
} from "@/services/dominio";

type Aba = "detalhes" | "mapa";

function hoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export default function Agendamentos() {
  const router = useRouter();
  const exigirLogin = useRequireLogin();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const [roteiro, setRoteiro] = useState<RoteiroDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [data, setData] = useState(hoje());
  const [slots, setSlots] = useState<HorarioDisponivel[] | null>(null);
  const [agendaIndisponivel, setAgendaIndisponivel] = useState(false);
  const [horario, setHorario] = useState("09:00");
  const [quantidade, setQuantidade] = useState(1);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [aba, setAba] = useState<Aba>("detalhes");

  useEffect(() => {
    if (!id) return;
    detalheRoteiro(id)
      .then(setRoteiro)
      .catch(() => setRoteiro(null))
      .finally(() => setCarregando(false));
  }, [id]);

  useEffect(() => {
    if (!id || !data) return;
    disponibilidadeRoteiro(id, data)
      .then((resposta) => {
        setAgendaIndisponivel(false);
        setSlots(resposta.horarios);
        setHorario(resposta.horarios[0]?.horario || "");
        setQuantidade(1);
        setErro(null);
      })
      .catch((error) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setAgendaIndisponivel(true);
          setSlots(null);
          setHorario("09:00");
          setErro(null);
          return;
        }
        setAgendaIndisponivel(false);
        setSlots([]);
        setHorario("");
        setErro(getApiErrorMessage(error, "Não foi possível consultar os horários."));
      });
  }, [id, data]);

  const vagas = slots?.find((slot) => slot.horario === horario)?.vagas ?? roteiro?.capacidade ?? 1;
  const maximo = Math.max(1, vagas);
  const total = (roteiro?.preco ?? 0) * quantidade;

  const reservar = async () => {
    if (!id || !data) return;
    const resultado = exigirLogin({
      motivo: "Entre para agendar este passeio.",
      voltarPara: `/home/tela-avaliacao/detalhes?id=${id}`,
      tipos: ["TURISTA"],
    });
    if (resultado === "tipo-invalido") {
      setErro("Somente contas de turista podem agendar passeios.");
      return;
    }
    if (resultado !== "ok") return;
    if (!horario) {
      setErro("Escolha um horário com vaga.");
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      const reserva = await criarReserva({ roteiroId: id, data, horario, quantidade });
      router.push(`/home/pagamento?id=${reserva.id}`);
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível reservar."));
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#f4f4f6] font-sans">
        <AppHeader />
        <main className="mx-auto w-full max-w-[1100px] space-y-6 p-4 md:p-6">
          <div className="h-[300px] animate-pulse rounded-2xl bg-white" />
          <div className="h-48 animate-pulse rounded-2xl bg-white" />
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
            <p className="font-bold text-[#1F3A66]">Não encontramos este roteiro</p>
            <p className="mt-1 text-sm text-muted-foreground">Volte ao catálogo e escolha outro passeio.</p>
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
            <button type="button" onClick={() => router.push(`/home/tela-avaliacao?id=${id}`)} className="hover:underline">
              Roteiro
            </button>
            <span className="mx-1">/</span>
            <span className="font-semibold text-[#F27420]">Reserva</span>
          </p>
          <Button variant="outline" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <img
              src={roteiro.imageUrl || "/assets/hero.jpg"}
              alt={roteiro.titulo}
              className="h-[240px] w-full object-cover md:h-[300px]"
            />
            <div className="space-y-3 p-6">
              <h1 className="text-2xl font-bold text-[#1F3A66]">{roteiro.titulo}</h1>
              <p className="leading-relaxed text-muted-foreground">{roteiro.descricao}</p>
              <div className="flex flex-wrap gap-4 text-sm text-[#1F3A66]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#F27420]" />
                  {roteiro.local}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#F27420]" />
                  {roteiro.duracao}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#F27420] text-[#F27420]" />
                  {roteiro.totalAvaliacoes > 0 ? `${roteiro.notaMedia} (${roteiro.totalAvaliacoes})` : "Novo"}
                </span>
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">por pessoa</p>
              <p className="text-3xl font-bold text-[#F27420]">{formatBRL(roteiro.preco)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" min={hoje()} value={data} onChange={(event) => setData(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              {agendaIndisponivel ? (
                <Input id="horario" type="time" value={horario} onChange={(event) => setHorario(event.target.value)} />
              ) : (
                <select
                  id="horario"
                  value={horario}
                  onChange={(event) => {
                    setHorario(event.target.value);
                    setQuantidade(1);
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-semibold text-[#1F3A66]"
                >
                  {slots?.length ? (
                    slots.map((slot) => (
                      <option key={slot.horario} value={slot.horario}>
                        {slot.horario} · {slot.vagas} {slot.vagas === 1 ? "vaga" : "vagas"}
                      </option>
                    ))
                  ) : (
                    <option value="">Sem vagas neste dia</option>
                  )}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pessoas">Pessoas</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Menos uma pessoa"
                  onClick={() => setQuantidade((atual) => Math.max(1, atual - 1))}
                  disabled={quantidade <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="pessoas"
                  type="number"
                  min={1}
                  max={maximo}
                  value={quantidade}
                  onChange={(event) =>
                    setQuantidade(Math.min(Math.max(1, Number(event.target.value) || 1), maximo))
                  }
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Mais uma pessoa"
                  onClick={() => setQuantidade((atual) => Math.min(maximo, atual + 1))}
                  disabled={quantidade >= maximo}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {agendaIndisponivel ? `Até ${maximo} pessoas por passeio` : `${vagas} ${vagas === 1 ? "vaga" : "vagas"} neste horário`}
              </p>
            </div>

            {!agendaIndisponivel && slots && slots.length === 0 && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Não há vaga nesta data. Escolha outro dia.
              </p>
            )}

            {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erro}</p>}

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-[#1F3A66]">{formatBRL(total)}</span>
            </div>

            <Button
              size="lg"
              className="w-full rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
              disabled={salvando || (!agendaIndisponivel && !horario)}
              onClick={reservar}
            >
              {salvando ? "Reservando..." : "Reservar"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Você só paga na etapa seguinte.</p>
          </aside>
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="flex gap-1 border-b border-border px-4">
            {([
              { id: "detalhes", label: "Detalhes" },
              { id: "mapa", label: "Mapa / Rota" },
            ] as { id: Aba; label: string }[]).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAba(item.id)}
                className={`border-b-[3px] px-4 py-3 text-sm font-semibold transition-colors ${
                  aba === item.id
                    ? "border-[#F27420] text-[#F27420]"
                    : "border-transparent text-muted-foreground hover:text-[#1F3A66]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {aba === "detalhes" && (
            <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-bold text-[#1F3A66]">Local</dt>
                  <dd className="text-muted-foreground">{roteiro.local}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#1F3A66]">Distância</dt>
                  <dd className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Route className="h-3.5 w-3.5" />
                    {roteiro.distancia}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-[#1F3A66]">Duração</dt>
                  <dd className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {roteiro.duracao}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-[#1F3A66]">Grupo</dt>
                  <dd className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    até {roteiro.capacidade} pessoas
                  </dd>
                </div>
                {roteiro.idioma && (
                  <div>
                    <dt className="font-bold text-[#1F3A66]">Idioma</dt>
                    <dd className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Languages className="h-3.5 w-3.5" />
                      {roteiro.idioma}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 font-bold text-[#1F3A66]">Descrição do roteiro</h2>
                  <p className="border-l-[3px] border-[#1F3A66] pl-4 text-sm leading-relaxed text-muted-foreground">
                    {roteiro.descricao}
                  </p>
                </div>

                {roteiro.incluso?.length > 0 && (
                  <div>
                    <h2 className="mb-2 font-bold text-[#1F3A66]">O que está incluso</h2>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {roteiro.incluso.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F27420]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {roteiro.paradas?.length > 0 && (
                  <div>
                    <h2 className="mb-2 font-bold text-[#1F3A66]">Paradas</h2>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      {roteiro.paradas.map((parada, indice) => (
                        <li key={parada.nome} className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1F3A66] text-xs font-bold text-white">
                            {indice + 1}
                          </span>
                          {parada.nome}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => router.push(`/guias/${roteiro.guia.id}`)}
                  >
                    <UserRound className="h-4 w-4" />
                    Perfil do guia
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => router.push(`/home/tela-avaliacao?id=${id}`)}
                  >
                    <Star className="h-4 w-4" />
                    Ver avaliações
                  </Button>
                </div>
              </div>
            </div>
          )}

          {aba === "mapa" && (
            <div className="p-6">
              <div className="overflow-hidden rounded-xl border-2 border-[#F27420]">
                <Mapa paradas={roteiro.paradas} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
