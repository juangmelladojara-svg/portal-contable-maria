"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface BrandMarkProps {
  /** Muestra el logo/wordmark completo (navbar, login, footer) */
  showWordmark?: boolean;
  /** Variante para fondos oscuros (logo en blanco) */
  light?: boolean;
  /** Envuelve la marca en un <Link href="..."> */
  href?: string;
  className?: string;
}

/** Respaldo tipográfico si aún no existe /logo.png */
function WordmarkFallback({ light }: { light: boolean }) {
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <span
        className={`font-display text-[15px] sm:text-base font-bold uppercase tracking-[0.14em] ${
          light ? "text-white" : "text-brand-600 dark:text-white"
        }`}
      >
        Contabilidad
      </span>
      <span className="font-script text-2xl sm:text-[26px] leading-[0.7] -mt-0.5 text-accent-500">
        con María
      </span>
    </span>
  );
}

/**
 * Marca "Contabilidad con María".
 * Prueba /logo.png en segundo plano; si carga, lo usa; si no, muestra el
 * respaldo tipográfico (nunca aparece una imagen rota).
 */
export default function BrandMark({
  showWordmark = true,
  light = false,
  href,
  className = "",
}: BrandMarkProps) {
  const [logoOk, setLogoOk] = useState(false);

  useEffect(() => {
    if (!showWordmark) return;
    const img = new window.Image();
    img.onload = () => setLogoOk(true);
    img.src = "/logo.png";
  }, [showWordmark]);

  let content: React.ReactNode;

  if (showWordmark) {
    content = logoOk ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="Contabilidad con María"
        className={`h-11 sm:h-12 w-auto object-contain ${light ? "brightness-0 invert" : ""} ${className}`}
      />
    ) : (
      <span className={className}>
        <WordmarkFallback light={light} />
      </span>
    );
  } else {
    content = (
      <span
        className={`relative grid h-9 w-9 place-items-center rounded-lg bg-brand-600 shadow-sm ring-1 ring-white/10 ${className}`}
      >
        <span className="font-script text-2xl leading-none text-accent-400 pb-1">M</span>
        <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/15 to-transparent" />
      </span>
    );
  }

  if (href) {
    return (
      <Link href={href} aria-label="Contabilidad con María — Inicio" className="inline-flex items-center">
        {content}
      </Link>
    );
  }
  return content;
}
