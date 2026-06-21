"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FolderOpen, BarChart3, LogOut } from "lucide-react";
import BrandMark from "@/components/BrandMark";

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
      setUser(JSON.parse(sessionStr));
    } catch {
      router.push("/portal");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("maria_portal_session");
    router.push("/portal");
  };

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-500">
        Cargando…
      </div>
    );
  }

  const tabs = [
    { href: "/portal/dashboard", label: "Archivos", icon: FolderOpen },
    { href: "/portal/dashboard/metricas", label: "KPIs Financieros", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-800/60 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandMark href="/" showWordmark={false} />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <span className="font-semibold text-slate-900 dark:text-white hidden sm:block">
              Portal de Clientes
            </span>
          </div>

          <nav className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
              <span className="text-xs text-slate-500">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium"
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
