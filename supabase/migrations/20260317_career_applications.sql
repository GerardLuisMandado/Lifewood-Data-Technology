-- Careers form backend (table + storage policies)
-- Apply in Supabase SQL editor (or via migrations).

create extension if not exists pgcrypto;

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text not null,
  last_name text not null,
  gender text not null,
  age int not null,

  phone_country_code text not null,
  phone_number text not null,
  email text not null,

  position_applied text not null,
  country text not null,
  current_address text not null,

  cv_bucket text not null,
  cv_path text not null,

  source text not null default 'website'
);

alter table public.career_applications enable row level security;

drop policy if exists "public insert career applications" on public.career_applications;
create policy "public insert career applications"
on public.career_applications
for insert
to anon, authenticated
with check (true);

-- Storage bucket + upload policy (CV PDFs)
insert into storage.buckets (id, name, public)
values ('career-cvs', 'career-cvs', false)
on conflict (id) do nothing;

drop policy if exists "public upload career cvs" on storage.objects;
create policy "public upload career cvs"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'career-cvs'
  and name like 'applications/%'
  and lower(name) like '%.pdf'
);

