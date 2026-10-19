"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/services/auth";
import {
  abrirConversa,
  formatBRL,
  labelStatus,
  listarReservasTurista,
  type ReservaTuristaItem,
  type StatusReserva,
} from "@/services/dominio";

const CORES: Record<StatusReserva, string> = {
  AGUARDANDO_PAGAMENTO: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  PENDENTE: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  CONFIRMADA: "bg-green-100 text-green-700 hover:bg-green-100",
  CONCLUIDA: "bg-[#1F3A66]/10 text-[#1F3A66] hover:bg-[#1F3A66]/10",
  RECUSADA: "bg-red-100 text-red-700 hover:bg-red-100",
  CANCELADA: "bg-muted text-muted-foreground hover:bg-muted",
};

function dataBr(iso: string) {
  const data = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function MeusAgendamentos() {
  const router = useRouter();
  const [items, setItems] = useState<ReservaTuristaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listarReservasTurista()
      .then((data) => setItems(data.items))
      .catch((error) => setErro(getApiErrorMessage(error, "Não foi possível carregar seus agendamentos.")))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1000px] space-y-5 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A66]">Meus agendamentos</h1>
          <p className="text-sm text-muted-foreground">Passeios reservados, pagos e já realizados</p>
        </div>

        {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{erro}</p>}

        {carregando && (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-2xl border border-border bg-white" />
            ))}
          </div>
        )}

        {!carregando &&
          items.map((reserva) => (
            <article
              key={reserva.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-[#1F3A66]">{reserva.roteiro}</h2>
                  <Badge className={CORES[reserva.status]}>{labelStatus(reserva.status)}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    {dataBr(reserva.data)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {reserva.horario}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {reserva.quantidade} {reserva.quantidade === 1 ? "pessoa" : "pessoas"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xl font-bold text-[#1F3A66]">{formatBRL(reserva.total)}</p>
                {reserva.guiaId && (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => router.push(`/guias/${reserva.guiaId}`)}
                  >
                    Perfil do guia
                  </Button>
                )}
                {reserva.status === "AGUARDANDO_PAGAMENTO" && (
                  <Button
                    onClick={() => router.push(`/home/pagamento?id=${reserva.id}`)}
                    className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
                  >
                    Pagar agora
                  </Button>
                )}
                {(reserva.status === "CONFIRMADA" || reserva.status === "PENDENTE") && (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      abrirConversa(reserva.id)
                        .then((conversa) => router.push(`/chat?id=${conversa.id}`))
                        .catch(() => router.push("/chat"))
                    }
                  >
                    Falar com o guia
                  </Button>
                )}
              </div>
            </article>
          ))}

        {!carregando && items.length === 0 && !erro && (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
            <p className="font-bold text-[#1F3A66]">Você ainda não tem agendamentos</p>
            <p className="mt-1 text-sm text-muted-foreground">Escolha um roteiro no catálogo para reservar seu primeiro passeio.</p>
            <Button
              onClick={() => router.push("/roteiros")}
              className="mt-4 rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
            >
              Ver roteiros
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
