import { Box, Button, Card, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import { ArrowLeft, Bookmark, Clock, CreditCard, Home as HomeIcon, List, MapPin, MessageSquare, QrCode, ShieldAlert, User, Users } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ORANGE = "#F47B2A";
const NAVY = "#1F3A66";
const BG = "#eef0f2";


function Header() {
  const navigate = useNavigate()
  return (
    <>
      {/* Header Completo da Home */}
      <header className="w-full p-4 border-b flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-orange-500">
          <div className="relative">
            <MapPin size={36} className="fill-current" />
            <User size={18} className="absolute top-1.5 left-2 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">GoGuia</h1>
        </div>

        {/* Ícones de Navegação Central */}
        <nav className="flex items-center gap-6 text-indigo-900">
          <button className="hover:text-orange-500 transition-colors" onClick={() => navigate("/home")}><HomeIcon size={28} /></button>
          <button className="hover:text-orange-500 transition-colors"><Bookmark size={28} /></button>
          <button className="hover:text-orange-500 transition-colors"><List size={28} /></button>
        </nav>

        {/* Ações da Direita */}
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-orange-500 transition-colors">
            <MessageSquare size={28} />
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 transition-colors">
            <User size={20} />
            Minha Conta
          </button>
        </div>
      </header>
    </>
  );
}


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

function PixPanel() {
  const code = "1a2b3c4d567890abcdejhdsbfgjy";
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
          <img
            alt="QR Code PIX"
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 10 10'><rect width='10' height='10' fill='white'/><g fill='black'><rect x='0' y='0' width='3' height='3'/><rect x='7' y='0' width='3' height='3'/><rect x='0' y='7' width='3' height='3'/><rect x='1' y='1' width='1' height='1' fill='white'/><rect x='8' y='1' width='1' height='1' fill='white'/><rect x='1' y='8' width='1' height='1' fill='white'/><rect x='4' y='1' width='1' height='1'/><rect x='5' y='2' width='1' height='1'/><rect x='4' y='4' width='2' height='2'/><rect x='7' y='5' width='1' height='1'/><rect x='5' y='7' width='1' height='1'/><rect x='7' y='8' width='1' height='1'/><rect x='8' y='4' width='1' height='1'/><rect x='3' y='5' width='1' height='1'/><rect x='6' y='6' width='1' height='1'/><rect x='2' y='4' width='1' height='1'/></g></svg>"
            style={{ width: 120, height: 120 }}
          />
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
            >
              Copiar código
            </Button>
          </Stack>
          <Typography sx={{ mt: 1.2, color: "#374151", fontSize: 14 }}>
            Expira em: <b>09:32</b>
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
        Esperando Pagamento . . .
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

function ReviewPanel() {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", mb: 2 }}>
        <Box
          component="img"
          src={"https://vineadei.wordpress.com/wp-content/uploads/2021/06/images28129.jpeg?w=640"}
          alt="Panteão Pátria Liberdade"
          sx={{ width: 170, height: 110, objectFit: "cover", borderRadius: 1 }}
        />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: 18 }}>
              Panteão Pátria Liberdade
            </Typography>
            <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: 13 }}>17 / 02 / 2026</Typography>
          </Stack>
          <Typography sx={{ color: "#374151", fontSize: 13, mt: 0.5, lineHeight: 1.4 }}>
            Um espaço moderno e imponente, marcado por uma arquitetura única com formas
            angulares e contemporâneas. Ideal para quem aprecia design inovador e busca um ponto
            turístico diferenciado, o local oferece uma experiência visual marcante e perfeita para
            fotos e momentos especiais.
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
            <Clock className="fontSize: 22" />
            <Typography sx={{ fontWeight: 800, fontSize: 24 }}>12 : 30</Typography>
          </Stack>
          <Typography sx={{ fontWeight: 800, fontSize: 22, mt: 1 }}>17 / 02 / 26</Typography>
        </Box>
        <Box sx={{ flex: 1, pt: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
            <User className={`color: ${NAVY}`} />
            <Box>
              <Typography sx={{ fontSize: 11, color: "#6b7280" }}>Guia</Typography>
              <Typography sx={{ fontWeight: 700, color: NAVY }}>Pedro castro França</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
            <Users className={`color: ${NAVY}`} />
            <Box>
              <Typography sx={{ fontSize: 11, color: "#6b7280" }}>Quantidade</Typography>
              <Typography sx={{ fontWeight: 700, color: NAVY }}>5 Pessoas</Typography>
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
  const navigate = useNavigate()

  return (

    <Box sx={{ minHeight: "100vh", bgcolor: BG }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: 32, letterSpacing: 0.5 }}>
            OPÇÕES DE PAGAMENTO
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowLeft />}
            sx={{ bgcolor: NAVY, borderRadius: 2, textTransform: "none", fontWeight: 700, px: 2.5, "&:hover": { bgcolor: "#162a4a" } }}
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, width: "100%" }}>
            <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
              <MethodCard
                active={method === "pix"}
                icon={<QrCode className="fontSize: 22px" />}
                title="PIX"
                subtitle="Pagamento instantâneo"
                onClick={() => setMethod("pix")}
              />
              <MethodCard
                active={method === "card"}
                icon={<CreditCard className="fontSize: 22px" />}
                title="CARTÃO"
                subtitle="Crédito ou débito"
                onClick={() => setMethod("card")}
              />
            </Stack>
            {method === "none" && <ReviewPanel />}
            {method === "pix" && <PixPanel />}
            {method === "card" && <CardPanel />}
          </Box>

          <Box sx={{ width: { xs: "100%", md: 360 } }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 2 }}>
                Resumo do pagamento
              </Typography>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ color: "#374151" }}>Guia turístico:</Typography>
                <Typography sx={{ color: "#111827", fontWeight: 700 }}>R$ 120,00</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ color: "#374151" }}>Extras:</Typography>
                <Typography sx={{ color: "#111827", fontWeight: 700 }}>R$ 10,00</Typography>
              </Stack>
              <Divider sx={{ mb: 1.5 }} />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Total:</Typography>
                <Typography sx={{ color: ORANGE, fontWeight: 800, fontSize: 18 }}>R$ 130,00</Typography>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}