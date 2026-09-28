"use client";

import { Suspense } from "react";
import Agendamentos from "@/views/Agendamentos";

export default function Page() {
  return (
    <Suspense>
      <Agendamentos />
    </Suspense>
  );
}
