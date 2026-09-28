"use client";

import { useEffect } from "react";

function urlDaRequisicao(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function ehPedidoDaApi(url: string): boolean {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) return false;
  try {
    return new URL(url, window.location.origin).origin === new URL(api, window.location.origin).origin;
  } catch {
    return false;
  }
}

/**
 * Injeta Authorization Bearer no fetch global, só para a API do GoGuia.
 * Pedidos a mapas e outros CDNs não podem levar esse header — o CORS deles
 * não permite Authorization e o browser responde com Failed to fetch (0).
 */
export function FetchAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input, init = {}) => {
      const token = localStorage.getItem("token");
      if (!token || !ehPedidoDaApi(urlDaRequisicao(input))) {
        return originalFetch(input, init);
      }

      const headers =
        init.headers instanceof Headers
          ? init.headers
          : new Headers(init.headers || (input instanceof Request ? input.headers : undefined));

      headers.set("Authorization", `Bearer ${token}`);
      return originalFetch(input, { ...init, headers });
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}
