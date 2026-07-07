-- =============================================================================
-- Portal Contabilidad con María — Migración 0004
--   Logos de empresas que aparecen en la cinta del landing, editables desde
--   el panel de administración (independiente de la tabla `clientes`, que es
--   para empresas con acceso real al portal).
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → pegar → Run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLA
-- -----------------------------------------------------------------------------
create table if not exists public.logos_clientes (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  logo_url    text not null,
  orden       integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.logos_clientes enable row level security;

-- Lectura pública: la cinta del landing no requiere sesión.
drop policy if exists logos_clientes_select on public.logos_clientes;
create policy logos_clientes_select on public.logos_clientes for select
  using (true);

-- Solo el admin agrega/edita/elimina.
drop policy if exists logos_clientes_admin_all on public.logos_clientes;
create policy logos_clientes_admin_all on public.logos_clientes for all
  using (public.es_admin()) with check (public.es_admin());

-- -----------------------------------------------------------------------------
-- 2. STORAGE: bucket público para los logos subidos desde el panel
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('logos-clientes', 'logos-clientes', true)
on conflict (id) do nothing;

drop policy if exists storage_logos_select on storage.objects;
create policy storage_logos_select on storage.objects for select
  using (bucket_id = 'logos-clientes');

drop policy if exists storage_logos_admin_all on storage.objects;
create policy storage_logos_admin_all on storage.objects for all
  using (bucket_id = 'logos-clientes' and public.es_admin())
  with check (bucket_id = 'logos-clientes' and public.es_admin());

-- -----------------------------------------------------------------------------
-- 3. SEED: logos ya existentes en public/clientes/ (quedan igual visualmente)
-- -----------------------------------------------------------------------------
insert into public.logos_clientes (nombre, logo_url, orden)
values
  ('Paola Zamorán · Fonoaudiología', '/clientes/paola-zamoran.png', 0),
  ('Dilo Conmigo',                   '/clientes/dilo-conmigo.png', 1),
  ('Hostal Beraca',                  '/clientes/hostal-beraca.png', 2),
  ('Panda',                          '/clientes/panda.png', 3),
  ('The Chicken Grill',              '/clientes/chicken-grill.png', 4),
  ('Bake House',                     '/clientes/bake-house.png', 5),
  ('Survial',                        '/clientes/survial.png', 6),
  ('MediFilter',                     '/clientes/medifilter.png', 7),
  ('NeuroStep',                      '/clientes/neurostep.png', 8),
  ('Coliseo · Constructora Bizama',  '/clientes/coliseo.png', 9)
on conflict do nothing;
