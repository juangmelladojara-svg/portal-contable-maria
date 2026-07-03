# Migración a Vercel + Supabase — Guía de pasos

> **Estado: Fases 1 y 2 completas y en producción** desde 2026-06-22.
> Este documento queda como registro histórico de los pasos ya ejecutados
> (útil si hay que rehacer el setup en otro proyecto Supabase). El estado
> actual del proyecto vive en [`README.md`](README.md).

Esta guía cubre **lo que TÚ debes hacer en los paneles** (yo ya dejé todo el código listo).
Sigue los bloques en orden. La Fase 1 deja el **login real funcionando**.

---

## ✅ Fase 1 — Auth real (código ya implementado)

Lo que ya quedó hecho en el repo:

- SDK de Supabase instalado (`@supabase/supabase-js`, `@supabase/ssr`).
- `next.config.ts` sin export estático (recupera servidor real).
- Migración SQL completa en [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
- Clientes Supabase + middleware de protección de rutas.
- Login, recuperación de contraseña y panel admin/cliente conectados a auth real.

---

### Paso 1 — Crear el proyecto Supabase

1. Entra a <https://supabase.com> → **Sign in** (puedes usar GitHub).
2. **New project**:
   - **Name:** `portal-contabilidad-maria`
   - **Database Password:** genera una fuerte y **guárdala** (la necesitarás para administrar la BD).
   - **Region:** `East US (North Virginia)` (la más cercana/barata para Chile).
3. Espera ~2 min a que aprovisione.

### Paso 2 — Correr la migración SQL

1. En el proyecto: menú lateral → **SQL Editor** → **New query**.
2. Abre [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), **copia TODO** y pégalo.
3. **Run** (▶). Debe decir *Success*. Esto crea tablas, RLS, trigger y el bucket de Storage.

### Paso 3 — Copiar las claves al `.env.local`

1. Menú → **Project Settings** → **API**.
2. Copia estos valores y crea el archivo `.env.local` (basándote en `.env.local.example`):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (en "Project API keys", revélala) → `SUPABASE_SERVICE_ROLE_KEY`

### Paso 4 — Crear el usuario admin (María) y un cliente de prueba

**4a. Crear la empresa cliente** (SQL Editor → New query):

```sql
insert into public.clientes (razon_social, rut)
values ('Empresa Demo Spa', '76.123.456-7')
returning id;
```

Copia el `id` que devuelve (lo usarás abajo).

**4b. Crear el usuario admin** → menú **Authentication** → **Users** → **Add user** → **Create new user**:
- Email: el correo de María
- Password: una contraseña temporal
- ✅ Marca **Auto Confirm User**

Luego conviértelo en admin (SQL Editor, reemplaza el correo):

```sql
update public.perfiles
set rol = 'admin', nombre = 'María'
where id = (select id from auth.users where email = 'correo-de-maria@ejemplo.cl');
```

**4c. Crear un usuario cliente de prueba** → **Add user** (Auto Confirm), luego asígnale la empresa
(reemplaza el correo y pega el `id` del cliente del paso 4a):

```sql
update public.perfiles
set rol = 'cliente', nombre = 'Empresa Demo Spa', cliente_id = 'PEGA_AQUI_EL_ID_DEL_CLIENTE'
where id = (select id from auth.users where email = 'cliente-demo@ejemplo.cl');
```

### Paso 5 — Probar en local

```bash
npm run dev
```

- `http://localhost:3000/portal` → entra con el correo de María → debe llevarte a **/portal/admin**.
- Cierra sesión, entra con el cliente de prueba → debe llevarte a **/portal/dashboard**.
- Prueba "¿Olvidaste tu contraseña?" (el correo llega si configuras SMTP; en desarrollo
  Supabase trae un envío básico con límite diario).

---

## 🚀 Despliegue en Vercel (cuando Fase 1 funcione en local)

1. Sube el repo a GitHub (si no está).
2. <https://vercel.com> → **Sign in con GitHub** → **Add New → Project** → importa el repo.
3. **Root Directory:** selecciona `contabilidad-maria/portal-contable`.
4. En **Environment Variables** agrega las 3 del `.env.local`.
5. **Deploy**. Vercel te da una URL `https://...vercel.app`.
6. **Importante:** en Supabase → **Authentication** → **URL Configuration** →
   agrega tu URL de Vercel en **Site URL** y en **Redirect URLs**
   (`https://tu-app.vercel.app/portal/actualizar-clave`).

> ⚠️ El deploy de GitHub Pages quedó obsoleto: esta app ya necesita servidor.
> El workflow `.github/workflows/manual.yml` y sus artefactos (`out/`, `nextjs-workflow.txt`)
> se eliminaron del repo — ver [`README.md`](README.md) para el estado actual del despliegue.

---

## ✅ Fase 2 — completada (2026-06-22)

- Subida real de PDFs a Storage (panel admin) + descarga por cliente con URL firmada.
- Métricas financieras leídas y cargadas desde `metricas_mensuales`.
- ABM de clientes y alta de usuarios desde el panel admin, vía `/api/admin/*` con `service_role`.
- `robots: noindex` de `layout.tsx` eliminado (2026-07-03), reemplazado por `src/app/robots.ts`
  que permite indexar la landing y bloquea `/portal` y `/api`.

## ✅ Fase 3 — landing y contacto (2026-06-25 a 2026-07-03)

- Rediseño completo de la landing (hero cinematográfico, scroll con inercia vía Lenis,
  escena anclada del portal, prueba social con logos reales de clientes).
- Botones de "agenda una asesoría" → página de reservas de Google Calendar (no Calendly).
- Contacto por WhatsApp con mensaje prellenado (footer y CTAs de planes), email con `mailto:`.
- Auditoría del panel admin y de la sección de cierre de la landing, con fixes aplicados
  (ver historial de commits para el detalle).
- Dominio propio `conmaria.cl` en proceso de compra/conexión — ver `README.md`.
