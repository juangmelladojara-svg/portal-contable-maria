"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem("maria_portal_session");
    if (!sessionStr) {
      router.push("/portal");
      return;
    }
    
    try {
      const session = JSON.parse(sessionStr);
      if (session.role !== "admin") {
        router.push("/portal/dashboard");
        return;
      }
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
    return <div className="min-h-screen flex items-center justify-center">Cargando Panel de Administración...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-brand-500 flex items-center justify-center text-white font-bold shadow-sm">
              M
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            <span className="font-semibold hidden sm:block">Panel de Administración</span>
          </div>

          <nav className="flex gap-4">
            <Link 
              href="/portal/admin"
              className={`text-sm font-medium transition-all ${
                pathname === '/portal/admin' ? 'text-brand-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Subir Documentos
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white font-medium bg-slate-800 px-3 py-1.5 rounded-md transition-colors"
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
