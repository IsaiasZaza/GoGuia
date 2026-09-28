"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, LogOut, ShieldAlert, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clearSession, getApiErrorMessage, getStoredUser, logout } from "@/services/auth";
import {
  atualizarPerfil,
  atualizarPerfilGuia,
  encerrarConta,
  enviarFotoPerfilGuia,
  obterPerfil,
  obterPerfilGuia,
  trocarSenha,
} from "@/services/dominio";

interface DadosUsuario {
  primeiroNome: string;
  ultimoNome: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  senhaAtual: string;
  novaSenha: string;
}

export default function Configuracoes() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);
  const [dados, setDados] = useState<DadosUsuario>({
    primeiroNome: "",
    ultimoNome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    senhaAtual: "",
    novaSenha: "",
  });

  const [salvando, setSalvando] = useState(false);
  const [ehGuia, setEhGuia] = useState(false);
  const [bio, setBio] = useState("");
  const [idiomas, setIdiomas] = useState("");
  const [cidadeGuia, setCidadeGuia] = useState("");
  const [estadoGuia, setEstadoGuia] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    obterPerfil()
      .then((user) => {
        const [primeiroNome, ...resto] = user.nomeCompleto.split(" ");
        setDados((prev) => ({
          ...prev,
          primeiroNome,
          ultimoNome: resto.join(" "),
          email: user.email,
          telefone: user.telefone,
          endereco: user.endereco,
          cidade: user.cidade,
          estado: user.estado,
          cep: user.cep,
        }));
      })
      .catch(() => undefined);
    if (getStoredUser()?.tipo === "GUIA") {
      obterPerfilGuia()
        .then((perfil) => {
          setEhGuia(true);
          setBio(perfil.bio || "");
          setIdiomas(perfil.idiomas.join(", "));
          setCidadeGuia(perfil.cidade || "");
          setEstadoGuia(perfil.estado || "");
        })
        .catch(() => setEhGuia(false));
    }
  }, []);

  const handleChange = (campo: keyof DadosUsuario) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDados((prev) => ({ ...prev, [campo]: e.target.value }));
    setMensagem(null);
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const nomeCompleto = `${dados.primeiroNome} ${dados.ultimoNome}`.trim();
      await atualizarPerfil({
        nomeCompleto,
        email: dados.email,
        telefone: dados.telefone,
        endereco: dados.endereco,
        cidade: dados.cidade,
        estado: dados.estado,
        cep: dados.cep,
      });
      if (dados.novaSenha) {
        await trocarSenha(dados.senhaAtual, dados.novaSenha);
        setDados((prev) => ({ ...prev, senhaAtual: "", novaSenha: "" }));
      }
      setMensagem({ tipo: "sucesso", texto: "Dados salvos com sucesso." });
    } catch (error) {
      setMensagem({ tipo: "erro", texto: getApiErrorMessage(error, "Erro ao salvar. Tente novamente.") });
    } finally {
      setSalvando(false);
    }
  };

  const handleEncerrar = async () => {
    if (!window.confirm("Encerrar a conta apaga o acesso e cancela reservas futuras. Continuar?")) return;
    setSaindo(true);
    try {
      await encerrarConta();
      clearSession();
      router.push("/login");
    } catch (error) {
      setMensagem({ tipo: "erro", texto: getApiErrorMessage(error, "Não foi possível encerrar a conta.") });
      setSaindo(false);
    }
  };

  const handleSalvarGuia = async () => {
    setSalvando(true);
    setMensagem(null);
    try {
      await atualizarPerfilGuia({
        bio,
        idiomas: idiomas
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        cidade: cidadeGuia,
        estado: estadoGuia,
      });
      setMensagem({ tipo: "sucesso", texto: "Perfil público atualizado." });
    } catch (error) {
      setMensagem({
        tipo: "erro",
        texto: getApiErrorMessage(error, "Não foi possível atualizar o perfil público."),
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleFotoGuia = async (arquivo?: File) => {
    if (!arquivo) return;
    try {
      await enviarFotoPerfilGuia(arquivo);
      setMensagem({ tipo: "sucesso", texto: "Foto atualizada." });
    } catch (error) {
      setMensagem({ tipo: "erro", texto: getApiErrorMessage(error, "Não foi possível enviar a foto.") });
    }
  };

  const handleSair = async () => {
    setSaindo(true);
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  const campo = (label: string, campoKey: keyof DadosUsuario, tipo: string = "text", className: string = "") => (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={campoKey}>{label}</Label>
      <Input id={campoKey} type={tipo} value={dados[campoKey]} onChange={handleChange(campoKey)} />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f6] font-sans">
      <AppHeader activePage="configuracoes" />

      <main className="mx-auto w-full max-w-[860px] space-y-5 p-4 md:p-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-[#1F3A66]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#1F3A66]">Configurações</h1>
          <p className="text-sm text-muted-foreground">Seus dados, senha e preferências da conta</p>
        </div>

        {mensagem && (
          <p
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}
          >
            {mensagem.texto}
          </p>
        )}

        <Card className="shadow-sm">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F3A66]/10 text-[#1F3A66]">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-lg text-[#1F3A66]">Dados pessoais</CardTitle>
              <p className="text-sm text-muted-foreground">Como o GoGuia se comunica com você</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {campo("Primeiro nome", "primeiroNome")}
              {campo("Último nome", "ultimoNome")}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {campo("E-mail", "email", "email")}
              {campo("Telefone", "telefone", "tel")}
            </div>
            {campo("Endereço", "endereco")}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {campo("Cidade", "cidade")}
              {campo("Estado", "estado")}
              {campo("CEP", "cep")}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSalvar}
                disabled={salvando}
                className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
              >
                {salvando ? "Salvando..." : "Salvar dados"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1F3A66]">Senha</CardTitle>
            <p className="text-sm text-muted-foreground">Troque a senha da conta sem sair desta tela</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {campo("Senha atual", "senhaAtual", "password")}
              {campo("Nova senha", "novaSenha", "password")}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => router.push("/esqueci-senha")}
                className="text-sm font-semibold text-[#1F3A66] hover:underline"
              >
                Esqueci minha senha
              </button>
              <Button
                onClick={handleSalvar}
                disabled={salvando || !dados.novaSenha}
                className="rounded-full bg-[#1F3A66] font-bold hover:bg-[#152847]"
              >
                Atualizar senha
              </Button>
            </div>
          </CardContent>
        </Card>

        {ehGuia && (
          <Card className="overflow-hidden shadow-sm">
            <div className="bg-[#1F3A66] px-6 py-5 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-[#F27420]">Página do guia</p>
              <CardTitle className="mt-1 text-2xl text-white">Perfil público</CardTitle>
              <p className="mt-1 text-sm text-white/75">O que o turista vê quando abre o seu nome no roteiro.</p>
            </div>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Conte de onde você é e o que torna o passeio especial."
                  className="min-h-28"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idiomas">Idiomas (separados por vírgula)</Label>
                <Input id="idiomas" value={idiomas} onChange={(event) => setIdiomas(event.target.value)} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cidadeGuia">Cidade</Label>
                  <Input id="cidadeGuia" value={cidadeGuia} onChange={(event) => setCidadeGuia(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoGuia">Estado</Label>
                  <Input id="estadoGuia" value={estadoGuia} onChange={(event) => setEstadoGuia(event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fotoGuia">Foto do perfil</Label>
                <Input
                  id="fotoGuia"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => handleFotoGuia(event.target.files?.[0])}
                />
              </div>
              <Button
                onClick={handleSalvarGuia}
                disabled={salvando}
                className="rounded-full bg-[#F27420] font-bold hover:bg-[#d65f15]"
              >
                Salvar perfil público
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-lg text-[#1F3A66]">Sessão e conta</CardTitle>
              <p className="text-sm text-muted-foreground">Saia deste dispositivo ou encerre o acesso</p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleSair} disabled={saindo} className="rounded-full">
              <LogOut className="h-4 w-4" />
              {saindo ? "Saindo..." : "Sair da conta"}
            </Button>
            <Button
              variant="outline"
              onClick={handleEncerrar}
              disabled={saindo}
              className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
            >
              Encerrar conta
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
