"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { createClient } from "@/lib/supabase/client";

export default function ActualizarClavePage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listo, setListo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    // El enlace del correo deja una sesión temporal activa; updateUser la usa.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("No pudimos actualizar la contraseña. El enlace pudo haber expirado.");
      return;
    }
    setListo(true);
    setTimeout(() => router.push("/portal/dashboard"), 1800);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 -z-10 grid-bg" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-96 glow-brand" aria-hidden />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BrandMark href="/" />
        </div>
        <h1 className="mt-8 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Nueva contraseña
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card rounded-2xl py-8 px-6 sm:px-10">
          {listo ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/40 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Contraseña actualizada. Redirigiéndote a tu portal…
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Repetir contraseña
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="confirm"
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 py-2.5 px-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
