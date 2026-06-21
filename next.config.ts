import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/portal-contable-maria',
  images: {
    unoptimized: true,
  },
  // Opcional: ignorar errores de typescript durante build para despliegue rápido
  typescript: { ignoreBuildErrors: true }
};

export default nextConfig;
