"use client";

import { NeoAuthProvider } from "@/hooks/useNeoAuth";
import { NeoExplorerProvider } from "@/context/NeoExplorerContext";

export function NeoProviders({ children }: { children: React.ReactNode }) {
  return (
    <NeoAuthProvider>
      <NeoExplorerProvider>{children}</NeoExplorerProvider>
    </NeoAuthProvider>
  );
}
