import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Boetto Propiedades | Curaduria inmobiliaria en Capital Federal",
    template: "%s | Boetto Propiedades",
  },
  description:
    "Propiedades con arquitectura, contexto y caracter. Venta, alquiler y tasacion en Capital Federal.",
  keywords: [
    "inmobiliaria",
    "propiedades",
    "capital federal",
    "buenos aires",
    "venta",
    "alquiler",
    "tasaciones",
    "arquitectura",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Boetto Propiedades",
    title: "Boetto Propiedades | Curaduria inmobiliaria en Capital Federal",
    description: "Propiedades con arquitectura, contexto y caracter en Capital Federal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${playfair.variable} antialiased`}
    >
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
