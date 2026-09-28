"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { confirmarEmail, getApiErrorMessage } from "@/services/auth";

export default function ConfirmacaoEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "erro">(token ? "loading" : "idle");
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;
    confirmarEmail(token)
      .then((data) => {
        if (!active) return;
        setStatus("ok");
        setMensagem(data.message || "E-mail confirmado com sucesso.");
      })
      .catch((error) => {
        if (!active) return;
        setStatus("erro");
        setMensagem(getApiErrorMessage(error, "Não foi possível confirmar o e-mail."));
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthLayout logoHref="/login">
      <div className="flex flex-col items-center text-center">
        {status === "loading" && (
          <>
            <Loader2 className="mb-6 h-12 w-12 animate-spin text-[#F27420]" />
            <h2 className="mb-3 text-2xl font-bold text-foreground">Confirmando e-mail...</h2>
          </>
        )}

        {status === "ok" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mb-3 text-3xl font-bold text-foreground">Tudo certo!</h2>
            <p className="mb-10 text-muted-foreground">{mensagem}</p>
          </>
        )}

        {status === "erro" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <MailWarning className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">Não foi possível confirmar</h2>
            <p className="mb-10 text-muted-foreground">{mensagem}</p>
          </>
        )}

        {status === "idle" && (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <MailWarning className="h-10 w-10 text-[#F27420]" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">Confirme seu e-mail</h2>
            <p className="mb-10 max-w-sm text-muted-foreground">
              Enviamos um link de confirmação. Abra o e-mail e clique no link para ativar sua conta.
            </p>
          </>
        )}

        {status !== "loading" && (
          <Button
            onClick={() => router.push("/login")}
            className="rounded-full bg-[#F27420] px-16 font-bold hover:bg-[#d65f15]"
          >
            Ir para o login
          </Button>
        )}
      </div>
    </AuthLayout>
  );
}
