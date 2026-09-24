import { TrendingUp, BookOpen, Briefcase, FileSignature, ShieldCheck, HardHat, Building2, Folder, type LucideIcon } from "lucide-react";

/**
 * Categorías oficiales de documentos del portal.
 * El cliente ve los archivos del mes agrupados por estas categorías y el admin
 * las usa al subir, para que cada archivo quede bien clasificado.
 */
export interface Categoria {
  key: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  /** Clases tailwind para el ícono y el chip de la categoría */
  iconCls: string;
  chipCls: string;
}

export const CATEGORIAS: Categoria[] = [
  {
    key: "Financiero",
    label: "Financiero",
    desc: "Balances, estados financieros y flujos de caja",
    icon: TrendingUp,
    iconCls: "text-emerald-600 dark:text-emerald-400",
    chipCls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    key: "Contable",
    label: "Contable",
    desc: "F29, F22, IVA y libros contables",
    icon: BookOpen,
    iconCls: "text-brand-600 dark:text-brand-400",
    chipCls: "bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300",
  },
  {
    // La key se mantiene "Laboral" para que los documentos ya subidos sigan aquí.
    key: "Laboral",
    label: "Laboral — Liquidaciones y Finiquitos",
    desc: "Liquidaciones de sueldo y finiquitos",
    icon: Briefcase,
    iconCls: "text-amber-600 dark:text-amber-400",
    chipCls: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    key: "Laboral — Contratos y Anexos Vigentes",
    label: "Laboral — Contratos y Anexos Vigentes",
    desc: "Contratos de trabajo y anexos vigentes",
    icon: FileSignature,
    iconCls: "text-orange-600 dark:text-orange-400",
    chipCls: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  },
  {
    key: "Legal y corporativo",
    label: "Legal y corporativo",
    desc: "Estatutos, actas, permisos y documentos legales",
    icon: Building2,
    iconCls: "text-slate-600 dark:text-slate-400",
    chipCls: "bg-slate-50 text-slate-700 dark:bg-slate-950/40 dark:text-slate-300",
  },
  {
    key: "Previsional",
    label: "Previsional",
    desc: "Previred, AFP, cotizaciones y leyes sociales",
    icon: ShieldCheck,
    iconCls: "text-violet-600 dark:text-violet-400",
    chipCls: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  },
  {
    key: "Prevención",
    label: "Prevención — Cumplimiento Laboral y Prevención de Riesgos",
    desc: "Reglamento interno, mutual, prevención de riesgos y fiscalizaciones",
    icon: HardHat,
    iconCls: "text-rose-600 dark:text-rose-400",
    chipCls: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  },
];

/** Categoría de respaldo para documentos antiguos con etiquetas en desuso. */
export const CATEGORIA_OTROS: Categoria = {
  key: "Otros",
  label: "Otros",
  desc: "Documentos sin categoría asignada",
  icon: Folder,
  iconCls: "text-slate-500 dark:text-slate-400",
  chipCls: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

/** Mapea etiquetas heredadas (Balances/Impuestos/…) a las categorías nuevas. */
const LEGADO: Record<string, string> = {
  Balances: "Financiero",
  Impuestos: "Contable",
  Remuneraciones: "Laboral",
  Legal: "Otros",
};

/** Devuelve la categoría canónica para un valor guardado (admite valores antiguos). */
export function resolverCategoria(valor: string): Categoria {
  const key = LEGADO[valor] ?? valor;
  return CATEGORIAS.find((c) => c.key === key) ?? CATEGORIA_OTROS;
}
