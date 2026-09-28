"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage, redefinirSenha } from "@/services/auth";

export default function RedefinirSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!token) {
      setErro("Link inválido. Solicite uma nova redefinição de senha.");
      return;
    }
    if (novaSenha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await redefinirSenha(token, novaSenha);
      setSucesso(true);
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível redefinir a senha."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout logoHref="/login">
      <div className="text-center">
        <h2 className="mb-3 text-2xl font-bold text-[#F27420]">Nova senha</h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          Escolha uma senha com no mínimo 8 caracteres.
        </p>

        {sucesso ? (
          <div className="space-y-6">
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              Senha alterada. Você já pode entrar com a nova senha.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="rounded-full bg-[#F27420] px-16 font-bold hover:bg-[#d65f15]"
            >
              Ir para o login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-5 text-left">
            <div className="space-y-2">
              <Label htmlFor="novaSenha">Nova senha</Label>
              <Input
                id="novaSenha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmar">Confirmar senha</Label>
              <Input
                id="confirmar"
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#F27420] px-16 font-bold hover:bg-[#d65f15]"
              >
                {loading ? "Salvando..." : "Redefinir senha"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
