"use client";

import { Box, Button, Card, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import { ArrowLeft, CheckCircle2, Clock, CreditCard, QrCode, ShieldAlert, User, Users } from 'lucide-react';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import {
  aplicarCupom,
  carteiraTurista,
  consultarPagamento,
  detalheReserva,
  formatBRL,
  pagarReserva,
  type CupomAplicado,
  type PagamentoPix,
  type Reserva,
} from "@/services/dominio";
import { getApiErrorMessage } from "@/services/auth";

const ORANGE = "#F47B2A";
const NAVY = "#1F3A66";
const BG = "#eef0f2";


function MethodCard({
  active,
  icon,
  title,
  subtitle,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onClick();
      }}
      sx={{
        p: 2,
        cursor: "pointer",
        borderRadius: 3,
        border: active ? `2px solid ${ORANGE}` : "2px solid transparent",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        minWidth: 280,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          bgcolor: active ? ORANGE : "#fff5ee",
          color: active ? "#fff" : ORANGE,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
        <Typography sx={{ fontSize: 11, fontWeight: 800, mt: 0.3 }}>{title}</Typography>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: 20 }}>{title}</Typography>
        <Typography sx={{ color: "#6b7280", fontSize: 14 }}>{subtitle}</Typography>
      </Box>
    </Card>
  );
}

function PixPanel({ pagamento }: { pagamento: PagamentoPix | null }) {
  const code = pagamento?.copiaECola || "Gerando código...";
  return (
    <Card sx={{ p: 3, borderRadius: 3, position: "relative", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <Box
        sx={{
          position: "absolute",
          top: -10,
          left: 90,
          width: 20,
          height: 20,
          bgcolor: "#fff",
          transform: "rotate(45deg)",
          borderTop: "2px solid transparent",
        }}
      />
      <Stack direction="row" spacing={3} sx={{ alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 140,
            height: 140,
            border: "1px solid #d1d5db",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          {pagamento?.qrCode ? (
            <img alt="QR Code PIX" src={pagamento.qrCode} style={{ width: 120, height: 120 }} />
          ) : (
            <QrCode size={48} color="#9ca3af" />
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: 22 }}>PIX</Typography>
          <Typography sx={{ color: "#374151", mb: 2 }}>Realize o pagamento via QR code</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: 1,
                px: 2,
                py: 1.2,
                fontFamily: "monospace",
                color: "#374151",
                bgcolor: "#fff",
              }}
            >
              {code}
            </Box>
            <Button
              variant="contained"
              sx={{ bgcolor: ORANGE, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#e06b1f" } }}
              onClick={() => pagamento?.copiaECola && navigator.clipboard.writeText(pagamento.copiaECola)}
            >
              Copiar código
            </Button>
          </Stack>
          <Typography sx={{ mt: 1.2, color: "#374151", fontSize: 14 }}>
            {pagamento?.status === "PAGO"
              ? "Pagamento confirmado"
              : pagamento?.expiraEm
              ? `Expira em: ${new Date(pagamento.expiraEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
              : "Aguardando código"}
          </Typography>
        </Box>
      </Stack>
      <Button
        fullWidth
        sx={{
          mt: 3,
          bgcolor: ORANGE,
          color: "#fff",
          textTransform: "none",
          fontWeight: 700,
          py: 1.4,
          fontSize: 17,
          borderRadius: 2,
          "&:hover": { bgcolor: "#e06b1f" },
        }}
      >
        {pagamento?.status === "PAGO" ? "Pagamento confirmado" : "Esperando pagamento..."}
      </Button>
    </Card>
  );
}

function CardPanel() {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", position: "relative" }}>
      <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1 }}>Número Cartão</Typography>
      <Box sx={{ position: "relative", mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="000 000 000 00000"
          slotProps={{ htmlInput: { maxLength: 19 } }}
        />
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}
        >
          <Box sx={{ px: 0.8, py: 0.2, bgcolor: "#1a1f71", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 0.5 }}>VISA</Box>
          <Box sx={{ px: 0.8, py: 0.2, bgcolor: "#eb001b", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 0.5 }}>MC</Box>
          <Box sx={{ px: 0.8, py: 0.2, bgcolor: "#000", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 0.5 }}>elo</Box>
        </Stack>
      </Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1 }}>Validade</Typography>
          <TextField fullWidth size="small" placeholder="00 / 00" slotProps={{ htmlInput: { maxLength: 7 } }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1 }}>CVV</Typography>
          <TextField fullWidth size="small" placeholder="•••" type="password" slotProps={{ htmlInput: { maxLength: 4 } }} />
        </Box>
      </Stack>
      <Button
        fullWidth
        sx={{
          bgcolor: ORANGE,
          color: "#fff",
          textTransform: "none",
          fontWeight: 700,
          py: 1.4,
          fontSize: 17,
          borderRadius: 2,
          "&:hover": { bgcolor: "#e06b1f" },
        }}
      >
        Confirmar pagamento
      </Button>
    </Card>
  );
}

function ReviewPanel({ reserva }: { reserva: Reserva | null }) {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", mb: 2 }}>
        <Box
          component="img"
          src={reserva?.roteiro?.imageUrl || "/assets/hero.jpg"}
          alt={reserva?.roteiro?.titulo || "Roteiro"}
          sx={{ width: 170, height: 110, objectFit: "cover", borderRadius: 1 }}
        />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: 18 }}>
              {reserva?.roteiro?.titulo || "Reserva"}
            </Typography>
            <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: 13 }}>
              {reserva?.data ? new Date(`${reserva.data}T00:00:00`).toLocaleDateString("pt-BR") : ""}
            </Typography>
          </Stack>
          <Typography sx={{ color: "#374151", fontSize: 13, mt: 0.5, lineHeight: 1.4 }}>
            {reserva?.roteiro?.descricao}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ alignItems: "stretch" }}>
        <Box
          sx={{
            bgcolor: NAVY,
            color: "#fff",
            borderRadius: 2,
            px: 3,
            py: 2,
            minWidth: 170,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
            <Clock size={22} />
            <Typography sx={{ fontWeight: 800, fontSize: 24 }}>{reserva?.horario || "--:--"}</Typography>
          </Stack>
          <Typography sx={{ fontWeight: 800, fontSize: 22, mt: 1 }}>
            {reserva?.data ? new Date(`${reserva.data}T00:00:00`).toLocaleDateString("pt-BR") : ""}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, pt: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
            <User size={18} color={NAVY} />
            <Box>
              <Typography sx={{ fontSize: 11, color: "#6b7280" }}>Guia</Typography>
              <Typography sx={{ fontWeight: 700, color: NAVY }}>{reserva?.guia?.nomeCompleto}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
            <Users size={18} color={NAVY} />
            <Box>
              <Typography sx={{ fontSize: 11, color: "#6b7280" }}>Quantidade</Typography>
              <Typography sx={{ fontWeight: 700, color: NAVY }}>
                {reserva?.quantidade} {reserva?.quantidade === 1 ? "pessoa" : "pessoas"}
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              border: `1px solid ${ORANGE}`,
              bgcolor: "#fff5ee",
              borderRadius: 1,
              px: 1.5,
              py: 1,
            }}
          >
            <ShieldAlert size={22} color={ORANGE} />
            <Typography sx={{ color: ORANGE, fontWeight: 700, fontSize: 13 }}>
              Verifique todas as informações antes de prosseguir
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

export default function Pagamento() {
  const [method, setMethod] = useState<"none" | "pix" | "card">("none");
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [pix, setPix] = useState<PagamentoPix | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("");
  const [cupom, setCupom] = useState<CupomAplicado | null>(null);
  const [usarCashback, setUsarCashback] = useState(false);
  const [cashback, setCashback] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const pago = pix?.status === "PAGO";

  useEffect(() => {
    if (!id) return;
    detalheReserva(id).then(setReserva).catch(() => setReserva(null));
    carteiraTurista().then((carteira) => setCashback(carteira.cashback)).catch(() => setCashback(0));
  }, [id]);

  useEffect(() => {
    if (method !== "pix" || !id) return;
    let active = true;
    const carregar = () =>
      consultarPagamento(id)
        .then((data) => {
          if (active) setPix(data);
        })
        .catch(() => undefined);

    pagarReserva(id, "PIX", { codigoCupom: cupom?.codigo, usarCashback })
      .then((data) => {
        if (active) setPix(data);
      })
      .catch((error) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (active && status !== 409) setErro(getApiErrorMessage(error, "Não foi possível gerar o PIX."));
        carregar();
      });

    const timer = window.setInterval(carregar, 3000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [method, id, cupom?.codigo, usarCashback]);

  return (

    <Box sx={{ minHeight: "100vh", bgcolor: BG }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: 32, letterSpacing: 0.5 }}>
            OPÇÕES DE PAGAMENTO
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowLeft />}
            sx={{ bgcolor: NAVY, borderRadius: 2, textTransform: "none", fontWeight: 700, px: 2.5, "&:hover": { bgcolor: "#162a4a" } }}
            onClick={() => (pago ? router.push("/agendamentos") : router.back())}
          >
            {pago ? "Voltar" : "Cancelar"}
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, width: "100%" }}>
            <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap", display: pago ? "none" : "flex" }}>
              <MethodCard
                active={method === "pix"}
                icon={<QrCode size={22} />}
                title="PIX"
                subtitle="Pagamento instantâneo"
                onClick={() => setMethod("pix")}
              />
              <MethodCard
                active={method === "card"}
                icon={<CreditCard size={22} />}
                title="CARTÃO"
                subtitle="Crédito ou débito"
                onClick={() => {
                  setMethod("card");
                  if (id) {
                    pagarReserva(id, "CARTAO", { codigoCupom: cupom?.codigo, usarCashback }).catch((error) =>
                      setErro(getApiErrorMessage(error, "Cartão indisponível no momento."))
                    );
                  }
                }}
              />
            </Stack>
            {erro && <Typography sx={{ color: "#b91c1c", mb: 2 }}>{erro}</Typography>}
            {pago ? (
              <Card sx={{ p: 4, borderRadius: 3, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <CheckCircle2 size={56} color="#16a34a" style={{ margin: "0 auto" }} />
                <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: 24, mt: 2 }}>
                  Pagamento confirmado
                </Typography>
                <Typography sx={{ color: "#4b5563", mt: 1 }}>
                  Sua reserva foi enviada ao guia. Você recebe um aviso assim que ele confirmar.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center", mt: 3 }}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: ORANGE, textTransform: "none", fontWeight: 700, borderRadius: 999, px: 4, "&:hover": { bgcolor: "#e06b1f" } }}
                    onClick={() => router.push("/agendamentos")}
                  >
                    Ver meus agendamentos
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999, px: 4, color: NAVY, borderColor: "#d1d5db" }}
                    onClick={() => router.push("/roteiros")}
                  >
                    Explorar outros roteiros
                  </Button>
                </Stack>
              </Card>
            ) : (
              <>
                {method === "none" && <ReviewPanel reserva={reserva} />}
                {method === "pix" && <PixPanel pagamento={pix} />}
                {method === "card" && <CardPanel />}
              </>
            )}
          </Box>

          <Box sx={{ width: { xs: "100%", md: 360 } }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 2 }}>
                Resumo do pagamento
              </Typography>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ color: "#374151" }}>Guia turístico:</Typography>
                <Typography sx={{ color: "#111827", fontWeight: 700 }}>
                  {reserva ? formatBRL(reserva.precoUnitario * reserva.quantidade) : "—"}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ color: "#374151" }}>Extras:</Typography>
                <Typography sx={{ color: "#111827", fontWeight: 700 }}>
                  {reserva ? formatBRL(reserva.extras) : "—"}
                </Typography>
              </Stack>
              <Box sx={{ bgcolor: "#fff7f2", border: "1px solid #f6d3b8", borderRadius: 2, p: 1.5, mb: 1.5 }}>
                <Typography sx={{ color: NAVY, fontSize: 13, fontWeight: 800, mb: 1 }}>Cupom e cashback</Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="BEMVINDO10"
                    value={codigo}
                    onChange={(event) => setCodigo(event.target.value.toUpperCase())}
                    fullWidth
                    sx={{ bgcolor: "#fff", borderRadius: 1 }}
                  />
                  <Button
                    variant="contained"
                    sx={{ textTransform: "none", fontWeight: 700, bgcolor: NAVY, boxShadow: "none", "&:hover": { bgcolor: "#162a4a" } }}
                    onClick={() => {
                      if (!id || !codigo.trim()) return;
                      setErro(null);
                      aplicarCupom(id, codigo.trim())
                        .then(setCupom)
                        .catch((error) => setErro(getApiErrorMessage(error, "Cupom inválido.")));
                    }}
                  >
                    Aplicar
                  </Button>
                </Stack>
                {cupom && (
                  <Typography sx={{ color: "#15803d", fontSize: 13, mt: 1, fontWeight: 700 }}>
                    {cupom.codigo} aplicado · −{formatBRL(cupom.desconto)}
                  </Typography>
                )}
                <Box
                  component="button"
                  type="button"
                  onClick={() => cashback > 0 && setUsarCashback((atual) => !atual)}
                  sx={{
                    mt: 1.2,
                    width: "100%",
                    textAlign: "left",
                    border: usarCashback ? `1px solid ${ORANGE}` : "1px solid #e5e7eb",
                    bgcolor: usarCashback ? "#fff" : "#fff",
                    borderRadius: 1.5,
                    px: 1.2,
                    py: 1,
                    cursor: cashback > 0 ? "pointer" : "default",
                    opacity: cashback > 0 ? 1 : 0.6,
                  }}
                >
                  <Typography sx={{ color: NAVY, fontSize: 13, fontWeight: 700 }}>
                    {usarCashback ? "Cashback será usado" : "Usar cashback"}
                  </Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: 12 }}>Saldo disponível: {formatBRL(cashback)}</Typography>
                </Box>
              </Box>
              {(pix?.desconto ?? cupom?.desconto ?? 0) > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ color: "#374151" }}>Desconto:</Typography>
                  <Typography sx={{ color: "#15803d", fontWeight: 700 }}>
                    −{formatBRL(pix?.desconto ?? cupom?.desconto ?? 0)}
                  </Typography>
                </Stack>
              )}
              {(pix?.cashbackAplicado ?? 0) > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ color: "#374151" }}>Cashback:</Typography>
                  <Typography sx={{ color: "#15803d", fontWeight: 700 }}>−{formatBRL(pix?.cashbackAplicado ?? 0)}</Typography>
                </Stack>
              )}
              {usarCashback && !pix?.cashbackAplicado && (
                <Typography sx={{ color: "#6b7280", fontSize: 12, mb: 1 }}>
                  O cashback entra no total quando o PIX é gerado.
                </Typography>
              )}
              <Divider sx={{ mb: 1.5 }} />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Total:</Typography>
                <Typography sx={{ color: ORANGE, fontWeight: 800, fontSize: 18 }}>
                  {reserva || pix?.total != null || cupom ? formatBRL(pix?.total ?? cupom?.total ?? reserva?.total ?? 0) : "—"}
                </Typography>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}