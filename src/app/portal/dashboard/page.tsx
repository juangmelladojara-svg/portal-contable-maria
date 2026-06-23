"use client";

import { useEffect, useState } from "react";
import { Folder, FileText, Download, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIAS, CATEGORIA_OTROS, resolverCategoria, type Categoria } from "@/lib/categorias";

interface Documento {
  id: string;
  nombre: string;
  categoria: string;
  anio: string;
  mes: string;
  size_bytes: number;
  storage_path: string;
  created_at: string;
}

const monthOrder = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function DashboardPage() {
  const [supabase] = useState(() => createClient());
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  // currentPath: [] = años, [year] = meses, [year, month] = archivos
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  // Categorías contraídas dentro de la vista de un mes (key → true = colapsada)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCat = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      // RLS deja ver SOLO los documentos del cliente autenticado.
      const { data } = await supabase
        .from("documentos")
        .select("id, nombre, categoria, anio, mes, size_bytes, storage_path, created_at")
        .order("created_at", { ascending: false });
      setDocuments((data as Documento[]) ?? []);
      setLoading(false);
    };
    cargar();
  }, [supabase]);

  const handleDownload = async (doc: Documento) => {
    setDownloadingId(doc.id);
    // URL firmada temporal (60s) sobre el bucket privado.
    const { data, error } = await supabase.storage
      .from("documentos")
      .createSignedUrl(doc.storage_path, 60, { download: doc.nombre });

    setDownloadingId(null);
    if (error || !data?.signedUrl) {
      alert("No se pudo generar la descarga. Inténtalo de nuevo.");
      return;
    }
    window.open(data.signedUrl, "_blank");
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
    if (loading) {
      return (
        <div className="glass-card rounded-2xl p-12 flex items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Cargando tus documentos…
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Folder className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Aún no tienes documentos disponibles.</p>
          <p className="text-sm text-slate-400 mt-1">Cuando María suba archivos a tu carpeta, aparecerán aquí.</p>
        </div>
      );
    }

    if (currentPath.length === 0) {
      const years = Array.from(new Set(documents.map((d) => d.anio))).sort((a, b) => b.localeCompare(a));
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
      const months = Array.from(new Set(documents.filter((d) => d.anio === year).map((d) => d.mes)));
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
    const files = documents.filter((d) => d.anio === year && d.mes === month);

    // Agrupar por categoría: las 4 oficiales en orden + "Otros" para etiquetas heredadas.
    const grupos: { cat: Categoria; docs: Documento[] }[] = CATEGORIAS.map((cat) => ({
      cat,
      docs: files.filter((d) => resolverCategoria(d.categoria).key === cat.key),
    }));
    const otros = files.filter((d) => resolverCategoria(d.categoria).key === CATEGORIA_OTROS.key);
    if (otros.length) grupos.push({ cat: CATEGORIA_OTROS, docs: otros });

    return (
      <div className="space-y-4">
        {grupos.map(({ cat, docs }) => {
          // Por defecto las categorías arrancan cerradas (acordeón).
          const isCollapsed = collapsed[cat.key] ?? true;
          const Icon = cat.icon;
          return (
            <div key={cat.key} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleCat(cat.key)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
              >
                <span className={`grid place-items-center w-9 h-9 rounded-lg ${cat.chipCls} flex-shrink-0`}>
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{cat.label}</p>
                  <p className="text-xs text-slate-500 truncate">{cat.desc}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.chipCls}`}>
                  {docs.length} {docs.length === 1 ? "archivo" : "archivos"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                />
              </button>

              {!isCollapsed && (
                docs.length === 0 ? (
                  <p className="px-5 pb-5 pt-1 text-sm text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    Sin archivos en esta categoría para {month} {year}.
                  </p>
                ) : (
                  <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <span className="grid place-items-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{doc.nombre}</p>
                          <p className="text-xs text-slate-500">
                            {formatSize(doc.size_bytes)} · {new Date(doc.created_at).toLocaleDateString("es-CL")}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(doc)}
                          disabled={downloadingId === doc.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-800 dark:hover:text-brand-400 transition-colors disabled:opacity-60 flex-shrink-0"
                        >
                          {downloadingId === doc.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">Descargar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          );
        })}
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
