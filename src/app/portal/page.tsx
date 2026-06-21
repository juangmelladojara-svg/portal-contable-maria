"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { createClient } from "@/lib/supabase/client";

export default function PortalLogin() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Modo recuperación de contraseña
  const [modoReset, setModoReset] = useState(false);
  const [resetEnviado, setResetEnviado] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : "No pudimos iniciar sesión. Inténtalo de nuevo."
      );
      setLoading(false);
      return;
    }

    // El middleware redirige al panel correcto (admin/cliente) según el rol.
    router.push("/portal/dashboard");
    router.refresh();
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/actualizar-clave`,
    });

    if (resetError) {
      setError("No pudimos enviar el correo de recuperación.");
    } else {
      setResetEnviado(true);
    }
    setLoading(false);
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
          {modoReset ? "Recuperar acceso" : "Portal de Clientes"}
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {modoReset
            ? "Te enviaremos un enlace para crear una nueva contraseña."
            : "Ingresa con tu correo y contraseña para ver tus documentos."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card rounded-2xl py-8 px-6 sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          {/* ----------------------- Modo recuperación ----------------------- */}
          {modoReset ? (
            resetEnviado ? (
              <div className="text-center space-y-4 py-2">
                <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/40 text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Si <span className="font-semibold">{email}</span> está registrado,
                  recibirás un correo con el enlace de recuperación.
                </p>
                <button
                  onClick={() => {
                    setModoReset(false);
                    setResetEnviado(false);
                  }}
                  className="text-sm font-medium text-brand-600 hover:text-brand-500"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleReset}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                      placeholder="ejemplo@empresa.cl"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 py-2.5 px-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar enlace"}
                </button>
                <button
                  type="button"
                  onClick={() => setModoReset(false)}
                  className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancelar
                </button>
              </form>
            )
          ) : (
            /* ------------------------- Modo login ------------------------- */
            <>
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                      placeholder="ejemplo@empresa.cl"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                      placeholder="Tu contraseña"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
                    />
                    Recordarme
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setModoReset(true);
                      setError("");
                    }}
                    className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow w-full inline-flex justify-center items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 py-2.5 px-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Ingresar al portal
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur text-slate-500">
                      ¿No tienes acceso?
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href="/#contacto"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    Solicita tus credenciales a María
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
