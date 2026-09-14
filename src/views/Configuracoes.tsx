"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DadosUsuario {
  primeiroNome: string;
  ultimoNome: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  senha: string;
}

export default function Configuracoes() {
  const [dados, setDados] = useState<DadosUsuario>({
    primeiroNome: "",
    ultimoNome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    senha: "",
  });

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(
    null
  );

  const handleChange =
    (campo: keyof DadosUsuario) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setDados((prev) => ({ ...prev, [campo]: e.target.value }));
      setMensagem(null);
    };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMensagem({ tipo: "sucesso", texto: "Dados salvos com sucesso!" });
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao salvar. Tente novamente." });
    } finally {
      setSalvando(false);
    }
  };

  const campo = (
    label: string,
    campoKey: keyof DadosUsuario,
    tipo: string = "text",
    className: string = ""
  ) => (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={campoKey}>{label}</Label>
      <Input
        id={campoKey}
        type={tipo}
        value={dados[campoKey]}
        onChange={handleChange(campoKey)}
      />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f6] font-sans">
      <AppHeader activePage="configuracoes" />

      <main className="mx-auto w-full max-w-[900px] p-6 md:p-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-[#1F3A66]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Configurações</CardTitle>
            <p className="text-sm text-muted-foreground">Gerencie seus dados pessoais e preferências</p>
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {campo("Endereço", "endereco", "text", "sm:col-span-1")}
              {campo("Cidade", "cidade")}
              {campo("Estado/Distrito", "estado")}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {campo("CEP", "cep")}
              {campo("Senha", "senha", "password", "sm:col-span-2")}
            </div>

            <div className="flex flex-wrap gap-4">
              <button type="button" className="text-sm font-semibold text-[#1F3A66] hover:underline">
                Redefinir senha
              </button>
              <button type="button" className="text-sm font-semibold text-destructive hover:underline">
                Encerrar conta
              </button>
            </div>

            <hr className="border-border" />

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Clique em <strong>Salvar</strong> para confirmar as alterações.
              </p>
              <Button
                onClick={handleSalvar}
                disabled={salvando}
                className="bg-green-600 font-bold hover:bg-green-700"
              >
                {salvando ? "Salvando..." : "Salvar"}
              </Button>
              <Button variant="ghost" onClick={() => window.history.back()}>
                Cancelar
              </Button>
            </div>

            {mensagem && (
              <p
                className={`text-sm font-medium ${
                  mensagem.tipo === "sucesso" ? "text-green-600" : "text-destructive"
                }`}
              >
                {mensagem.texto}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
