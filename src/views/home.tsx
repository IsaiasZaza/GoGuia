"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookmarkCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
  Heart,
  Landmark,
  Loader2,
  LogIn,
  MapPin,
  MessageSquare,
  Palmtree,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  UserCheck,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { textoNota } from "@/components/AvaliacaoEstrelas";
import Logo from "@/components/Logo";
import AppHeader from "@/components/layout/AppHeader";
import LocalizacaoSelect from "@/components/layout/LocalizacaoSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRequireLogin } from "@/hooks/use-require-login";
import { cn } from "@/lib/utils";
import { getStoredUser, isLoggedIn, type AuthUser } from "@/services/auth";
import {
  desfavoritar,
  favoritar,
  formatBRL,
  listarFavoritos,
  listarLocalizacoes,
  listarRoteiros,
  type CategoriaRoteiro,
  type RoteiroListaItem,
} from "@/services/dominio";

const imgHero = "/assets/hero.jpg";

type FiltroCategoriaHome = "todos" | CategoriaRoteiro;

interface CategoriaInfo {
  id: CategoriaRoteiro;
  titulo: string;
  subtitulo: string;
  icon: typeof Palmtree;
  corBadge: string;
}

const CATEGORIAS_HOME: CategoriaInfo[] = [
  {
    id: "lazer",
    titulo: "Lazer e Aventura",
    subtitulo: "Praias, trilhas, mirantes e passeios ao ar livre para relaxar ou se aventurar.",
    icon: Palmtree,
    corBadge: "bg-orange-50 text-[#F27420] border-orange-200",
  },
  {
    id: "cultural",
    titulo: "História e Cultura",
    subtitulo: "Centros históricos, gastronomia regional, museus e tradições contadas por quem vive no local.",
    icon: Landmark,
    corBadge: "bg-blue-50 text-[#1F3A66] border-blue-200",
  },
  {
    id: "rural",
    titulo: "Turismo Rural e Natureza",
    subtitulo: "Fazendas históricas, cachoeiras, engenhos, vivências no campo e ecoturismo.",
    icon: Trees,
    corBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

const COMO_FUNCIONA = [
  {
    passo: "01",
    titulo: "Escolha seu destino e roteiro",
    descricao:
      "Filtre passeios por localização, categoria ou busque pelo nome. Compare avaliações reais de outros viajantes e veja o perfil completo do guia.",
    icon: Compass,
  },
  {
    passo: "02",
    titulo: "Agende data e horário em tempo real",
    descricao:
      "Consulte os dias e horários disponíveis na agenda do guia, selecione a quantidade de participantes e confirme sua solicitação de reserva.",
    icon: CalendarCheck,
  },
  {
    passo: "03",
    titulo: "Pague com PIX e fale com o guia",
    descricao:
      "Conclua o pagamento via PIX com QR Code ou código copia e cola, aplique cupons ou cashback da carteira e combine os detalhes pelo chat integrado.",
    icon: MessageSquare,
  },
];

const BENEFICIOS = [
  {
    titulo: "Guias verificados",
    descricao: "Perfis avaliados pela administração com histórico de passeios, foto, localização e nota pública.",
    icon: ShieldCheck,
  },
  {
    titulo: "Avaliações reais",
    descricao: "Notas e comentários publicados exclusivamente por turistas que realizaram o passeio.",
    icon: Star,
  },
  {
    titulo: "Chat direto na reserva",
    descricao: "Converse diretamente com o guia responsável pelo seu agendamento para alinhar ponto de encontro e dúvidas.",
    icon: MessageSquare,
  },
  {
    titulo: "Carteira com cashback e cupons",
    descricao: "Acumule saldo de cashback em suas reservas e utilize cupons de desconto diretamente no pagamento.",
    icon: Wallet,
  },
];

const LABEL_CATEGORIA: Record<CategoriaRoteiro, string> = {
  lazer: "Lazer",
  cultural: "Cultural",
  rural: "Rural",
};

export default function Home() {
  const router = useRouter();
  const exigirLogin = useRequireLogin();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  const [todosPasseios, setTodosPasseios] = useState<RoteiroListaItem[]>([]);
  const [locaisDisponiveis, setLocaisDisponiveis] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  const [busca, setBusca] = useState("");
  const [localFiltro, setLocalFiltro] = useState("");
  const [buscandoRedirect, setBuscandoRedirect] = useState(false);

  const [categoriaAtiva, setCategoriaAtiva] = useState<FiltroCategoriaHome>("todos");
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const [favoritandoIds, setFavoritandoIds] = useState<Record<string, boolean>>({});
  const [feedbackBanner, setFeedbackBanner] = useState<{ tipo: "sucesso" | "info" | "erro"; texto: string } | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
    if (isLoggedIn()) {
      setUser(getStoredUser());
    } else {
      setUser(null);
    }
  }, []);

  const mostrarFeedback = useCallback((tipo: "sucesso" | "info" | "erro", texto: string) => {
    setFeedbackBanner({ tipo, texto });
  }, []);

  useEffect(() => {
    if (!feedbackBanner) return;
    const timer = window.setTimeout(() => setFeedbackBanner(null), 4000);
    return () => window.clearTimeout(timer);
  }, [feedbackBanner]);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErroCarregamento(null);
    try {
      const [destaquesRes, todosRes, locaisRes] = await Promise.all([
        listarRoteiros({ destaque: true }).catch(() => ({ items: [] as RoteiroListaItem[] })),
        listarRoteiros({}),
        listarLocalizacoes().catch(() => ({ items: [] as string[] })),
      ]);

      const idsDestaque = new Set(destaquesRes.items.map((item) => item.id));
      const complemento = todosRes.items.filter((item) => !idsDestaque.has(item.id));
      const combinados = [...destaquesRes.items, ...complemento];

      setTodosPasseios(combinados);
      setLocaisDisponiveis(locaisRes.items);
    } catch {
      setErroCarregamento("Não foi possível carregar os roteiros no momento. Verifique sua conexão e tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Carrega os favoritos reais do turista autenticado para refletir o coração preenchido nos cards
  useEffect(() => {
    if (!mounted || !user || user.tipo !== "TURISTA") return;
    listarFavoritos()
      .then((res) => {
        const mapa: Record<string, boolean> = {};
        res.items.forEach((fav) => {
          mapa[fav.roteiroId] = true;
        });
        setFavoritos(mapa);
      })
      .catch(() => {});
  }, [mounted, user]);

  const passeiosFiltrados = useMemo(() => {
    const lista =
      categoriaAtiva === "todos"
        ? todosPasseios
        : todosPasseios.filter((item) => item.categoria === categoriaAtiva);
    return lista.slice(0, 6);
  }, [todosPasseios, categoriaAtiva]);

  const buscar = (override?: { q?: string; local?: string; categoria?: string }) => {
    if (buscandoRedirect) return;
    setBuscandoRedirect(true);
    const params = new URLSearchParams();
    const termo = (override?.q ?? busca).trim();
    const loc = override?.local ?? localFiltro;
    const cat = override?.categoria;

    if (termo) params.set("q", termo);
    if (loc) params.set("local", loc);
    if (cat) params.set("categoria", cat);

    const texto = params.toString();
    router.push(texto ? `/roteiros?${texto}` : "/roteiros");
  };

  const alternarFavorito = async (id: string, titulo: string) => {
    if (favoritandoIds[id]) return;

    const resultadoAuth = exigirLogin({
      motivo: "Entre como turista para salvar passeios nos seus favoritos.",
      tipos: ["TURISTA"],
    });

    if (resultadoAuth === "tipo-invalido") {
      mostrarFeedback("info", "Apenas contas de turista podem salvar roteiros nos favoritos.");
      return;
    }
    if (resultadoAuth !== "ok") return;

    const proximo = !favoritos[id];
    setFavoritandoIds((atual) => ({ ...atual, [id]: true }));
    setFavoritos((atual) => ({ ...atual, [id]: proximo }));

    try {
      if (proximo) {
        await favoritar(id);
        mostrarFeedback("sucesso", `"${titulo}" foi salvo nos seus favoritos.`);
      } else {
        await desfavoritar(id);
        mostrarFeedback("info", `"${titulo}" foi removido dos seus favoritos.`);
      }
    } catch {
      setFavoritos((atual) => ({ ...atual, [id]: !proximo }));
      mostrarFeedback("erro", "Não foi possível atualizar os favoritos agora. Tente novamente.");
    } finally {
      setFavoritandoIds((atual) => ({ ...atual, [id]: false }));
    }
  };

  const primeiroNome = user?.nomeCompleto?.split(" ")[0];

  return (
    <div className=" flex min-h-screen flex-col bg-[#f4f4f6] font-sans text-foreground">
      <AppHeader activePage="home" />

      {/* Toast / Banner de Feedback Flutuante */}
      {feedbackBanner && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-xl transition-all motion-reduce:transition-none"
        >
          {feedbackBanner.tipo === "sucesso" ? (
            <BookmarkCheck className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : feedbackBanner.tipo === "erro" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          ) : (
            <Sparkles className="h-5 w-5 shrink-0 text-[#F27420]" />
          )}
          <p className="text-sm font-medium text-[#1F3A66]">{feedbackBanner.texto}</p>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="ml-auto text-xs font-bold text-muted-foreground hover:text-foreground"
            aria-label="Fechar aviso"
          >
            ✕
          </button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#1F3A66]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 transition-transform duration-700 motion-reduce:transition-none"
          style={{ backgroundImage: `url(${imgHero})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1F3A66] via-[#1F3A66]/90 to-[#1F3A66]/65"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#F27420]" />
              <span>Turismo local com guias credenciados e reserva online</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:leading-[1.15]">
              {mounted && user
                ? `Olá, ${primeiroNome}! Qual será sua próxima experiência?`
                : "Descubra roteiros autênticos guiados por quem conhece cada lugar"}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Conectamos viajantes a guias de turismo locais para passeios de lazer, história, cultura e natureza com
              agendamento em tempo real, pagamento via PIX e chat direto.
            </p>

            {/* Barra de Busca Principal */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                buscar();
              }}
              aria-label="Buscar passeios turísticos"
              className="mt-8 flex flex-col gap-2.5 rounded-2xl bg-white/95 p-2.5 shadow-2xl backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full sm:p-2"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Busque por roteiro, destino ou guia..."
                  aria-label="Termo de busca"
                  className="h-11 w-full rounded-full border-0 bg-transparent pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F27420]"
                />
              </div>

              <div className="sm:w-[230px]">
                <LocalizacaoSelect
                  value={localFiltro}
                  onChange={setLocalFiltro}
                  className="border-0 shadow-none sm:border-l sm:border-border sm:rounded-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={buscandoRedirect}
                className="h-11 rounded-full bg-[#F27420] px-7 font-bold text-white shadow-md transition-all hover:bg-[#d65f15] disabled:opacity-70"
              >
                {buscandoRedirect ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Buscar roteiros</span>
                  </>
                )}
              </Button>
            </form>

            {/* Sugestões rápidas de destinos reais */}
            {locaisDisponiveis.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-white/75">Destinos disponíveis:</span>
                {locaisDisponiveis.slice(0, 5).map((local) => (
                  <button
                    key={local}
                    type="button"
                    onClick={() => buscar({ local })}
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition-colors hover:border-[#F27420] hover:bg-[#F27420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]"
                  >
                    <MapPin className="h-3 w-3" />
                    {local}
                  </button>
                ))}
              </div>
            )}

            {/* CTAs Contextuais (Autenticado vs Visitante) */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-2">
              {mounted && user ? (
                <>
                  <Button
                    type="button"
                    onClick={() => router.push("/roteiros")}
                    className="rounded-full bg-[#F27420] px-6 py-5 font-bold text-white shadow-lg hover:bg-[#d65f15]"
                  >
                    <Compass className="h-4 w-4" />
                    Explorar todos os roteiros
                  </Button>
                  {user.tipo === "GUIA" ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/meus-roteiros")}
                      className="rounded-full border-white/30 bg-white/10 px-6 py-5 font-bold text-white backdrop-blur-xs hover:bg-white hover:text-[#1F3A66]"
                    >
                      Ir para meus roteiros
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : user.tipo === "ADMIN" ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/admin")}
                      className="rounded-full border-white/30 bg-white/10 px-6 py-5 font-bold text-white backdrop-blur-xs hover:bg-white hover:text-[#1F3A66]"
                    >
                      Acessar painel admin
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/agendamentos")}
                      className="rounded-full border-white/30 bg-white/10 px-6 py-5 font-bold text-white backdrop-blur-xs hover:bg-white hover:text-[#1F3A66]"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      Meus agendamentos
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => router.push("/login?tab=cadastro")}
                    className="rounded-full bg-[#F27420] px-6 py-5 font-bold text-white shadow-lg transition-all hover:bg-[#d65f15]"
                  >
                    <UserPlus className="h-4 w-4" />
                    Criar conta gratuita
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="rounded-full border-white/35 bg-white/10 px-6 py-5 font-bold text-white backdrop-blur-xs transition-all hover:bg-white hover:text-[#1F3A66]"
                  >
                    <LogIn className="h-4 w-4" />
                    Já tenho conta · Entrar
                  </Button>
                  <button
                    type="button"
                    onClick={() => router.push("/roteiros")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline"
                  >
                    Explorar catálogo sem login
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        {/* SEÇÃO 1: CATEGORIAS DE EXPERIÊNCIA */}
        <section aria-labelledby="titulo-categorias">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F27420]">Estilos de viagem</span>
              <h2 id="titulo-categorias" className="mt-1 text-2xl font-extrabold text-[#1F3A66] sm:text-3xl">
                Explore por categoria
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Escolha o tipo de passeio ideal para sua programação
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {CATEGORIAS_HOME.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => buscar({ categoria: cat.id })}
                  className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-6 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#F27420]/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420] motion-reduce:transition-none"
                >
                  <div>
                    <div
                      className={cn(
                        "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border",
                        cat.corBadge
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1F3A66] group-hover:text-[#F27420]">{cat.titulo}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cat.subtitulo}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3A66] group-hover:text-[#F27420]">
                    Ver roteiros de {LABEL_CATEGORIA[cat.id].toLowerCase()}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SEÇÃO 2: ROTEIROS EM DESTAQUE / CATÁLOGO */}
        <section aria-labelledby="titulo-roteiros-destaque">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F27420]">Seleção GoGuia</span>
              <h2 id="titulo-roteiros-destaque" className="mt-1 text-2xl font-extrabold text-[#1F3A66] sm:text-3xl">
                Roteiros para sua próxima saída
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Passeios publicados por guias locais com reserva online imediata
              </p>
            </div>

            {/* Filtro rápido por abas */}
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrar roteiros por categoria">
              {(
                [
                  { id: "todos", label: "Todos" },
                  { id: "lazer", label: "Lazer" },
                  { id: "cultural", label: "Cultural" },
                  { id: "rural", label: "Rural" },
                ] as { id: FiltroCategoriaHome; label: string }[]
              ).map((aba) => {
                const selecionada = categoriaAtiva === aba.id;
                return (
                  <button
                    key={aba.id}
                    type="button"
                    role="tab"
                    aria-selected={selecionada}
                    onClick={() => setCategoriaAtiva(aba.id)}
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420]",
                      selecionada
                        ? "bg-[#1F3A66] text-white shadow-xs"
                        : "border border-border bg-white text-[#1F3A66] hover:border-[#1F3A66]/40 hover:bg-muted"
                    )}
                  >
                    {aba.label}
                  </button>
                );
              })}
            </div>
          </div>

          {carregando ? (
            <div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              aria-busy="true"
              aria-label="Carregando roteiros"
            >
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex h-[360px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-xs"
                >
                  <div className="h-48 w-full animate-pulse bg-muted" />
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="space-y-3">
                      <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3.5 w-1/2 animate-pulse rounded bg-muted" />
                      <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                      <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : erroCarregamento ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-xs"
            >
              <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
              <p className="mt-3 text-base font-bold text-[#1F3A66]">Falha ao carregar os passeios</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{erroCarregamento}</p>
              <Button
                type="button"
                onClick={carregarDados}
                className="mt-5 rounded-full bg-[#1F3A66] font-bold text-white hover:bg-[#152847]"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          ) : passeiosFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
              <Compass className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-base font-bold text-[#1F3A66]">
                {categoriaAtiva === "todos"
                  ? "Nenhum roteiro publicado ainda"
                  : `Nenhum roteiro na categoria ${LABEL_CATEGORIA[categoriaAtiva]} no momento`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {categoriaAtiva === "todos"
                  ? "Assim que os guias publicarem novos passeios, eles aparecerão aqui."
                  : "Experimente visualizar todas as categorias ou buscar por outro destino."}
              </p>
              {categoriaAtiva !== "todos" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCategoriaAtiva("todos")}
                  className="mt-4 rounded-full font-semibold"
                >
                  Mostrar todas as categorias
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {passeiosFiltrados.map((passeio) => {
                  const isFav = Boolean(favoritos[passeio.id]);
                  const isSalvandoFav = Boolean(favoritandoIds[passeio.id]);

                  return (
                    <Card
                      key={passeio.id}
                      onClick={() => router.push(`/home/tela-avaliacao?id=${passeio.id}`)}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none"
                    >
                      <div className="relative h-52 overflow-hidden bg-muted">
                        <img
                          src={passeio.imageUrl || imgHero}
                          alt={passeio.titulo}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                        <span className="absolute left-3 top-3 rounded-full bg-[#1F3A66]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-xs">
                          {LABEL_CATEGORIA[passeio.categoria] ?? passeio.categoria}
                        </span>

                        <button
                          type="button"
                          disabled={isSalvandoFav}
                          onClick={(event) => {
                            event.stopPropagation();
                            alternarFavorito(passeio.id, passeio.titulo);
                          }}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27420] disabled:opacity-60"
                          aria-label={isFav ? "Remover dos favoritos" : "Salvar nos favoritos"}
                          aria-pressed={isFav}
                        >
                          {isSalvandoFav ? (
                            <Loader2 className="h-4 w-4 animate-spin text-[#F27420]" />
                          ) : (
                            <Heart
                              className={cn(
                                "h-4 w-4 transition-colors",
                                isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"
                              )}
                            />
                          )}
                        </button>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
                          <span className="inline-flex items-center gap-1 truncate drop-shadow-xs">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F27420]" />
                            <span className="truncate">{passeio.local}</span>
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/50 px-2.5 py-0.5 backdrop-blur-xs">
                            <Clock className="h-3 w-3" />
                            {passeio.duracao}
                          </span>
                        </div>
                      </div>

                      <CardContent className="flex flex-1 flex-col justify-between gap-3 p-5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-1 text-base font-bold text-[#1F3A66] group-hover:text-[#F27420]">
                              {passeio.titulo}
                            </h3>
                            <span
                              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-xs font-bold text-[#F27420]"
                              title={
                                passeio.totalAvaliacoes > 0
                                  ? `Nota ${passeio.notaMedia} de 5 (${passeio.totalAvaliacoes} avaliações)`
                                  : "Roteiro ainda sem avaliações"
                              }
                            >
                              <Star className="h-3 w-3 fill-current" />
                              {textoNota(passeio.notaMedia, passeio.totalAvaliacoes)}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {passeio.descricao}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/70 pt-3">
                          <div className="min-w-0">
                            <p className="text-[11px] text-muted-foreground">Guiado por</p>
                            <p className="truncate text-xs font-semibold text-[#1F3A66]">
                              {passeio.guia.nomeCompleto}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-semibold uppercase text-muted-foreground">por pessoa</p>
                            <p className="text-lg font-extrabold text-[#1F3A66]">{formatBRL(passeio.preco)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/roteiros")}
                  className="rounded-full border-[#1F3A66]/30 bg-white px-8 font-bold text-[#1F3A66] hover:bg-[#1F3A66] hover:text-white"
                >
                  Ver catálogo completo de roteiros
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </section>

        {/* SEÇÃO 3: COMO FUNCIONA */}
        <section
          aria-labelledby="titulo-como-funciona"
          className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs sm:p-10"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F27420]">Simples e transparente</span>
            <h2 id="titulo-como-funciona" className="mt-1 text-2xl font-extrabold text-[#1F3A66] sm:text-3xl">
              Como funciona o GoGuia
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Planeje seu passeio em poucos cliques com acompanhamento do pedido ao encontro com o guia
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {COMO_FUNCIONA.map((etapa) => {
              const Icon = etapa.icon;
              return (
                <div key={etapa.passo} className="relative flex flex-col items-start">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F3A66] text-white shadow-sm">
                      <Icon className="h-6 w-6 text-[#F27420]" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-[#F27420]">
                      Passo {etapa.passo}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1F3A66]">{etapa.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{etapa.descricao}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEÇÃO 4: DIFERENCIAIS / CONFIANÇA */}
        <section aria-labelledby="titulo-beneficios">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F27420]">Por que usar o GoGuia</span>
            <h2 id="titulo-beneficios" className="mt-1 text-2xl font-extrabold text-[#1F3A66] sm:text-3xl">
              Segurança para o turista e valorização do guia local
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFICIOS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.titulo}
                  className="rounded-2xl border border-border/70 bg-white p-5 shadow-xs"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F27420]/12 text-[#F27420]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F3A66]">{item.titulo}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.descricao}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEÇÃO 5: CTA PARA GUIAS DE TURISMO */}
        <section
          aria-labelledby="titulo-seja-guia"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F3A66] via-[#1F3A66] to-[#152847] p-6 text-white shadow-lg sm:p-10 lg:p-12"
        >
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#F27420]">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Para profissionais e guias locais</span>
              </div>
              <h2 id="titulo-seja-guia" className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Você é guia de turismo? Divulgue seus roteiros no GoGuia
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                Cadastre seus passeios com fotos, paradas e valores, organize sua agenda de horários, gerencie
                solicitações de reserva, converse com os turistas e acompanhe seus ganhos e saques na carteira do guia.
              </p>

              <ul className="mt-5 grid grid-cols-1 gap-2.5 text-xs font-medium text-white/90 sm:grid-cols-2 sm:text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F27420]" />
                  Publicação de roteiros com galeria e mapa de paradas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F27420]" />
                  Controle completo de dias, horários e vagas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F27420]" />
                  Aceite ou recuse reservas em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F27420]" />
                  Carteira digital com extrato e solicitação de saque via PIX
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
              {mounted && user?.tipo === "GUIA" ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => router.push("/meus-roteiros")}
                  className="rounded-full bg-[#F27420] px-8 py-6 text-base font-bold text-white shadow-lg hover:bg-[#d65f15]"
                >
                  Acessar painel do guia
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => router.push("/login?tab=cadastro&tipo=GUIA")}
                    className="rounded-full bg-[#F27420] px-8 py-6 text-base font-bold text-white shadow-lg hover:bg-[#d65f15]"
                  >
                    Quero me cadastrar como guia
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  {!user && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.push("/login")}
                      className="rounded-full text-white/90 hover:bg-white/10 hover:text-white"
                    >
                      Já sou guia cadastrado · Entrar
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="mt-12 border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="space-y-2">
            <Logo />
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Plataforma de conexão entre turistas e guias locais para experiências autênticas, seguras e bem
              avaliadas.
            </p>
          </div>

          <nav aria-label="Links do rodapé" className="flex flex-wrap gap-6 text-sm font-semibold text-[#1F3A66]">
            <button type="button" onClick={() => router.push("/roteiros")} className="hover:text-[#F27420]">
              Roteiros
            </button>
            <button
              type="button"
              onClick={() => router.push("/roteiros?categoria=lazer")}
              className="hover:text-[#F27420]"
            >
              Lazer
            </button>
            <button
              type="button"
              onClick={() => router.push("/roteiros?categoria=cultural")}
              className="hover:text-[#F27420]"
            >
              Cultural
            </button>
            <button
              type="button"
              onClick={() => router.push("/roteiros?categoria=rural")}
              className="hover:text-[#F27420]"
            >
              Rural
            </button>
            {!user && (
              <>
                <button type="button" onClick={() => router.push("/login")} className="hover:text-[#F27420]">
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/login?tab=cadastro")}
                  className="text-[#F27420] hover:underline"
                >
                  Criar conta
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="border-t border-border/60 bg-[#f4f4f6]/60 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} GoGuia. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
