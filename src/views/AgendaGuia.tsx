"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ban, CalendarDays, Clock, Plus } from "lucide-react";
import GuidePanelLayout from "@/components/layout/GuidePanelLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { obterAgenda, salvarAgenda, type AgendaRoteiro } from "@/services/dominio";
import { getApiErrorMessage } from "@/services/auth";

const DIAS = [
  { id: 1, label: "Seg" },
  { id: 2, label: "Ter" },
  { id: 3, label: "Qua" },
  { id: 4, label: "Qui" },
  { id: 5, label: "Sex" },
  { id: 6, label: "Sáb" },
  { id: 0, label: "Dom" },
];

const vazia: AgendaRoteiro = { diasSemana: [1, 2, 3, 4, 5], horarios: ["09:00"], datasBloqueadas: [] };

function dataBr(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  if (!ano || !mes || !dia) return iso;
  return `${dia}/${mes}/${ano}`;
}

export default function AgendaGuia() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roteiroId = searchParams.get("id") || "";
  const [agenda, setAgenda] = useState<AgendaRoteiro>(vazia);
  const [horarioNovo, setHorarioNovo] = useState("14:00");
  const [dataNova, setDataNova] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!roteiroId) return;
    obterAgenda(roteiroId)
      .then(setAgenda)
      .catch(() => setAgenda(vazia));
  }, [roteiroId]);

  const alternarDia = (dia: number) => {
    setAgenda((atual) => ({
      ...atual,
      diasSemana: atual.diasSemana.includes(dia)
        ? atual.diasSemana.filter((item) => item !== dia)
        : [...atual.diasSemana, dia],
    }));
  };

  const adicionarHorario = () => {
    if (!/^\d{2}:\d{2}$/.test(horarioNovo)) {
      setErro("Horário no formato HH:mm.");
      return;
    }
    setErro(null);
    setAgenda((atual) =>
      atual.horarios.includes(horarioNovo) ? atual : { ...atual, horarios: [...atual.horarios, horarioNovo].sort() }
    );
  };

  const adicionarBloqueio = () => {
    if (!dataNova) return;
    setAgenda((atual) =>
      atual.datasBloqueadas.includes(dataNova)
        ? atual
        : { ...atual, datasBloqueadas: [...atual.datasBloqueadas, dataNova].sort() }
    );
    setDataNova("");
  };

  const salvar = () => {
    if (!roteiroId) return;
    setSalvando(true);
    setErro(null);
    setOk(null);
    salvarAgenda(roteiroId, agenda)
      .then((salva) => {
        setAgenda(salva);
        setOk("Agenda salva.");
      })
      .catch((error) => setErro(getApiErrorMessage(error, "Não foi possível salvar a agenda.")))
      .finally(() => setSalvando(false));
  };

  if (!roteiroId) {
    return (
      <GuidePanelLayout activeTab="roteiros">
        <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="font-bold text-[#1F3A66]">Escolha um roteiro para editar a agenda</p>
          <p className="mt-1 text-sm text-muted-foreground">Abra a agenda a partir da lista de roteiros.</p>
          <Button className="mt-4 rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]" onClick={() => router.push("/meus-roteiros")}>
            Voltar aos roteiros
          </Button>
        </div>
      </GuidePanelLayout>
    );
  }

  return (
    <GuidePanelLayout activeTab="roteiros">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#F27420]">Disponibilidade</p>
            <h1 className="text-2xl font-bold text-[#1F3A66]">Agenda do roteiro</h1>
            <p className="mt-1 text-sm text-muted-foreground">Escolha os dias, os horários e as datas em que o passeio não sai.</p>
          </div>
          <Button variant="ghost" onClick={() => router.push("/meus-roteiros")}>
            Voltar aos roteiros
          </Button>
        </div>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F27420]/10 text-[#F27420]">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-bold text-[#1F3A66]">Dias da semana</h2>
              <p className="text-xs text-muted-foreground">Toque para ligar ou desligar o dia</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {DIAS.map((dia) => {
              const ativo = agenda.diasSemana.includes(dia.id);
              return (
                <button
                  key={dia.id}
                  type="button"
                  onClick={() => alternarDia(dia.id)}
                  className={`rounded-xl py-3 text-sm font-bold transition-colors ${
                    ativo ? "bg-[#F27420] text-white shadow-sm" : "bg-[#f4f4f6] text-[#1F3A66] hover:bg-[#F27420]/10"
                  }`}
                >
                  {dia.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F3A66]/10 text-[#1F3A66]">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-bold text-[#1F3A66]">Horários de saída</h2>
              <p className="text-xs text-muted-foreground">Toque num horário para removê-lo</p>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {agenda.horarios.length === 0 && <p className="text-sm text-muted-foreground">Nenhum horário. Adicione pelo menos um.</p>}
            {agenda.horarios.map((horario) => (
              <button
                key={horario}
                type="button"
                onClick={() =>
                  setAgenda((atual) => ({ ...atual, horarios: atual.horarios.filter((item) => item !== horario) }))
                }
                className="rounded-full bg-[#1F3A66] px-4 py-1.5 text-sm font-semibold text-white"
              >
                {horario} ×
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Input type="time" value={horarioNovo} onChange={(event) => setHorarioNovo(event.target.value)} className="max-w-[160px]" />
            <Button type="button" variant="outline" onClick={adicionarHorario}>
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Ban className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-bold text-[#1F3A66]">Datas bloqueadas</h2>
              <p className="text-xs text-muted-foreground">Feriados e dias em que você não atende</p>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {agenda.datasBloqueadas.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma data bloqueada.</p>
            )}
            {agenda.datasBloqueadas.map((data) => (
              <button
                key={data}
                type="button"
                onClick={() =>
                  setAgenda((atual) => ({
                    ...atual,
                    datasBloqueadas: atual.datasBloqueadas.filter((item) => item !== data),
                  }))
                }
                className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600"
              >
                {dataBr(data)} ×
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Input type="date" value={dataNova} onChange={(event) => setDataNova(event.target.value)} className="max-w-[200px]" />
            <Button type="button" variant="outline" onClick={adicionarBloqueio}>
              Bloquear data
            </Button>
          </div>
        </section>

        {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{erro}</p>}
        {ok && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{ok}</p>}

        <Button onClick={salvar} disabled={salvando || !roteiroId} className="h-11 rounded-full bg-[#F27420] px-8 font-bold hover:bg-[#d65f15]">
          {salvando ? "Salvando..." : "Salvar agenda"}
        </Button>
      </div>
    </GuidePanelLayout>
  );
}
