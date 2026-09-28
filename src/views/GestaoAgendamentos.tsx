"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Info,
  MapPin,
  MessageSquare,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import GuidePanelLayout from "@/components/layout/GuidePanelLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  abrirConversa,
  aceitarReserva,
  detalheReservaGuia,
  formatBRL,
  labelStatus,
  listarReservasGuia,
  recusarReserva,
  resumoSemana,
  type ReservaGuiaDetalhe,
  type ReservaGuiaItem,
  type StatusReserva,
} from "@/services/dominio";

function dataBr(iso: string) {
  const data = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(data.getTime())) {
    const direto = new Date(iso);
    if (Number.isNaN(direto.getTime())) return iso;
    return direto.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function quandoLegivel(reserva: { data: string; horario: string; quando: string }) {
  const data = dataBr(reserva.data);
  if (reserva.horario) return `${data} · ${reserva.horario}`;
  const direto = new Date(reserva.quando);
  if (Number.isNaN(direto.getTime())) return reserva.quando;
  return direto.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CORES: Record<StatusReserva, string> = {
  AGUARDANDO_PAGAMENTO: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  PENDENTE: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  CONFIRMADA: "bg-green-100 text-green-700 hover:bg-green-100",
  CONCLUIDA: "bg-[#1F3A66]/10 text-[#1F3A66] hover:bg-[#1F3A66]/10",
  RECUSADA: "bg-red-100 text-red-700 hover:bg-red-100",
  CANCELADA: "bg-muted text-muted-foreground hover:bg-muted",
};

function Avatar({ nome, fotoUrl, tamanho = 32 }: { nome: string; fotoUrl: string | null; tamanho?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-xs font-bold text-white"
      style={{ width: tamanho, height: tamanho }}
    >
      {fotoUrl ? <img src={fotoUrl} alt="" className="h-full w-full object-cover" /> : nome.slice(0, 2).toUpperCase()}
    </span>
  );
}

function GestaoAgendamentos() {
  const [detalhe, setDetalhe] = useState<ReservaGuiaDetalhe | null>(null);

  return (
    <GuidePanelLayout activeTab="agendamentos">
      {detalhe ? (
        <Detalhes reserva={detalhe} onVoltar={() => setDetalhe(null)} />
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A66]">Agendamentos</h1>
            <p className="text-sm text-muted-foreground">Gerencie reservas e confirmações</p>
          </div>
          <Lista
            onVerDetalhes={(id) => {
              detalheReservaGuia(id).then(setDetalhe).catch(() => undefined);
            }}
          />
        </div>
      )}
    </GuidePanelLayout>
  );
}

function Lista({ onVerDetalhes }: { onVerDetalhes: (id: string) => void }) {
  const router = useRouter();
  const [reservas, setReservas] = useState<ReservaGuiaItem[]>([]);
  const [resumo, setResumo] = useState({ totalReservas: 0, faturamentoPrevisto: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarReservasGuia("proximas")
      .then((data) => setReservas(data.items))
      .catch(() => setReservas([]))
      .finally(() => setCarregando(false));
    resumoSemana().then(setResumo).catch(() => undefined);
  }, []);

  const pendentes = reservas.filter((item) => item.status === "PENDENTE").length;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_260px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-[#1F3A66]">Próximas reservas</h2>
          {pendentes > 0 && (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
              {pendentes} aguardando resposta
            </Badge>
          )}
        </div>

        {carregando && (
          <div className="grid gap-5 md:grid-cols-2">
            {[0, 1].map((item) => (
              <div key={item} className="h-48 animate-pulse rounded-xl bg-white" />
            ))}
          </div>
        )}

        {!carregando && reservas.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {reservas.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                onVerDetalhes={() => onVerDetalhes(reserva.id)}
                onMensagem={() =>
                  abrirConversa(reserva.id)
                    .then((conversa) => router.push(`/chat?id=${conversa.id}`))
                    .catch(() => router.push("/chat"))
                }
              />
            ))}
          </div>
        )}

        {!carregando && reservas.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-white px-6 py-14 text-center">
            <p className="font-bold text-[#1F3A66]">Nenhuma reserva pela frente</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Quando um turista reservar um dos seus roteiros, o pedido aparece aqui.
            </p>
          </div>
        )}
      </div>

      <aside className="rounded-2xl bg-[#1F3A66] p-5 text-white">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
          <Wallet className="h-4 w-4" />
          Resumo da semana
        </h3>
        <p className="mb-4 text-sm text-white/70">
          Total de reservas
          <span className="mt-0.5 block text-2xl font-bold text-white">{resumo.totalReservas}</span>
        </p>
        <p className="text-sm text-white/70">
          Faturamento previsto
          <span className="mt-0.5 block text-2xl font-bold text-white">{formatBRL(resumo.faturamentoPrevisto)}</span>
        </p>
      </aside>
    </div>
  );
}

function ReservaCard({
  reserva,
  onVerDetalhes,
  onMensagem,
}: {
  reserva: ReservaGuiaItem;
  onVerDetalhes: () => void;
  onMensagem: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#F27420]">{quandoLegivel(reserva)}</p>
          <p className="mt-1 font-bold text-[#1F3A66]">{reserva.roteiro}</p>
        </div>
        <Badge className={CORES[reserva.status]}>{labelStatus(reserva.status)}</Badge>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#1F3A66]/10 text-xs font-bold text-[#1F3A66]">
          {reserva.cliente.fotoUrl ? (
            <img src={reserva.cliente.fotoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            reserva.cliente.nomeCompleto.slice(0, 2).toUpperCase()
          )}
        </span>
        <div>
          <div className="font-semibold text-[#1F3A66]">{reserva.cliente.nomeCompleto}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {reserva.quantidade} {reserva.quantidade === 1 ? "pessoa" : "pessoas"}
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm font-bold text-[#1F3A66]">Total {formatBRL(reserva.total)}</p>

      <div className="flex gap-2">
        <Button size="sm" onClick={onVerDetalhes} className="flex-1 rounded-full bg-[#F27420] font-semibold hover:bg-[#d65f15]">
          Ver detalhes
        </Button>
        <Button size="sm" variant="outline" onClick={onMensagem} className="flex-1 rounded-full">
          <MessageSquare className="h-3.5 w-3.5" />
          Mensagem
        </Button>
      </div>
    </div>
  );
}

function Detalhes({ reserva, onVoltar }: { reserva: ReservaGuiaDetalhe; onVoltar: () => void }) {
  const router = useRouter();
  const [status, setStatus] = useState(reserva.status);
  const [salvando, setSalvando] = useState(false);

  const responder = (acao: "aceitar" | "recusar") => {
    setSalvando(true);
    const pedido = acao === "aceitar" ? aceitarReserva(reserva.id) : recusarReserva(reserva.id);
    pedido
      .then((r) => setStatus(r.status))
      .catch(() => undefined)
      .finally(() => setSalvando(false));
  };

  return (
    <div>
      <Button variant="ghost" onClick={onVoltar} className="mb-4 text-[#1F3A66]">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="bg-[#14264a] p-5 text-white">
            <h2 className="mb-3 text-2xl font-bold">Detalhes da reserva</h2>
            <div className="mb-3 flex items-center gap-3">
              <Avatar nome={reserva.cliente.nomeCompleto} fotoUrl={reserva.cliente.fotoUrl} tamanho={40} />
              <div>
                <div className="font-semibold">{reserva.cliente.nomeCompleto}</div>
                <div className="text-sm text-white/70">{labelStatus(status)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                <Clock className="h-4 w-4" />
              </span>
              <div>
                <div className="font-semibold">{quandoLegivel(reserva)}</div>
                <div className="text-white/80">{reserva.local}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 text-sm">
            <Linha icone={<CalendarDays className="h-4 w-4" />} label="Data" valor={dataBr(reserva.data)} />
            <Linha icone={<Clock className="h-4 w-4" />} label="Horário" valor={reserva.horario} />
            <Linha
              icone={<MapPin className="h-4 w-4" />}
              label="Local"
              valor={
                <>
                  <div className="font-semibold text-[#1F3A66]">{reserva.local}</div>
                  <div className="text-muted-foreground">{reserva.endereco}</div>
                </>
              }
            />
            <Linha
              icone={<Users className="h-4 w-4" />}
              label="Participantes"
              valor={
                <span className="font-semibold text-[#1F3A66]">
                  {reserva.quantidade} {reserva.quantidade === 1 ? "pessoa" : "pessoas"}
                </span>
              }
            />
            <Linha
              icone={<User className="h-4 w-4" />}
              label="Cliente"
              valor={<span className="font-semibold text-[#1F3A66]">{reserva.cliente.nomeCompleto}</span>}
            />

            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Total da reserva</span>
              <span className="font-bold text-[#1F3A66]">{formatBRL(reserva.total)}</span>
            </div>

            {status === "PENDENTE" ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button variant="outline" disabled={salvando} onClick={() => responder("recusar")}>
                  Negar
                </Button>
                <Button
                  disabled={salvando}
                  onClick={() => responder("aceitar")}
                  className="bg-[#F27420] font-semibold hover:bg-[#d65f15]"
                >
                  <Check className="h-4 w-4" />
                  Aceitar
                </Button>
              </div>
            ) : (
              <p className="rounded-lg bg-muted px-3 py-2 text-center text-sm font-semibold text-[#1F3A66]">
                Reserva {labelStatus(status).toLowerCase()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Painel titulo="Sobre a experiência" icone={<Info className="h-4 w-4" />}>
            <p className="mb-3 text-sm text-muted-foreground">{reserva.descricao}</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <Mini label="Duração" valor={reserva.duracao} />
              <Mini label="Tamanho do grupo" valor={`Até ${reserva.capacidade} pessoas`} />
              <Mini label="Idioma" valor={reserva.idioma} />
            </div>
          </Painel>

          <Painel titulo="O que está incluso" icone={<Check className="h-4 w-4" />}>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {reserva.incluso.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F27420]" />
                  {item}
                </li>
              ))}
            </ul>
          </Painel>

          <Painel titulo="Política de cancelamento" icone={<Info className="h-4 w-4" />}>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {reserva.politicaCancelamento.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F3A66]" />
                  {item}
                </li>
              ))}
            </ul>
          </Painel>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-orange-100 bg-orange-50 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#14264a] text-white">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div>
            <div className="font-bold text-[#1F3A66]">Comunicação com o cliente</div>
            <div className="text-xs text-muted-foreground">
              Fale com o cliente para dúvidas ou alterações na reserva.
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-[#F27420] text-[#F27420] hover:bg-orange-100 hover:text-[#d65f15]"
          onClick={() => abrirConversa(reserva.id).then((conversa) => router.push(`/chat?id=${conversa.id}`))}
        >
          <MessageSquare className="h-4 w-4" />
          Abrir chat
        </Button>
      </div>
    </div>
  );
}

function Linha({ icone, label, valor }: { icone: React.ReactNode; label: string; valor: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icone}
        <span className="font-semibold">{label}</span>
      </div>
      <div className="text-[#1F3A66]">{valor}</div>
    </div>
  );
}

function Painel({ titulo, icone, children }: { titulo: string; icone: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-[#1F3A66]">{icone}</span>
        <h3 className="font-bold text-[#1F3A66]">{titulo}</h3>
      </div>
      {children}
    </div>
  );
}

function Mini({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-semibold text-[#1F3A66]">{valor}</div>
    </div>
  );
}

export default GestaoAgendamentos;
