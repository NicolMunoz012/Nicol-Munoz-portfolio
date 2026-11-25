import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { RootProviders } from "./_components/providers/RootProviders";
import { AppShell } from "./_components/layout/AppShell";
import { preferencesScript } from "./_lib/preferences";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

const title = "Nicol Muñoz | Portafolio";
const description =
  "Portafolio de Nicol Muñoz, estudiante de Ingeniería de Software en Pasto, Colombia. Proyectos con Java, Spring Boot, Python, React y Next.js.";

// Define NEXT_PUBLIC_SITE_URL con el dominio público para que las imágenes de
// Open Graph se resuelvan con URL absoluta (en Vercel se infiere sola).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title,
  description,
  authors: [{ name: "Nicol Muñoz" }],
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Nicol Muñoz",
    locale: "es_CO",
    alternateLocale: ["en_US"],
    images: [{ url: "/nick.jpg", alt: "Retrato de Nicol Muñoz" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/nick.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1c122d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // El script de preferencias cambia `class` y `lang` antes de hidratar.
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
      </head>
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
