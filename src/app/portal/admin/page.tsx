"use client";

import { useState, useEffect, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Save } from "lucide-react";

interface Document {
  id: number;
  name: string;
  category: string;
  date: string;
  size: string;
  year: string;
  month: string;
}

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function AdminDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [client, setClient] = useState("Empresa Demo Spa");
  const [category, setCategory] = useState("Balances");
  const [month, setMonth] = useState("Marzo");
  const [year, setYear] = useState("2025");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("0 KB");

  useEffect(() => {
    const docsStr = localStorage.getItem("maria_portal_docs_v2");
    if (docsStr) setDocuments(JSON.parse(docsStr));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize((file.size / 1024 / 1024).toFixed(2) + " MB");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    const newDoc: Document = {
      id: Date.now(),
      name: fileName,
      category,
      date: new Date().toISOString().split("T")[0],
      size: fileSize,
      year,
      month,
    };

    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    localStorage.setItem("maria_portal_docs_v2", JSON.stringify(updatedDocs));

    setSuccessMsg(`¡El documento "${fileName}" se subió correctamente y ya es visible para el cliente!`);
    setFileName("");
    if (formRef.current) formRef.current.reset();
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const selectCls =
    "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subir Documentos</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Carga nuevos archivos a las carpetas de tus clientes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Nuevo documento</h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
              {successMsg && (
                <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-sm rounded-lg border border-green-200 dark:border-green-900">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente</label>
                <select value={client} onChange={(e) => setClient(e.target.value)} className={selectCls}>
                  <option value="Empresa Demo Spa">Empresa Demo Spa (76.123.456-7)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
                  <option value="Balances">Balances y Estados</option>
                  <option value="Impuestos">Impuestos (F29, F22)</option>
                  <option value="Remuneraciones">Remuneraciones y Leyes Sociales</option>
                  <option value="Legal">Legal y Contratos</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mes</label>
                  <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectCls}>
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Año</label>
                  <select value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
                    {["2024", "2025", "2026"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Archivo PDF/ZIP</label>
                <label
                  htmlFor="file-upload"
                  className="mt-1 flex flex-col items-center justify-center gap-2 px-6 py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-center"
                >
                  <UploadCloud className="w-9 h-9 text-slate-400" />
                  <span className="text-sm font-medium text-brand-600">Sube un archivo</span>
                  <span className="text-xs text-slate-400">PDF o ZIP hasta 10 MB</span>
                  {fileName && (
                    <span className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">{fileName}</span>
                  )}
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-2.5 px-4 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Guardar documento
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Listado */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Últimos documentos subidos</h2>
              <span className="text-xs text-slate-500">{documents.length} archivos</span>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50/60 dark:bg-slate-950/40 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Archivo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Carpeta destino</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha carga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md">
                          {doc.year} / {doc.month}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-right text-xs text-slate-500">{doc.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
