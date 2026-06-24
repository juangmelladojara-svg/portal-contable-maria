"use client";

import { useState, useEffect, useCallback } from "react";
import { Building2, UserPlus, CheckCircle2, AlertCircle, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Cliente {
  id: string;
  razon_social: string;
  rut: string;
  created_at: string;
}

export default function AdminClientesPage() {
  const [supabase] = useState(() => createClient());
  const [clientes, setClientes] = useState<Cliente[]>([]);
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

  const cargarClientes = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("clientes")
      .select("id, razon_social, rut, created_at")
      .order("razon_social");
    const lista = (data as Cliente[]) ?? [];
    setClientes(lista);
    if (lista.length > 0 && !uClienteId) setUClienteId(lista[0].id);
    setLoading(false);
  }, [supabase, uClienteId]);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

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
    await cargarClientes();
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
        <p className="text-slate-600 dark:text-slate-400 mt-1">Crea empresas y da acceso a sus usuarios.</p>
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

      {/* Listado de empresas */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Empresas registradas</h2>
          <span className="text-xs text-slate-500">{clientes.length} empresas</span>
        </div>
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">Cargando…</div>
        ) : clientes.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">Aún no hay empresas. Crea la primera arriba.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50/60 dark:bg-slate-950/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Razón social</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">RUT</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Alta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">{c.razon_social}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{c.rut}</td>
                  <td className="px-6 py-3 text-right text-xs text-slate-500">{new Date(c.created_at).toLocaleDateString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
