"use client";

import { useEffect, useState } from "react";
import { Folder, FileText, Download, ChevronRight } from "lucide-react";

interface Document {
  id: number;
  name: string;
  category: string;
  date: string;
  size: string;
  year: string;
  month: string;
}

const monthOrder = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  // currentPath: [] = años, [year] = meses, [year, month] = archivos
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  useEffect(() => {
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
    const blob = new Blob([`Contenido simulado del documento ${doc.name}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const FolderCard = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="card-lift glass-card rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center group"
    >
      <Folder className="w-12 h-12 text-brand-400 group-hover:text-brand-600 transition-colors" strokeWidth={1.5} />
      <span className="font-semibold text-slate-800 dark:text-slate-200">{label}</span>
    </button>
  );

  const renderContent = () => {
    if (currentPath.length === 0) {
      const years = Array.from(new Set(documents.map((d) => d.year))).sort((a, b) => b.localeCompare(a));
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {years.map((year) => (
            <FolderCard key={year} label={year} onClick={() => setCurrentPath([year])} />
          ))}
        </div>
      );
    }

    if (currentPath.length === 1) {
      const year = currentPath[0];
      const months = Array.from(new Set(documents.filter((d) => d.year === year).map((d) => d.month)));
      months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {months.map((month) => (
            <FolderCard key={month} label={month} onClick={() => setCurrentPath([year, month])} />
          ))}
        </div>
      );
    }

    const [year, month] = currentPath;
    const files = documents.filter((d) => d.year === year && d.month === month);
    return (
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50/70 dark:bg-slate-950/40">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Archivo</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Categoría</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {files.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.size}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {doc.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(doc.date).toLocaleDateString("es-CL")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-800 dark:hover:text-brand-400 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
          <button
            onClick={() => setCurrentPath([])}
            className={`hover:text-brand-600 transition-colors ${currentPath.length === 0 ? "font-semibold text-slate-900 dark:text-white" : ""}`}
          >
            Archivos
          </button>
          {currentPath.length > 0 && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => setCurrentPath([currentPath[0]])}
                className={`hover:text-brand-600 transition-colors ${currentPath.length === 1 ? "font-semibold text-slate-900 dark:text-white" : ""}`}
              >
                {currentPath[0]}
              </button>
            </>
          )}
          {currentPath.length > 1 && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-white">{currentPath[1]}</span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {currentPath.length === 0 && "Explorar carpetas"}
          {currentPath.length === 1 && `Archivos de ${currentPath[0]}`}
          {currentPath.length === 2 && `${currentPath[1]} ${currentPath[0]}`}
        </h1>
      </div>

      {renderContent()}
    </div>
  );
}
