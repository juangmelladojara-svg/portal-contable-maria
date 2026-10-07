import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap. Solo lleva lo público: el portal es privado y queda fuera.
 * Cuando se agreguen páginas (servicios, blog, casos), se suman acá.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
