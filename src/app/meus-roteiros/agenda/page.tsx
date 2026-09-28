"use client";

import { Suspense } from "react";
import AgendaGuia from "@/views/AgendaGuia";

export default function Page() {
  return (
    <Suspense>
      <AgendaGuia />
    </Suspense>
  );
}
