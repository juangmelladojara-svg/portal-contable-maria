"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { UploadCloud, FileText, CheckCircle2, Save, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIAS, resolverCategoria } from "@/lib/categorias";

interface Cliente {
  id: string;
  razon_social: string;
  rut: string;
}

interface Documento {
  id: string;
  nombre: string;
  categoria: string;
  anio: string;
  mes: string;
  size_bytes: number;
  storage_path: string | null;
  created_at: string;
  cliente_id: string;
  clientes?: { razon_social: string } | null;
}

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function AdminDashboard() {
  const [supabase] = useState(() => createClient());

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [clienteId, setClienteId] = useState("");
  const [category, setCategory] = useState("Financiero");
  const [month, setMonth] = useState("Marzo");
  const [year, setYear] = useState("2025");
  const [file, setFile] = useState<File | null>(null);

  // Cargar la lista de documentos (con el nombre de la empresa)
  const cargarDocumentos = useCallback(async () => {
    setLoadingDocs(true);
    const { data } = await supabase
      .from("documentos")
      .select("id, nombre, categoria, anio, mes, size_bytes, storage_path, created_at, cliente_id, clientes(razon_social)")
      .order("created_at", { ascending: false })
      .limit(100);
    setDocuments((data as unknown as Documento[]) ?? []);
    setLoadingDocs(false);
  }, [supabase]);

  // Cargar clientes + documentos al montar
  useEffect(() => {
    const cargar = async () => {
      const { data: cs } = await supabase
        .from("clientes")
        .select("id, razon_social, rut")
        .order("razon_social");
      const lista = (cs as Cliente[]) ?? [];
      setClientes(lista);
      if (lista.length > 0) setClienteId(lista[0].id);
      await cargarDocumentos();
    };
    cargar();
  }, [supabase, cargarDocumentos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!file) {
      setErrorMsg("Selecciona un archivo antes de guardar.");
      return;
    }
    if (!clienteId) {
      setErrorMsg("No hay clientes disponibles. Crea uno primero en 'Clientes'.");
      return;
    }

    setUploading(true);

    // 1) Subir el archivo real a Storage en la carpeta del cliente: {cliente_id}/{timestamp}-{nombre}
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${clienteId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("documentos")
      .upload(storagePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setErrorMsg(`Error al subir el archivo: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    // 2) Registrar el documento en la base de datos
    const { error: insertError } = await supabase.from("documentos").insert({
      cliente_id: clienteId,
      nombre: file.name,
      categoria: category,
      anio: year,
      mes: month,
      storage_path: storagePath,
      size_bytes: file.size,
    });

    if (insertError) {
      // Si falla el registro, limpiamos el archivo huérfano del Storage
      await supabase.storage.from("documentos").remove([storagePath]);
      setErrorMsg(`Error al registrar el documento: ${insertError.message}`);
      setUploading(false);
      return;
    }

    setSuccessMsg(`¡"${file.name}" se subió correctamente y ya es visible para el cliente!`);
    setFile(null);
    if (formRef.current) formRef.current.reset();
    setUploading(false);
    await cargarDocumentos();
    setTimeout(() => setSuccessMsg(""), 6000);
  };

  const handleDelete = async (doc: Documento) => {
    const ok = window.confirm(
      `¿Eliminar "${doc.nombre}"?\n\nSe borrará para siempre del portal y el cliente dejará de verlo. Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    setDeletingId(doc.id);
    setErrorMsg("");
    setSuccessMsg("");

    // 1) Borrar el archivo real del Storage (si existe la ruta)
    if (doc.storage_path) {
      await supabase.storage.from("documentos").remove([doc.storage_path]);
    }

    // 2) Borrar el registro de la base de datos
    const { error } = await supabase.from("documentos").delete().eq("id", doc.id);

    setDeletingId(null);
    if (error) {
      setErrorMsg(`No se pudo eliminar el documento: ${error.message}`);
      return;
    }

    setSuccessMsg(`"${doc.nombre}" se eliminó correctamente.`);
    await cargarDocumentos();
    setTimeout(() => setSuccessMsg(""), 6000);
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
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm rounded-lg border border-red-200 dark:border-red-900">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente</label>
                <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className={selectCls}>
                  {clientes.length === 0 && <option value="">— Sin clientes aún —</option>}
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.razon_social} ({c.rut})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
                  {CATEGORIAS.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label} — {c.desc}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-400">
                  El cliente verá sus archivos del mes agrupados por esta categoría.
                </p>
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
                  <span className="text-xs text-slate-400">PDF o ZIP hasta 50 MB</span>
                  {file && (
                    <span className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">
                      {file.name} · {formatSize(file.size)}
                    </span>
                  )}
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-2.5 px-4 shadow-sm disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subiendo…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar documento
                    </>
                  )}
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
              {loadingDocs ? (
                <div className="p-10 text-center text-sm text-slate-500">Cargando documentos…</div>
              ) : documents.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  Aún no hay documentos. Sube el primero con el formulario.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50/60 dark:bg-slate-950/40 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Archivo</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Carpeta</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{doc.nombre}</p>
                              <p className="text-xs text-slate-400">{resolverCategoria(doc.categoria).label} · {formatSize(doc.size_bytes)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {doc.clientes?.razon_social ?? "—"}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md">
                            {doc.anio} / {doc.mes}
                          </span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-500">
                          {new Date(doc.created_at).toLocaleDateString("es-CL")}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(doc)}
                            disabled={deletingId === doc.id}
                            title="Eliminar documento"
                            aria-label={`Eliminar ${doc.nombre}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-60"
                          >
                            {deletingId === doc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
