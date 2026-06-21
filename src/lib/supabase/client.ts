import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para componentes de cliente ("use client").
 * Usa las claves públicas (anon) — seguras de exponer en el navegador
 * porque la seguridad real la impone Row Level Security en la base de datos.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
