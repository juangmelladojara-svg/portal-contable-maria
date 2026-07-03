import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // App con servidor real (auth, API routes, Storage) — desplegada en Vercel.
  // Ya NO usamos `output: 'export'` ni `basePath`: eso era solo para la maqueta en GitHub Pages.

  // Fijamos la raíz de Turbopack a esta carpeta para que SIEMPRE resuelva `next`
  // desde aquí (evita el error "Next.js package not found" y el bucle de recarga).
  turbopack: {
    root: path.resolve(process.cwd()),
  },

  images: {
    // Permitir servir imágenes desde el bucket público de Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
