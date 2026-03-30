import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { RootProviders } from "./_components/providers/RootProviders";
import { AppShell } from "./_components/layout/AppShell";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Nicol Muñoz",
  description:
    "Personal portfolio of Nicol Muñoz. Bilingual, cinematic, and responsive design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} antialiased`}
      >
        <RootProviders>
          <AppShell>{children}</AppShell>
        </RootProviders>
      </body>
    </html>
  );
}

