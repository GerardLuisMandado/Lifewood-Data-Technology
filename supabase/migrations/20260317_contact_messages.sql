-- Contact Us form backend (table + RLS).

create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  message text not null,

  source text not null default 'website'
);

alter table public.contact_messages enable row level security;

drop policy if exists public_insert_contact_messages on public.contact_messages;
create policy public_insert_contact_messages
on public.contact_messages
for insert
to anon, authenticated
with check (true);

drop policy if exists admin_select_contact_messages on public.contact_messages;
create policy admin_select_contact_messages
on public.contact_messages
for select
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));
