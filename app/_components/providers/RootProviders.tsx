'use client';

import type { ReactNode } from "react";
import { LanguageProvider } from "../../_context/LanguageContext";
import { ThemeProvider } from "../../_context/ThemeContext";

type RootProvidersProps = {
  children: ReactNode;
};

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
