-- Admin-only read access for the careers dashboard.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists admin_users_read_self on public.admin_users;
create policy admin_users_read_self
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists admin_select_career_applications on public.career_applications;
create policy admin_select_career_applications
on public.career_applications
for select
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists admin_read_career_cvs on storage.objects;
create policy admin_read_career_cvs
on storage.objects
for select
to authenticated
using (
  bucket_id = 'career-cvs'
  and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
);
