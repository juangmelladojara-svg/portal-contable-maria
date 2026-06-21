import Link from "next/link";

interface BrandMarkProps {
  /** Muestra el wordmark "Contabilidad con María" junto al monograma */
  showWordmark?: boolean;
  /** Variante para fondos oscuros (texto claro) */
  light?: boolean;
  /** Envuelve la marca en un <Link href="/"> */
  href?: string;
  className?: string;
}

/**
 * Marca de "Contabilidad con María".
 * Monograma cuadrado azul con "M" dorada — sin dependencia de assets externos
 * (evita el logo.png roto y los problemas de basePath en export estático).
 */
export default function BrandMark({
  showWordmark = true,
  light = false,
  href,
  className = "",
}: BrandMarkProps) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-brand-600 shadow-sm ring-1 ring-white/10">
        <span className="font-mono text-lg font-bold text-accent-500">M</span>
        <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/15 to-transparent" />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[13px] font-bold tracking-tight ${
              light ? "text-white" : "text-slate-900 dark:text-white"
            }`}
          >
            Contabilidad
          </span>
          <span className="text-[11px] font-medium tracking-wide text-accent-500">
            con María
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Contabilidad con María — Inicio" className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
