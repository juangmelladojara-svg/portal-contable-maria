import { NextResponse } from "next/server";
import { getUsuarioConPerfil } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/eliminar-empresa
 * Elimina por completo una empresa cliente. Solo accesible por un admin autenticado.
 * Body: { cliente_id: string }
 *
 * Borra, en este orden:
 *   1. Los archivos reales del Storage en la carpeta documentos/{cliente_id}/.
 *   2. Los usuarios (auth.users) asociados a la empresa — al borrarlos cae su perfil.
 *   3. La fila de `clientes` → en cascada elimina sus `documentos` y `metricas_mensuales`.
 *
 * Es una acción irreversible.
 */
export async function POST(request: Request) {
  // 1) Verificar que quien llama es admin
  const usuario = await getUsuarioConPerfil();
  if (!usuario || usuario.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  // 2) Validar entrada
  let body: { cliente_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  const clienteId = body.cliente_id;
  if (!clienteId) {
    return NextResponse.json({ error: "Falta cliente_id." }, { status: 400 });
  }

  const admin = createAdminClient();

  // 3) Borrar los archivos del Storage de la carpeta de la empresa (paginado)
  let archivosBorrados = 0;
  for (let intento = 0; intento < 100; intento++) {
    const { data: archivos, error: listError } = await admin.storage
      .from("documentos")
      .list(clienteId, { limit: 100 });

    if (listError) {
      return NextResponse.json(
        { error: `No se pudieron listar los archivos: ${listError.message}` },
        { status: 500 }
      );
    }
    if (!archivos || archivos.length === 0) break;

    const rutas = archivos.map((a) => `${clienteId}/${a.name}`);
    const { error: removeError } = await admin.storage.from("documentos").remove(rutas);
    if (removeError) {
      return NextResponse.json(
        { error: `No se pudieron borrar los archivos: ${removeError.message}` },
        { status: 500 }
      );
    }
    archivosBorrados += rutas.length;
    if (archivos.length < 100) break; // última página
  }

  // 4) Borrar los usuarios (auth) de la empresa. Al borrar el auth.user cae su perfil (FK cascade).
  const { data: perfiles, error: perfilesError } = await admin
    .from("perfiles")
    .select("id")
    .eq("cliente_id", clienteId);

  if (perfilesError) {
    return NextResponse.json(
      { error: `No se pudieron leer los usuarios: ${perfilesError.message}` },
      { status: 500 }
    );
  }

  let usuariosBorrados = 0;
  for (const p of perfiles ?? []) {
    const { error: delUserError } = await admin.auth.admin.deleteUser(p.id);
    if (delUserError) {
      return NextResponse.json(
        { error: `No se pudo borrar un usuario de la empresa: ${delUserError.message}` },
        { status: 500 }
      );
    }
    usuariosBorrados++;
  }

  // 5) Borrar la empresa (cascada: documentos + metricas_mensuales)
  const { error: delClienteError } = await admin.from("clientes").delete().eq("id", clienteId);
  if (delClienteError) {
    return NextResponse.json(
      { error: `No se pudo eliminar la empresa: ${delClienteError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    archivosBorrados,
    usuariosBorrados,
  });
}
