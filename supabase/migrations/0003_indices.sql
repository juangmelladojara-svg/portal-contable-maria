-- =============================================================================
-- Portal Contabilidad con María — Migración 0003
--   Índice para acelerar el filtrado de documentos por cliente (RLS + listados).
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → pegar → Run
-- =============================================================================

create index if not exists documentos_cliente_id_idx
  on public.documentos (cliente_id);

-- Útil para los listados ordenados por fecha de subida más reciente.
create index if not exists documentos_created_at_idx
  on public.documentos (created_at desc);
