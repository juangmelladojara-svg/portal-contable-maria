import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Rastreadores de motores de respuesta.
 *
 * Para que ChatGPT, Claude, Perplexity o Google AI Overviews puedan *citar* el
 * sitio, primero tienen que poder leerlo. Van explícitos (y no solo bajo "*")
 * porque algunos equipos los bloquean por defecto y conviene que la decisión
 * quede escrita.
 *
 * Los de "búsqueda" (OAI-SearchBot, Claude-SearchBot, PerplexityBot) alimentan
 * el índice que se cita en las respuestas. Los de "lectura en vivo"
 * (ChatGPT-User, Claude-User, Perplexity-User) entran cuando un usuario pregunta
 * por el sitio en ese momento.
 *
 * GPTBot y CCBot además se usan para entrenamiento de modelos: si María prefiere
 * no aportar a eso, basta con sacarlos de esta lista (el resto sigue citando).
 */
const RASTREADORES_IA = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const privado = ["/portal", "/api"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privado },
      ...RASTREADORES_IA.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: privado,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
