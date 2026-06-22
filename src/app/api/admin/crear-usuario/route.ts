import { NextResponse } from "next/server";
import { getUsuarioConPerfil } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/crear-usuario
 * Crea un usuario de auth (cliente o admin). Solo accesible por un admin autenticado.
 * Body: { email, password, nombre, rol: 'cliente'|'admin', cliente_id?: string }
 */
export async function POST(request: Request) {
  // 1) Verificar que quien llama es admin
  const usuario = await getUsuarioConPerfil();
  if (!usuario || usuario.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  // 2) Validar entrada
  let body: { email?: string; password?: string; nombre?: string; rol?: string; cliente_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { email, password, nombre, rol, cliente_id } = body;
  if (!email || !password || !rol) {
    return NextResponse.json({ error: "Faltan campos obligatorios (email, password, rol)." }, { status: 400 });
  }
  if (rol !== "cliente" && rol !== "admin") {
    return NextResponse.json({ error: "Rol inválido." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
  }
  if (rol === "cliente" && !cliente_id) {
    return NextResponse.json({ error: "Un cliente debe tener una empresa asignada." }, { status: 400 });
  }

  // 3) Crear el usuario (el trigger handle_new_user crea su perfil desde la metadata)
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // sin paso de confirmación por correo
    user_metadata: {
      rol,
      nombre: nombre || email,
      cliente_id: rol === "cliente" ? cliente_id : null,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, userId: data.user?.id });
}
