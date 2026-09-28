"use client";

import { Suspense } from "react";
import ChatScreen from "@/views/Chat";

export default function Page() {
  return (
    <Suspense>
      <ChatScreen />
    </Suspense>
  );
}
