"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  FolderOpen,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resolverCategoria } from "@/lib/categorias";

interface Cliente {
  id: string;
  razon_social: string;
  rut: string;
  created_at: string;
}

interface DocLite {
  id: string;
  cliente_id: string;
  nombre: string;
  categoria: string;
  anio: string;
  mes: string;
  size_bytes: number;
  created_at: string;
}

interface Agg {
  docsCount: number;
  periodosCount: number;
  usersCount: number;
  lastUpload: string | null;
  docs: DocLite[];
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const emptyAgg = (): Agg => ({ docsCount: 0, periodosCount: 0, usersCount: 0, lastUpload: null, docs: [] });

export default function AdminClientesPage() {
  const [supabase] = useState(() => createClient());
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [aggs, setAggs] = useState<Record<string, Agg>>({});
  const [loading, setLoading] = useState(true);

  // Form: nueva empresa
  const [razonSocial, setRazonSocial] = useState("");
  const [rut, setRut] = useState("");
  const [savingCliente, setSavingCliente] = useState(false);
  const [msgCliente, setMsgCliente] = useState<{ ok: boolean; text: string } | null>(null);

  // Form: nuevo usuario
  const [uEmail, setUEmail] = useState("");
  const [uPassword, setUPassword] = useState("");
  const [uNombre, setUNombre] = useState("");
  const [uRol, setURol] = useState<"cliente" | "admin">("cliente");
  const [uClienteId, setUClienteId] = useState("");
  const [savingUser, setSavingUser] = useState(false);
  const [msgUser, setMsgUser] = useState<{ ok: boolean; text: string } | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  // Supervisión / eliminación de empresas
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [msgEmpresa, setMsgEmpresa] = useState<{ ok: boolean; text: string } | null>(null);

  const cargarTodo = useCallback(async () => {
    setLoading(true);
    const [{ data: cs }, { data: docs }, { data: mets }, { data: perfiles }] = await Promise.all([
      supabase.from("clientes").select("id, razon_social, rut, created_at").order("razon_social"),
      supabase
        .from("documentos")
        .select("id, cliente_id, nombre, categoria, anio, mes, size_bytes, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("metricas_mensuales").select("id, cliente_id"),
      supabase.from("perfiles").select("id, cliente_id"),
    ]);

    const lista = (cs as Cliente[]) ?? [];
    setClientes(lista);
    if (lista.length > 0 && !uClienteId) setUClienteId(lista[0].id);

    // Agregados por empresa
    const map: Record<string, Agg> = {};
    for (const c of lista) map[c.id] = emptyAgg();
    for (const d of (docs as DocLite[]) ?? []) {
      const a = map[d.cliente_id];
      if (!a) continue;
      a.docsCount++;
      a.docs.push(d);
      if (!a.lastUpload || d.created_at > a.lastUpload) a.lastUpload = d.created_at;
    }
    for (const m of (mets as { cliente_id: string }[]) ?? []) {
      if (map[m.cliente_id]) map[m.cliente_id].periodosCount++;
    }
    for (const p of (perfiles as { cliente_id: string | null }[]) ?? []) {
      if (p.cliente_id && map[p.cliente_id]) map[p.cliente_id].usersCount++;
    }
    setAggs(map);
    setLoading(false);
  }, [supabase, uClienteId]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgCliente(null);
    if (!razonSocial.trim() || !rut.trim()) {
      setMsgCliente({ ok: false, text: "Completa razón social y RUT." });
      return;
    }
    setSavingCliente(true);
    const { error } = await supabase.from("clientes").insert({ razon_social: razonSocial.trim(), rut: rut.trim() });
    setSavingCliente(false);
    if (error) {
      setMsgCliente({ ok: false, text: `Error: ${error.message}` });
      return;
    }
    setMsgCliente({ ok: true, text: `Empresa "${razonSocial}" creada.` });
    setRazonSocial("");
    setRut("");
    await cargarTodo();
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgUser(null);
    setSavingUser(true);

    const res = await fetch("/api/admin/crear-usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: uEmail,
        password: uPassword,
        nombre: uNombre,
        rol: uRol,
        cliente_id: uRol === "cliente" ? uClienteId : null,
      }),
    });
    const json = await res.json();
    setSavingUser(false);

    if (!res.ok) {
      setMsgUser({ ok: false, text: json.error ?? "No se pudo crear el usuario." });
      return;
    }
    setMsgUser({ ok: true, text: `Usuario ${uEmail} creado correctamente.` });
    setUEmail("");
    setUPassword("");
    setUNombre("");
    await cargarTodo();
  };

  const handleEliminarEmpresa = async (c: Cliente) => {
    const a = aggs[c.id] ?? emptyAgg();
    const ok = window.confirm(
      `¿Eliminar la empresa "${c.razon_social}"?\n\n` +
        `Se borrarán PARA SIEMPRE:\n` +
        `• ${a.docsCount} documento(s) y sus archivos del storage\n` +
        `• ${a.periodosCount} período(s) de métricas\n` +
        `• ${a.usersCount} usuario(s) / acceso(s) de esta empresa\n\n` +
        `Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    setDeletingId(c.id);
    setMsgEmpresa(null);

    const res = await fetch("/api/admin/eliminar-empresa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente_id: c.id }),
    });
    const json = await res.json();
    setDeletingId(null);

    if (!res.ok) {
      setMsgEmpresa({ ok: false, text: json.error ?? "No se pudo eliminar la empresa." });
      return;
    }
    if (expandedId === c.id) setExpandedId(null);
    if (uClienteId === c.id) setUClienteId("");
    setMsgEmpresa({
      ok: true,
      text: `Empresa "${c.razon_social}" eliminada — ${json.archivosBorrados} archivo(s) y ${json.usuariosBorrados} usuario(s).`,
    });
    await cargarTodo();
  };

  const inputCls =
    "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  const Mensaje = ({ m }: { m: { ok: boolean; text: string } }) => (
    <div
      className={`flex items-start gap-2 p-3 text-sm rounded-lg border ${
        m.ok
          ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900"
          : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900"
      }`}
    >
      {m.ok ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
      <span>{m.text}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clientes y usuarios</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Crea empresas, da acceso a sus usuarios y supervisa lo cargado.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Crear empresa */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">Nueva empresa cliente</h2>
          </div>
          <form onSubmit={handleCrearCliente} className="p-6 space-y-4">
            {msgCliente && <Mensaje m={msgCliente} />}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Razón social</label>
              <input value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} className={inputCls} placeholder="Empresa Ejemplo SpA" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">RUT</label>
              <input value={rut} onChange={(e) => setRut(e.target.value)} className={inputCls} placeholder="76.123.456-7" />
            </div>
            <button
              type="submit"
              disabled={savingCliente}
              className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 px-4 disabled:opacity-60"
            >
              {savingCliente ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Crear empresa
            </button>
          </form>
        </div>

        {/* Crear usuario */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-brand-600" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">Nuevo usuario</h2>
          </div>
          <form onSubmit={handleCrearUsuario} className="p-6 space-y-4">
            {msgUser && <Mensaje m={msgUser} />}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo</label>
              <input type="email" required value={uEmail} onChange={(e) => setUEmail(e.target.value)} className={inputCls} placeholder="cliente@empresa.cl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                <input value={uNombre} onChange={(e) => setUNombre(e.target.value)} className={inputCls} placeholder="Nombre visible" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={uPassword}
                    onChange={(e) => setUPassword(e.target.value)}
                    className={`${inputCls} pr-10`}
                    placeholder="Mín. 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                <select value={uRol} onChange={(e) => setURol(e.target.value as "cliente" | "admin")} className={inputCls}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {uRol === "cliente" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Empresa</label>
                  <select value={uClienteId} onChange={(e) => setUClienteId(e.target.value)} className={inputCls}>
                    {clientes.length === 0 && <option value="">— Crea una empresa primero —</option>}
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.razon_social}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={savingUser || (uRol === "cliente" && clientes.length === 0)}
              className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-2.5 px-4 disabled:opacity-60"
            >
              {savingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Crear usuario
            </button>
            <p className="text-xs text-slate-400">
              El usuario podrá entrar de inmediato con ese correo y contraseña. Recomiéndale cambiarla en su primer ingreso.
            </p>
          </form>
        </div>
      </div>

      {/* Supervisión por empresa */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Empresas registradas</h2>
          <span className="text-xs text-slate-500">{clientes.length} empresas</span>
        </div>

        {msgEmpresa && <div className="p-4 border-b border-slate-200 dark:border-slate-800"><Mensaje m={msgEmpresa} /></div>}

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">Cargando…</div>
        ) : clientes.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">Aún no hay empresas. Crea la primera arriba.</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {clientes.map((c) => {
              const a = aggs[c.id] ?? emptyAgg();
              const abierto = expandedId === c.id;
              return (
                <li key={c.id}>
                  <div className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    {/* Expandir */}
                    <button
                      onClick={() => setExpandedId(abierto ? null : c.id)}
                      aria-label={abierto ? "Ocultar documentos" : "Ver documentos"}
                      className="flex-shrink-0 grid place-items-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {abierto ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {/* Identidad */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{c.razon_social}</p>
                      <p className="text-xs text-slate-500">
                        {c.rut} · alta {new Date(c.created_at).toLocaleDateString("es-CL")}
                      </p>
                    </div>

                    {/* Métricas resumidas por empresa */}
                    <div className="hidden md:flex items-center gap-5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5" title="Documentos cargados">
                        <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{a.docsCount}</span> docs
                      </span>
                      <span className="inline-flex items-center gap-1.5" title="Períodos de métricas">
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{a.periodosCount}</span> períodos
                      </span>
                      <span className="inline-flex items-center gap-1.5" title="Usuarios con acceso">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{a.usersCount}</span> usuarios
                      </span>
                      <span className="w-28 text-right" title="Última carga de documento">
                        {a.lastUpload ? `Últ. ${new Date(a.lastUpload).toLocaleDateString("es-CL")}` : "Sin cargas"}
                      </span>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleEliminarEmpresa(c)}
                      disabled={deletingId === c.id}
                      title="Eliminar empresa"
                      aria-label={`Eliminar ${c.razon_social}`}
                      className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-60"
                    >
                      {deletingId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Detalle expandible: documentos de esta empresa */}
                  {abierto && (
                    <div className="bg-slate-50/70 dark:bg-slate-950/30 px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800/50">
                      {/* Resumen también visible en móvil */}
                      <div className="md:hidden mb-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{a.docsCount} docs</span>
                        <span>·</span>
                        <span>{a.periodosCount} períodos</span>
                        <span>·</span>
                        <span>{a.usersCount} usuarios</span>
                      </div>

                      {a.docs.length === 0 ? (
                        <p className="text-sm text-slate-500">Esta empresa aún no tiene documentos cargados.</p>
                      ) : (
                        <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
                          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                            <thead className="bg-white/60 dark:bg-slate-900/40 sticky top-0">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Archivo</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Categoría</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Período</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                              {a.docs.map((d) => {
                                const cat = resolverCategoria(d.categoria);
                                return (
                                  <tr key={d.id} className="hover:bg-white/60 dark:hover:bg-slate-800/30">
                                    <td className="px-4 py-2">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                                        <span className="truncate text-slate-700 dark:text-slate-300">{d.nombre}</span>
                                        <span className="flex-shrink-0 text-xs text-slate-400">{formatSize(d.size_bytes)}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-2">
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${cat.chipCls}`}>{cat.label}</span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-500">{d.anio} / {d.mes}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-right text-xs text-slate-500">
                                      {new Date(d.created_at).toLocaleDateString("es-CL")}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
