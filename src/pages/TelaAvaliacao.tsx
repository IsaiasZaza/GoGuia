
import { AppBar, Avatar, Box, Button, Container, CssBaseline, Divider, IconButton, LinearProgress, Rating, Stack, ThemeProvider, Toolbar, Typography, createTheme } from "@mui/material";
import { User, MapPin, Home as HomeIcon, Bookmark, List, MessageSquare, Heart, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const ORANGE = "#F47B2A";

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

const ratings = [
  { label: "Excelente", value: 92 },
  { label: "Muito bom", value: 18 },
  { label: "Razoável", value: 4 },
  { label: "Ruim", value: 10 },
  { label: "Horrível", value: 2 },
];

const reviews = [
  {
    name: "Anthony C",
    text: "Excursão de um dia fantástico com o nosso guia Samuel! Aprendemos muito e nos divertimos muito! Recomendamos vivamente este tour.",
    date: "mar. de 2026",
  },
  {
    name: "Aris",
    text: "Samuel foi incrível, ele é muito informado e tem uma paixão pelo que faz. Ele é muito útil e assegurou que todos nos sentimos seguros e confortáveis durante todo o passeio. Eu definitivamente vou indicar para familiares.",
    date: "nov. de 2025",
  },
];

export default function TelaAvaliacao() {
  const navigate = useNavigate()

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gap: 6,
            alignItems: "start",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={"https://vineadei.wordpress.com/wp-content/uploads/2021/06/images28129.jpeg?w=640"}
              alt="Catedral da fé"
              sx={{
                width: "100%",
                height: { xs: 280, md: 360 },
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "#fff",
                width: 48,
                height: 48,
                boxShadow: 2,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <Heart />
            </IconButton>
          </Box>

          <Stack spacing={3} sx={{ pt: { md: 4 } }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#111", fontSize: 36 }}>
                Catedral da fé
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                <Typography sx={{ color: "#555" }}>Samuel Dantas · 5.0</Typography>
                <Star />
              </Stack>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-start" } }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: ORANGE,
                  color: "#fff",
                  borderRadius: 999,
                  px: 5,
                  py: 1.6,
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#e06d20" },
                }}
                onClick={() => navigate("/home/tela-avaliacao/detalhes")}
              >
                Reserve Agora!
              </Button>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: 6,
            mt: 8,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#111",
                textDecoration: "underline",
                textUnderlineOffset: 4,
                mb: 3,
              }}
            >
              Avaliações
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>5.0</Typography>
              <Rating value={5} readOnly size="small" sx={{ color: ORANGE }} />
              <Typography sx={{ color: "#555" }}>(427)</Typography>
            </Stack>
            <Stack spacing={1.2}>
              {ratings.map((r) => (
                <Stack key={r.label} direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Typography sx={{ width: 90, fontSize: 14, color: "#222" }}>
                    {r.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={r.value}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#eee",
                      "& .MuiLinearProgress-bar": { bgcolor: ORANGE },
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </Box>

          <Stack spacing={2} divider={<Divider />}>
            {reviews.map((rev) => (
              <Stack key={rev.name} spacing={1} sx={{ pt: 2 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Avatar sx={{ width: 32, height: 32 }}>{rev.name[0]}</Avatar>
                  <Typography sx={{ fontWeight: 700 }}>{rev.name}</Typography>
                </Stack>
                <Typography sx={{ color: "#222", lineHeight: 1.5 }}>{rev.text}</Typography>
                <Typography sx={{ color: "#666", fontSize: 14 }}>{rev.date}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}