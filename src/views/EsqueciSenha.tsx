"use client";

import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { esqueciSenha, getApiErrorMessage } from "@/services/auth";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await esqueciSenha(email.trim());
      setEnviado(true);
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível enviar o e-mail."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout logoHref="/login">
      <div className="text-center">
        <h2 className="mb-3 text-2xl font-bold text-[#F27420]">Esqueci minha senha</h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          Digite seu e-mail e enviaremos um link para definir uma nova senha.
        </p>

        {enviado ? (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Se o e-mail existir, enviaremos instruções para redefinir a senha.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-6 text-left">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
