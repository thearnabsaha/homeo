"use client";

import { useEffect } from "react";
import { NeoExplorerProvider } from "@/context/NeoExplorerContext";
import { NeoAuthProvider } from "@/hooks/useNeoAuth";

export default function NeoLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("neo");
    return () => {
      document.documentElement.classList.remove("neo");
    };
  }, []);

  return (
    <NeoAuthProvider>
      <NeoExplorerProvider>{children}</NeoExplorerProvider>
    </NeoAuthProvider>
  );
}
