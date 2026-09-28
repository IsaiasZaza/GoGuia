"use client";

import { Suspense } from "react";
import TelaAvaliacao from "@/views/TelaAvaliacao";

export default function Page() {
  return (
    <Suspense>
      <TelaAvaliacao />
    </Suspense>
  );
}
