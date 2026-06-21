"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  CalendarCheck,
  LogIn,
  Calculator,
  ReceiptText,
  Users,
  ShieldCheck,
  FileText,
  Folder,
  Download,
  CheckCircle2,
  TrendingUp,
  Landmark,
  Building2,
  FileCheck2,
  Server,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";

const brands = [
  "TechCorp",
  "Innovate SpA",
  "Global Logistics",
  "Estudio Jurídico",
  "Constructora Sur",
  "StartUp X",
];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const mockup = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero: fade-up en cascada
      gsap.from(".hero-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.1,
      });

      // Mockup del dashboard: inclinación 3D que se endereza al hacer scroll
      if (mockup.current) {
        gsap.fromTo(
          mockup.current,
          { rotateX: 22, y: 60, opacity: 0 },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mockup.current,
              start: "top 90%",
              end: "top 45%",
              scrub: 1,
            },
          }
        );
      }

      // Reveal genérico por sección
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Micro-interacción: barras que crecen
      gsap.from(".bento-bar", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".bento-bars", start: "top 80%" },
      });

      // Micro-interacción: barra de progreso F29 llenándose
      gsap.fromTo(
        ".bento-progress",
        { width: "0%" },
        {
          width: "100%",
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: ".bento-progress", start: "top 85%" },
        }
      );

      // Micro-interacción: toggle de remuneraciones que se activa
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".bento-toggle", start: "top 80%" },
      });
      tl.to(".bento-toggle", { backgroundColor: "#1c4173", duration: 0.4, ease: "power2.out" })
        .to(".bento-knob", { x: 22, duration: 0.4, ease: "power2.out" }, "<");

      // Integraciones: flujo de datos por las líneas SVG
      gsap.to(".flow-line", {
        strokeDashoffset: -28,
        duration: 1.1,
        ease: "none",
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="flex flex-col min-h-screen">
      {/* ============== 1. NAVBAR ============== */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandMark href="/" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#servicios" className="hover:text-brand-600 transition-colors">Servicios</a>
            <a href="#integraciones" className="hover:text-brand-600 transition-colors">Integraciones</a>
            <a href="#portal" className="hover:text-brand-600 transition-colors">Portal</a>
            <a href="#contacto" className="hover:text-brand-600 transition-colors">Contacto</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/portal"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors px-3 py-2"
            >
              <LogIn className="w-4 h-4" />
              Acceso clientes
            </Link>
            <a
              href="#contacto"
              className="btn-glow inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg"
            >
              Agenda asesoría
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* ============== 2. HERO ============== */}
        <section className="relative overflow-hidden pt-20 pb-24">
          <div className="absolute inset-0 -z-10 grid-bg" aria-hidden />
          <div className="absolute inset-x-0 top-0 -z-10 h-[520px] glow-brand" aria-hidden />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="hero-reveal inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50/70 dark:bg-brand-900/20 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
              Portal de clientes 24/7 · SII y Previred al día
            </span>

            <h1 className="hero-reveal text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6">
              Tu contabilidad en orden,
              <br className="hidden sm:block" />{" "}
              <span className="text-brand-600">sin estrés.</span>
            </h1>

            <p className="hero-reveal mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-9">
              Contabilidad, remuneraciones y asesoría tributaria para pymes. Y un
              portal donde descargas tus balances, liquidaciones e impuestos al
              instante, sin mandar un solo correo.
            </p>

            <div className="hero-reveal flex flex-wrap justify-center gap-4">
              <a
                href="#contacto"
                className="btn-glow inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-base font-semibold py-3.5 px-7 rounded-xl"
              >
                <CalendarCheck className="w-5 h-5" />
                Agenda una asesoría
              </a>
              <Link
                href="/portal"
                className="card-lift inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-base font-semibold py-3.5 px-7 rounded-xl"
              >
                Conoce el portal
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mockup del dashboard (producto real) con tilt 3D */}
          <div
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
            style={{ perspective: "1400px" }}
          >
            <div
              ref={mockup}
              className="relative rounded-2xl glass-card shadow-2xl overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* barra superior */}
              <div className="h-11 flex items-center gap-2 px-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs font-medium text-slate-400">
                  portal.contabilidadconmaria.cl / dashboard
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 p-5 bg-slate-50/40 dark:bg-slate-900/40">
                {/* KPI cards */}
                <div className="sm:col-span-3 grid grid-cols-3 gap-4">
                  {[
                    { label: "Ingresos", value: "$15.5M", icon: TrendingUp, tone: "text-green-600" },
                    { label: "IVA del mes", value: "$1.38M", icon: ReceiptText, tone: "text-brand-600" },
                    { label: "F29", value: "Declarado", icon: CheckCircle2, tone: "text-green-600" },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{kpi.label}</span>
                        <kpi.icon className={`w-4 h-4 ${kpi.tone}`} />
                      </div>
                      <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                        {kpi.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* lista de documentos */}
                <div className="sm:col-span-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    "Balance General 2025.pdf",
                    "F29_Marzo_2025.pdf",
                    "Liquidaciones_Abril.zip",
                  ].map((doc) => (
                    <div key={doc} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600">
                          <FileText className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {doc}
                        </span>
                      </div>
                      <span className="text-brand-600">
                        <Download className="w-4 h-4" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* badge flotante */}
              <div className="absolute -bottom-5 -left-3 sm:-left-6 glass-card rounded-xl px-4 py-3 flex items-center gap-3 animate-float">
                <span className="grid place-items-center w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">F29 Declarado</p>
                  <p className="text-xs text-slate-500">Periodo al día</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 3. SOCIAL PROOF ============== */}
        <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-7">
            Empresas que confían su contabilidad a María
          </p>
          <div className="relative flex overflow-x-hidden">
            <div className="flex items-center gap-16 md:gap-24 px-8 min-w-max animate-marquee whitespace-nowrap">
              {brands.map((b, i) => (
                <span key={i} className="text-xl md:text-2xl font-bold text-slate-300 dark:text-slate-700 grayscale opacity-50">
                  {b}
                </span>
              ))}
            </div>
            <div className="absolute top-0 flex items-center gap-16 md:gap-24 px-8 min-w-max animate-marquee2 whitespace-nowrap" aria-hidden>
              {brands.map((b, i) => (
                <span key={`dup-${i}`} className="text-xl md:text-2xl font-bold text-slate-300 dark:text-slate-700 grayscale opacity-50">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 4. BENTO GRID — SERVICIOS ============== */}
        <section id="servicios" className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Todo tu back-office contable, resuelto
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Nos hacemos cargo de los números para que tú te enfoques en crecer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* A — Contabilidad mensual (span 2) con barras */}
              <article data-reveal className="card-lift md:col-span-2 glass-card rounded-2xl p-7 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 mb-4">
                      <Calculator className="w-5 h-5" />
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contabilidad mensual</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
                      Libros tributarios al cierre de cada mes, con total transparencia y acceso 24/7.
                    </p>
                  </div>
                </div>
                <div className="bento-bars mt-auto flex items-end gap-2 h-24 pt-4">
                  {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
                    <div
                      key={i}
                      className="bento-bar flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </article>

              {/* B — Impuestos con progreso */}
              <article data-reveal className="card-lift glass-card rounded-2xl p-7 flex flex-col">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 mb-4">
                  <ReceiptText className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Impuestos al día</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  F29, declaraciones juradas y renta anual. Sin atrasos ni multas.
                </p>
                <div className="mt-auto pt-6">
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                    <span>F29 Marzo</span>
                    <span className="text-green-600">100%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="bento-progress h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600" style={{ width: "100%" }} />
                  </div>
                </div>
              </article>

              {/* C — Remuneraciones con toggle */}
              <article data-reveal className="card-lift glass-card rounded-2xl p-7 flex flex-col">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 mb-4">
                  <Users className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Remuneraciones</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Sueldos, finiquitos, Previred y contratos laborales.
                </p>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Previred automático</span>
                  <span className="bento-toggle relative w-12 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center px-1">
                    <span className="bento-knob w-5 h-5 rounded-full bg-white shadow" />
                  </span>
                </div>
              </article>

              {/* D — Portal (span 2) */}
              <article data-reveal id="portal" className="card-lift md:col-span-2 glass-card rounded-2xl p-7 flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-1">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-accent-500/15 text-accent-600 mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tu portal exclusivo, 24/7</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
                    Descarga balances, liquidaciones y comprobantes cuando quieras. Carpetas por año y mes, sin pedir nada por correo.
                  </p>
                  <Link href="/portal" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700">
                    Entrar al portal <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="w-full sm:w-56 space-y-2">
                  {["2025", "2024", "2023"].map((y) => (
                    <div key={y} className="flex items-center gap-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2.5">
                      <Folder className="w-4 h-4 text-brand-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{y}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============== 5. INTEGRACIONES ============== */}
        <section id="integraciones" className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                Conectada con todo el ecosistema tributario
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Sincronizamos tu información con las instituciones que importan, y la dejamos lista en tu portal.
              </p>
            </div>

            <div data-reveal className="relative max-w-4xl mx-auto">
              <svg viewBox="0 0 800 240" className="w-full h-auto" role="img" aria-label="Diagrama de integraciones">
                <defs>
                  <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7eb0d5" />
                    <stop offset="100%" stopColor="#1c4173" />
                  </linearGradient>
                </defs>
                {/* líneas de flujo */}
                {[40, 100, 140, 200].map((y, i) => (
                  <path
                    key={i}
                    className="flow-line"
                    d={`M 180 ${y} C 320 ${y}, 360 120, 400 120`}
                    fill="none"
                    stroke="url(#flow)"
                    strokeWidth="2.5"
                    strokeDasharray="6 8"
                  />
                ))}
                <path className="flow-line" d="M 400 120 C 480 120, 540 120, 620 120" fill="none" stroke="url(#flow)" strokeWidth="3" strokeDasharray="6 8" />
              </svg>

              {/* nodos */}
              <div className="absolute inset-0">
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
                  {[
                    { icon: Landmark, label: "SII" },
                    { icon: Building2, label: "Previred" },
                    { icon: FileCheck2, label: "DTE / Boletas" },
                    { icon: Server, label: "Bancos" },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center gap-2.5">
                      <span className="grid place-items-center w-11 h-11 rounded-xl glass-card text-brand-600">
                        <n.icon className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{n.label}</span>
                    </div>
                  ))}
                </div>

                {/* nodo central */}
                <div className="absolute left-[44%] top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="grid place-items-center w-16 h-16 rounded-2xl bg-brand-600 text-white shadow-xl ring-4 ring-brand-100 dark:ring-brand-900/40">
                    <Calculator className="w-7 h-7" />
                  </div>
                </div>

                {/* salida: portal */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2.5">
                  <span className="grid place-items-center w-12 h-12 rounded-xl bg-accent-500 text-white shadow-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tu portal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 6. CTA FINAL ============== */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-reveal className="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-16 md:py-20 text-center">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] glow-accent" aria-hidden />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
                  Deja tus números en manos expertas
                </h2>
                <p className="text-brand-100 text-lg mb-9">
                  Agenda una asesoría sin costo y empieza a ver tu contabilidad clara, ordenada y siempre disponible.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="#contacto"
                    className="btn-glow inline-flex items-center gap-2 bg-white text-brand-700 text-base font-semibold py-3.5 px-7 rounded-xl"
                  >
                    <CalendarCheck className="w-5 h-5" />
                    Agenda tu asesoría
                  </a>
                  <Link
                    href="/portal"
                    className="inline-flex items-center gap-2 border border-white/30 text-white text-base font-semibold py-3.5 px-7 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Ver el portal <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============== FOOTER ============== */}
      <footer id="contacto" className="bg-slate-900 text-slate-300 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <BrandMark light />
            <p className="text-sm text-slate-400 max-w-xs mt-4">
              Soluciones contables, tributarias y laborales para empresas que buscan crecer de manera ordenada.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#servicios" className="hover:text-white transition-colors">Contabilidad mensual</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Impuestos (F29, F22)</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Remuneraciones</a></li>
              <li><a href="#integraciones" className="hover:text-white transition-colors">Integraciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/portal" className="hover:text-white transition-colors">Portal de clientes</Link></li>
              <li><a href="#portal" className="hover:text-white transition-colors">¿Cómo funciona?</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-400" /> Oficina Central, Ciudad</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /> contabilidad@mmellado.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /> +56 9 1234 5678</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2025 Contabilidad con María. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            Todos los sistemas operativos
          </p>
        </div>
      </footer>
    </div>
  );
}
