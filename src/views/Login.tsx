"use client";

import { useState } from "react";
import { Camera, Lock, Mail, MapPin, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const imgHero = "/assets/hero.jpg";

type Tab = "login" | "cadastro";

export default function Login() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/home");
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Painel esquerdo — branding */}
      <div className="relative hidden w-[45%] overflow-hidden lg:flex lg:flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F3A66]/95 via-[#1F3A66]/80 to-[#F27420]/40" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-11 w-11 items-center justify-center">
              <MapPin className="h-11 w-11 fill-[#F27420] text-[#F27420]" strokeWidth={2.5} />
              <Users className="absolute h-4 w-4 text-white" style={{ top: 10 }} />
            </div>
            <span className="text-3xl font-bold">
              <span className="text-[#F27420]">Go</span>
              <span className="text-white">Guia</span>
            </span>
          </div>

          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
              Descubra experiências únicas com guias locais
            </h1>
            <p className="text-lg leading-relaxed text-white/80">
              Conectamos você aos melhores guias da região para passeios inesquecíveis.
            </p>
          </div>

          <p className="text-sm text-white/50">© 2026 GoGuia. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Painel direito — formulários */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Logo mobile */}
        <div className="flex items-center gap-2 p-6 lg:hidden">
          <MapPin className="h-9 w-9 fill-[#F27420] text-[#F27420]" />
          <span className="text-2xl font-bold">
            <span className="text-[#F27420]">Go</span>
            <span className="text-[#1F3A66]">Guia</span>
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-md animate-fade-in">
            {/* Tabs */}
            <div className="mb-8 flex rounded-xl bg-muted p-1">
              {(["login", "cadastro"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all",
                    tab === t
                      ? "bg-white text-[#1F3A66] shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "login" ? "Entrar" : "Cadastrar"}
                </button>
              ))}
            </div>

            {tab === "login" ? (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Bem-vindo(a) de volta!</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Entre com suas credenciais para continuar
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="senha"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-[#F27420] py-5 text-base font-bold hover:bg-[#d65f15]"
                  >
                    Entrar
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Esqueceu sua senha?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/esqueci-senha")}
                    className="font-semibold text-[#F27420] hover:underline"
                  >
                    Recuperar acesso
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Crie sua conta</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Junte-se à comunidade GoGuia
                  </p>
                </div>

                {/* Upload de foto */}
                <button
                  type="button"
                  className="mb-6 flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-border p-4 transition-colors hover:border-[#F27420]/50 hover:bg-orange-50/50"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Foto de perfil</p>
                    <p className="text-xs text-muted-foreground">Clique para fazer upload</p>
                  </div>
                </button>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="nome" type="text" placeholder="Seu nome" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-cadastro">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email-cadastro"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha-cadastro">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="senha-cadastro"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="mt-2 w-full rounded-xl bg-[#F27420] py-5 text-base font-bold hover:bg-[#d65f15]"
                  >
                    Criar conta
                  </Button>
                </form>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  Ao cadastrar, você concorda com nossos termos de uso e política de privacidade.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
