import { ChevronDown } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { faqs, faqJsonLd } from "@/lib/site";

/**
 * Preguntas frecuentes.
 *
 * Es la pieza central del AEO: un motor de respuesta cita mucho mejor un bloque
 * "pregunta → respuesta completa" que un párrafo de marketing. Por eso cada
 * respuesta es autocontenida (menciona el nombre del negocio y los números) y
 * el texto va en el HTML, no detrás de JavaScript.
 *
 * Se usa <details> nativo: acordeón sin JS, accesible y legible por rastreadores.
 */
export default function FaqSection() {
  return (
    <section id="preguntas" className="py-24 lg:py-32 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal className="max-w-3xl mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700 dark:text-accent-500">
            preguntas frecuentes
          </span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.04] text-slate-900 dark:text-white text-balance">
            Lo que todos preguntan antes de empezar
          </h2>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
            Respuestas directas sobre precios, alcance del servicio y cómo funciona el portal.
          </p>
        </div>

        <div data-reveal className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {faqs.map((faq, i) => (
            <details key={faq.pregunta} open={i === 0} className="group py-5">
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {faq.pregunta}
                </h3>
                <ChevronDown
                  className="w-5 h-5 mt-1 flex-shrink-0 text-brand-500 transition-transform duration-300 group-open:rotate-180"
                  strokeWidth={2.5}
                  aria-hidden
                />
              </summary>
              <p className="mt-3 pr-11 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                {faq.respuesta}
              </p>
            </details>
          ))}
        </div>

        <p data-reveal className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          ¿Tu pregunta no está aquí?{" "}
          <a
            href="#contacto"
            className="font-semibold text-brand-600 dark:text-brand-300 hover:underline"
          >
            Escríbenos
          </a>{" "}
          y te respondemos.
        </p>
      </div>

      {/* Mismas preguntas y respuestas, en formato schema.org. */}
      <JsonLd data={faqJsonLd()} />
    </section>
  );
}
