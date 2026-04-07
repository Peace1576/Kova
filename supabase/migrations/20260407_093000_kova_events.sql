create extension if not exists pgcrypto;

create table if not exists public.kova_legal_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  user_id text,
  email text,
  plan text,
  document_slug text,
  document_name text,
  version text,
  checksum text,
  details jsonb not null default '{}'::jsonb
);

create index if not exists kova_legal_events_user_id_idx on public.kova_legal_events (user_id);
create index if not exists kova_legal_events_event_type_idx on public.kova_legal_events (event_type);
create index if not exists kova_legal_events_created_at_idx on public.kova_legal_events (created_at desc);

create table if not exists public.kova_ai_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  user_id text,
  email text,
  prompt text,
  response text,
  context jsonb not null default '{}'::jsonb
);

create index if not exists kova_ai_events_user_id_idx on public.kova_ai_events (user_id);
create index if not exists kova_ai_events_event_type_idx on public.kova_ai_events (event_type);
create index if not exists kova_ai_events_created_at_idx on public.kova_ai_events (created_at desc);

create table if not exists public.kova_flow_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  user_id text,
  email text,
  plan text,
  flow_slug text,
  details jsonb not null default '{}'::jsonb
);

create index if not exists kova_flow_events_user_id_idx on public.kova_flow_events (user_id);
create index if not exists kova_flow_events_event_type_idx on public.kova_flow_events (event_type);
create index if not exists kova_flow_events_created_at_idx on public.kova_flow_events (created_at desc);
