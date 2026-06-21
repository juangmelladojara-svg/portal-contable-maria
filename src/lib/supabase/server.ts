import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Lee/escribe la sesión en las cookies de la petición.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Llamado desde un Server Component: lo maneja el middleware al refrescar.
          }
        },
      },
    }
  );
}

/**
 * Devuelve el usuario autenticado y su perfil (rol + cliente_id), o null.
 * Úsalo en layouts/páginas de servidor para proteger y personalizar.
 */
export async function getUsuarioConPerfil() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, nombre, cliente_id")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    nombre: perfil?.nombre ?? user.email ?? "",
    rol: (perfil?.rol ?? "cliente") as "admin" | "cliente",
    clienteId: perfil?.cliente_id ?? null,
  };
}
