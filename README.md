# Portal Contable — Contabilidad con María

Sitio público (landing) + portal de clientes/admin para un estudio contable chileno.
Next.js con backend real (Supabase), desplegado en Vercel.

## Estado actual (2026-07-03)

- **En producción:** https://portal-contable-maria.vercel.app (auto-deploy desde `main`).
- **Dominio propio en curso:** `conmaria.cl` — comprar en [nic.cl](https://nic.cl) y apuntar
  nameservers a Vercel (`ns1.vercel-dns.com` / `ns2.vercel-dns.com`). Ver detalle más abajo.
- **SEO:** la landing es indexable (`robots.ts` permite `/` y bloquea `/portal` y `/api`).
- **Auth y datos:** 100% Supabase (Postgres + Auth + Storage + RLS). No queda nada en `localStorage`.
- **Contacto:** botones de agenda abren la página de reservas de Google Calendar; WhatsApp
  con mensaje prellenado en el footer y en los CTA de planes.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first, `src/app/globals.css`)
- Supabase: Postgres + Auth + Storage, con RLS y funciones `SECURITY DEFINER`
  (`es_admin()`, `mi_cliente_id()`) para evitar recursión de políticas
- GSAP 3 + ScrollTrigger + Lenis (scroll con inercia) en la landing
- Lucide Icons

## Estructura

```
src/app/
  page.tsx                 → landing pública
  robots.ts                → robots.txt dinámico (permite "/", bloquea /portal y /api)
  portal/
    page.tsx               → login + recuperación de clave
    actualizar-clave/      → reset de contraseña
    dashboard/             → panel del cliente (documentos, métricas, KPIs, eventos)
    admin/                 → panel de María (clientes, documentos, métricas, eventos)
  api/admin/                → rutas protegidas con service_role (crear usuario, eliminar empresa)
src/lib/supabase/           → clientes Supabase (browser/server) + helpers de sesión
src/proxy.ts                 → protección de rutas por rol (Next 16 renombró middleware → proxy)
supabase/migrations/         → SQL versionado (tablas, RLS, índices, columnas de KPIs/eventos)
```

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local   # completar con las claves del proyecto Supabase
npm run dev
```

Variables de entorno (`.env.local`, ver `.env.local.example`):

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (segura de exponer; RLS impone la seguridad real) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta — solo servidor, usada en `/api/admin/*` |

## Base de datos

Migraciones en `supabase/migrations/`, aplicadas en orden contra el proyecto Supabase real
(vía SQL Editor o Management API):

- `0001_init.sql` — tablas `clientes`/`perfiles`/`documentos`/`metricas_mensuales`, RLS, trigger
  `handle_new_user`, bucket de Storage `documentos`.
- `0002_kpis_eventos.sql` — columnas de PPM y contratos (vigentes/finiquitos/nuevos) en
  `metricas_mensuales`; tabla `eventos` con RLS para el calendario de recordatorios.
- `0003_indices.sql` — índices en `documentos` (`cliente_id`, `created_at`) para listados rápidos.

## Despliegue

- **Vercel**, proyecto `portal-contable-maria` (team `tamp1`), root directory
  `contabilidad-maria/portal-contable`, auto-deploy en cada push a `main` del repo
  `juangmelladojara-svg/portal-contable-maria`.
- Las 3 variables de entorno de Supabase están configuradas en Vercel (Production).
- En Supabase → **Authentication → URL Configuration**, la `Site URL` y la `Redirect URLs`
  apuntan a la URL de Vercel; hay que agregar el dominio propio ahí también cuando esté activo.

### Conectar el dominio `conmaria.cl` (pendiente)

1. Comprarlo en [nic.cl](https://nic.cl) (más barato que comprarlo directo en Vercel).
2. En Vercel → proyecto → **Settings → Domains → Add** → `conmaria.cl`.
3. En el panel de NIC Chile, cambiar los nameservers del dominio a `ns1.vercel-dns.com` /
   `ns2.vercel-dns.com`.
4. Esperar propagación y confirmar en Vercel que queda "Valid Configuration".
5. Agregar `https://conmaria.cl/**` a la `Redirect URLs` de Supabase Auth.

## Pendientes conocidos (no bloqueantes)

- **Email transaccional:** Supabase usa su SMTP por defecto (límite ~2 correos/hora), no apto
  para producción real. Configurar un SMTP propio (Resend/Brevo) en
  Authentication → Emails cuando el volumen de clientes lo requiera.
- **Auditoría de seguridad pendiente de aplicar:** ver hallazgos de la última auditoría del
  panel admin (validación de RUT al editar empresa, confirmación antes de guardar ediciones,
  revocar EXECUTE público sobre las funciones `SECURITY DEFINER`).
- **Contenido de footer/placeholder:** confirmar que el copy de servicios y planes sigue
  reflejando la oferta real antes de la indexación pública.
