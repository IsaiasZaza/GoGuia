"use client";

import { useEffect } from "react";

/**
 * Injeta Authorization Bearer no fetch global (paridade com o bootstrap Vite).
 */
export function FetchAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input, init = {}) => {
      const token = localStorage.getItem("token");
      const headers =
        init.headers instanceof Headers
          ? init.headers
          : new Headers(init.headers || {});

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return originalFetch(input, { ...init, headers });
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}
