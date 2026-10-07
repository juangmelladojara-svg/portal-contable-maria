// ---------------------------------------------------------------------------
// AEO (Answer Engine Optimization) — fuente única de verdad del negocio.
//
// Todo lo que leen los motores de respuesta (ChatGPT, Perplexity, Claude,
// Google AI Overviews) sale de aquí: metadatos, JSON-LD y /llms.txt.
// Si cambia un dato del negocio, se cambia acá y se propaga solo.
// ---------------------------------------------------------------------------

import { planes } from "./planes";

/**
 * URL pública del sitio.
 *
 * Es `www` a propósito: `conmaria.cl` responde 308 hacia `www.conmaria.cl`, así que
 * ese es el host oficial. El canonical tiene que apuntar al destino final del
 * redirect, no al de origen, o Google ve dos versiones del mismo sitio.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.conmaria.cl";

export const NEGOCIO = {
  nombre: "Contabilidad con María",
  descripcion:
    "Estudio contable chileno para pymes: contabilidad mensual, impuestos (F29 y F22), remuneraciones y asesoría tributaria, con un portal de clientes disponible 24/7.",
  email: "contabilidad@mmellado.com",
  telefono: "+56958508710",
  whatsapp: "https://wa.me/56958508710",
  agenda:
    "https://calendar.google.com/appointments/schedules/AcZssZ1OAvlHnKVw41rl46K5nqQbYYST0bDE-B7EWfujRJXAic402JfhC0ahv7ZPPnny9RP3XLMYfQxA",
  // TODO(María): para búsquedas locales ("contador en <ciudad>"), completar
  // ciudad/región y agregar el perfil de Google Business en `sameAs`.
  ciudad: "",
  region: "",
  pais: "CL",
  idioma: "es-CL",
  moneda: "CLP",
  rangoPrecios: "$$",
  // Perfiles oficiales (LinkedIn, Instagram, Google Business). Refuerzan la
  // identidad de la entidad frente a los motores de respuesta.
  sameAs: [] as string[],
};

/** "$65.000" → 65000 | null (los planes "Cotización" no llevan precio en el schema). */
function precioNumerico(precio: string): number | null {
  const soloDigitos = precio.replace(/[^\d]/g, "");
  return soloDigitos ? Number(soloDigitos) : null;
}

// ---------------------------------------------------------------------------
// Preguntas frecuentes
//
// El formato pregunta → respuesta corta y autocontenida es lo que los motores
// de respuesta citan textualmente. Cada respuesta tiene que poder leerse sola,
// sin el resto de la página.
// ---------------------------------------------------------------------------
export const faqs: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Cuánto cuesta la contabilidad mensual para una pyme?",
    respuesta:
      "Los planes mensuales de Contabilidad con María parten en $65.000 (Inicio Pyme, para empresas sin trabajadores), $120.000 (Pyme Gestión, 1 a 3 trabajadores) y $180.000 (Pyme Pro, 4 a 7 trabajadores). Las empresas con más de 7 trabajadores, varias sucursales o alto volumen de documentos se cotizan a medida. Son valores referenciales: el precio final se ajusta según cantidad de movimientos, trabajadores y complejidad operativa.",
  },
  {
    pregunta: "¿Qué incluye el servicio de contabilidad mensual?",
    respuesta:
      "Todos los planes incluyen acceso al Portal del Cliente, un dashboard financiero con indicadores (KPIs), la gestión mensual del Formulario 29 y soporte por WhatsApp en horario de atención. Desde el plan Pyme Gestión se suman la gestión de compras y ventas, recursos humanos, Previred y los certificados F30 y F30-1. El plan Pyme Pro agrega análisis de KPIs, informe gerencial semestral, revisión tributaria preventiva y planificación de la Operación Renta.",
  },
  {
    pregunta: "¿Qué plan conviene según el tamaño de la empresa?",
    respuesta:
      "Inicio Pyme está pensado para profesionales, emprendedores y empresas sin trabajadores. Pyme Gestión, para empresas con 1 a 3 trabajadores. Pyme Pro, para empresas con 4 a 7 trabajadores que además quieren usar sus números para tomar decisiones. El plan Empresas · Corporativo es para empresas con más de 7 trabajadores, múltiples sucursales o alto volumen de documentos.",
  },
  {
    pregunta: "¿La Declaración Anual de Renta está incluida en la mensualidad?",
    respuesta:
      "No. La Declaración Anual de Renta es un servicio adicional que no está incluido en el plan mensual y parte desde $150.000 + IVA. Su valor final depende de la cantidad de Declaraciones Juradas, la preparación del Formulario 22, la participación de socios, los registros empresariales tributarios (RAI, DDAN, REX, SAC), las rectificaciones y la revisión de la información tributaria del ejercicio.",
  },
  {
    pregunta: "¿Qué es el Portal de Clientes y qué se puede ver ahí?",
    respuesta:
      "Es un portal privado, disponible 24/7, donde cada cliente encuentra su información contable ya procesada: dashboard con indicadores financieros, impuestos (F29 y Formulario 22), ingresos y egresos, balance general, libros contables y documentos de remuneraciones. Se actualiza mensualmente, así que no hay que pedir los documentos por correo ni esperar respuesta.",
  },
  {
    pregunta: "¿Qué trámites tributarios y laborales cubre el servicio?",
    respuesta:
      "En lo tributario: Formulario 29 mensual, Formulario 22, libros contables, balance general e informes de ingresos y egresos. En lo laboral: liquidaciones y documentos de remuneraciones, finiquitos, Previred y los certificados F30 y F30-1.",
  },
  {
    pregunta: "¿Se puede trabajar con Contabilidad con María de forma remota?",
    respuesta:
      "Sí. Toda la información queda disponible en el Portal del Cliente, accesible desde cualquier navegador las 24 horas, y la comunicación del día a día es por WhatsApp. Las reuniones de seguimiento se agendan en línea, así que no es necesario asistir presencialmente a una oficina.",
  },
  {
    pregunta: "¿Cómo se empieza a trabajar con Contabilidad con María?",
    respuesta:
      "Se agenda una asesoría inicial sin costo desde el sitio web o se escribe por WhatsApp al +56 9 5850 8710. En esa primera conversación se revisa la situación de la empresa, se define el plan que corresponde y se habilita el acceso al Portal del Cliente.",
  },
];

// ---------------------------------------------------------------------------
// JSON-LD (schema.org)
// ---------------------------------------------------------------------------

const ID_NEGOCIO = `${SITE_URL}/#negocio`;

/** La entidad: quién es, qué vende, a qué precio y cómo contactarla. */
export function negocioJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": ID_NEGOCIO,
    name: NEGOCIO.nombre,
    description: NEGOCIO.descripcion,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og.png`,
    email: NEGOCIO.email,
    telephone: NEGOCIO.telefono,
    priceRange: NEGOCIO.rangoPrecios,
    currenciesAccepted: NEGOCIO.moneda,
    areaServed: { "@type": "Country", name: "Chile" },
    availableLanguage: "es",
    ...(NEGOCIO.sameAs.length ? { sameAs: NEGOCIO.sameAs } : {}),
    ...(NEGOCIO.ciudad
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: NEGOCIO.ciudad,
            addressRegion: NEGOCIO.region,
            addressCountry: NEGOCIO.pais,
          },
        }
      : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: NEGOCIO.telefono,
        email: NEGOCIO.email,
        availableLanguage: ["es"],
        areaServed: "CL",
      },
    ],
    knowsAbout: [
      "Contabilidad para pymes",
      "Formulario 29",
      "Formulario 22",
      "Declaración Anual de Renta",
      "Remuneraciones y finiquitos",
      "Previred",
      "Certificados F30 y F30-1",
      "Asesoría tributaria",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Planes de contabilidad mensual",
      itemListElement: planes.map((plan) => {
        const valor = precioNumerico(plan.precio);
        return {
          "@type": "Offer",
          name: plan.nombre,
          description: `${plan.tagline} Ideal para: ${plan.ideal}`,
          category: "Contabilidad mensual",
          url: `${SITE_URL}/#planes`,
          availability: "https://schema.org/InStock",
          itemOffered: {
            "@type": "Service",
            name: `Plan ${plan.nombre}`,
            serviceType: "Servicios contables",
            provider: { "@id": ID_NEGOCIO },
            areaServed: { "@type": "Country", name: "Chile" },
            description: plan.incluye.join(" "),
          },
          ...(valor
            ? {
                priceCurrency: NEGOCIO.moneda,
                price: valor,
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: valor,
                  priceCurrency: NEGOCIO.moneda,
                  referenceQuantity: {
                    "@type": "QuantitativeValue",
                    value: 1,
                    unitCode: "MON",
                  },
                },
              }
            : {}),
        };
      }),
    },
  };
}

/** El sitio como obra: ayuda a que el nombre del sitio se muestre bien en resultados. */
export function sitioWebJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#sitio`,
    url: SITE_URL,
    name: NEGOCIO.nombre,
    inLanguage: NEGOCIO.idioma,
    publisher: { "@id": ID_NEGOCIO },
  };
}

/** Preguntas frecuentes: el formato que los motores de respuesta citan directo. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    inLanguage: NEGOCIO.idioma,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };
}
