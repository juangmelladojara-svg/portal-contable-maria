import { NEGOCIO, SITE_URL, faqs } from "@/lib/site";
import { planes, factoresRenta } from "@/lib/planes";

/**
 * /llms.txt — resumen del sitio en Markdown plano, pensado para que un modelo
 * de lenguaje entienda el negocio sin tener que interpretar el HTML animado.
 *
 * Es una convención emergente (llmstxt.org), todavía no un estándar que todos
 * respeten: no reemplaza al JSON-LD ni al contenido real de la página, pero
 * cuesta poco y algunos rastreadores ya lo leen.
 *
 * Se genera desde src/lib/site.ts y src/lib/planes.ts, así que nunca queda
 * desactualizado respecto de lo que dice la web.
 */

export const dynamic = "force-static";

export function GET() {
  const lineas: string[] = [
    `# ${NEGOCIO.nombre}`,
    "",
    `> ${NEGOCIO.descripcion}`,
    "",
    "## Datos de contacto",
    "",
    `- Sitio web: ${SITE_URL}`,
    `- Correo: ${NEGOCIO.email}`,
    "- WhatsApp: +56 9 5850 8710",
    `- Agendar asesoría sin costo: ${NEGOCIO.agenda}`,
    "- Zona de atención: Chile (servicio remoto, con portal de clientes en línea)",
    "",
    "## Servicios",
    "",
    "- Contabilidad mensual para pymes.",
    "- Impuestos: Formulario 29 mensual y Formulario 22 anual.",
    "- Remuneraciones: liquidaciones, finiquitos, Previred, certificados F30 y F30-1.",
    "- Asesoría tributaria y revisión preventiva.",
    "- Portal del Cliente: dashboard de indicadores, libros contables, balance general e informes, disponible 24/7.",
    "",
    "## Planes mensuales",
    "",
  ];

  for (const plan of planes) {
    lineas.push(
      `### ${plan.nombre} — ${plan.precio}${plan.custom ? "" : " mensuales"}`,
      "",
      `${plan.tagline}`,
      "",
      `Ideal para: ${plan.ideal}`,
      "",
      "Incluye:",
      ...plan.incluye.map((item) => `- ${item}`),
      "",
    );
  }

  lineas.push(
    "Los valores son referenciales y se ajustan según cantidad de movimientos, trabajadores y complejidad operativa.",
    "",
    "## Declaración Anual de Renta (servicio adicional)",
    "",
    "No está incluida en el plan mensual. Parte desde $150.000 + IVA y su valor final depende de:",
    ...factoresRenta.map((factor) => `- ${factor}`),
    "",
    "## Preguntas frecuentes",
    "",
  );

  for (const faq of faqs) {
    lineas.push(`### ${faq.pregunta}`, "", faq.respuesta, "");
  }

  return new Response(lineas.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
