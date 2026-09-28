"use client";

import { Suspense } from "react";
import ConfirmacaoEmail from "@/views/Confirmacaoemail";

export default function Page() {
  return (
    <Suspense>
      <ConfirmacaoEmail />
    </Suspense>
  );
}
