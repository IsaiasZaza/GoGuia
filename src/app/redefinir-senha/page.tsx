"use client";

import { Suspense } from "react";
import RedefinirSenha from "@/views/RedefinirSenha";

export default function Page() {
  return (
    <Suspense>
      <RedefinirSenha />
    </Suspense>
  );
}
