"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const SESSION_KEY = "ccm-intro-seen";

/**
 * Pantalla de bienvenida que se ve una sola vez por sesión de navegador:
 * fondo azul de marca, "con María" se revela como si se escribiera y luego
 * se desvanece dando paso al sitio.
 */
export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setShow(true);
  }, []);

  useLayoutEffect(() => {
    if (!show) return;
    const overlay = overlayRef.current;
    const text = textRef.current;
    if (!overlay || !text) return;

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setShow(false);
      },
    });

    tl.fromTo(
      text,
      { clipPath: "inset(0 100% 0 0)", filter: "blur(9px)", opacity: 0 },
      { clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", opacity: 1, duration: 1.5, ease: "power2.out" }
    )
      .to({}, { duration: 0.55 }) // pausa: deja el nombre respirar antes de irse
      .to(overlay, { opacity: 0, duration: 0.9, ease: "power2.inOut", pointerEvents: "none" }, "+=0");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!mounted || !show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900"
      aria-hidden
    >
      <span
        ref={textRef}
        className="font-script text-6xl sm:text-7xl md:text-8xl text-accent-400 select-none"
      >
        con María
      </span>
    </div>
  );
}
