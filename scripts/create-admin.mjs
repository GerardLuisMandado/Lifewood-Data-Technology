import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ??
  (process.env.VITE_ADMIN_EMAILS ? process.env.VITE_ADMIN_EMAILS.split(',')[0]?.trim() : undefined);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const missing = [];
if (!SUPABASE_URL) missing.push('SUPABASE_URL (or VITE_SUPABASE_URL)');
if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
if (!ADMIN_EMAIL) missing.push('ADMIN_EMAIL (or VITE_ADMIN_EMAILS)');
if (!ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD');

if (missing.length > 0) {
  console.error('Missing env vars: ' + missing.join(', '));
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

const findUserByEmail = async (email) => {
  const target = normalizeEmail(email);
  let page = 1;
  const perPage = 200;

  for (;;) {
    const res = await supabase.auth.admin.listUsers({ page, perPage });
    if (res.error) throw res.error;

    const users = res.data?.users ?? [];
    const found = users.find((u) => normalizeEmail(u.email) === target);
    if (found) return found;

    if (users.length < perPage) return null;
    page += 1;
  }
};

const main = async () => {
  const existing = await findUserByEmail(ADMIN_EMAIL);

  const res = existing
    ? await supabase.auth.admin.updateUserById(existing.id, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
      })
    : await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });

  if (res.error) throw res.error;
  if (!res.data?.user) throw new Error('No user returned from Supabase admin API');

  const upsertRes = await supabase
    .from('admin_users')
    .upsert(
      {
        user_id: res.data.user.id,
        email: ADMIN_EMAIL,
      },
      { onConflict: 'email' }
    );
  if (upsertRes.error) throw upsertRes.error;

  console.log('Admin user ready: ' + ADMIN_EMAIL + ' (' + res.data.user.id + ')');
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
