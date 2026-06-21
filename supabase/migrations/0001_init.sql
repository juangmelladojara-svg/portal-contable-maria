-- =============================================================================
-- Portal Contabilidad con María — Esquema inicial (Fase 1: auth + base)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → pegar → Run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLAS
-- -----------------------------------------------------------------------------

-- Empresas clientes de María
create table if not exists public.clientes (
  id            uuid primary key default gen_random_uuid(),
  razon_social  text not null,
  rut           text not null,
  created_at    timestamptz not null default now()
);

-- Perfil de cada usuario (extiende auth.users de Supabase)
-- rol: 'admin' (María) | 'cliente'
create table if not exists public.perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  cliente_id  uuid references public.clientes(id) on delete set null,
  rol         text not null default 'cliente' check (rol in ('admin', 'cliente')),
  nombre      text,
  created_at  timestamptz not null default now()
);

-- Documentos contables (reemplaza el localStorage `maria_portal_docs_v2`)
create table if not exists public.documentos (
  id            uuid primary key default gen_random_uuid(),
  cliente_id    uuid not null references public.clientes(id) on delete cascade,
  nombre        text not null,
  categoria     text not null,
  anio          text not null,
  mes           text not null,
  storage_path  text,              -- ruta del archivo real en Supabase Storage
  size_bytes    bigint default 0,
  created_at    timestamptz not null default now()
);

-- Métricas financieras mensuales (reemplaza el `financialData` hardcodeado)
create table if not exists public.metricas_mensuales (
  id             uuid primary key default gen_random_uuid(),
  cliente_id     uuid not null references public.clientes(id) on delete cascade,
  periodo        text not null,    -- formato 'YYYY-MM'
  ingresos       bigint not null default 0,
  gastos         bigint not null default 0,
  iva            bigint not null default 0,
  remuneraciones bigint not null default 0,
  created_at     timestamptz not null default now(),
  unique (cliente_id, periodo)
);

-- -----------------------------------------------------------------------------
-- 2. FUNCIONES AUXILIARES (SECURITY DEFINER evita recursión en las políticas RLS)
-- -----------------------------------------------------------------------------

create or replace function public.es_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

create or replace function public.mi_cliente_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select cliente_id from public.perfiles where id = auth.uid();
$$;

-- -----------------------------------------------------------------------------
-- 3. TRIGGER: crear perfil automáticamente al registrarse un usuario
--    El rol y cliente_id se pueden pasar en user_metadata al crear el usuario.
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, rol, nombre, cliente_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'rol', 'cliente'),
    coalesce(new.raw_user_meta_data->>'nombre', new.email),
    (new.raw_user_meta_data->>'cliente_id')::uuid
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
--    Regla: el admin ve/edita todo; un cliente solo ve SUS filas.
-- -----------------------------------------------------------------------------

alter table public.clientes            enable row level security;
alter table public.perfiles            enable row level security;
alter table public.documentos          enable row level security;
alter table public.metricas_mensuales  enable row level security;

-- PERFILES: cada uno lee su propio perfil; el admin lee todos
drop policy if exists perfiles_select on public.perfiles;
create policy perfiles_select on public.perfiles for select
  using (id = auth.uid() or public.es_admin());

drop policy if exists perfiles_admin_all on public.perfiles;
create policy perfiles_admin_all on public.perfiles for all
  using (public.es_admin()) with check (public.es_admin());

-- CLIENTES: el admin gestiona todo; un cliente ve solo su propia empresa
drop policy if exists clientes_select on public.clientes;
create policy clientes_select on public.clientes for select
  using (public.es_admin() or id = public.mi_cliente_id());

drop policy if exists clientes_admin_all on public.clientes;
create policy clientes_admin_all on public.clientes for all
  using (public.es_admin()) with check (public.es_admin());

-- DOCUMENTOS: el cliente ve solo los suyos; el admin gestiona todos
drop policy if exists documentos_select on public.documentos;
create policy documentos_select on public.documentos for select
  using (public.es_admin() or cliente_id = public.mi_cliente_id());

drop policy if exists documentos_admin_all on public.documentos;
create policy documentos_admin_all on public.documentos for all
  using (public.es_admin()) with check (public.es_admin());

-- MÉTRICAS: idéntico patrón
drop policy if exists metricas_select on public.metricas_mensuales;
create policy metricas_select on public.metricas_mensuales for select
  using (public.es_admin() or cliente_id = public.mi_cliente_id());

drop policy if exists metricas_admin_all on public.metricas_mensuales;
create policy metricas_admin_all on public.metricas_mensuales for all
  using (public.es_admin()) with check (public.es_admin());

-- -----------------------------------------------------------------------------
-- 5. STORAGE: bucket privado para los documentos contables
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

-- El admin sube/borra cualquier archivo
drop policy if exists storage_admin_all on storage.objects;
create policy storage_admin_all on storage.objects for all
  using (bucket_id = 'documentos' and public.es_admin())
  with check (bucket_id = 'documentos' and public.es_admin());

-- Un cliente solo descarga archivos dentro de la carpeta de SU cliente_id
-- (convención de ruta: documentos/{cliente_id}/{archivo})
drop policy if exists storage_cliente_select on storage.objects;
create policy storage_cliente_select on storage.objects for select
  using (
    bucket_id = 'documentos'
    and (storage.foldername(name))[1] = public.mi_cliente_id()::text
  );
