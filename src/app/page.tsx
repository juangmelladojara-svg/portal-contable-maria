"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  FileCheck2,
  Folder,
  Check,
  CheckCircle2,
  TrendingUp,
  Landmark,
  Building2,
  Server,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";

// Logos reales de clientes — guardar cada archivo en public/clientes/<file>.png
const clientes = [
  { name: "Paola Zamorán · Fonoaudiología", file: "paola-zamoran" },
  { name: "Dilo Conmigo", file: "dilo-conmigo" },
  { name: "Hostal Beraca", file: "hostal-beraca" },
  { name: "Panda", file: "panda" },
  { name: "The Chicken Grill", file: "chicken-grill" },
  { name: "Bake House", file: "bake-house" },
  { name: "Survial", file: "survial" },
  { name: "MediFilter", file: "medifilter" },
  { name: "NeuroStep", file: "neurostep" },
  { name: "Coliseo · Constructora Bizama", file: "coliseo" },
];

// Carrusel del portal — pantallazos reales del portal (en public/portal/)
const portalShots = [
  { src: "/portal/02-dashboard.png", label: "Tus archivos por año y mes" },
  { src: "/portal/03-metricas.png", label: "KPIs financieros" },
  { src: "/portal/04-admin-subir.png", label: "Carga de documentos" },
  { src: "/portal/06-admin-metricas.png", label: "Métricas mensuales" },
  { src: "/portal/05-admin-clientes.png", label: "Gestión de clientes" },
  { src: "/portal/01-login.png", label: "Acceso seguro 24/7" },
];

// Gráfico de 12 meses (ingresos mensuales, en %)
const ingresos12 = [42, 50, 46, 58, 54, 64, 60, 71, 66, 78, 74, 88];
const mesesIni = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// Checklist de impuestos con auto-check
const impuestos = ["F29", "Ingresos", "Egresos", "Balance general", "Formulario 22", "Libros contables"];

// Documentos de remuneraciones
const remDocs = [
  { label: "Liquidaciones de sueldo", icon: ReceiptText },
  { label: "Previred", icon: Building2 },
  { label: "Comprobantes de vacaciones", icon: CalendarCheck },
  { label: "Contrato de trabajo", icon: FileText },
  { label: "Finiquitos", icon: FileCheck2 },
];

/** Logo de cliente con respaldo al nombre si aún no existe el archivo /clientes/<file>.png */
function ClientLogo({ c }: { c: { name: string; file: string } }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setOk(true);
    img.src = `/clientes/${c.file}.png`;
  }, [c.file]);

  if (!ok) {
    return (
      <span className="text-lg md:text-xl font-bold text-slate-300 dark:text-slate-700 whitespace-nowrap shrink-0">
        {c.name.split(" · ")[0]}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/clientes/${c.file}.png`}
      alt={c.name}
      title={c.name}
      className="h-10 md:h-12 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition duration-300 shrink-0"
    />
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

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

      // Gráfico de 12 meses: barras que crecen
      gsap.from(".bento-bar", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ".bento-bars", start: "top 85%" },
      });

      // Impuestos: las casillas se auto-marcan en secuencia
      gsap.from(".tax-check-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(2)",
        stagger: 0.18,
        scrollTrigger: { trigger: ".tax-list", start: "top 85%" },
      });

      // Remuneraciones: documentos que entran escalonados
      gsap.from(".remun-list > li", {
        y: 14,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".remun-list", start: "top 85%" },
      });

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
        {/* ============== 2. HERO (editorial asimétrico) ============== */}
        <section className="relative overflow-hidden bg-[#faf9f7] dark:bg-slate-950 pt-14 pb-16 lg:pt-24 lg:pb-24">
          <div className="absolute inset-0 -z-10 grid-bg" aria-hidden />
          <div className="absolute right-[-10%] top-[-5%] -z-10 h-[620px] w-[60%] glow-brand" aria-hidden />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Columna de texto */}
            <div className="lg:col-span-7 xl:col-span-6">
              <h1 className="hero-reveal font-display text-5xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.02] mb-6">
                Tu contabilidad
                <br />
                en <span className="underline-gold">orden</span>, sin estrés.
              </h1>

              <p className="hero-reveal max-w-xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                Contabilidad, remuneraciones y asesoría tributaria para pymes. Más un
                portal donde descargas balances, liquidaciones e impuestos al instante
                — sin enviar un solo correo.
              </p>

              <div className="hero-reveal flex flex-wrap gap-4">
                <a
                  href="#contacto"
                  className="btn-glow inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-base font-semibold py-3.5 px-7 rounded-xl"
                >
                  <CalendarCheck className="w-5 h-5" />
                  Agenda una asesoría
                </a>
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white py-3.5 px-3 group"
                >
                  Conoce el portal
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Stat strip editorial */}
              <div className="hero-reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                {[
                  { n: "+50", l: "pymes asesoradas" },
                  { n: "15", l: "años de experiencia" },
                  { n: "100%", l: "al día con el SII" },
                ].map((s, i) => (
                  <div key={s.l} className="flex items-center gap-8">
                    {i > 0 && <span className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />}
                    <div>
                      <span className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{s.n}</span>
                      <span className="ml-2 text-slate-500 dark:text-slate-400">{s.l}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna de imagen (corporativa) */}
            <div className="hero-reveal lg:col-span-5 xl:col-span-6 relative">
              <div className="relative w-full max-w-md mx-auto lg:max-w-none aspect-[4/5] rounded-[1.75rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
                {/* PLACEHOLDER corporativo: reemplazar por imagen propia */}
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85"
                  alt="Oficina de Contabilidad con María"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/30 via-transparent to-transparent" />
              </div>

              {/* KPI flotante sobre la imagen */}
              <div className="absolute -bottom-5 -left-2 sm:-left-5 glass-card rounded-2xl px-4 py-3 flex items-center gap-3 animate-float shadow-xl">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">F29 Declarado</p>
                  <p className="text-xs text-slate-500">Periodo al día</p>
                </div>
              </div>

              {/* Acento dorado tras la imagen */}
              <div className="absolute -top-4 -right-4 -z-10 w-28 h-28 rounded-2xl bg-accent-500/20" aria-hidden />
            </div>
          </div>
        </section>

        {/* ============== 3. SOCIAL PROOF ============== */}
        <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-7">
            Empresas que confían su contabilidad a María
          </p>
          <div className="relative flex overflow-x-hidden">
            {[0, 1].map((track) => (
              <div
                key={track}
                aria-hidden={track === 1}
                className={`flex items-center gap-12 md:gap-20 px-6 min-w-max ${track === 0 ? "animate-marquee" : "absolute top-0 left-0 animate-marquee2"}`}
              >
                {clientes.map((c, i) => (
                  <ClientLogo key={`${track}-${i}`} c={c} />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ============== 3b. PORTAL — carrusel de imágenes reales ============== */}
        <section className="py-20 lg:py-24 bg-[#faf9f7] dark:bg-slate-950 overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
            <span data-reveal className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-accent-600 mb-3">
              El portal
            </span>
            <h2 data-reveal className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Toda tu información, en un solo lugar
            </h2>
          </div>

          {/* Carrusel infinito (dos pistas duplicadas para loop continuo) */}
          <div
            className="relative flex"
            style={{
              maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
            }}
          >
            {[0, 1].map((track) => (
              <div
                key={track}
                aria-hidden={track === 1}
                className={`flex items-center gap-5 px-2.5 min-w-max ${track === 0 ? "animate-marquee" : "absolute top-0 left-0 animate-marquee2"}`}
              >
                {portalShots.map((shot, i) => (
                  <figure
                    key={`${track}-${i}`}
                    className="relative w-72 sm:w-80 aspect-[16/10] rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 shrink-0"
                  >
                    <Image
                      src={shot.src}
                      alt={shot.label}
                      fill
                      sizes="320px"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/10 to-transparent" />
                    <figcaption className="absolute bottom-3 left-4 text-sm font-semibold text-white drop-shadow">
                      {shot.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ============== 4. BENTO GRID — SERVICIOS ============== */}
        <section id="servicios" className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
                Todo tu back-office contable, resuelto
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Nos hacemos cargo de los números para que tú te enfoques en crecer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* A — Contabilidad mensual (span 2) con gráfico de 12 meses */}
              <article data-reveal className="card-lift md:col-span-2 glass-card rounded-2xl p-7 flex flex-col">
                <div className="mb-4">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 mb-4">
                    <Calculator className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contabilidad mensual</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
                    Libros tributarios al cierre de cada mes, con total transparencia y acceso 24/7.
                  </p>
                </div>

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-3">
                    <span>Ingresos mensuales · 2025</span>
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3.5 h-3.5" /> +18% anual
                    </span>
                  </div>
                  <div className="bento-bars flex items-end gap-1.5 sm:gap-2 h-28">
                    {ingresos12.map((h, i) => (
                      <div
                        key={i}
                        className={`bento-bar flex-1 rounded-t-md ${
                          i === ingresos12.length - 1
                            ? "bg-gradient-to-t from-accent-600 to-accent-400"
                            : "bg-gradient-to-t from-brand-600 to-brand-400"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between gap-1.5 sm:gap-2 mt-2">
                    {mesesIni.map((m, i) => (
                      <span key={i} className="flex-1 text-center text-[10px] text-slate-400">{m}</span>
                    ))}
                  </div>
                </div>
              </article>

              {/* B — Impuestos con checklist auto-check */}
              <article data-reveal className="card-lift glass-card rounded-2xl p-7 flex flex-col">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 mb-4">
                  <ReceiptText className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Impuestos al día</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Declaramos y cumplimos cada obligación, sin atrasos ni multas.
                </p>
                <ul className="tax-list mt-auto pt-5 space-y-2.5">
                  {impuestos.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <span className="tax-check-icon grid place-items-center w-5 h-5 rounded-full bg-green-500 text-white shadow-sm">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* C — Remuneraciones con lista de documentos */}
              <article data-reveal className="card-lift glass-card rounded-2xl p-7 flex flex-col">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 mb-4">
                  <Users className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Remuneraciones</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Todo el ciclo laboral de tu equipo, documentado y disponible.
                </p>
                <ul className="remun-list mt-auto pt-5 space-y-2">
                  {remDocs.map((d) => (
                    <li
                      key={d.label}
                      className="flex items-center gap-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2"
                    >
                      <d.icon className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{d.label}</span>
                      <Check className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" strokeWidth={3} />
                    </li>
                  ))}
                </ul>
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
        <section id="integraciones" className="py-24 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-accent-600 mb-3">
                Integraciones
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
                Conectada con todo el ecosistema tributario
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Sincronizamos tu información con las instituciones que importan, y la dejamos lista en tu portal.
              </p>
            </div>

            <div data-reveal className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-6">
              {/* Conectores animados (solo escritorio) */}
              <svg
                className="hidden md:block absolute inset-0 w-full h-full -z-0 pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 1000 100"
                aria-hidden
              >
                <defs>
                  <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7eb0d5" />
                    <stop offset="100%" stopColor="#1c4173" />
                  </linearGradient>
                </defs>
                <line className="flow-line" x1="300" y1="50" x2="470" y2="50" stroke="url(#flow)" strokeWidth="2.5" strokeDasharray="6 8" />
                <line className="flow-line" x1="530" y1="50" x2="700" y2="50" stroke="url(#flow)" strokeWidth="2.5" strokeDasharray="6 8" />
              </svg>

              {/* Fuentes */}
              <div className="space-y-3">
                {[
                  { icon: Landmark, label: "SII" },
                  { icon: Building2, label: "Previred" },
                  { icon: FileCheck2, label: "DTE / Boletas" },
                  { icon: Server, label: "Bancos" },
                ].map((n) => (
                  <div key={n.label} className="flex items-center gap-3 rounded-xl glass-card px-4 py-3 shadow-sm">
                    <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600">
                      <n.icon className="w-5 h-5" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{n.label}</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                  </div>
                ))}
              </div>

              {/* Motor central */}
              <div className="relative z-10 flex flex-col items-center gap-4 py-2">
                <div className="relative grid place-items-center w-24 h-24 rounded-3xl bg-brand-600 text-white shadow-2xl ring-1 ring-white/10">
                  <Calculator className="w-9 h-9" />
                  <span className="absolute inset-0 rounded-3xl ring-2 ring-brand-400/50 animate-ping" aria-hidden />
                </div>
                <div className="text-center">
                  <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">Procesamos y conciliamos</p>
                  <p className="text-xs text-slate-500">en tiempo real</p>
                </div>
              </div>

              {/* Salida: portal */}
              <div className="glass-card rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-accent-500 text-white shadow">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">Tu portal, listo</span>
                </div>
                <ul className="space-y-2.5">
                  {["Balances y estados", "F29 y declaraciones", "Liquidaciones", "KPIs financieros"].map((d) => (
                    <li key={d} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={3} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 6. CTA FINAL ============== */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-700 px-8 py-16 md:py-20 text-center">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] glow-accent" aria-hidden />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 rounded-b-full bg-accent-500" aria-hidden />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white mb-5">
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
          <p>© 2026 Contabilidad con María. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            Todos los sistemas operativos
          </p>
        </div>
      </footer>
    </div>
  );
}
