"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de validación (acepta cualquier cosa para pruebas, o uno específico)
    if (email && password) {
      const isAdmin = email.toLowerCase() === "admin@contabilidad.cl";
      
      // Guardar sesión en LocalStorage
      const userSession = isAdmin ? {
        name: "María (Admin)",
        email: email,
        role: "admin",
        token: "admin-jwt-token-123"
      } : {
        name: "Empresa Demo Spa",
        email: email,
        role: "client",
        token: "fake-jwt-token-12345"
      };
      
      localStorage.setItem("maria_portal_session", JSON.stringify(userSession));
      
      // Inicializar datos falsos si no existen
      if (!localStorage.getItem("maria_portal_docs")) {
        const fakeDocs = [
          { id: 1, name: "Balance General 2025.pdf", category: "Balances", date: "2025-05-10", size: "1.2 MB" },
          { id: 2, name: "F29_Marzo_2025.pdf", category: "Impuestos", date: "2025-04-15", size: "0.8 MB" },
          { id: 3, name: "Liquidaciones_Abril.zip", category: "Remuneraciones", date: "2025-05-02", size: "3.5 MB" }
        ];
        localStorage.setItem("maria_portal_docs", JSON.stringify(fakeDocs));
      }

      if (isAdmin) {
        router.push("/portal/admin");
      } else {
        router.push("/portal/dashboard");
      }
    } else {
      setError("Por favor, ingresa correo y contraseña.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2" aria-label="Volver al inicio">
            <div className="w-10 h-10 rounded bg-brand-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              M
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Portal de Clientes
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Ingresa con tu correo y contraseña para ver tus documentos.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="ejemplo@empresa.cl"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contraseña (simulada)
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Cualquier texto funciona"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded dark:border-slate-700 dark:bg-slate-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                Ingresar al Portal
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                  ¿No tienes acceso?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a href="/#contacto" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                Solicita tus credenciales a María
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
