"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Flag,
  LogOut,
  MapPin,
  Ticket,
  UserCheck,
  Wallet,
} from "lucide-react";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage, getStoredUser, logout } from "@/services/auth";
import {
  aprovarGuia,
  atualizarSaqueAdmin,
  criarCupomAdmin,
  definirAtivoAdmin,
  definirDestaqueAdmin,
  formatBRL,
  listarCuponsAdmin,
  listarDenunciasAdmin,
  listarGuiasAdmin,
  listarRoteirosAdmin,
  listarSaquesAdmin,
  recusarGuia,
  type CupomAdmin,
  type Denuncia,
  type GuiaAdmin,
  type RoteiroAdmin,
  type SaqueAdmin,
  type StatusAprovacao,
} from "@/services/dominio";

type Aba = "guias" | "roteiros" | "saques" | "denuncias" | "cupons";

const ABAS: { id: Aba; label: string; icon: typeof UserCheck; descricao: string }[] = [
  { id: "guias", label: "Guias", icon: UserCheck, descricao: "Aprove quem pode publicar roteiros" },
  { id: "roteiros", label: "Roteiros", icon: MapPin, descricao: "Destaque na home e roteiros no ar" },
  { id: "saques", label: "Saques", icon: Wallet, descricao: "Pagamentos solicitados pelos guias" },
  { id: "denuncias", label: "Denúncias", icon: Flag, descricao: "Reclamações enviadas pelos usuários" },
  { id: "cupons", label: "Cupons", icon: Ticket, descricao: "Descontos aplicados no pagamento" },
];

function dataHora(iso: string) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function Admin() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>("guias");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [nome, setNome] = useState("Administração");
  const [autorizado, setAutorizado] = useState(false);
  const [filtroGuias, setFiltroGuias] = useState<StatusAprovacao>("PENDENTE");
  const [guias, setGuias] = useState<GuiaAdmin[]>([]);
  const [roteiros, setRoteiros] = useState<RoteiroAdmin[]>([]);
  const [saques, setSaques] = useState<SaqueAdmin[]>([]);
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [cupons, setCupons] = useState<CupomAdmin[]>([]);
  const [codigo, setCodigo] = useState("");
  const [valorCupom, setValorCupom] = useState("10");
  const [tipoCupom, setTipoCupom] = useState<"PERCENTUAL" | "VALOR">("PERCENTUAL");

  const falhou = (mensagem: string) => (error: unknown) => setErro(getApiErrorMessage(error, mensagem));

  const carregar = () => {
    setErro(null);
    setCarregando(true);
    const pedido =
      aba === "guias"
        ? listarGuiasAdmin(filtroGuias).then((data) => setGuias(data.items))
        : aba === "roteiros"
        ? listarRoteirosAdmin().then((data) => setRoteiros(data.items))
        : aba === "saques"
        ? listarSaquesAdmin().then((data) => setSaques(data.items))
        : aba === "denuncias"
        ? listarDenunciasAdmin().then((data) => setDenuncias(data.items))
        : listarCuponsAdmin().then((data) => setCupons(data.items));

    pedido.catch(falhou("Não foi possível carregar os dados.")).finally(() => setCarregando(false));
  };

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.tipo !== "ADMIN") {
      router.replace("/home");
      return;
    }
    setNome(user.nomeCompleto);
    setAutorizado(true);
  }, [router]);

  useEffect(() => {
    if (autorizado) carregar();
  }, [aba, filtroGuias, autorizado]);

  const sair = async () => {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  const abaAtual = ABAS.find((item) => item.id === aba);

  const vazio = (texto: string, detalhe: string) => (
    <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
      <p className="font-bold text-[#1F3A66]">{texto}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detalhe}</p>
    </div>
  );

  const carregandoLista = (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-24 animate-pulse rounded-2xl border border-border bg-white" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f6] font-sans">
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 shadow-sm md:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/home")} className="rounded-lg transition-opacity hover:opacity-80" aria-label="Ir para o site">
            <Logo />
          </button>
          <span className="hidden rounded-full bg-[#1F3A66] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white sm:inline">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-semibold text-[#1F3A66] md:inline">{nome}</span>
          <Button variant="outline" className="rounded-full" onClick={() => router.push("/home")}>
            <ArrowUpRight className="h-4 w-4" />
            Ver o site
          </Button>
          <Button onClick={sair} className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1150px] flex-col gap-6 p-4 md:flex-row md:p-6">
        <aside className="h-fit w-full shrink-0 rounded-2xl bg-[#1F3A66] p-3 md:w-[220px]">
          <p className="mb-2 px-3 pt-2 text-xs font-bold uppercase tracking-widest text-white/50">Painel</p>
          <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
            {ABAS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCarregando(true);
                  setAba(id);
                }}
                className={`flex flex-1 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  aba === id ? "bg-white text-[#1F3A66]" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A66]">{abaAtual?.label}</h1>
            <p className="text-sm text-muted-foreground">{abaAtual?.descricao}</p>
          </div>

          {erro && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{erro}</p>
              <Button variant="outline" size="sm" onClick={carregar}>
                Tentar de novo
              </Button>
            </div>
          )}

          {aba === "guias" && (
            <div className="flex flex-wrap gap-2">
              {(["PENDENTE", "APROVADO", "RECUSADO"] as StatusAprovacao[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setCarregando(true);
                    setFiltroGuias(status);
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    filtroGuias === status ? "bg-[#F27420] text-white" : "bg-white text-[#1F3A66] hover:bg-[#F27420]/10"
                  }`}
                >
                  {status === "PENDENTE" ? "Pendentes" : status === "APROVADO" ? "Aprovados" : "Recusados"}
                </button>
              ))}
            </div>
          )}

          {carregando && carregandoLista}

          {!carregando && aba === "guias" && (
            <div className="space-y-3">
              {guias.map((guia) => (
                <article key={guia.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1F3A66]/10 text-sm font-bold text-[#1F3A66]">
                      {guia.fotoUrl ? (
                        <img src={guia.fotoUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        guia.nomeCompleto.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-[#1F3A66]">{guia.nomeCompleto}</h2>
                      <p className="truncate text-sm text-muted-foreground">
                        {guia.email}
                        {guia.cidade ? ` · ${guia.cidade}` : ""} · desde {dataHora(guia.criadoEm)}
                      </p>
                    </div>
                  </div>
                  {guia.statusAprovacao === "PENDENTE" ? (
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => aprovarGuia(guia.id).then(carregar).catch(falhou("Não foi possível aprovar."))}
                      >
                        Aprovar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => recusarGuia(guia.id).then(carregar).catch(falhou("Não foi possível recusar."))}
                      >
                        Recusar
                      </Button>
                    </div>
                  ) : (
                    <Badge
                      className={
                        guia.statusAprovacao === "APROVADO"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {guia.statusAprovacao === "APROVADO" ? "Aprovado" : "Recusado"}
                    </Badge>
                  )}
                </article>
              ))}
              {guias.length === 0 &&
                vazio(
                  filtroGuias === "PENDENTE" ? "Nenhum guia aguardando aprovação" : "Nenhum guia nesta lista",
                  "Guias novos aparecem aqui assim que criam a conta."
                )}
            </div>
          )}

          {!carregando && aba === "roteiros" && (
            <div className="space-y-3">
              {roteiros.map((roteiro) => (
                <article key={roteiro.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-bold text-[#1F3A66]">{roteiro.titulo}</h2>
                      {roteiro.destaque && <Badge className="bg-[#F27420] hover:bg-[#F27420]">Destaque</Badge>}
                      {!roteiro.ativo && <Badge variant="secondary">Inativo</Badge>}
                      {roteiro.denuncias > 0 && (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          {roteiro.denuncias} {roteiro.denuncias === 1 ? "denúncia" : "denúncias"}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{roteiro.guia.nomeCompleto}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        definirDestaqueAdmin(roteiro.id, !roteiro.destaque).then(carregar).catch(falhou("Não foi possível alterar o destaque."))
                      }
                    >
                      {roteiro.destaque ? "Tirar destaque" : "Destacar"}
                    </Button>
                    <Button
                      variant="outline"
                      className={roteiro.ativo ? "border-red-200 text-red-600 hover:bg-red-50" : ""}
                      onClick={() =>
                        definirAtivoAdmin(roteiro.id, !roteiro.ativo).then(carregar).catch(falhou("Não foi possível alterar o roteiro."))
                      }
                    >
                      {roteiro.ativo ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </article>
              ))}
              {roteiros.length === 0 && vazio("Nenhum roteiro cadastrado", "Os roteiros publicados pelos guias aparecem aqui.")}
            </div>
          )}

          {!carregando && aba === "saques" && (
            <div className="space-y-3">
              {saques.map((saque) => (
                <article key={saque.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div>
                    <h2 className="font-bold text-[#1F3A66]">{saque.guia.nomeCompleto}</h2>
                    <p className="text-sm text-muted-foreground">
                      {formatBRL(saque.valor)} · {saque.metodo === "PIX" ? "PIX" : "Conta bancária"} · {dataHora(saque.criadoEm)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        saque.status === "CONCLUIDO"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : saque.status === "PROCESSANDO"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      }
                    >
                      {saque.status === "CONCLUIDO" ? "Concluído" : saque.status === "PROCESSANDO" ? "Processando" : "Pendente"}
                    </Badge>
                    {saque.status === "PENDENTE" && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          atualizarSaqueAdmin(saque.id, "PROCESSANDO").then(carregar).catch(falhou("Não foi possível processar o saque."))
                        }
                      >
                        Processar
                      </Button>
                    )}
                    {saque.status === "PROCESSANDO" && (
                      <Button
                        className="bg-[#1F3A66] hover:bg-[#152847]"
                        onClick={() =>
                          atualizarSaqueAdmin(saque.id, "CONCLUIDO").then(carregar).catch(falhou("Não foi possível concluir o saque."))
                        }
                      >
                        Concluir
                      </Button>
                    )}
                  </div>
                </article>
              ))}
              {saques.length === 0 && vazio("Nenhum saque solicitado", "Quando um guia pedir um saque, ele aparece aqui.")}
            </div>
          )}

          {!carregando && aba === "denuncias" && (
            <div className="space-y-3">
              {denuncias.map((item) => (
                <article key={item.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-bold text-[#1F3A66]">{item.roteiro}</h2>
                    <span className="text-xs text-muted-foreground">{dataHora(item.criadoEm)}</span>
                  </div>
                  <p className="mt-2 rounded-xl bg-[#f4f4f6] px-4 py-3 text-sm leading-relaxed">{item.motivo}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">Enviada por {item.autor}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAba("roteiros");
                      }}
                    >
                      Ver nos roteiros
                    </Button>
                  </div>
                </article>
              ))}
              {denuncias.length === 0 && vazio("Nenhuma denúncia recebida", "As reclamações sobre roteiros aparecem aqui.")}
            </div>
          )}

          {!carregando && aba === "cupons" && (
            <div className="space-y-4">
              <form
                className="grid gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
                onSubmit={(event) => {
                  event.preventDefault();
                  criarCupomAdmin({ codigo: codigo.trim().toUpperCase(), tipo: tipoCupom, valor: Number(valorCupom) })
                    .then(() => {
                      setCodigo("");
                      carregar();
                    })
                    .catch(falhou("Não foi possível criar o cupom."));
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    placeholder="BEMVINDO10"
                    value={codigo}
                    onChange={(event) => setCodigo(event.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoCupom">Tipo</Label>
                  <select
                    id="tipoCupom"
                    value={tipoCupom}
                    onChange={(event) => setTipoCupom(event.target.value as "PERCENTUAL" | "VALOR")}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="PERCENTUAL">Percentual</option>
                    <option value="VALOR">Valor em R$</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorCupom">{tipoCupom === "PERCENTUAL" ? "Desconto (%)" : "Desconto (R$)"}</Label>
                  <Input
                    id="valorCupom"
                    type="number"
                    min={1}
                    max={tipoCupom === "PERCENTUAL" ? 100 : undefined}
                    value={valorCupom}
                    onChange={(event) => setValorCupom(event.target.value)}
                  />
                </div>
                <Button type="submit" className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]">
                  Criar cupom
                </Button>
              </form>
              {cupons.map((cupom) => (
                <article key={cupom.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <div>
                    <h2 className="font-mono text-lg font-bold tracking-wide text-[#1F3A66]">{cupom.codigo}</h2>
                    <p className="text-sm text-muted-foreground">
                      {cupom.tipo === "PERCENTUAL" ? `${cupom.valor}% de desconto` : `${formatBRL(cupom.valor)} de desconto`}
                      {cupom.expiraEm ? ` · expira em ${dataHora(cupom.expiraEm)}` : " · sem prazo"}
                    </p>
                  </div>
                  <Badge
                    className={
                      cupom.ativo ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-muted text-muted-foreground hover:bg-muted"
                    }
                  >
                    {cupom.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </article>
              ))}
              {cupons.length === 0 && vazio("Nenhum cupom criado", "Crie um código acima para oferecer desconto no pagamento.")}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
