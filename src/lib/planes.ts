// Datos de planes y servicios — fuente única de verdad.
// Los consumen la landing (src/app/page.tsx) y el JSON-LD de AEO (src/lib/site.ts),
// para que el precio publicado y el que leen los buscadores nunca se desincronicen.

// Planes mensuales
export interface Plan {
  num: string;
  nombre: string;
  tagline: string;
  precio: string;
  custom: boolean;
  incluye: string[];
  ideal: string;
  popular: boolean;
}

export const planes: Plan[] = [
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
export const factoresRenta = [
  "Cantidad de Declaraciones Juradas a presentar.",
  "Preparación y presentación del Formulario 22.",
  "Participación de socios y declaraciones asociadas.",
  "Registros empresariales tributarios (RAI, DDAN, REX, SAC, entre otros, cuando corresponda).",
  "Rectificaciones o regularizaciones.",
  "Revisión y análisis de la información tributaria del ejercicio.",
];
