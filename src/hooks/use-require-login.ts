"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, isLoggedIn, loginUrl, type UserTipo } from "@/services/auth";

export type ResultadoLogin = "ok" | "redirecionado" | "tipo-invalido";

interface Opcoes {
  /** Mensagem mostrada na tela de login. */
  motivo: string;
  /** Para onde voltar depois do login. Padrão: a página atual. */
  voltarPara?: string;
  /** Tipos de conta que podem fazer a ação. Sem lista, qualquer conta logada serve. */
  tipos?: UserTipo[];
}

/**
 * Protege uma ação (reservar, favoritar, criar roteiro...). Sem sessão, leva para o login
 * e volta para a mesma página depois. Com sessão de um tipo que não pode agir, devolve
 * "tipo-invalido" para a tela avisar o usuário.
 */
export function useRequireLogin() {
  const router = useRouter();

  return useCallback(
    ({ motivo, voltarPara, tipos }: Opcoes): ResultadoLogin => {
      if (!isLoggedIn()) {
        const destino = voltarPara ?? `${window.location.pathname}${window.location.search}`;
        router.push(loginUrl(destino, motivo));
        return "redirecionado";
      }
      const user = getStoredUser();
      if (tipos && user && !tipos.includes(user.tipo)) return "tipo-invalido";
      return "ok";
    },
    [router],
  );
}
