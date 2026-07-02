"use client";

import { useState, useEffect } from "react";
import {
  Printer, ReceiptText, TrendingUp, TrendingDown, Users, Landmark, Loader2,
  CalendarDays, FileCheck, FileX, FilePlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Metrica {
  periodo: string; // 'YYYY-MM'
  ingresos: number;
  gastos: number;
  iva: number;
  remuneraciones: number;
  ppm: number;
  contratos_vigentes_cant: number;
  contratos_vigentes_total: number;
  finiquitos_cant: number;
  finiquitos_total: number;
  nuevos_contratos_cant: number;
  nuevos_contratos_total: number;
}

interface Evento {
  id: string;
  fecha: string; // 'YYYY-MM-DD'
  titulo: string;
  descripcion: string | null;
}

const mesesLargo = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const etiquetaPeriodo = (periodo: string) => {
  const [y, m] = periodo.split("-");
  const idx = parseInt(m, 10) - 1;
  return `${mesesLargo[idx] ?? m} ${y}`;
};

const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);

export default function MetricasPage() {
  const [supabase] = useState(() => createClient());
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fin = new Date(hoy);
      fin.setDate(fin.getDate() + 4); // ventana de 5 días (hoy + 4)

      const [{ data: mData }, { data: eData }] = await Promise.all([
        supabase
          .from("metricas_mensuales")
          .select(
            "periodo, ingresos, gastos, iva, remuneraciones, ppm, contratos_vigentes_cant, contratos_vigentes_total, finiquitos_cant, finiquitos_total, nuevos_contratos_cant, nuevos_contratos_total"
          )
          .order("periodo", { ascending: false }),
        supabase
          .from("eventos")
          .select("id, fecha, titulo, descripcion")
          .gte("fecha", isoLocal(hoy))
          .lte("fecha", isoLocal(fin))
          .order("fecha", { ascending: true }),
      ]);

      const lista = (mData as Metrica[]) ?? [];
      setMetricas(lista);
      if (lista.length > 0) setSelectedPeriod(lista[0].periodo);
      setEventos((eData as Evento[]) ?? []);
      setLoading(false);
    };
    cargar();
  }, [supabase]);

  const data = metricas.find((m) => m.periodo === selectedPeriod);
  const handlePrint = () => window.print();

  // --- Calendario: 5 días desde hoy ---
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() + i);
    return d;
  });

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-12 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando métricas…
      </div>
    );
  }

  // Vectores financieros para el gráfico comparativo
  const vectores = data
    ? [
        { label: "Total ingresos", value: data.ingresos, color: "bg-emerald-500", icon: TrendingUp },
        { label: "Total egresos", value: data.gastos, color: "bg-amber-500", icon: TrendingDown },
        { label: "Total remuneraciones", value: data.remuneraciones, color: "bg-orange-500", icon: Users },
        { label: "Impuesto a pagar", value: data.iva, color: "bg-red-500", icon: ReceiptText },
        { label: "PPM", value: data.ppm, color: "bg-brand-500", icon: Landmark },
      ]
    : [];
  const maxVector = Math.max(1, ...vectores.map((v) => v.value));

  // Contratos: 3 vectores a comparar (cantidad + total)
  const contratos = data
    ? [
        { label: "Contratos vigentes", cant: data.contratos_vigentes_cant, total: data.contratos_vigentes_total, color: "bg-emerald-500", text: "text-emerald-600", icon: FileCheck },
        { label: "Finiquitos del mes", cant: data.finiquitos_cant, total: data.finiquitos_total, color: "bg-red-500", text: "text-red-600", icon: FileX },
        { label: "Nuevos contratos", cant: data.nuevos_contratos_cant, total: data.nuevos_contratos_total, color: "bg-brand-500", text: "text-brand-600", icon: FilePlus },
      ]
    : [];
  const maxCant = Math.max(1, ...contratos.map((c) => c.cant));

  const kpiCards = data
    ? [
        { label: "PPM", value: data.ppm, icon: Landmark, accent: "text-brand-600", bar: "bg-brand-500" },
        { label: "Total ingresos", value: data.ingresos, icon: TrendingUp, accent: "text-emerald-600", bar: "bg-emerald-500" },
        { label: "Total egresos", value: data.gastos, icon: TrendingDown, accent: "text-amber-600", bar: "bg-amber-500" },
        { label: "Total remuneraciones", value: data.remuneraciones, icon: Users, accent: "text-orange-600", bar: "bg-orange-500" },
        { label: "Impuesto a pagar", value: data.iva, icon: ReceiptText, accent: "text-red-600", bar: "bg-red-500" },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen Financiero</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Análisis de KPIs, calendario y contratos.</p>
        </div>

        <div className="flex items-center gap-3">
          {metricas.length > 0 && (
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            >
              {metricas.map((m) => (
                <option key={m.periodo} value={m.periodo}>{etiquetaPeriodo(m.periodo)}</option>
              ))}
            </select>
          )}
          <button
            onClick={handlePrint}
            className="btn-glow inline-flex items-center gap-2 rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* ---------- CALENDARIO: próximos 5 días ---------- */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Próximos 5 días</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {dias.map((d, i) => {
            const iso = isoLocal(d);
            const delDia = eventos.filter((e) => e.fecha === iso);
            const esHoy = i === 0;
            return (
              <div
                key={iso}
                className={`glass-card rounded-2xl p-4 min-h-[150px] flex flex-col ${
                  esHoy ? "ring-2 ring-brand-500/40" : ""
                }`}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <p className={`text-xs uppercase tracking-wide ${esHoy ? "text-brand-600 font-semibold" : "text-slate-400"}`}>
                      {esHoy ? "Hoy" : d.toLocaleDateString("es-CL", { weekday: "short" })}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{d.getDate()}</p>
                  </div>
                  <span className="text-xs text-slate-400 capitalize">{mesesLargo[d.getMonth()].slice(0, 3)}</span>
                </div>
                <div className="space-y-2 flex-1">
                  {delDia.length === 0 ? (
                    <p className="text-xs text-slate-300 dark:text-slate-600">Sin eventos</p>
                  ) : (
                    delDia.map((e) => (
                      <div key={e.id} className="rounded-lg bg-brand-50 dark:bg-brand-950/40 border-l-2 border-brand-500 px-2.5 py-1.5">
                        <p className="text-xs font-semibold text-brand-800 dark:text-brand-200 leading-snug">{e.titulo}</p>
                        {e.descripcion && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{e.descripcion}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {!data ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Aún no hay métricas financieras cargadas.</p>
          <p className="text-sm text-slate-400 mt-1">Cuando María registre tus cifras mensuales, verás aquí tus KPIs.</p>
        </div>
      ) : (
        <>
          {/* Cabecera solo en PDF */}
          <div className="hidden print:block mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Reporte Financiero — {etiquetaPeriodo(selectedPeriod)}</h1>
            <div className="h-px bg-slate-300 my-3 w-full" />
          </div>

          {/* ---------- TARJETAS KPI ---------- */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white print:hidden">KPIs de {etiquetaPeriodo(selectedPeriod)}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {kpiCards.map((k) => (
                <div key={k.label} className="card-lift glass-card p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-500">{k.label}</h3>
                    <k.icon className={`w-4 h-4 ${k.accent}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(k.value)}</p>
                  <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${k.bar}`} style={{ width: `${Math.round((k.value / maxVector) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- GRÁFICO COMPARATIVO FINANCIERO ---------- */}
          <section className="glass-card rounded-2xl p-6 print:break-inside-avoid">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Comparativo financiero</h2>
            <div className="space-y-4">
              {vectores.map((v) => (
                <div key={v.label}>
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <v.icon className="w-4 h-4 text-slate-400" />
                      {v.label}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(v.value)}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${v.color} rounded-full transition-all`} style={{ width: `${Math.round((v.value / maxVector) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- SECCIÓN CONTRATOS ---------- */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contratos del período</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contratos.map((c) => (
                <div key={c.label} className="card-lift glass-card p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-500">{c.label}</h3>
                    <c.icon className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className={`text-3xl font-bold ${c.text}`}>{c.cant}</p>
                      <p className="text-xs text-slate-400">{c.cant === 1 ? "contrato" : "contratos"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(c.total)}</p>
                      <p className="text-xs text-slate-400">monto total</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gráfico comparativo de los 3 vectores (por cantidad) */}
            <div className="glass-card rounded-2xl p-6 print:break-inside-avoid">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-5">Comparativo de contratos (cantidad)</h3>
              <div className="flex items-end justify-around gap-6 h-44">
                {contratos.map((c) => (
                  <div key={c.label} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{c.cant}</span>
                    <div
                      className={`w-full max-w-[64px] ${c.color} rounded-t-lg transition-all`}
                      style={{ height: `${Math.max(4, Math.round((c.cant / maxCant) * 100))}%` }}
                    />
                    <span className="text-xs text-center text-slate-500 leading-tight">{c.label}</span>
                    <span className="text-[11px] text-slate-400">{formatCurrency(c.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pie de página (solo impresión) */}
          <div className="hidden print:block mt-8 text-center text-sm text-slate-500">
            <p>Documento generado automáticamente por Contabilidad con María.</p>
          </div>
        </>
      )}
    </div>
  );
}
