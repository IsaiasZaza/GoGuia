"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Percent,
  TrendingUp,
  Wallet,
} from "lucide-react";
import GuidePanelLayout from "@/components/layout/GuidePanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  carteiraGuia,
  formatBRL,
  listarSaques,
  solicitarSaque,
  type CarteiraGuia,
  type MetodoSaque,
  type Saque,
} from "@/services/dominio";
import { getApiErrorMessage } from "@/services/auth";

function dataBr(iso: string) {
  const data = iso.includes("T") ? new Date(iso) : new Date(`${iso}T00:00:00`);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export const TourGuideWallet: React.FC = () => {
  const [withdrawalMethod, setWithdrawalMethod] = useState<MetodoSaque>("PIX");
  const [withdrawalValue, setWithdrawalValue] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState<CarteiraGuia>({
    saldoDisponivel: 0,
    saldoPendente: 0,
    ganhosMes: 0,
    acumulado: 0,
    taxasPlataforma: 0,
    liquido: 0,
    proximoPagamento: null,
  });
  const [withdrawalHistory, setWithdrawalHistory] = useState<Saque[]>([]);

  const carregar = () => {
    carteiraGuia().then(setFinancialData).catch(() => undefined);
    listarSaques()
      .then((data) => setWithdrawalHistory(data.items))
      .catch(() => setWithdrawalHistory([]));
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    solicitarSaque(Number(withdrawalValue), withdrawalMethod)
      .then(() => {
        setWithdrawalValue("");
        carregar();
      })
      .catch((error) => setErro(getApiErrorMessage(error, "Não foi possível solicitar o saque.")));
  };

  return (
    <GuidePanelLayout activeTab="carteira">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F27420]/10 text-[#F27420]">
            <Wallet className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A66] lg:text-3xl">Minha carteira</h1>
            <p className="text-sm text-muted-foreground">Saldos, taxas e pedidos de saque</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden space-y-2 rounded-2xl bg-[#F27420] p-6 text-white shadow-sm">
            <p className="text-sm font-medium opacity-90">Saldo disponível para saque</p>
            <p className="text-3xl font-bold">{formatBRL(financialData.saldoDisponivel)}</p>
            <div className="absolute bottom-4 right-4 opacity-10">
              <DollarSign className="h-24 w-24" />
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Saldo pendente</span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-[#1F3A66]">{formatBRL(financialData.saldoPendente)}</p>
            <p className="text-xs text-muted-foreground">Passeios aguardando liberação</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Ganhos do mês</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[#1F3A66]">{formatBRL(financialData.ganhosMes)}</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">Acumulado total</span>
              <DollarSign className="h-5 w-5 text-[#1F3A66]" />
            </div>
            <p className="text-2xl font-bold text-[#1F3A66]">{formatBRL(financialData.acumulado)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-red-50 p-3 text-red-500">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Taxas da plataforma</p>
              <p className="text-lg font-bold text-[#1F3A66]">{formatBRL(financialData.taxasPlataforma)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Valor líquido recebido</p>
              <p className="text-lg font-bold text-green-600">{formatBRL(financialData.liquido)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-orange-50 p-3 text-[#F27420]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Próximo pagamento</p>
              <p className="text-lg font-bold text-[#1F3A66]">
                {financialData.proximoPagamento ? dataBr(financialData.proximoPagamento) : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="shadow-sm lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#1F3A66]">Pedir um saque</CardTitle>
              <p className="text-xs text-muted-foreground">Transfira o saldo já liberado</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdrawRequest} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1F3A66]">Valor</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-medium text-muted-foreground">R$</span>
                    <input
                      type="number"
                      max={financialData.saldoDisponivel}
                      min={1}
                      step="0.01"
                      placeholder="0,00"
                      value={withdrawalValue}
                      onChange={(e) => setWithdrawalValue(e.target.value)}
                      required
                      className="w-full rounded-xl border border-input py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F27420]"
                    />
                  </div>
                  {financialData.saldoDisponivel > 0 && (
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-[#F27420] hover:underline"
                      onClick={() => setWithdrawalValue(String(financialData.saldoDisponivel))}
                    >
                      Sacar tudo ({formatBRL(financialData.saldoDisponivel)})
                    </button>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F3A66]">Forma de recebimento</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWithdrawalMethod("PIX")}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                        withdrawalMethod === "PIX"
                          ? "border-[#F27420] bg-orange-50 text-[#F27420]"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      PIX
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawalMethod("CONTA_BANCARIA")}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                        withdrawalMethod === "CONTA_BANCARIA"
                          ? "border-[#F27420] bg-orange-50 text-[#F27420]"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Conta bancária
                    </button>
                  </div>
                </div>

                {erro && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{erro}</p>}
                <Button type="submit" className="w-full rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]">
                  Solicitar saque <ArrowUpRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#1F3A66]">Histórico de saques</CardTitle>
              <p className="text-xs text-muted-foreground">Acompanhe o andamento das solicitações</p>
            </CardHeader>
            <CardContent>
              {withdrawalHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border px-4 py-12 text-center">
                  <p className="font-bold text-[#1F3A66]">Nenhum saque pedido ainda</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Quando o saldo for liberado, peça o saque ao lado.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2">Data</th>
                        <th className="px-3 py-2">Método</th>
                        <th className="px-3 py-2">Valor</th>
                        <th className="px-3 py-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {withdrawalHistory.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-3 font-medium text-[#1F3A66]">{dataBr(item.criadoEm)}</td>
                          <td className="px-3 py-3 text-muted-foreground">
                            {item.metodo === "PIX" ? "PIX" : "Conta bancária"}
                          </td>
                          <td className="px-3 py-3 font-semibold text-[#1F3A66]">{formatBRL(item.valor)}</td>
                          <td className="px-3 py-3 text-right">
                            <Badge
                              className={
                                item.status === "CONCLUIDO"
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : item.status === "PROCESSANDO"
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                  : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                              }
                            >
                              {item.status === "CONCLUIDO"
                                ? "Concluído"
                                : item.status === "PROCESSANDO"
                                ? "Processando"
                                : "Pendente"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </GuidePanelLayout>
  );
};
