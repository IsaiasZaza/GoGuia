"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";

export default function ConfirmacaoEmail() {
  const router = useRouter();

  return (
    <AuthLayout logoHref="/login">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mb-3 text-3xl font-bold text-foreground">Tudo certo!</h2>
        <p className="mb-10 text-muted-foreground">
          E-mail confirmado com sucesso. Você já pode acessar sua conta.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="rounded-full bg-[#F27420] px-16 font-bold hover:bg-[#d65f15]"
        >
          Ir para o login
        </Button>
      </div>
    </AuthLayout>
  );
}
