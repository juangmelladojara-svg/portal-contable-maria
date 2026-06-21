import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión de Supabase y protege las rutas del portal.
 * - Sin sesión + ruta protegida (/portal/dashboard, /portal/admin) → redirige a /portal.
 * - Con sesión + página de login (/portal) → redirige al panel según rol.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: getUser() revalida el token contra Supabase (no confiar solo en la cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const esRutaProtegida =
    pathname.startsWith("/portal/dashboard") || pathname.startsWith("/portal/admin");
  const esLogin = pathname === "/portal" || pathname === "/portal/";

  // No autenticado intentando entrar a un panel → al login
  if (!user && esRutaProtegida) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    return NextResponse.redirect(url);
  }

  // Ya autenticado y parado en el login → mandarlo a su panel
  if (user && esLogin) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = perfil?.rol === "admin" ? "/portal/admin" : "/portal/dashboard";
    return NextResponse.redirect(url);
  }

  // Un cliente intentando entrar al panel de admin → a su dashboard
  if (user && pathname.startsWith("/portal/admin")) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (perfil?.rol !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/portal/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
