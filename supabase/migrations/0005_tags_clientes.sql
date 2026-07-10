-- =============================================================================
-- Portal Contabilidad con María — Migración 0005
--   Etiquetas de servicio por cliente (Remuneraciones / Contabilidad).
--   Permiten agendar un evento dirigido a todo un grupo de clientes (los que
--   tengan la etiqueta activa) en vez de a uno solo.
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → pegar → Run
-- =============================================================================

alter table public.clientes
  add column if not exists tag_remuneraciones boolean not null default false,
  add column if not exists tag_contabilidad   boolean not null default false;
