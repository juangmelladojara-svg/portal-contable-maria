import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la clave SERVICE ROLE (privilegios totales, salta RLS).
 * ⚠️ SOLO usar en el servidor (Route Handlers / Server Actions). NUNCA en el navegador.
 * Se usa para operaciones de administración como crear usuarios de auth.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
