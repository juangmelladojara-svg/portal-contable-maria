import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Alex_Brush } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { NEGOCIO, SITE_URL, negocioJsonLd, sitioWebJsonLd } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Grotesk de carácter para titulares (dirección "moderno premium").
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Script para el "con María" del logo (alternativa libre más cercana a Brittany Signature).
const signature = Alex_Brush({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  // metadataBase hace que Next resuelva solo las URLs absolutas de canonical y
  // Open Graph. Sin esto, los motores de respuesta no saben citar la página.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Contabilidad con María | Contabilidad para pymes en Chile",
    template: "%s | Contabilidad con María",
  },
  description:
    "Contabilidad mensual para pymes desde $65.000: F29, Formulario 22, remuneraciones y asesoría tributaria, con un portal de clientes disponible 24/7.",
  applicationName: NEGOCIO.nombre,
  authors: [{ name: NEGOCIO.nombre, url: SITE_URL }],
  creator: NEGOCIO.nombre,
  publisher: NEGOCIO.nombre,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: NEGOCIO.nombre,
    title: "Contabilidad con María | Contabilidad para pymes en Chile",
    description:
      "Contabilidad mensual, impuestos, remuneraciones y un portal donde tu información está ordenada y disponible 24/7.",
    // og.png es una tarjeta 1200x630 real (public/og.png). El logo mide 1170x327:
    // declararlo como 1200x630 hacía que WhatsApp recibiera una proporción que no
    // calza y descartara la vista previa.
    images: [{ url: "/og.png", width: 1200, height: 630, alt: NEGOCIO.nombre }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contabilidad con María",
    description:
      "Contabilidad mensual para pymes en Chile, con portal de clientes disponible 24/7.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Sin límite de fragmento: permite que Google cite párrafos completos
      // en AI Overviews en vez de recortar a dos líneas.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "Servicios contables",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CL"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${signature.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Identidad del negocio y del sitio, legible por máquinas. */}
        <JsonLd data={negocioJsonLd()} />
        <JsonLd data={sitioWebJsonLd()} />
      </body>
    </html>
  );
}
