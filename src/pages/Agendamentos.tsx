
import TabsElementos from "@/components/Agendamentos/TabsElementos";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ArrowLeft, Bookmark, HomeIcon, List, MapPin, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const ORANGE = "#F47B2A";
const NAVY = "#1F3A66";
const BG = "#eef0f2";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');
dayjs.tz.setDefault('America/Sao_Paulo');

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

export default function Agendamentos() {
  const [formData, setFormData] = useState(dayjs.tz(new Date(), 'America/Sao_Paulo'));
  const navigate = useNavigate()
  

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* breadcrumb + voltar */}
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
        >
          <Typography sx={{ color: "#8a93a0", fontSize: 14 }}>
            <Link to="/home/tela-avaliacao" style={{ color: "inherit", textDecoration: "none" }}>
              catalogo
            </Link>{" "}
            / <span style={{ color: ORANGE }}>Panteão Pátria Liberdade</span>
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowLeft />}
            sx={{
              bgcolor: NAVY,
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#162a4a" },
            }}
            onClick={()=> navigate(-1)}
          >
            Voltar
          </Button>
        </Stack>

        {/* hero card */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 420px) 1fr" },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Box
            component="img"
            src={"https://vineadei.wordpress.com/wp-content/uploads/2021/06/images28129.jpeg?w=640"}
            alt="Panteão Pátria Liberdade"
            sx={{
              width: "100%",
              height: 260,
              objectFit: "cover",
              borderRadius: 2,
              display: "block",
            }}
          />
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: NAVY, mb: 1.5 }}
            >
              Panteão Pátria Liberdade
            </Typography>
            <Typography sx={{ color: "#3a4554", lineHeight: 1.55, mb: 2 }}>
              Um marco da arquitetura moderna e espiritualidade. Projetada com
              curvas que se elevam ao céu, a Catedral é famosa por seus
              vitrais em tons de azul, verde e marrom que banham o interior
              com uma luz celestial única. É um ponto obrigatório para quem
              busca contemplar arte, história e um momento de paz no coração
              da capital.
            </Typography>
            <Typography
              sx={{ color: ORANGE, fontWeight: 800, fontSize: 22, mb: 2 }}
            >
              R$ 300, 00
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Stack direction="row" spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DatePicker
                    label="Data"
                    value={formData}
                    onChange={(value) => setFormData(value)}
                    disablePast

                    sx={{ mb: 2, width: '70%' }}
                  />
                </LocalizationProvider>
              </Stack>
              <Box sx={{ flex: 1 }} />
              <Button
                variant="contained"
                sx={{
                  bgcolor: NAVY,
                  px: 5,
                  py: 1.5,
                  fontWeight: 800,
                  letterSpacing: 1,
                  borderRadius: 1.5,
                  "&:hover": { bgcolor: "#162a4a" },
                }}
                onClick={() => navigate("/home/pagamento")}
              >
                RESERVAR
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ mt: 4, borderBottom: "1px solid #d6dae0" }}>
          <TabsElementos />
        </Box>

      </Container>
    </Box>
  );
}