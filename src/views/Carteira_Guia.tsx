"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  CheckCircle2,
  ArrowUpRight,
  Wallet
} from 'lucide-react';

// 1. IMPORTAÇÃO DA SUA LOGO (Ajuste o caminho './Logo' se o arquivo estiver em outra pasta)
import GuidePanelLayout from "@/components/layout/GuidePanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  method: 'PIX' | 'Conta Bancária';
  status: 'Pendente' | 'Processando' | 'Concluído';
}

export const TourGuideWallet: React.FC = () => {
  const [withdrawalMethod, setWithdrawalMethod] = useState<'pix' | 'bank_account'>('pix');
  const [withdrawalValue, setWithdrawalValue] = useState('');

  const financialData = {
    availableBalance: 1250.00,
    pendingBalance: 450.00,
    monthlyEarnings: 3200.00,
    totalEarnings: 15400.00,
    platformFees: 320.00,
    netEarnings: 2880.00,
    nextPaymentDate: '18/06/2026'
  };

  const withdrawalHistory: Withdrawal[] = [
    { id: '1', date: '10/06/2026', amount: 850.00, method: 'PIX', status: 'Concluído' },
    { id: '2', date: '01/06/2026', amount: 1200.00, method: 'Conta Bancária', status: 'Concluído' },
    { id: '3', date: '12/06/2026', amount: 500.00, method: 'PIX', status: 'Processando' },
  ];

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Solicitação de saque enviada!`);
    setWithdrawalValue('');
  };

  return (
    <GuidePanelLayout activeTab="roteiros">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-[#F27420]" />
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">Minha Carteira</h1>
            <p className="text-sm text-muted-foreground">Painel do prestador</p>
          </div>
        </div>

        {/* 1. VISÃO GERAL DE SALDOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative overflow-hidden space-y-2 rounded-2xl bg-[#F27420] p-6 text-white shadow-sm">
            <p className="text-sm font-medium opacity-90">Saldo disponível para saque</p>
            <p className="text-3xl font-bold">R$ {financialData.availableBalance.toFixed(2)}</p>
            <div className="absolute right-4 bottom-4 opacity-10">
              <DollarSign className="w-24 h-24" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm font-medium">Saldo pendente</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {financialData.pendingBalance.toFixed(2)}</p>
            <p className="text-xs text-gray-400">Passeios realizados (aguardando liberação)</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm font-medium">Ganhos totais do mês</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {financialData.monthlyEarnings.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm font-medium">Acumulado total</span>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {financialData.totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* DETALHAMENTO DE TAXAS E PRÓXIMO PAGAMENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-lg text-red-500"><Percent className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Taxas da plataforma</p>
                <p className="text-lg font-semibold text-gray-800">R$ {financialData.platformFees.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Valor líquido recebido</p>
                <p className="text-lg font-semibold text-green-600">R$ {financialData.netEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-50 p-3 text-[#F27420]"><Calendar className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Próximo pagamento previsto</p>
                <p className="text-lg font-semibold text-gray-800">{financialData.nextPaymentDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ÁREA DE SAQUE E HISTÓRICO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="space-y-6 shadow-sm lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Área de saque</CardTitle>
              <p className="text-xs text-muted-foreground">Transfira seus valores disponíveis</p>
            </CardHeader>
            <CardContent className="space-y-4">

            <form onSubmit={handleWithdrawRequest} className="space-y-4 pt-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Saque</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-medium">R$</span>
                  <input
                    type="number"
                    max={financialData.availableBalance}
                    placeholder="0,00"
                    value={withdrawalValue}
                    onChange={(e) => setWithdrawalValue(e.target.value)}
                    required
                    className="w-full rounded-lg border border-input py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F27420]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Recebimento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWithdrawalMethod('pix')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      withdrawalMethod === 'pix'
                        ? 'border-[#F27420] bg-orange-50 text-[#F27420]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Chave PIX
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawalMethod('bank_account')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      withdrawalMethod === 'bank_account'
                        ? 'border-[#F27420] bg-orange-50 text-[#F27420]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Conta Bancária
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-4 w-full rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
              >
                Solicitar saque <ArrowUpRight className="h-4 w-4" />
              </Button>
            </form>
            </CardContent>
          </Card>

          <Card className="space-y-4 shadow-sm lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Histórico de saques</CardTitle>
              <p className="text-xs text-muted-foreground">Acompanhe o andamento das suas solicitações</p>
            </CardHeader>
            <CardContent>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {withdrawalHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-800">{item.date}</td>
                      <td className="py-3.5 px-4 text-gray-500">{item.method}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">R$ {item.amount.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          className={
                            item.status === "Concluído"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : item.status === "Processando"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GuidePanelLayout>
  );
};