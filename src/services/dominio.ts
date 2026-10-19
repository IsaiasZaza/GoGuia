import api from "@/services/api";

const publico = { skipAuth: true };

export type CategoriaRoteiro = "lazer" | "cultural" | "rural";
export type StatusReserva =
  | "AGUARDANDO_PAGAMENTO"
  | "PENDENTE"
  | "CONFIRMADA"
  | "RECUSADA"
  | "CONCLUIDA"
  | "CANCELADA";
export type StatusPagamento = "PENDENTE" | "PAGO" | "EXPIRADO";
export type StatusSaque = "PENDENTE" | "PROCESSANDO" | "CONCLUIDO";
export type MetodoSaque = "PIX" | "CONTA_BANCARIA";

export interface GuiaResumo {
  id: string;
  nomeCompleto: string;
  fotoUrl: string | null;
  notaMedia: number;
}

export interface Parada {
  nome: string;
  lat: number;
  lng: number;
}

export interface RoteiroListaItem {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaRoteiro;
  local: string;
  distancia: string;
  duracao: string;
  preco: number;
  imageUrl: string | null;
  notaMedia: number;
  totalAvaliacoes: number;
  guia: GuiaResumo;
}

export interface RoteiroDetalhe extends RoteiroListaItem {
  capacidade: number;
  ativo: boolean;
  destaque: boolean;
  idioma: string;
  incluso: string[];
  politicaCancelamento: string[];
  paradas: Parada[];
}

export interface AvaliacoesRoteiro {
  notaMedia: number;
  total: number;
  distribuicao: { label: string; quantidade: number }[];
  comentarios: {
    id: string;
    autor: string;
    texto: string;
    nota: number;
    criadoEm: string;
  }[];
}

export interface Favorito {
  roteiroId: string;
  titulo: string;
  descricao: string;
  imageUrl: string | null;
}

export interface Perfil {
  id: string;
  nomeCompleto: string;
  email: string;
  fotoUrl: string | null;
  tipo: "TURISTA" | "GUIA" | "ADMIN";
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Reserva {
  id: string;
  status: StatusReserva;
  data: string;
  horario: string;
  quantidade: number;
  precoUnitario: number;
  extras: number;
  total: number;
  roteiro: {
    id: string;
    titulo: string;
    descricao: string;
    imageUrl: string | null;
    local: string;
    incluso?: string[];
    politicaCancelamento?: string[];
  };
  guia: { id: string; nomeCompleto: string };
}

export interface ReservaTuristaItem {
  id: string;
  roteiro: string;
  guiaId?: string;
  data: string;
  horario: string;
  quantidade: number;
  status: StatusReserva;
  total: number;
}

export interface PagamentoPix {
  metodo: "PIX" | "CARTAO";
  status: StatusPagamento;
  qrCode?: string;
  copiaECola?: string;
  expiraEm?: string;
  desconto?: number;
  cashbackAplicado?: number;
  total?: number;
}

export interface RoteiroGuia {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  capacidade: number;
  preco: number;
  imageUrl: string | null;
  ativo: boolean;
  categoria: CategoriaRoteiro;
  local: string;
}

export interface ReservaGuiaItem {
  id: string;
  quando: string;
  data: string;
  horario: string;
  roteiro: string;
  roteiroId: string;
  cliente: { id: string; nomeCompleto: string; fotoUrl: string | null };
  quantidade: number;
  extras: number;
  total: number;
  status: StatusReserva;
}

export interface ReservaGuiaDetalhe extends ReservaGuiaItem {
  local: string;
  endereco: string;
  duracao: string;
  capacidade: number;
  idioma: string;
  descricao: string;
  incluso: string[];
  politicaCancelamento: string[];
}

export interface Conversa {
  id: string;
  reservaId: string;
  roteiro: { id: string; titulo: string; imageUrl: string | null };
  outroUsuario: { id: string; nomeCompleto: string; fotoUrl: string | null; online: boolean };
  ultimaMensagem: { texto: string; criadoEm: string; minha: boolean } | null;
  atualizadoEm: string;
}

export interface Mensagem {
  id: string;
  texto: string;
  criadoEm: string;
  remetenteId: string;
  minha: boolean;
}

export interface CarteiraTurista {
  pagamentosRealizados: number;
  creditosPromocionais: number;
  cashback: number;
  vouchers: number;
}

export interface CarteiraGuia {
  saldoDisponivel: number;
  saldoPendente: number;
  ganhosMes: number;
  acumulado: number;
  taxasPlataforma: number;
  liquido: number;
  proximoPagamento: string | null;
}

export interface Saque {
  id: string;
  valor: number;
  metodo: MetodoSaque;
  status: StatusSaque;
  criadoEm: string;
}

export function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function labelStatus(status: StatusReserva) {
  const map: Record<StatusReserva, string> = {
    AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
    PENDENTE: "Pendente",
    CONFIRMADA: "Confirmada",
    RECUSADA: "Recusada",
    CONCLUIDA: "Concluída",
    CANCELADA: "Cancelada",
  };
  return map[status];
}

function qs(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const text = search.toString();
  return text ? `?${text}` : "";
}

export function listarLocalizacoes() {
  return api.get<{ items: string[] }>("/roteiros/localizacoes", publico);
}

export function listarRoteiros(filtro: { q?: string; local?: string; categoria?: string; destaque?: boolean } = {}) {
  return api.get<{ items: RoteiroListaItem[] }>(
    `/roteiros${qs({
      q: filtro.q,
      local: filtro.local,
      categoria: filtro.categoria,
      destaque: filtro.destaque ? "true" : undefined,
    })}`,
    publico
  );
}

export function detalheRoteiro(id: string) {
  return api.get<RoteiroDetalhe>(`/roteiros/${id}`, publico);
}

export function avaliacoesRoteiro(id: string) {
  return api.get<AvaliacoesRoteiro>(`/roteiros/${id}/avaliacoes`, publico);
}

export function listarFavoritos() {
  return api.get<{ items: Favorito[] }>("/turista/favoritos");
}

export function favoritar(roteiroId: string) {
  return api.post<Favorito>("/turista/favoritos", { roteiroId });
}

export function desfavoritar(roteiroId: string) {
  return api.delete<void>(`/turista/favoritos/${roteiroId}`);
}

export function obterPerfil() {
  return api.get<Perfil>("/usuario/perfil");
}

export function atualizarPerfil(dados: Partial<Omit<Perfil, "id" | "fotoUrl" | "tipo">>) {
  return api.put<Perfil>("/usuario/perfil", dados);
}

export function trocarSenha(senhaAtual: string, novaSenha: string) {
  return api.put<void>("/usuario/senha", { senhaAtual, novaSenha });
}

export function encerrarConta() {
  return api.delete<void>("/usuario/conta");
}

export function criarReserva(input: { roteiroId: string; data: string; horario: string; quantidade: number }) {
  return api.post<Reserva>("/reservas", input);
}

export function detalheReserva(id: string) {
  return api.get<Reserva>(`/reservas/${id}`);
}

export function listarReservasTurista(status?: StatusReserva) {
  return api.get<{ items: ReservaTuristaItem[] }>(`/turista/reservas${qs({ status })}`);
}

export function pagarReserva(
  id: string,
  metodo: "PIX" | "CARTAO",
  opcoes?: { codigoCupom?: string; usarCashback?: boolean }
) {
  return api.post<PagamentoPix>(`/reservas/${id}/pagamento`, {
    metodo,
    ...(opcoes?.codigoCupom ? { codigoCupom: opcoes.codigoCupom } : {}),
    ...(opcoes?.usarCashback ? { usarCashback: true } : {}),
  });
}

export function consultarPagamento(id: string) {
  return api.get<PagamentoPix>(`/reservas/${id}/pagamento`);
}

export function listarRoteirosGuia(q?: string) {
  return api.get<{ items: RoteiroGuia[] }>(`/guia/roteiros${qs({ q })}`);
}

export function criarRoteiroGuia(dados: {
  titulo: string;
  descricao: string;
  duracao: string;
  capacidade: number;
  preco: number;
  categoria: CategoriaRoteiro;
  local: string;
  distancia?: string;
  incluso?: string[];
}) {
  return api.post<RoteiroDetalhe>("/guia/roteiros", dados);
}

export function atualizarRoteiroGuia(id: string, dados: Partial<RoteiroGuia>) {
  return api.put<RoteiroDetalhe>(`/guia/roteiros/${id}`, dados);
}

export function definirRoteiroAtivo(id: string, ativo: boolean) {
  return api.patch<{ id: string; ativo: boolean }>(`/guia/roteiros/${id}/ativo`, { ativo });
}

export function listarReservasGuia(quando: "proximas" | "historico" = "proximas") {
  return api.get<{ items: ReservaGuiaItem[] }>(`/guia/reservas?quando=${quando}`);
}

export function detalheReservaGuia(id: string) {
  return api.get<ReservaGuiaDetalhe>(`/guia/reservas/${id}`);
}

export function aceitarReserva(id: string) {
  return api.post<{ id: string; status: StatusReserva }>(`/guia/reservas/${id}/aceitar`);
}

export function recusarReserva(id: string) {
  return api.post<{ id: string; status: StatusReserva }>(`/guia/reservas/${id}/recusar`);
}

export function resumoSemana() {
  return api.get<{ totalReservas: number; faturamentoPrevisto: number }>("/guia/resumo-semana");
}

export function abrirConversa(reservaId: string) {
  return api.post<Conversa>("/conversas", { reservaId });
}

export function listarConversas() {
  return api.get<{ items: Conversa[] }>("/conversas");
}

export function listarMensagens(conversaId: string, depois?: string) {
  return api.get<{ items: Mensagem[] }>(`/conversas/${conversaId}/mensagens${qs({ depois })}`);
}

export function enviarMensagem(conversaId: string, texto: string) {
  return api.post<Mensagem>(`/conversas/${conversaId}/mensagens`, { texto });
}

export function carteiraTurista() {
  return api.get<CarteiraTurista>("/turista/carteira");
}

export function carteiraGuia() {
  return api.get<CarteiraGuia>("/guia/carteira");
}

export function solicitarSaque(valor: number, metodo: MetodoSaque) {
  return api.post<Saque>("/guia/saques", { valor, metodo });
}

export function listarSaques() {
  return api.get<{ items: Saque[] }>("/guia/saques");
}

export interface AgendaRoteiro {
  diasSemana: number[];
  horarios: string[];
  datasBloqueadas: string[];
}

export interface HorarioDisponivel {
  horario: string;
  vagas: number;
}

export interface CupomAplicado {
  codigo: string;
  tipo: "PERCENTUAL" | "VALOR";
  valor: number;
  desconto: number;
  total: number;
}

export interface PerfilGuia {
  id: string;
  nomeCompleto: string;
  fotoUrl: string | null;
  bio: string;
  idiomas: string[];
  cidade: string;
  estado: string;
  notaMedia: number;
  totalAvaliacoes: number;
  aprovado: boolean;
  email?: string;
  roteiros: (RoteiroListaItem & { ativo?: boolean })[];
}

export type TipoNotificacao =
  | "PAGAMENTO_PAGO"
  | "RESERVA_CONFIRMADA"
  | "RESERVA_RECUSADA"
  | "RESERVA_CANCELADA"
  | "MENSAGEM";

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  texto: string;
  lida: boolean;
  criadoEm: string;
  href: string | null;
}

export type StatusAprovacao = "PENDENTE" | "APROVADO" | "RECUSADO";

export interface GuiaAdmin {
  id: string;
  nomeCompleto: string;
  email: string;
  fotoUrl: string | null;
  cidade: string;
  criadoEm: string;
  statusAprovacao: StatusAprovacao;
}

export interface RoteiroAdmin {
  id: string;
  titulo: string;
  ativo: boolean;
  destaque: boolean;
  denuncias: number;
  guia: { id: string; nomeCompleto: string };
}

export interface Denuncia {
  id: string;
  roteiroId: string;
  roteiro: string;
  motivo: string;
  autor: string;
  criadoEm: string;
}

export interface SaqueAdmin extends Saque {
  guia: { id: string; nomeCompleto: string };
}

export interface CupomAdmin {
  id: string;
  codigo: string;
  tipo: "PERCENTUAL" | "VALOR";
  valor: number;
  ativo: boolean;
  expiraEm: string | null;
}

export function obterAgenda(roteiroId: string) {
  return api.get<AgendaRoteiro>(`/guia/roteiros/${roteiroId}/agenda`);
}

export function salvarAgenda(roteiroId: string, agenda: AgendaRoteiro) {
  return api.put<AgendaRoteiro>(`/guia/roteiros/${roteiroId}/agenda`, agenda);
}

export function disponibilidadeRoteiro(roteiroId: string, data: string) {
  return api.get<{ data: string; horarios: HorarioDisponivel[] }>(
    `/roteiros/${roteiroId}/disponibilidade${qs({ data })}`,
    publico
  );
}

export function aplicarCupom(reservaId: string, codigo: string) {
  return api.post<CupomAplicado>(`/reservas/${reservaId}/cupom`, { codigo });
}

export function perfilGuiaPublico(id: string) {
  return api.get<PerfilGuia>(`/guias/${id}`, publico);
}

export function obterPerfilGuia() {
  return api.get<PerfilGuia>("/guia/perfil");
}

export function atualizarPerfilGuia(dados: { bio: string; idiomas: string[]; cidade: string; estado: string }) {
  return api.put<PerfilGuia>("/guia/perfil", dados);
}

export function enviarFotoPerfilGuia(foto: File) {
  const form = new FormData();
  form.append("foto", foto);
  return api.postForm<PerfilGuia>("/guia/perfil/foto", form);
}

export function listarNotificacoes() {
  return api.get<{ items: Notificacao[] }>("/notificacoes");
}

export function marcarNotificacaoLida(id: string) {
  return api.patch<void>(`/notificacoes/${id}/lida`);
}

export function denunciarRoteiro(roteiroId: string, motivo: string) {
  return api.post<{ id: string }>(`/roteiros/${roteiroId}/denuncias`, { motivo });
}

export function listarGuiasAdmin(status?: StatusAprovacao) {
  return api.get<{ items: GuiaAdmin[] }>(`/admin/guias${qs({ status })}`);
}

export function aprovarGuia(id: string) {
  return api.post<{ id: string; statusAprovacao: StatusAprovacao }>(`/admin/guias/${id}/aprovar`);
}

export function recusarGuia(id: string) {
  return api.post<{ id: string; statusAprovacao: StatusAprovacao }>(`/admin/guias/${id}/recusar`);
}

export function listarRoteirosAdmin() {
  return api.get<{ items: RoteiroAdmin[] }>("/admin/roteiros");
}

export function definirDestaqueAdmin(id: string, destaque: boolean) {
  return api.patch<{ id: string; destaque: boolean }>(`/admin/roteiros/${id}/destaque`, { destaque });
}

export function definirAtivoAdmin(id: string, ativo: boolean) {
  return api.patch<{ id: string; ativo: boolean }>(`/admin/roteiros/${id}/ativo`, { ativo });
}

export function listarDenunciasAdmin() {
  return api.get<{ items: Denuncia[] }>("/admin/denuncias");
}

export function listarSaquesAdmin() {
  return api.get<{ items: SaqueAdmin[] }>("/admin/saques");
}

export function atualizarSaqueAdmin(id: string, status: "PROCESSANDO" | "CONCLUIDO") {
  return api.patch<SaqueAdmin>(`/admin/saques/${id}`, { status });
}

export function listarCuponsAdmin() {
  return api.get<{ items: CupomAdmin[] }>("/admin/cupons");
}

export function criarCupomAdmin(dados: { codigo: string; tipo: "PERCENTUAL" | "VALOR"; valor: number; expiraEm?: string }) {
  return api.post<CupomAdmin>("/admin/cupons", dados);
}
