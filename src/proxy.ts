import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: el antiguo "middleware" se llama ahora "proxy" (mismo comportamiento).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica a todo salvo archivos estáticos e imágenes:
     * - _next/static, _next/image, favicon, y assets comunes.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
