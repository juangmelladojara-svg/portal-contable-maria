"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
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
  Sparkles,
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

// Vistas del portal (pestañas interactivas) — pantallazos reales en public/portal/
const portalTabs = [
  {
    icon: Folder,
    label: "Archivos",
    src: "/portal/02-dashboard.png",
    desc: "Tus carpetas por año y mes, listas para descargar cuando quieras.",
  },
  {
    icon: TrendingUp,
    label: "KPIs financieros",
    src: "/portal/03-metricas.png",
    desc: "Tus números clave del mes —ingresos, gastos y márgenes— siempre al día.",
  },
  {
    icon: LogIn,
    label: "Acceso seguro",
    src: "/portal/01-login.png",
    desc: "Entra cuando quieras, 24/7, con tu acceso privado y desde cualquier dispositivo.",
  },
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

// Planes mensuales
interface Plan {
  num: string;
  nombre: string;
  tagline: string;
  precio: string;
  custom: boolean;
  incluye: string[];
  ideal: string;
  popular: boolean;
}

const planes: Plan[] = [
  {
    num: "01",
    nombre: "Inicio Pyme",
    tagline: "Empieza con el pie derecho.",
    precio: "$65.000",
    custom: false,
    incluye: [
      "Acceso al Portal del Cliente.",
      "Dashboard financiero con indicadores (KPIs).",
      "Gestión mensual del F29.",
      "Soporte vía WhatsApp en horario de atención.",
    ],
    ideal: "Profesionales, emprendedores y empresas sin trabajadores.",
    popular: false,
  },
  {
    num: "02",
    nombre: "Pyme Gestión",
    tagline: "Ordena la operación de tu empresa.",
    precio: "$120.000",
    custom: false,
    incluye: [
      "Todo lo del Plan Inicio Pyme.",
      "Gestión de compras y ventas.",
      "Gestión de Recursos Humanos.",
      "Previred.",
      "Certificados F30 y F30-1.",
      "Portal del Cliente actualizado mensualmente.",
    ],
    ideal: "Empresas con 1 a 3 trabajadores.",
    popular: false,
  },
  {
    num: "03",
    nombre: "Pyme Pro",
    tagline: "Convierte tus números en decisiones.",
    precio: "$180.000",
    custom: false,
    incluye: [
      "Todo lo del Plan Pyme Gestión.",
      "Revisión y análisis de los KPIs del Portal.",
      "Reunión de seguimiento financiero semestral.",
      "Informe Gerencial Semestral.",
      "Revisión tributaria preventiva.",
      "Planificación para la Operación Renta.",
      "Atención prioritaria vía WhatsApp.",
    ],
    ideal: "Empresas con 4 a 7 trabajadores.",
    popular: true,
  },
  {
    num: "04",
    nombre: "Empresas · Corporativo",
    tagline: "Una solución diseñada para tu empresa.",
    precio: "Cotización",
    custom: true,
    incluye: [
      "Diagnóstico inicial de la empresa.",
      "Propuesta de servicio personalizada.",
      "Configuración del Portal de Gestión Empresarial.",
      "Gestión contable, tributaria y laboral a medida.",
      "Acompañamiento permanente.",
      "Reuniones periódicas de seguimiento.",
      "Atención prioritaria.",
    ],
    ideal: "Empresas con más de 7 trabajadores, múltiples sucursales o alto volumen de documentos.",
    popular: false,
  },
];

// Factores que inciden en el valor de la Declaración Anual de Renta
const factoresRenta = [
  "Cantidad de Declaraciones Juradas a presentar.",
  "Preparación y presentación del Formulario 22.",
  "Participación de socios y declaraciones asociadas.",
  "Registros empresariales tributarios (RAI, DDAN, REX, SAC, entre otros, cuando corresponda).",
  "Rectificaciones o regularizaciones.",
  "Revisión y análisis de la información tributaria del ejercicio.",
];

/** Logo de cliente (acepta png/jpg/jpeg/webp); si no existe, muestra el nombre. */
function ClientLogo({ c }: { c: { name: string; file: string } }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const ext of ["png", "jpg", "jpeg", "webp"]) {
        const url = `/clientes/${c.file}.${ext}`;
        const found = await new Promise<string | null>((res) => {
          const img = new window.Image();
          img.onload = () => res(url);
          img.onerror = () => res(null);
          img.src = url;
        });
        if (cancelled) return;
        if (found) { setSrc(found); return; }
      }
    })();
    return () => { cancelled = true; };
  }, [c.file]);

  if (!src) {
    return (
      <span className="text-lg md:text-xl font-bold text-slate-300 dark:text-slate-700 whitespace-nowrap shrink-0">
        {c.name.split(" · ")[0]}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={c.name}
      title={c.name}
      className="h-10 md:h-12 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition duration-300 shrink-0"
    />
  );
}

/** Header de sección asimétrico: título grande a la izquierda, lead angosto a la derecha. */
function SectionHead({ tag, title, lead }: { tag: string; title: string; lead: string }) {
  return (
    <div data-reveal className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-12 lg:mb-16">
      <div className="lg:col-span-8">
        <span className="block text-sm font-medium tracking-wide text-accent-600 mb-4">( {tag} )</span>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.04] text-slate-900 dark:text-white text-balance">
          {title}
        </h2>
      </div>
      <p className="lg:col-span-4 text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-md lg:justify-self-end lg:pb-1.5">
        {lead}
      </p>
    </div>
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [portalTab, setPortalTab] = useState(0);
  const pctRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const portalSTRef = useRef<ScrollTrigger | null>(null);
  const portalTabRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Scroll con inercia (sensación cinemática); respeta reduced-motion.
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let heroMove: ((e: MouseEvent) => void) | null = null;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis = new Lenis({ duration: 1.15, anchors: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      // ---- HERO: entrada cinematográfica ----
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-eyebrow", { y: 22, opacity: 0, duration: 0.6 })
        // Las líneas del titular emergen desde máscaras (overflow hidden)
        .from(".hero-line", { yPercent: 112, duration: 1.15, stagger: 0.14 }, 0.08)
        // El resaltador dorado se dibuja de izquierda a derecha
        .fromTo(
          ".hero-band",
          { backgroundSize: "0% 100%" },
          { backgroundSize: "100% 100%", duration: 0.85, ease: "power3.inOut" },
          "-=0.5"
        )
        // La firma script cae con una leve rotación
        .from(".hero-script", { opacity: 0, y: 16, rotate: 10, duration: 0.7 }, "-=0.55")
        .from(".hero-sub", { y: 26, opacity: 0, duration: 0.75, stagger: 0.12 }, "-=0.6")
        // El visual del portal entra desde el borde derecho
        .from(".hero-visual-inner", { x: 180, y: 60, opacity: 0, duration: 1.4 }, 0.35)
        .from(
          ".hero-chip",
          { y: 28, opacity: 0, scale: 0.92, duration: 0.6, ease: "back.out(1.6)", stagger: 0.12 },
          "-=0.7"
        );

      // Contadores: las cifras suben desde 0 al entrar en pantalla
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const end = parseFloat(el.dataset.value || "0");
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 94%" },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(obj.v)}${suffix}`;
          },
        });
      });

      // Reveal genérico por sección (ágil + GPU)
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // Grupos: los hijos entran en cascada (bento, planes).
      // Trigger por tarjeta + delay incremental: robusto frente a pins/refresh.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        Array.from(group.children).forEach((child, i) => {
          gsap.from(child, {
            y: 44,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            force3D: true,
            delay: (i % 4) * 0.09,
            scrollTrigger: { trigger: child as Element, start: "top 92%" },
          });
        });
      });

      // Gráfico de 12 meses: barras que crecen
      gsap.from(".bento-bar", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.5,
        ease: "power2.out",
        force3D: true,
        stagger: 0.035,
        scrollTrigger: { trigger: ".bento-bars", start: "top 90%" },
      });

      // Impuestos: las casillas se auto-marcan en secuencia
      gsap.from(".tax-check-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.out(2)",
        force3D: true,
        stagger: 0.1,
        scrollTrigger: { trigger: ".tax-list", start: "top 90%" },
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

      // Hero: el titular deriva hacia arriba al scrollear (parallax)
      gsap.to(".hero-par", {
        yPercent: -14,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // El visual del portal deriva a distinta velocidad (profundidad)
      gsap.to(".hero-visual-inner", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Palabra gigante de fondo: cruza la escena con el scroll (scrub)
      gsap.fromTo(
        ".giant-word",
        { xPercent: 8 },
        {
          xPercent: -36,
          ease: "none",
          scrollTrigger: {
            trigger: ".giant-word-band",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Cierre: la marca de agua script se desplaza con el scroll
      gsap.from(".cta-script", {
        xPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-final",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Portal: escena anclada — el scroll recorre las 3 vistas (solo escritorio)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: ".portal-pin",
          start: "top top",
          end: "+=1500",
          pin: true,
          onUpdate: (self) => {
            const idx = Math.min(2, Math.floor(self.progress * 3));
            if (idx !== portalTabRef.current) {
              portalTabRef.current = idx;
              setPortalTab(idx);
            }
          },
        });
        portalSTRef.current = st;
        return () => {
          portalSTRef.current = null;
        };
      });

      // Marco fijo: porcentaje + línea de progreso del scroll
      ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onUpdate: (self) => {
          if (pctRef.current) pctRef.current.textContent = `${Math.round(self.progress * 100)}%`;
          if (lineRef.current) lineRef.current.style.transform = `scaleX(${self.progress})`;
        },
      });

      // Parallax al mouse en el hero (solo puntero fino)
      if (window.matchMedia("(pointer: fine)").matches) {
        const heroEl = document.querySelector<HTMLElement>(".hero-section");
        if (heroEl) {
          const xTitle = gsap.quickTo(".hero-par", "x", { duration: 0.8, ease: "power3.out" });
          const xVisual = gsap.quickTo(".hero-visual-inner", "x", { duration: 1.1, ease: "power3.out" });
          const chipTos = gsap.utils.toArray<HTMLElement>(".hero-chip").map((c) => ({
            x: gsap.quickTo(c, "x", { duration: 1, ease: "power3.out" }),
            y: gsap.quickTo(c, "y", { duration: 1, ease: "power3.out" }),
          }));
          heroMove = (e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            xTitle(nx * 18);
            xVisual(nx * -22);
            chipTos.forEach((t, i) => {
              const f = i % 2 === 0 ? 1 : -1.4;
              t.x(nx * 24 * f);
              t.y(ny * 16 * f);
            });
          };
          heroEl.addEventListener("mousemove", heroMove);
        }
      }
    }, root);

    return () => {
      ctx.revert();
      if (heroMove) document.querySelector(".hero-section")?.removeEventListener("mousemove", heroMove as EventListener);
      if (tick) gsap.ticker.remove(tick);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  /** Cambia de vista del portal; si la escena está anclada, scrollea a su tramo. */
  const goTab = (i: number) => {
    portalTabRef.current = i;
    setPortalTab(i);
    const st = portalSTRef.current;
    if (st) {
      const target = st.start + ((i + 0.5) / 3) * (st.end - st.start);
      if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 0.9 });
      else window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <div ref={root} className="flex flex-col min-h-screen">
      {/* ============== 1. NAVBAR ============== */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <BrandMark href="/" />

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#servicios" className="hover:text-brand-600 transition-colors">servicios</a>
            <a href="#planes" className="hover:text-brand-600 transition-colors">planes</a>
            <a href="#integraciones" className="hover:text-brand-600 transition-colors">integraciones</a>
            <a href="#portal" className="hover:text-brand-600 transition-colors">portal</a>
            <a href="#contacto" className="hover:text-brand-600 transition-colors">contacto</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/portal"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors px-3 py-2"
            >
              <LogIn className="w-4 h-4" />
              acceso clientes
            </Link>
            <a
              href="#contacto"
              className="btn-glow inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2 px-3.5 sm:py-2.5 sm:px-5 rounded-full whitespace-nowrap"
            >
              <span className="sm:hidden">agenda</span>
              <span className="hidden sm:inline">agenda asesoría</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* ============== 2. HERO (tipográfico, un solo concepto) ============== */}
        <section className="hero-section relative overflow-hidden bg-[#faf9f7] dark:bg-slate-950">
          <div className="absolute inset-0 -z-10 grid-bg" aria-hidden />
          <div className="absolute right-[-10%] top-[-5%] -z-10 h-[620px] w-[60%] glow-brand" aria-hidden />

          {/* Visual del portal: el "objeto héroe" que sangra por el borde derecho */}
          <div
            aria-hidden
            className="hidden lg:block absolute right-[-22%] xl:right-[-14%] top-[57%] -translate-y-1/2 w-[54vw] max-w-[860px] z-0"
          >
            <div className="hero-visual-inner relative rotate-[5deg]">
              <div className="rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-2xl bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2 px-4 h-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs font-mono text-slate-400 truncate">portal.contabilidadconmaria.cl</span>
                </div>
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/portal/03-metricas.png"
                    alt=""
                    fill
                    priority
                    sizes="60vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>

              {/* Chips flotantes anclados al visual */}
              <div className="hero-chip absolute -left-10 top-10 -rotate-2">
                <div className="animate-float glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">F29 declarado</p>
                    <p className="text-xs text-slate-500">período al día</p>
                  </div>
                </div>
              </div>
              <div className="hero-chip absolute -left-16 bottom-14 rotate-2">
                <div
                  className="animate-float glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
                  style={{ animationDuration: "7.5s", animationDelay: "0.8s" }}
                >
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">+18% margen</p>
                    <p className="text-xs text-slate-500">vs. año anterior</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100dvh-4rem)] flex flex-col justify-center pt-12 pb-24 lg:pb-28">
            <p className="hero-eyebrow text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400 mb-6 lg:mb-8">
              contabilidad · impuestos · remuneraciones
            </p>

            <h1 className="hero-par relative font-display font-semibold tracking-tight text-slate-900 dark:text-white leading-[0.98] text-[clamp(2.5rem,9.5vw,8.25rem)]">
              {/* Cada línea emerge de su propia máscara */}
              <span className="block overflow-hidden">
                <span className="hero-line block">tu contabilidad</span>
              </span>
              <span className="block overflow-hidden pb-[0.18em] -mb-[0.12em]">
                <span className="hero-line block">
                  <span
                    className="hero-band underline-gold"
                    style={{
                      backgroundImage:
                        "linear-gradient(transparent 58%, rgba(201, 166, 117, 0.4) 58%, rgba(201, 166, 117, 0.4) 86%, transparent 86%)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                    }}
                  >
                    en orden.
                  </span>
                  <span className="inline-block -rotate-3 ml-4 sm:ml-6 align-baseline">
                    <span
                      className="hero-script inline-block font-script font-normal text-accent-500 text-[0.36em] leading-none relative top-[-0.4em]"
                      aria-label="con María"
                    >
                      con María
                    </span>
                  </span>
                </span>
              </span>
            </h1>

            {/* Lead mínimo + un solo CTA (escaso, estilo Sofi) */}
            <p className="hero-sub mt-8 lg:mt-10 max-w-sm text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              contabilidad, remuneraciones y asesoría tributaria para pymes — con un
              portal donde descargas todo al instante.
            </p>
            <div className="hero-sub mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#contacto"
                className="btn-glow inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-base font-semibold py-3.5 px-7 rounded-full"
              >
                <CalendarCheck className="w-5 h-5" />
                agenda una asesoría
              </a>
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white py-3.5 px-2 group"
              >
                conoce el portal
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============== 2b. CIFRAS (banda fina con contadores) ============== */}
        <section className="bg-white dark:bg-slate-950 border-y border-slate-200/70 dark:border-slate-800">
          <div
            data-reveal
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm"
          >
            {[
              { v: 50, prefix: "+", l: "pymes asesoradas" },
              { v: 15, l: "años de experiencia" },
              { v: 100, suffix: "%", l: "al día con el SII" },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-10">
                {i > 0 && <span className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />}
                <div>
                  <span
                    className="stat-num font-display text-2xl font-semibold text-slate-900 dark:text-white tabular-nums"
                    data-value={s.v}
                    data-prefix={s.prefix ?? ""}
                    data-suffix={s.suffix ?? ""}
                  >
                    {`${s.prefix ?? ""}${s.v}${s.suffix ?? ""}`}
                  </span>
                  <span className="ml-2 text-slate-500 dark:text-slate-400">{s.l}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============== 3. SOCIAL PROOF (escena de palabra gigante + marquesina) ============== */}
        <section className="giant-word-band relative min-h-[60vh] lg:min-h-[82vh] flex flex-col justify-center py-24 bg-white dark:bg-slate-950 overflow-hidden">
          {/* Palabra gigante: cruza la escena con el scroll (como "natural magic") */}
          <span
            aria-hidden
            className="giant-word absolute top-1/2 -translate-y-1/2 left-[-8%] whitespace-nowrap font-display font-bold tracking-tight leading-none text-[34vw] text-stroke-brand select-none pointer-events-none"
          >
            confianza
          </span>

          <p className="relative text-sm font-medium tracking-wide text-slate-400 mb-14 lg:mb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            ( empresas que confían su contabilidad a María )
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

        {/* ============== 3b. PORTAL — escena anclada (el scroll recorre las vistas) ============== */}
        <section className="bg-[#faf9f7] dark:bg-slate-950">
          <div className="portal-pin lg:min-h-[100svh] flex items-center py-20 lg:pt-24 lg:pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {/* Header compacto para caber en la escena anclada */}
              <div data-reveal className="grid lg:grid-cols-12 gap-4 lg:gap-8 items-end mb-8">
                <div className="lg:col-span-8">
                  <span className="block text-sm font-medium tracking-wide text-accent-600 mb-3">( el portal )</span>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.04] text-slate-900 dark:text-white text-balance">
                    conoce el portal por dentro
                  </h2>
                </div>
                <p className="lg:col-span-4 text-base text-slate-600 dark:text-slate-400 max-w-md lg:justify-self-end lg:pb-1">
                  Tu información ordenada y disponible cuando la necesites. Sigue scrolleando: el recorrido pasa por cada vista.
                </p>
              </div>

              {/* Escena: descripción lateral | mockup central | pestañas mínimas */}
              <div data-reveal className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Descripción de la vista activa (columna lateral izquierda) */}
                <p
                  key={portalTab}
                  className="portal-desc order-2 lg:order-1 lg:col-span-3 text-slate-600 dark:text-slate-400 text-center lg:text-left text-base leading-relaxed"
                >
                  {portalTabs[portalTab].desc}
                </p>

                {/* Marco de navegador con la vista activa */}
                <div className="order-1 lg:order-2 lg:col-span-6 w-full rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-2xl bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-2 px-4 h-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs font-mono text-slate-400 truncate">portal.contabilidadconmaria.cl</span>
                  </div>
                  <div className="relative aspect-[16/10]">
                    {portalTabs.map((t, i) => (
                      <Image
                        key={t.src}
                        src={t.src}
                        alt={t.label}
                        fill
                        sizes="(max-width: 1024px) 100vw, 640px"
                        className={`object-cover object-top transition-all duration-700 ease-out ${
                          portalTab === i ? "opacity-100 scale-100" : "opacity-0 scale-[1.05] pointer-events-none"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Pestañas mínimas numeradas (columna lateral derecha) */}
                <div className="order-3 lg:col-span-3 flex flex-wrap justify-center lg:flex-col gap-4 lg:gap-6 lg:pl-6">
                  {portalTabs.map((t, i) => (
                    <button
                      key={t.label}
                      onClick={() => goTab(i)}
                      aria-pressed={portalTab === i}
                      className={`group flex items-center gap-3 text-left text-sm font-semibold tracking-wide transition-colors ${
                        portalTab === i
                          ? "text-brand-700 dark:text-brand-300"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      <span
                        className={`font-mono text-xs transition-colors ${
                          portalTab === i ? "text-accent-600" : "text-slate-300 dark:text-slate-700"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      {t.label.toLowerCase()}
                      <span
                        className={`hidden lg:block h-px transition-all duration-500 ${
                          portalTab === i ? "w-10 bg-accent-500" : "w-4 bg-slate-200 dark:bg-slate-800"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 4. BENTO GRID — SERVICIOS ============== */}
        <section id="servicios" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              tag="servicios"
              title="todo tu back-office contable, resuelto"
              lead="Nos hacemos cargo de los números para que tú te enfoques en crecer."
            />

            <div data-reveal-group className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* A — Contabilidad mensual (span 2) con gráfico de 12 meses */}
              <article className="card-lift md:col-span-2 glass-card rounded-2xl p-7 flex flex-col">
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
              <article className="card-lift glass-card rounded-2xl p-7 flex flex-col">
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
              <article className="card-lift glass-card rounded-2xl p-7 flex flex-col">
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
              <article id="portal" className="card-lift md:col-span-2 glass-card rounded-2xl p-7 flex flex-col sm:flex-row gap-6 items-center">
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
        <section id="integraciones" className="py-24 lg:py-32 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              tag="integraciones"
              title="conectada con todo el ecosistema tributario"
              lead="Sincronizamos tu información con las instituciones que importan, y la dejamos lista en tu portal."
            />

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

        {/* ============== 5b. PLANES MENSUALES ============== */}
        <section id="planes" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              tag="planes mensuales"
              title="un plan para cada etapa de tu empresa"
              lead="Más que contabilidad, información clara para tomar mejores decisiones y pagar lo justo en impuestos."
            />

            <div data-reveal-group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {planes.map((p) => (
                <article
                  key={p.num}
                  className={`card-lift glass-card rounded-2xl p-6 flex flex-col relative ${
                    p.popular ? "ring-2 ring-accent-500 shadow-lg" : ""
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      <Sparkles className="w-3.5 h-3.5" /> Recomendado
                    </span>
                  )}

                  {/* Cabecera: numeral editorial en vez de icono genérico */}
                  <span className="font-display text-3xl font-bold text-accent-500/90">{p.num}</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {p.nombre}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{p.tagline}</p>

                  {/* Precio */}
                  <div className="my-5">
                    {p.custom ? (
                      <>
                        <span className="font-display text-3xl font-bold text-slate-900 dark:text-white">Cotización</span>
                        <p className="text-sm font-medium text-accent-600 mt-1">personalizada, a la medida</p>
                      </>
                    ) : (
                      <>
                        <span className="font-display text-4xl font-bold text-slate-900 dark:text-white">{p.precio}</span>
                        <span className="text-sm font-medium text-slate-500"> + IVA</span>
                        <p className="text-xs text-slate-400 mt-0.5">al mes</p>
                      </>
                    )}
                  </div>

                  {/* Incluye */}
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Incluye</p>
                  <ul className="space-y-2.5">
                    {p.incluye.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" strokeWidth={3} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pie: ideal + CTA */}
                  <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Ideal para: </span>
                      {p.ideal}
                    </p>
                    <a
                      href="#contacto"
                      className={`inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors ${
                        p.popular
                          ? "btn-glow bg-brand-600 hover:bg-brand-700 text-white"
                          : "border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                      }`}
                    >
                      {p.custom ? "Solicitar cotización" : "Contratar plan"}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Servicio adicional: Declaración Anual de Renta (sobrio y legible) */}
            <div data-reveal className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-7 md:p-9">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  Declaración Anual de Renta
                </h3>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-500 bg-accent-500/10 px-2.5 py-1 rounded-full">
                  Servicio adicional
                </span>
                <span className="md:ml-auto text-sm font-semibold text-brand-700 dark:text-brand-300">
                  desde $150.000 + IVA
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
                El precio final depende del volumen y la complejidad de la información a procesar. Su valor se
                determina según factores como:
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {factoresRenta.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <p data-reveal className="mt-8 text-center text-xs text-slate-400 max-w-2xl mx-auto">
              Valores referenciales sujetos a evaluación según cantidad de movimientos, trabajadores y complejidad operativa.
            </p>
          </div>
        </section>

        {/* ============== 6. CTA FINAL (cierre navy, tipográfico) ============== */}
        <section className="cta-final relative overflow-hidden bg-brand-900 pt-24 pb-24 lg:pt-36 lg:pb-32">
          <div className="absolute top-[-30%] right-[-10%] w-[42rem] h-[42rem] glow-accent" aria-hidden />
          <span
            aria-hidden
            className="cta-script absolute bottom-[-0.25em] right-[-2%] font-script text-accent-500/10 text-[18vw] leading-none whitespace-nowrap select-none pointer-events-none"
          >
            con María
          </span>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span data-reveal className="block text-sm font-medium tracking-wide text-accent-400 mb-5">
              ( conversemos )
            </span>
            <h2
              data-reveal
              className="font-display font-semibold tracking-tight text-white leading-[0.98] text-[clamp(2.9rem,8.5vw,7.5rem)] text-balance"
            >
              hablemos de
              <br />
              tus números.
            </h2>
            <p data-reveal className="mt-7 max-w-md text-lg text-brand-100/90">
              Agenda una asesoría sin costo y empieza a ver tu contabilidad clara,
              ordenada y siempre disponible.
            </p>
            <div data-reveal className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contacto"
                className="btn-glow inline-flex items-center gap-2 bg-white text-brand-700 text-base font-semibold py-3.5 px-7 rounded-full"
              >
                <CalendarCheck className="w-5 h-5" />
                agenda tu asesoría
              </a>
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 border border-white/25 text-white text-base font-semibold py-3.5 px-7 rounded-full hover:bg-white/10 transition-colors"
              >
                ver el portal <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ============== FOOTER ============== */}
      <footer id="contacto" className="bg-brand-900 text-slate-300 pt-16 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <BrandMark light />
            <p className="text-sm text-slate-400 max-w-xs mt-4">
              Soluciones contables, tributarias y laborales para empresas que buscan crecer de manera ordenada.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">servicios</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#servicios" className="hover:text-white transition-colors">Contabilidad mensual</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Impuestos (F29, F22)</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Remuneraciones</a></li>
              <li><a href="#integraciones" className="hover:text-white transition-colors">Integraciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">recursos</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/portal" className="hover:text-white transition-colors">Portal de clientes</Link></li>
              <li><a href="#portal" className="hover:text-white transition-colors">¿Cómo funciona?</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">contacto</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="break-words">Oficina Central, Ciudad</span>
              </li>
              <li className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="break-all">contabilidad@mmellado.com</span>
              </li>
              <li className="flex items-center gap-2 min-w-0">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="break-words">+56 9 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 pb-6 lg:pb-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 Contabilidad con María. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            Todos los sistemas operativos
          </p>
        </div>
      </footer>

      {/* ============== PESTAÑA LATERAL FIJA (acceso al portal) ============== */}
      <Link
        href="/portal"
        className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 items-center gap-1.5 bg-brand-900 hover:bg-brand-700 text-white text-xs font-semibold tracking-[0.14em] px-2.5 py-5 rounded-l-2xl shadow-lg transition-colors [writing-mode:vertical-rl] rotate-180"
      >
        acceso clientes
      </Link>

      {/* ============== MARCO FIJO INFERIOR (progreso de scroll) ============== */}
      <div
        aria-hidden
        className="hidden lg:flex fixed bottom-0 inset-x-0 z-40 h-11 px-6 items-center justify-between text-[11px] font-medium tracking-wider pointer-events-none mix-blend-difference text-white/75"
      >
        <span>contabilidad — impuestos — remuneraciones</span>
        <span className="flex items-center gap-3">
          scroll
          <span className="relative block h-px w-28 bg-white/30 overflow-hidden">
            <span ref={lineRef} className="absolute inset-0 origin-left scale-x-0 bg-white" />
          </span>
          <span ref={pctRef} className="tabular-nums w-9 text-right">
            0%
          </span>
        </span>
      </div>
    </div>
  );
}
