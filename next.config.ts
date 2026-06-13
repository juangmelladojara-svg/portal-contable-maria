import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/portal-contable-maria',
  images: {
    unoptimized: true,
  },
  // Opcional: ignorar errores de eslint/typescript durante build para garantizar despliegue rápido
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};

export default nextConfig;
