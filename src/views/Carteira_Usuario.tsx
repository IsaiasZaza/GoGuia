"use client";

import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock,
  Coins,
  CreditCard,
  Gift,
  MapPin,
  Ticket,
  Wallet,
} from 'lucide-react';
import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  carteiraTurista,
  formatBRL,
  labelStatus,
  listarReservasTurista,
  type CarteiraTurista,
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
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export const CarteiraUsuario: React.FC = () => {
  const router = useRouter();
  const [carteira, setCarteira] = useState<CarteiraTurista>({
    pagamentosRealizados: 0,
    creditosPromocionais: 0,
    cashback: 0,
    vouchers: 0,
  });
  const [reservas, setReservas] = useState<ReservaTuristaItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carteiraTurista().then(setCarteira).catch(() => undefined);
    listarReservasTurista()
      .then((data) => setReservas(data.items))
      .catch(() => setReservas([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
        <div className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-[#F27420]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A66] lg:text-3xl">Minha Carteira</h1>
            <p className="text-sm text-muted-foreground">Saldos, benefícios e próximos passeios</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative space-y-2 overflow-hidden rounded-2xl bg-[#F27420] p-6 text-white shadow-sm">
            <p className="text-sm font-medium opacity-90">Pagamentos realizados</p>
            <p className="text-3xl font-bold">{formatBRL(carteira.pagamentosRealizados)}</p>
            <p className="text-xs opacity-80">Total já pago em passeios</p>
            <div className="absolute bottom-4 right-4 opacity-10">
              <CreditCard className="h-24 w-24" />
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Créditos promocionais</span>
              <Gift className="h-5 w-5 text-[#F27420]" />
            </div>
            <p className="text-2xl font-bold text-[#1F3A66]">{formatBRL(carteira.creditosPromocionais)}</p>
            <p className="text-xs text-muted-foreground">Abatidos no próximo pagamento</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Cashback acumulado</span>
              <Coins className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-[#1F3A66]">{formatBRL(carteira.cashback)}</p>
            <p className="text-xs text-muted-foreground">Saldo para usar no próximo passeio</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Vouchers disponíveis</span>
              <Ticket className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-[#1F3A66]">{carteira.vouchers}</p>
            <p className="text-xs text-muted-foreground">Cupons ativos na conta</p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-[#F27420]" />
              <div>
                <CardTitle className="text-xl text-[#1F3A66]">Minhas reservas</CardTitle>
                <p className="text-xs text-muted-foreground">Passeios reservados e realizados</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-full" onClick={() => router.push("/agendamentos")}>
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            {carregando && (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-14 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            )}

            {!carregando && reservas.length > 0 && (
              <ul className="divide-y divide-border">
                {reservas.map((reserva) => (
                  <li key={reserva.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold text-[#1F3A66]">
                        <MapPin className="h-4 w-4 shrink-0 text-[#F27420]" />
                        <span className="truncate">{reserva.roteiro}</span>
                      </p>
                      <p className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {dataBr(reserva.data)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {reserva.horario}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#1F3A66]">{formatBRL(reserva.total)}</span>
                      <Badge className={CORES[reserva.status]}>{labelStatus(reserva.status)}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!carregando && reservas.length === 0 && (
              <div className="py-10 text-center">
                <p className="font-semibold text-[#1F3A66]">Nenhuma reserva por aqui</p>
                <p className="mt-1 text-sm text-muted-foreground">Escolha um roteiro e faça seu primeiro passeio.</p>
                <Button
                  onClick={() => router.push("/roteiros")}
                  className="mt-4 rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
                >
                  Ver roteiros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
