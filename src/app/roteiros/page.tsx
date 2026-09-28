"use client";

import { Suspense } from "react";
import RoteirosScreen from "@/views/Roteiros";

export default function Page() {
  return (
    <Suspense>
      <RoteirosScreen />
    </Suspense>
  );
}
