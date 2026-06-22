"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { UploadCloud, LogOut, Building2, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Crear el cliente UNA sola vez (si no, el useEffect entra en bucle infinito).
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<{ nombre: string; email: string } | null>(null);

  useEffect(() => {
    const cargar = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/portal");
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombre, rol")
        .eq("id", authUser.id)
        .single();

      // Doble cierre de seguridad además del middleware: un no-admin no ve este panel.
      if (perfil?.rol !== "admin") {
        router.push("/portal/dashboard");
        return;
      }

      setUser({ nombre: perfil?.nombre ?? authUser.email ?? "", email: authUser.email ?? "" });
    };
    cargar();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/portal");
    router.refresh();
  };

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-500">
        Cargando panel de administración…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-brand-500 shadow-sm ring-1 ring-white/10">
              <span className="font-mono text-lg font-bold text-white">M</span>
            </span>
            <div className="h-6 w-px bg-slate-700" />
            <span className="font-semibold hidden sm:block">Panel de Administración</span>
          </div>

          <nav className="flex gap-1 sm:gap-4">
            {[
              { href: "/portal/admin", label: "Documentos", icon: UploadCloud },
              { href: "/portal/admin/clientes", label: "Clientes", icon: Building2 },
              { href: "/portal/admin/metricas", label: "Métricas", icon: BarChart3 },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`inline-flex items-center gap-1.5 text-sm font-medium transition-all px-2 py-1 rounded-lg ${
                  pathname === t.href ? "text-brand-400" : "text-slate-300 hover:text-white"
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-sm font-semibold">{user.nombre}</span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
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
