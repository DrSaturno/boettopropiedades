import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    default: "Boetto Propiedades | Curaduría inmobiliaria en Córdoba",
    template: "%s | Boetto Propiedades",
  },
  description:
    "Propiedades con arquitectura, contexto y carácter. Venta, alquiler y tasación en Córdoba.",
  keywords: [
    "inmobiliaria",
    "propiedades",
    "córdoba",
    "venta",
    "alquiler",
    "tasaciones",
    "arquitectura",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Boetto Propiedades",
    title: "Boetto Propiedades | Curaduría inmobiliaria en Córdoba",
    description: "Propiedades con arquitectura, contexto y carácter en Córdoba.",
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
