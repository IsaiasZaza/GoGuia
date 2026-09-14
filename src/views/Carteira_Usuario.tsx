"use client";

import React from 'react';
import {
  CreditCard,
  Gift,
  Coins,
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  Wallet
} from 'lucide-react';

// IMPORTAÇÃO DA SUA LOGO (Ajuste o caminho se necessário)
import AppHeader from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Tipagem para as próximas reservas do usuário
interface Reservation {
  id: string;
  tourName: string;
  date: string;
  status: 'Confirmado' | 'Pago';
}

export const CarteiraUsuario: React.FC = () => {

  // Dados fictícios do Usuário (Turista)
  const userFinancialData = {
    totalPayments: 1540.00,
    promoCredits: 50.00,
    cashbackAccumulated: 32.40,
    availableVouchers: 2
  };

  // Histórico de próximas reservas fornecido
  const nextReservations: Reservation[] = [
    { id: '1', tourName: 'City Tour Brasília', date: '20/06/2026', status: 'Confirmado' },
    { id: '2', tourName: 'Chapada dos Veadeiros', date: '05/07/2026', status: 'Pago' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
        <div className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-[#F27420]" />
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">Minha Carteira</h1>
            <p className="text-sm text-muted-foreground">Painel do turista</p>
          </div>
        </div>

        {/* 1. CARDS DE SALDO E BENEFÍCIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Pagamentos Realizados (Destaque em Laranja igual ao layout) */}
          <div className="relative overflow-hidden space-y-2 rounded-2xl bg-[#F27420] p-6 text-white shadow-sm">
            <p className="text-sm font-medium opacity-90">Pagamentos Realizados</p>
            <p className="text-3xl font-bold">R$ {userFinancialData.totalPayments.toFixed(2)}</p>
            <div className="absolute right-4 bottom-4 opacity-10">
              <CreditCard className="w-24 h-24" />
            </div>
          </div>

          {/* Créditos Promocionais */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm font-medium">Créditos Promocionais</span>
              <Gift className="h-5 w-5 text-[#F27420]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {userFinancialData.promoCredits.toFixed(2)}</p>
            <p className="text-xs text-green-600 font-medium">Expira em breve</p>
          </div>

          {/* Cashback Acumulado */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm font-medium">Cashback Acumulado</span>
              <Coins className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {userFinancialData.cashbackAccumulated.toFixed(2)}</p>
            <p className="text-xs text-gray-400">Saldo para usar no próximo passeio</p>
          </div>

          {/* Vouchers Disponíveis */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm font-medium">Vouchers Disponíveis</span>
              <Ticket className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{userFinancialData.availableVouchers}</p>
            <p className="text-xs text-gray-400">Cupons ativos na conta</p>
          </div>
        </div>

        {/* 2. ÁREA DE PRÓXIMAS RESERVAS DESTAQUE */}
        <Card className="shadow-sm">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <Calendar className="h-6 w-6 text-[#F27420]" />
            <div>
              <CardTitle className="text-xl">Próximas reservas</CardTitle>
              <p className="text-xs text-muted-foreground">Passeios confirmados para a sua viagem</p>
            </div>
          </CardHeader>
          <CardContent>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-6">Passeio</th>
                  <th className="py-3 px-6">Data</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nextReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-[#F27420]" />
                      {reservation.tourName}
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">{reservation.date}</td>
                    <td className="py-4 px-6 text-center">
                      <Badge
                        className={
                          reservation.status === "Confirmado"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        }
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        {reservation.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};