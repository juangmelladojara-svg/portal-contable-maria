"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarPlus, Save, CheckCircle2, AlertCircle, Loader2, Trash2, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Cliente {
  id: string;
  razon_social: string;
  tag_remuneraciones: boolean;
  tag_contabilidad: boolean;
}

const TODOS = "TODOS";

interface Evento {
  id: string;
  cliente_id: string;
  fecha: string; // 'YYYY-MM-DD'
  titulo: string;
  descripcion: string | null;
  clientes?: { razon_social: string } | null;
}

const hoyISO = () => new Date().toISOString().slice(0, 10);

const etiquetaFecha = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("es-CL", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function AdminEventosPage() {
  const [supabase] = useState(() => createClient());
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [clienteId, setClienteId] = useState(TODOS);
  const [fecha, setFecha] = useState(hoyISO());
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [quiereRemuneraciones, setQuiereRemuneraciones] = useState(false);
  const [quiereContabilidad, setQuiereContabilidad] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    const [{ data: cs }, { data: ev }] = await Promise.all([
      supabase.from("clientes").select("id, razon_social, tag_remuneraciones, tag_contabilidad").order("razon_social"),
      supabase
        .from("eventos")
        .select("id, cliente_id, fecha, titulo, descripcion, clientes(razon_social)")
        .gte("fecha", hoyISO())
        .order("fecha", { ascending: true })
        .limit(100),
    ]);
    setClientes((cs as Cliente[]) ?? []);
    setEventos((ev as unknown as Evento[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (clientes.length === 0) {
      setMsg({ ok: false, text: "Crea una empresa primero en 'Clientes'." });
      return;
    }
    if (!titulo.trim()) {
      setMsg({ ok: false, text: "Escribe un título para el evento." });
      return;
    }

    // A quién le llega: un cliente puntual, o -si es "Todos"- el grupo
    // filtrado por las etiquetas marcadas (unión), o todos si no marcaste ninguna.
    let destinatarios: Cliente[];
    if (clienteId !== TODOS) {
      const uno = clientes.find((c) => c.id === clienteId);
      destinatarios = uno ? [uno] : [];
    } else if (quiereRemuneraciones || quiereContabilidad) {
      destinatarios = clientes.filter(
        (c) => (quiereRemuneraciones && c.tag_remuneraciones) || (quiereContabilidad && c.tag_contabilidad)
      );
    } else {
      destinatarios = clientes;
    }

    if (destinatarios.length === 0) {
      setMsg({ ok: false, text: "Ningún cliente coincide con el filtro elegido." });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("eventos").insert(
      destinatarios.map((c) => ({
        cliente_id: c.id,
        fecha,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
      }))
    );
    setSaving(false);
    if (error) {
      setMsg({ ok: false, text: `Error: ${error.message}` });
      return;
    }
    setMsg({
      ok: true,
      text:
        destinatarios.length === 1
          ? `Evento "${titulo.trim()}" agendado para ${destinatarios[0].razon_social}.`
          : `Evento "${titulo.trim()}" agendado para ${destinatarios.length} clientes.`,
    });
    setTitulo("");
    setDescripcion("");
    await cargar();
    setTimeout(() => setMsg(null), 6000);
  };

  const handleDelete = async (ev: Evento) => {
    if (!window.confirm(`¿Eliminar el evento "${ev.titulo}"?`)) return;
    setDeletingId(ev.id);
    const { error } = await supabase.from("eventos").delete().eq("id", ev.id);
    setDeletingId(null);
    if (error) {
      setMsg({ ok: false, text: `No se pudo eliminar: ${error.message}` });
      return;
    }
    await cargar();
  };

  const inputCls =
    "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calendario de eventos</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Agenda recordatorios y vencimientos. El cliente los verá en su calendario y recibirá un aviso el día del evento.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-2">
              <CalendarPlus className="w-4 h-4 text-brand-600" />
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Nuevo evento</h2>
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
                  <option value={TODOS}>Todos los clientes</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.razon_social}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Filtrar el grupo &quot;Todos&quot; por etiqueta (opcional)
                </p>
                <div className="flex items-center gap-4">
                  <label
                    className={`inline-flex items-center gap-1.5 text-sm select-none ${
                      clienteId === TODOS ? "text-slate-700 dark:text-slate-300 cursor-pointer" : "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={quiereRemuneraciones}
                      disabled={clienteId !== TODOS}
                      onChange={(e) => setQuiereRemuneraciones(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 focus:ring-offset-0 disabled:opacity-50"
                    />
                    Remuneraciones
                  </label>
                  <label
                    className={`inline-flex items-center gap-1.5 text-sm select-none ${
                      clienteId === TODOS ? "text-slate-700 dark:text-slate-300 cursor-pointer" : "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={quiereContabilidad}
                      disabled={clienteId !== TODOS}
                      onChange={(e) => setQuiereContabilidad(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 focus:ring-offset-0 disabled:opacity-50"
                    />
                    Contabilidad
                  </label>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Sin marcar ninguna, el evento llega a todos. Marca una o ambas para acotarlo al grupo con esa etiqueta en &quot;Clientes&quot;.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
                <input type="date" value={fecha} min={hoyISO()} onChange={(e) => setFecha(e.target.value)} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputCls} placeholder="Vencimiento F29" maxLength={120} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción (opcional)</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={`${inputCls} resize-none`} rows={3} placeholder="Detalle del recordatorio para el cliente…" maxLength={400} />
              </div>

              <button
                type="submit"
                disabled={saving || clientes.length === 0}
                className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 px-4 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Agendar evento
              </button>
            </form>
          </div>
        </div>

        {/* Listado de próximos eventos */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-brand-600" />
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Próximos eventos</h2>
            </div>
            <div className="overflow-y-auto max-h-[640px]">
              {loading ? (
                <div className="p-10 text-center text-sm text-slate-500">Cargando…</div>
              ) : eventos.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">No hay eventos próximos agendados.</div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {eventos.map((ev) => (
                    <li key={ev.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <div className="flex flex-col items-center justify-center w-14 flex-shrink-0 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 py-1.5">
                        <span className="text-lg font-bold leading-none">{ev.fecha.slice(8, 10)}</span>
                        <span className="text-[10px] uppercase tracking-wide">{etiquetaFecha(ev.fecha).split(" ")[2]?.slice(0, 3)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{ev.titulo}</p>
                        <p className="text-xs text-slate-500 capitalize">{etiquetaFecha(ev.fecha)}</p>
                        {ev.descripcion && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{ev.descripcion}</p>}
                        <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">{ev.clientes?.razon_social ?? "—"}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(ev)}
                        disabled={deletingId === ev.id}
                        title="Eliminar evento"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-60 flex-shrink-0"
                      >
                        {deletingId === ev.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
