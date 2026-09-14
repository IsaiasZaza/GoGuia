"use client";

import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EsqueciSenha() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/confirmacao-email");
  };

  return (
    <AuthLayout logoHref="/login">
      <div className="text-center">
        <h2 className="mb-3 text-2xl font-bold text-[#F27420]">Esqueci minha senha</h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          Digite seu e-mail e enviaremos um link para definir uma nova senha.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-6 text-left">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required />
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="rounded-full bg-[#F27420] px-16 font-bold hover:bg-[#d65f15]"
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
