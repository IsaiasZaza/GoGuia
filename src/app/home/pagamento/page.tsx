"use client";

import { Suspense } from "react";
import Pagamento from "@/views/Pagamento";

export default function Page() {
  return (
    <Suspense>
      <Pagamento />
    </Suspense>
  );
}
