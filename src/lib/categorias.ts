import { TrendingUp, BookOpen, Briefcase, ShieldCheck, Folder, type LucideIcon } from "lucide-react";

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
    key: "Laboral",
    label: "Laboral",
    desc: "Liquidaciones, contratos y finiquitos",
    icon: Briefcase,
    iconCls: "text-amber-600 dark:text-amber-400",
    chipCls: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    key: "Previsional",
    label: "Previsional",
    desc: "Previred, AFP, cotizaciones y leyes sociales",
    icon: ShieldCheck,
    iconCls: "text-violet-600 dark:text-violet-400",
    chipCls: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
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
