"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem("maria_portal_session");
    if (!sessionStr) {
      router.push("/portal");
      return;
    }
    
    try {
      const session = JSON.parse(sessionStr);
      setUser(session);
    } catch (e) {
      router.push("/portal");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("maria_portal_session");
    router.push("/portal");
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-8 h-8 rounded bg-brand-600 flex items-center justify-center text-white font-bold shadow-sm">
              M
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <span className="font-semibold text-slate-900 dark:text-white hidden sm:block">Portal de Clientes</span>
          </div>

          {/* Navegación de Pestañas */}
          <nav className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <Link 
              href="/portal/dashboard"
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                pathname === '/portal/dashboard' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Archivos
            </Link>
            <Link 
              href="/portal/dashboard/metricas"
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                pathname === '/portal/dashboard/metricas' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              KPIs Financieros
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
              <span className="text-xs text-slate-500">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
