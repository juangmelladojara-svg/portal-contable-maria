"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Cliente {
  id: string;
  razon_social: string;
}

interface MetricaRow {
  id: string;
  cliente_id: string;
  periodo: string;
  ingresos: number;
  gastos: number;
  iva: number;
  remuneraciones: number;
  clientes?: { razon_social: string } | null;
}

const meses = [
  { v: "01", l: "Enero" }, { v: "02", l: "Febrero" }, { v: "03", l: "Marzo" },
  { v: "04", l: "Abril" }, { v: "05", l: "Mayo" }, { v: "06", l: "Junio" },
  { v: "07", l: "Julio" }, { v: "08", l: "Agosto" }, { v: "09", l: "Septiembre" },
  { v: "10", l: "Octubre" }, { v: "11", l: "Noviembre" }, { v: "12", l: "Diciembre" },
];

const formatCLP = (v: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);

export default function AdminMetricasPage() {
  const [supabase] = useState(() => createClient());
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rows, setRows] = useState<MetricaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [clienteId, setClienteId] = useState("");
  const [mes, setMes] = useState("03");
  const [anio, setAnio] = useState("2025");
  const [ingresos, setIngresos] = useState("");
  const [gastos, setGastos] = useState("");
  const [iva, setIva] = useState("");
  const [remuneraciones, setRemuneraciones] = useState("");

  const cargar = useCallback(async () => {
    setLoading(true);
    const [{ data: cs }, { data: ms }] = await Promise.all([
      supabase.from("clientes").select("id, razon_social").order("razon_social"),
      supabase
        .from("metricas_mensuales")
        .select("id, cliente_id, periodo, ingresos, gastos, iva, remuneraciones, clientes(razon_social)")
        .order("periodo", { ascending: false })
        .limit(100),
    ]);
    const lista = (cs as Cliente[]) ?? [];
    setClientes(lista);
    if (lista.length > 0 && !clienteId) setClienteId(lista[0].id);
    setRows((ms as unknown as MetricaRow[]) ?? []);
    setLoading(false);
  }, [supabase, clienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!clienteId) {
      setMsg({ ok: false, text: "Crea una empresa primero en 'Clientes'." });
      return;
    }
    setSaving(true);
    const periodo = `${anio}-${mes}`;
    // upsert por (cliente_id, periodo): si ya existe, lo actualiza.
    const { error } = await supabase.from("metricas_mensuales").upsert(
      {
        cliente_id: clienteId,
        periodo,
        ingresos: Number(ingresos) || 0,
        gastos: Number(gastos) || 0,
        iva: Number(iva) || 0,
        remuneraciones: Number(remuneraciones) || 0,
      },
      { onConflict: "cliente_id,periodo" }
    );
    setSaving(false);
    if (error) {
      setMsg({ ok: false, text: `Error: ${error.message}` });
      return;
    }
    setMsg({ ok: true, text: `Métricas de ${periodo} guardadas.` });
    setIngresos(""); setGastos(""); setIva(""); setRemuneraciones("");
    await cargar();
  };

  const inputCls =
    "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Métricas financieras</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Carga o actualiza los KPIs mensuales de cada cliente.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Cargar período</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {msg && (
                <div
                  className={`flex items-start gap-2 p-3 text-sm rounded-lg border ${
                    msg.ok
                      ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900"
                      : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900"
                  }`}
                >
                  {msg.ok ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                  <span>{msg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente</label>
                <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className={inputCls}>
                  {clientes.length === 0 && <option value="">— Sin clientes —</option>}
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.razon_social}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mes</label>
                  <select value={mes} onChange={(e) => setMes(e.target.value)} className={inputCls}>
                    {meses.map((m) => (
                      <option key={m.v} value={m.v}>{m.l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Año</label>
                  <select value={anio} onChange={(e) => setAnio(e.target.value)} className={inputCls}>
                    {["2024", "2025", "2026"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ingresos (CLP)</label>
                <input type="number" min="0" value={ingresos} onChange={(e) => setIngresos(e.target.value)} className={inputCls} placeholder="15500000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gastos operativos (CLP)</label>
                <input type="number" min="0" value={gastos} onChange={(e) => setGastos(e.target.value)} className={inputCls} placeholder="8200000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remuneraciones (CLP)</label>
                <input type="number" min="0" value={remuneraciones} onChange={(e) => setRemuneraciones(e.target.value)} className={inputCls} placeholder="4500000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">IVA a pagar (CLP)</label>
                <input type="number" min="0" value={iva} onChange={(e) => setIva(e.target.value)} className={inputCls} placeholder="1387000" />
              </div>

              <button
                type="submit"
                disabled={saving || clientes.length === 0}
                className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 px-4 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar métricas
              </button>
              <p className="text-xs text-slate-400">Si ya existe ese período para el cliente, se actualiza.</p>
            </form>
          </div>
        </div>

        {/* Listado */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Períodos cargados</h2>
            </div>
            <div className="overflow-y-auto max-h-[640px]">
              {loading ? (
                <div className="p-10 text-center text-sm text-slate-500">Cargando…</div>
              ) : rows.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">Aún no hay métricas cargadas.</div>
              ) : (
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50/60 dark:bg-slate-950/40 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cliente</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Período</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Ingresos</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Utilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {rows.map((r) => {
                      const util = r.ingresos - r.gastos - r.remuneraciones;
                      return (
                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{r.clientes?.razon_social ?? "—"}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{r.periodo}</td>
                          <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">{formatCLP(r.ingresos)}</td>
                          <td className={`px-4 py-3 text-right text-sm font-medium ${util >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCLP(util)}
                          </td>
                        </tr>
                      );
                    })}
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
