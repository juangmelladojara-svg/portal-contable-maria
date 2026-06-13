"use client";

import { useState, useEffect, useRef } from "react";

interface Document {
  id: number;
  name: string;
  category: string;
  date: string;
  size: string;
  year: string;
  month: string;
}

export default function AdminDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Form states
  const [client, setClient] = useState("Empresa Demo Spa");
  const [category, setCategory] = useState("Balances");
  const [month, setMonth] = useState("Marzo");
  const [year, setYear] = useState("2025");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("0 KB");

  useEffect(() => {
    const docsStr = localStorage.getItem("maria_portal_docs_v2");
    if (docsStr) {
      setDocuments(JSON.parse(docsStr));
    }
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
      date: new Date().toISOString().split('T')[0],
      size: fileSize,
      year,
      month
    };

    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    localStorage.setItem("maria_portal_docs_v2", JSON.stringify(updatedDocs));
    
    setSuccessMsg(`¡El documento "${fileName}" se ha subido correctamente y ya es visible para el cliente!`);
    
    // Resetear archivo
    setFileName("");
    if (formRef.current) formRef.current.reset();
    
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subir Documentos</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Carga nuevos archivos a las carpetas de tus clientes.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Formulario de Carga */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Nuevo Documento</h2>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
              {successMsg && (
                <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200 mb-4">
                  {successMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente</label>
                <select 
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Empresa Demo Spa">Empresa Demo Spa (76.123.456-7)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Balances">Balances y Estados</option>
                  <option value="Impuestos">Impuestos (F29, F22)</option>
                  <option value="Remuneraciones">Remuneraciones y Leyes Sociales</option>
                  <option value="Legal">Legal y Contratos</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mes</label>
                  <select 
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Año</label>
                  <select 
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {["2024", "2025", "2026"].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Archivo PDF/ZIP</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                        <span>Sube un archivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                      </label>
                    </div>
                    {fileName && <p className="text-xs font-semibold text-slate-900 dark:text-white mt-2">{fileName}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-2.5 px-4 rounded-md transition-all shadow-sm"
                >
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Listado de Últimos Archivos */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Últimos documentos subidos</h2>
              <span className="text-xs text-slate-500">{documents.length} archivos</span>
            </div>
            
            <div className="overflow-y-auto max-h-[600px]">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50/50 dark:bg-slate-950/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Archivo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Carpeta Destino</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha Carga</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/50">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <svg className="text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md">
                          {doc.year} / {doc.month}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-right text-xs text-slate-500">
                        {doc.date}
                      </td>
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
