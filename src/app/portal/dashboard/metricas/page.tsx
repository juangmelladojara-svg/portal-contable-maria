"use client";

import { useState } from "react";

// Datos financieros de prueba por mes
const financialData = {
  "2025-03": { ingresos: 15500000, gastos: 8200000, iva: 1387000, remuneraciones: 4500000 },
  "2025-02": { ingresos: 12000000, gastos: 7500000, iva: 855000, remuneraciones: 4500000 },
  "2025-01": { ingresos: 18000000, gastos: 9000000, iva: 1710000, remuneraciones: 4500000 }
};

export default function MetricasPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-03");
  const [visibleWidgets, setVisibleWidgets] = useState({
    ingresos: true,
    gastos: true,
    utilidad: true,
    iva: true,
    remuneraciones: true
  });

  const [showConfig, setShowConfig] = useState(false);

  const data = financialData[selectedPeriod as keyof typeof financialData];
  const utilidad = data.ingresos - data.gastos - data.remuneraciones;

  const handlePrint = () => {
    window.print();
  };

  const toggleWidget = (key: keyof typeof visibleWidgets) => {
    setVisibleWidgets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Dashboard (Oculta al imprimir) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen Financiero</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Análisis de KPIs y rendimiento mensual.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="2025-03">Marzo 2025</option>
            <option value="2025-02">Febrero 2025</option>
            <option value="2025-01">Enero 2025</option>
          </select>

          <div className="relative">
            <button 
              onClick={() => setShowConfig(!showConfig)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Configurar
            </button>

            {/* Menú de Configuración de Widgets */}
            {showConfig && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10 p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Mostrar KPIs</h3>
                <div className="space-y-2">
                  {Object.keys(visibleWidgets).map((key) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 capitalize">
                      <input 
                        type="checkbox" 
                        checked={visibleWidgets[key as keyof typeof visibleWidgets]}
                        onChange={() => toggleWidget(key as keyof typeof visibleWidgets)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
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
            className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Cabecera solo visible en PDF */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reporte Financiero Mensual</h1>
        <p className="text-lg text-slate-600 mt-2">Período: {selectedPeriod}</p>
        <div className="h-px bg-slate-300 my-4 w-full"></div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleWidgets.ingresos && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print:border-slate-300">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Ingresos Totales</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.ingresos)}</p>
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-full"></div>
            </div>
          </div>
        )}

        {visibleWidgets.gastos && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print:border-slate-300">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Gastos Operativos</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.gastos)}</p>
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-full" style={{ width: `${(data.gastos/data.ingresos)*100}%` }}></div>
            </div>
          </div>
        )}

        {visibleWidgets.remuneraciones && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print:border-slate-300">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Remuneraciones</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.remuneraciones)}</p>
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-full" style={{ width: `${(data.remuneraciones/data.ingresos)*100}%` }}></div>
            </div>
          </div>
        )}

        {visibleWidgets.iva && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print:border-slate-300">
            <h3 className="text-sm font-medium text-slate-500 mb-2">IVA a Pagar</h3>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(data.iva)}</p>
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <svg className="text-red-500 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Estimación basada en F29
            </div>
          </div>
        )}
      </div>

      {/* Gráfico de Resumen (Visualización simple con CSS) */}
      {visibleWidgets.utilidad && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6 print:border-slate-300 print:break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Resumen de Utilidad</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-slate-800 relative flex items-center justify-center">
              {/* Círculo simulado */}
              <div className="absolute inset-0 rounded-full border-[16px] border-brand-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)' }}></div>
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
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Gastos Totales (Operativos + Rem)</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(data.gastos + data.remuneraciones)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${((data.gastos + data.remuneraciones)/data.ingresos)*100}%` }}></div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Margen Operacional</span>
                <span className="font-bold text-brand-600">{((utilidad / data.ingresos) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mensaje de pie de página solo en impresión */}
      <div className="hidden print:block mt-12 text-center text-sm text-slate-500">
        <p>Documento generado automáticamente por Contabilidad con María.</p>
        <p>Para dudas sobre este reporte, contactar a soporte@contabilidadconmaria.cl</p>
      </div>
    </div>
  );
}
