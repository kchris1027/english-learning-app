"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toast";
import { LanguageProvider } from "@/components/language-provider";
import { PwaRegister } from "@/components/pwa-register";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        {children}
        <Toaster />
        <PwaRegister />
      </LanguageProvider>
    </ThemeProvider>
  );
}
