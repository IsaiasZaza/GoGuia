"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, CalendarDays, Clock, Edit, Plus, Users } from "lucide-react";
import GuidePanelLayout from "@/components/layout/GuidePanelLayout";
import SearchBar from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CriarRoteiroDialog from "@/components/guia/CriarRoteiroDialog";
import { useRequireLogin } from "@/hooks/use-require-login";
import { formatBRL, atualizarRoteiroGuia, definirRoteiroAtivo, listarRoteirosGuia, obterPerfilGuia, type RoteiroGuia } from "@/services/dominio";

export default function MeusRoteiros() {
  const router = useRouter();
  const exigirLogin = useRequireLogin();
  const [criando, setCriando] = useState(false);
  const [avisoAcao, setAvisoAcao] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [roteiros, setRoteiros] = useState<RoteiroGuia[]>([]);
  const [aprovado, setAprovado] = useState<boolean | null>(null);

  const carregar = (q?: string) => {
    listarRoteirosGuia(q).then((data) => setRoteiros(data.items)).catch(() => setRoteiros([]));
  };

  useEffect(() => {
    carregar(busca);
  }, [busca]);

  useEffect(() => {
    obterPerfilGuia()
      .then((perfil) => setAprovado(perfil.aprovado))
      .catch(() => setAprovado(null));
  }, []);

  const handleDesabilitar = (roteiro: RoteiroGuia) => {
    definirRoteiroAtivo(roteiro.id, !roteiro.ativo).then(() => carregar(busca)).catch(() => undefined);
  };

  const handleEditar = (roteiro: RoteiroGuia) => {
    const valor = window.prompt("Novo preço (R$)", String(roteiro.preco));
    if (!valor) return;
    const preco = Number(valor.replace(",", "."));
    if (!Number.isFinite(preco) || preco <= 0) return;
    atualizarRoteiroGuia(roteiro.id, { preco }).then(() => carregar(busca)).catch(() => undefined);
  };

  const handleCriar = () => {
    const resultado = exigirLogin({
      motivo: "Entre como guia para registrar um roteiro.",
      voltarPara: "/meus-roteiros",
      tipos: ["GUIA"],
    });
    if (resultado === "tipo-invalido") {
      setAvisoAcao("Somente contas de guia podem registrar roteiros.");
      return;
    }
    if (resultado === "ok") {
      setAvisoAcao(null);
      setCriando(true);
    }
  };

  const roteirosFiltrados = roteiros;

  return (
    <GuidePanelLayout activeTab="roteiros">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A66]">Meus roteiros</h1>
          <p className="text-sm text-muted-foreground">Passeios que você oferece e a agenda de cada um</p>
        </div>

        {aprovado === false && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="font-bold text-amber-900">Conta em análise</p>
            <p className="mt-1 text-sm text-amber-800">
              Você poderá publicar roteiros depois que a administração liberar o acesso.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={busca} onChange={setBusca} placeholder="Buscar roteiros..." className="flex-1" />
          <Button onClick={handleCriar} disabled={aprovado === false} className="shrink-0 rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]">
            <Plus className="h-4 w-4" />
            Criar roteiro
          </Button>
        </div>

        {avisoAcao && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {avisoAcao}
          </p>
        )}

        <CriarRoteiroDialog aberto={criando} onOpenChange={setCriando} onCriado={() => carregar(busca)} />

        <div className="flex flex-col gap-4">
          {roteirosFiltrados.map((roteiro) => (
            <article
              key={roteiro.id}
              className={`flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row ${
                roteiro.ativo ? "border-border" : "border-border opacity-60"
              }`}
            >
              <div className="h-[140px] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-[200px]">
                <img src={roteiro.imageUrl || "/assets/hero.jpg"} alt={roteiro.titulo} className="h-full w-full object-cover" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-bold text-[#1F3A66]">{roteiro.titulo}</h3>
                    {!roteiro.ativo && (
                      <Badge variant="secondary" className="text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {roteiro.descricao}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {roteiro.duracao}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> {roteiro.capacidade} pessoas
                  </span>
                  <span className="text-sm font-bold text-[#1F3A66]">{formatBRL(roteiro.preco)}</span>
                </div>
              </div>

              <div className="flex shrink-0 flex-row gap-2 sm:w-[150px] sm:flex-col">
                <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs" onClick={() => router.push(`/meus-roteiros/agenda?id=${roteiro.id}`)}>
                  <CalendarDays className="h-3.5 w-3.5" /> Agenda
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs" onClick={() => handleEditar(roteiro)}>
                  <Edit className="h-3.5 w-3.5" /> Preço
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDesabilitar(roteiro)}
                  className={`flex-1 rounded-full text-xs ${roteiro.ativo ? "border-red-200 text-red-500 hover:bg-red-50" : ""}`}
                >
                  <Ban className="h-3.5 w-3.5" />
                  {roteiro.ativo ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </article>
          ))}

          {roteirosFiltrados.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <p className="font-bold text-[#1F3A66]">
                {busca ? "Nenhum roteiro para esta busca" : "Você ainda não publicou um roteiro"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {busca
                  ? "Tente outro título."
                  : aprovado === false
                  ? "Quando a conta for aprovada, o botão de criar fica liberado."
                  : "Crie o primeiro passeio para aparecer no catálogo."}
              </p>
            </div>
          )}
        </div>
      </div>
    </GuidePanelLayout>
  );
}
