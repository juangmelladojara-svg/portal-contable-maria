"use client";

import { useEffect, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EventoHoy {
  id: string;
  titulo: string;
  descripcion: string | null;
}

const isoHoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * Muestra un aviso (modal) cuando hay eventos agendados para HOY.
 * Aparece solo una vez al día: al cerrarlo se marca en localStorage con la
 * fecha, de modo que no vuelve a salir hasta el día siguiente.
 */
export default function EventAlert() {
  const [supabase] = useState(() => createClient());
  const [eventos, setEventos] = useState<EventoHoy[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hoy = isoHoy();
    const yaVisto = typeof window !== "undefined" && localStorage.getItem("aviso_eventos") === hoy;
    if (yaVisto) return;

    (async () => {
      // RLS limita los eventos a los del cliente autenticado.
      const { data } = await supabase
        .from("eventos")
        .select("id, titulo, descripcion")
        .eq("fecha", hoy)
        .order("created_at", { ascending: true });
      const lista = (data as EventoHoy[]) ?? [];
      if (lista.length > 0) {
        setEventos(lista);
        setOpen(true);
      }
    })();
  }, [supabase]);

  const cerrar = () => {
    localStorage.setItem("aviso_eventos", isoHoy());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={cerrar} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md glass-card rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-slate-200 dark:border-slate-800 bg-brand-50/70 dark:bg-brand-950/30">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-600 text-white flex-shrink-0">
            <CalendarClock className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              {eventos.length === 1 ? "Tienes un evento hoy" : `Tienes ${eventos.length} eventos hoy`}
            </h2>
            <p className="text-xs text-slate-500">
              {new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <button
            onClick={cerrar}
            aria-label="Cerrar"
            className="ml-auto text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
          {eventos.map((e) => (
            <div key={e.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 border-l-4 border-l-brand-500">
              <p className="font-semibold text-slate-900 dark:text-white">{e.titulo}</p>
              {e.descripcion && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{e.descripcion}</p>}
            </div>
          ))}
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={cerrar}
            className="btn-glow w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 px-4 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
