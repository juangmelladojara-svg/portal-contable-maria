"use client";

import { useState, useEffect } from "react";
import { Settings, Printer, ReceiptText, Clock, TrendingUp, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Metrica {
  periodo: string; // 'YYYY-MM'
  ingresos: number;
  gastos: number;
  iva: number;
  remuneraciones: number;
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

export default function MetricasPage() {
  const [supabase] = useState(() => createClient());
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const [visibleWidgets, setVisibleWidgets] = useState({
    ingresos: true,
    gastos: true,
    utilidad: true,
    iva: true,
    remuneraciones: true,
    responsabilidades: true,
  });
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("metricas_mensuales")
        .select("periodo, ingresos, gastos, iva, remuneraciones")
        .order("periodo", { ascending: false });
      const lista = (data as Metrica[]) ?? [];
      setMetricas(lista);
      if (lista.length > 0) setSelectedPeriod(lista[0].periodo);
      setLoading(false);
    };
    cargar();
  }, [supabase]);

  const data = metricas.find((m) => m.periodo === selectedPeriod);
  const utilidad = data ? data.ingresos - data.gastos - data.remuneraciones : 0;
  const margen = data && data.ingresos > 0 ? (utilidad / data.ingresos) * 100 : 0;

  const handlePrint = () => window.print();
  const toggleWidget = (key: keyof typeof visibleWidgets) =>
    setVisibleWidgets((prev) => ({ ...prev, [key]: !prev[key] }));
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-12 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando métricas…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-slate-600 dark:text-slate-300 font-medium">Aún no hay métricas financieras cargadas.</p>
        <p className="text-sm text-slate-400 mt-1">Cuando María registre tus cifras mensuales, verás aquí tus KPIs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera (oculta al imprimir) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen Financiero</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Análisis de KPIs y rendimiento mensual.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
          >
            {metricas.map((m) => (
              <option key={m.periodo} value={m.periodo}>{etiquetaPeriodo(m.periodo)}</option>
            ))}
          </select>

          <div className="relative">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Configurar
            </button>

            {showConfig && (
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-lg z-10 p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Mostrar KPIs</h3>
                <div className="space-y-2">
                  {Object.keys(visibleWidgets).map((key) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 capitalize">
                      <input
                        type="checkbox"
                        checked={visibleWidgets[key as keyof typeof visibleWidgets]}
                        onChange={() => toggleWidget(key as keyof typeof visibleWidgets)}
                        className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
                      />
                      {key}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handlePrint}
            className="btn-glow inline-flex items-center gap-2 rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Cabecera solo en PDF */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reporte Financiero Mensual</h1>
        <p className="text-lg text-slate-600 mt-2">Período: {etiquetaPeriodo(selectedPeriod)}</p>
        <div className="h-px bg-slate-300 my-4 w-full" />
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleWidgets.ingresos && (
          <div className="card-lift glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Ingresos Totales</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.ingresos)}</p>
            <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-full" />
            </div>
          </div>
        )}

        {visibleWidgets.gastos && (
          <div className="card-lift glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Gastos Operativos</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.gastos)}</p>
            <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${Math.min((data.gastos / data.ingresos) * 100, 100)}%` }} />
            </div>
          </div>
        )}

        {visibleWidgets.remuneraciones && (
          <div className="card-lift glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Remuneraciones</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.remuneraciones)}</p>
            <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: `${Math.min((data.remuneraciones / data.ingresos) * 100, 100)}%` }} />
            </div>
          </div>
        )}

        {visibleWidgets.iva && (
          <div className="card-lift glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-slate-500 mb-2">IVA a Pagar</h3>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(data.iva)}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <ReceiptText className="w-4 h-4 text-red-500" />
              Estimación basada en F29
            </div>
          </div>
        )}

        {visibleWidgets.responsabilidades && (
          <div className="card-lift glass-card p-6 rounded-2xl ring-2 ring-brand-500/20">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Próximos Pagos</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">F29 (IVA): 20 de cada mes</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">Previred: 13 de cada mes</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-600 font-medium">
              <Clock className="w-4 h-4" />
              Recordatorio activo
            </div>
          </div>
        )}
      </div>

      {/* Resumen de utilidad */}
      {visibleWidgets.utilidad && (
        <div className="glass-card p-8 rounded-2xl mt-6 print:break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Resumen de Utilidad</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-slate-800 relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-[16px] border-brand-500"
                style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)" }}
              />
              <div className="text-center z-10">
                <span className="block text-sm text-slate-500">Utilidad Neta</span>
                <span className="block text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(utilidad)}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Ingresos Brutos</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(data.ingresos)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Gastos Totales (Operativos + Rem)</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(data.gastos + data.remuneraciones)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${Math.min(((data.gastos + data.remuneraciones) / data.ingresos) * 100, 100)}%` }} />
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">Margen Operacional</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-brand-600">
                  <TrendingUp className="w-4 h-4" />
                  {margen.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pie de página (solo impresión) */}
      <div className="hidden print:block mt-12 text-center text-sm text-slate-500">
        <p>Documento generado automáticamente por Contabilidad con María.</p>
        <p>Para dudas sobre este reporte, contactar a soporte@contabilidadconmaria.cl</p>
      </div>
    </div>
  );
}
