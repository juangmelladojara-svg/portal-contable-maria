-- =============================================================================
-- Portal Contabilidad con María — Migración 0002
--   1) Nuevos KPIs mensuales: PPM acumulado + contratos (vigentes/finiquitos/nuevos)
--   2) Tabla de eventos del calendario (cargados por el admin)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → pegar → Run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. NUEVAS COLUMNAS EN metricas_mensuales
-- -----------------------------------------------------------------------------
alter table public.metricas_mensuales
  add column if not exists ppm                      bigint  not null default 0,
  add column if not exists contratos_vigentes_cant  integer not null default 0,
  add column if not exists contratos_vigentes_total bigint  not null default 0,
  add column if not exists finiquitos_cant          integer not null default 0,
  add column if not exists finiquitos_total         bigint  not null default 0,
  add column if not exists nuevos_contratos_cant    integer not null default 0,
  add column if not exists nuevos_contratos_total   bigint  not null default 0;

-- -----------------------------------------------------------------------------
-- 2. TABLA DE EVENTOS (calendario del cliente, cargados por el admin)
-- -----------------------------------------------------------------------------
create table if not exists public.eventos (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references public.clientes(id) on delete cascade,
  fecha       date not null,
  titulo      text not null,
  descripcion text,
  created_at  timestamptz not null default now()
);

create index if not exists eventos_cliente_fecha_idx
  on public.eventos (cliente_id, fecha);

-- RLS: el cliente ve solo sus eventos; el admin gestiona todos.
alter table public.eventos enable row level security;

drop policy if exists eventos_select on public.eventos;
create policy eventos_select on public.eventos for select
  using (public.es_admin() or cliente_id = public.mi_cliente_id());

drop policy if exists eventos_admin_all on public.eventos;
create policy eventos_admin_all on public.eventos for all
  using (public.es_admin()) with check (public.es_admin());
