"use client";

import { useEffect, useState } from "react";

interface Document {
  id: number;
  name: string;
  category: string;
  date: string;
  size: string;
  year: string;
  month: string;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  // currentPath: [] = Root (Years), [year] = Months in Year, [year, month] = Files in Month
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  useEffect(() => {
    // Inicializar datos simulados estructurados si no existen
    if (!localStorage.getItem("maria_portal_docs_v2")) {
      const fakeDocs: Document[] = [
        { id: 1, name: "Balance General 2025.pdf", category: "Balances", date: "2025-05-10", size: "1.2 MB", year: "2025", month: "Mayo" },
        { id: 2, name: "F29_Marzo_2025.pdf", category: "Impuestos", date: "2025-04-15", size: "0.8 MB", year: "2025", month: "Marzo" },
        { id: 3, name: "Liquidaciones_Marzo.zip", category: "Remuneraciones", date: "2025-04-02", size: "3.5 MB", year: "2025", month: "Marzo" },
        { id: 4, name: "F29_Febrero_2025.pdf", category: "Impuestos", date: "2025-03-12", size: "0.8 MB", year: "2025", month: "Febrero" },
        { id: 5, name: "Liquidaciones_Febrero.pdf", category: "Remuneraciones", date: "2025-03-05", size: "1.1 MB", year: "2025", month: "Febrero" },
        { id: 6, name: "Balance Anual 2024.pdf", category: "Balances", date: "2024-12-31", size: "4.2 MB", year: "2024", month: "Diciembre" },
      ];
      localStorage.setItem("maria_portal_docs_v2", JSON.stringify(fakeDocs));
      setDocuments(fakeDocs);
    } else {
      setDocuments(JSON.parse(localStorage.getItem("maria_portal_docs_v2")!));
    }
  }, []);

  const handleDownload = (doc: Document) => {
    const blob = new Blob(["Contenido simulado del documento " + doc.name], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Lógica de navegación del explorador
  const renderContent = () => {
    if (currentPath.length === 0) {
      // Root: Mostrar Años
      const years = Array.from(new Set(documents.map(d => d.year))).sort((a, b) => b.localeCompare(a));
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {years.map(year => (
            <div 
              key={year} 
              onClick={() => setCurrentPath([year])}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-500 hover:shadow-md transition-all group"
            >
              <svg className="text-slate-400 group-hover:text-brand-500 transition-colors" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{year}</span>
            </div>
          ))}
        </div>
      );
    } else if (currentPath.length === 1) {
      // Nivel 1: Mostrar Meses dentro del Año seleccionado
      const year = currentPath[0];
      const docsInYear = documents.filter(d => d.year === year);
      const months = Array.from(new Set(docsInYear.map(d => d.month)));
      
      // Orden predeterminado simple para meses (idealmente usaríamos un mapeo numérico)
      const monthOrder = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

      return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {months.map(month => (
            <div 
              key={month} 
              onClick={() => setCurrentPath([year, month])}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-500 hover:shadow-md transition-all group"
            >
              <svg className="text-slate-400 group-hover:text-brand-500 transition-colors" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{month}</span>
            </div>
          ))}
        </div>
      );
    } else if (currentPath.length === 2) {
      // Nivel 2: Mostrar Archivos dentro del Mes y Año seleccionado
      const [year, month] = currentPath;
      const files = documents.filter(d => d.year === year && d.month === month);

      return (
        <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Archivo</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoría</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {files.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(doc.date).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-800 dark:hover:text-brand-400 transition-colors bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded"
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Migas de Pan (Breadcrumbs) y Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <button 
              onClick={() => setCurrentPath([])} 
              className={`hover:text-brand-600 ${currentPath.length === 0 ? 'font-semibold text-slate-900 dark:text-white' : ''}`}
            >
              Archivos
            </button>
            {currentPath.length > 0 && (
              <>
                <span>/</span>
                <button 
                  onClick={() => setCurrentPath([currentPath[0]])} 
                  className={`hover:text-brand-600 ${currentPath.length === 1 ? 'font-semibold text-slate-900 dark:text-white' : ''}`}
                >
                  {currentPath[0]}
                </button>
              </>
            )}
            {currentPath.length > 1 && (
              <>
                <span>/</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentPath[1]}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentPath.length === 0 && "Explorar Carpetas"}
            {currentPath.length === 1 && `Archivos de ${currentPath[0]}`}
            {currentPath.length === 2 && `Archivos: ${currentPath[1]} ${currentPath[0]}`}
          </h1>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
