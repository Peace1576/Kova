create extension if not exists pgcrypto;

create table if not exists public.kova_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  plan text not null default 'legal',
  created_at timestamptz not null default now(),
  consent jsonb not null default '{}'::jsonb,
  consent_log jsonb not null default '[]'::jsonb,
  deleted_at timestamptz,
  deleted boolean not null default false
);

create index if not exists kova_users_email_idx on public.kova_users (email);
create index if not exists kova_users_plan_idx on public.kova_users (plan);

create table if not exists public.kova_sessions (
  token text primary key,
  user_id uuid not null references public.kova_users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists kova_sessions_user_id_idx on public.kova_sessions (user_id);
create index if not exists kova_sessions_created_at_idx on public.kova_sessions (created_at desc);
