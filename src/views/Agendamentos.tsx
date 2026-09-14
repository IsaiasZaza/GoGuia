"use client";

import TabsElementos from "@/components/Agendamentos/TabsElementos";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";

const ORANGE = "#F47B2A";
const NAVY = "#1F3A66";
const BG = "#eef0f2";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');
dayjs.tz.setDefault('America/Sao_Paulo');

export default function Agendamentos() {
  const [formData, setFormData] = useState(dayjs.tz(new Date(), 'America/Sao_Paulo'));
  const router = useRouter()
  

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* breadcrumb + voltar */}
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
        >
          <Typography sx={{ color: "#8a93a0", fontSize: 14 }}>
            <Link href="/home/tela-avaliacao" style={{ color: "inherit", textDecoration: "none" }}>
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
            onClick={()=> router.back()}
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
                onClick={() => router.push("/home/pagamento")}
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