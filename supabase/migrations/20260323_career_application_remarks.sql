alter table public.career_applications
add column if not exists remarks text not null default '';

drop policy if exists admin_update_career_applications on public.career_applications;
create policy admin_update_career_applications
on public.career_applications
for update
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));
