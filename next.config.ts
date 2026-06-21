import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // App con servidor real (auth, API routes, Storage) — desplegada en Vercel.
  // Ya NO usamos `output: 'export'` ni `basePath`: eso era solo para la maqueta en GitHub Pages.
  images: {
    // Permitir servir imágenes desde el bucket público de Supabase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
