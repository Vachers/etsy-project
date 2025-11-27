"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "./session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

