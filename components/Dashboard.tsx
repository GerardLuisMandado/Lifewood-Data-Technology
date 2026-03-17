import React, { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type DashboardRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  phone_country_code: string;
  phone_number: string;
  email: string;
  position_applied: string;
  country: string;
  current_address: string;
  cv_bucket: string;
  cv_path: string;
  source: string;
};

type ContactMessageRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  source: string;
};

const adminEmailList = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  if (adminEmailList.length === 0) return false;
  return adminEmailList.includes(email.toLowerCase());
};

const Dashboard: React.FC = () => {
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [contactRows, setContactRows] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'applications' | 'contacts'>('applications');

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const haystack = [
        r.first_name,
        r.last_name,
        r.email,
        r.position_applied,
        r.country,
        r.phone_number,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, rows]);

  const filteredContactRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contactRows;
    return contactRows.filter((r) => {
      const haystack = [r.name, r.email, r.message].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [contactRows, query]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        setError('Supabase is not configured.');
        setLoading(false);
        return;
      }

      const { data: sessionRes, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        setError(sessionErr.message);
        setLoading(false);
        return;
      }

      const user = sessionRes.session?.user ?? null;
      if (!user || !isAdminEmail(user.email)) {
        window.history.replaceState({}, '', '/login');
        window.dispatchEvent(new Event('popstate'));
        setLoading(false);
        return;
      }

      const appsRes = await supabase
        .from('career_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (appsRes.error) {
        setError(appsRes.error.message);
      } else {
        setRows((appsRes.data ?? []) as DashboardRow[]);
      }

      const contactRes = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactRes.error) {
        setError((prev) => prev ?? contactRes.error!.message);
      } else {
        setContactRows((contactRes.data ?? []) as ContactMessageRow[]);
      }

      setLoading(false);
    };

    void run();
  }, []);

  const onDownloadCv = async (row: DashboardRow) => {
    setError(null);
    const res = await supabase.storage.from(row.cv_bucket).createSignedUrl(row.cv_path, 60);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    if (res.data?.signedUrl) window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section data-no-reveal className="pt-24 pb-16 bg-[#06090B] min-h-[calc(100vh-76px)] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.25em] text-[#F7B955] uppercase">Admin</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-black tracking-tight">Dashboard</h1>
            <p className="mt-3 text-slate-300/80 text-sm">Career applications (latest first).</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.location.hash = '#/careers';
                window.dispatchEvent(new Event('popstate'));
              }}
              className="h-11 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-5 text-xs font-black uppercase tracking-widest"
            >
              View Careers
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setView('applications')}
                className={[
                  'h-10 rounded-xl px-4 text-xs font-black uppercase tracking-widest border',
                  view === 'applications'
                    ? 'bg-[#F7B955] text-[#012620] border-[#F7B955]'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10',
                ].join(' ')}
              >
                Applications ({rows.length})
              </button>
              <button
                type="button"
                onClick={() => setView('contacts')}
                className={[
                  'h-10 rounded-xl px-4 text-xs font-black uppercase tracking-widest border',
                  view === 'contacts'
                    ? 'bg-[#F7B955] text-[#012620] border-[#F7B955]'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10',
                ].join(' ')}
              >
                Contact Messages ({contactRows.length})
              </button>
              <div className="text-sm text-slate-200/70 ml-2">
                {loading
                  ? 'Loading…'
                  : view === 'applications'
                    ? `${filteredRows.length} result${filteredRows.length === 1 ? '' : 's'}`
                    : `${filteredContactRows.length} result${filteredContactRows.length === 1 ? '' : 's'}`}
              </div>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={view === 'applications' ? 'Search name, email, position…' : 'Search name, email, message…'}
              className="h-11 w-full sm:w-[340px] rounded-xl bg-white/10 text-white placeholder:text-slate-300/50 border border-white/10 px-4 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
            />
          </div>

          {error && (
            <div className="mx-5 mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100 text-sm">
              {error}
            </div>
          )}

          <div className="p-5">
            {loading ? (
              <div className="text-slate-300/70 text-sm">Fetching applications…</div>
            ) : view === 'applications' && filteredRows.length === 0 ? (
              <div className="text-slate-300/70 text-sm">No applications found.</div>
            ) : view === 'contacts' && filteredContactRows.length === 0 ? (
              <div className="text-slate-300/70 text-sm">No contact messages found.</div>
            ) : (
              <>
                {view === 'applications' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredRows.map((r) => (
                      <div key={r.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-lg font-black">
                              {r.first_name} {r.last_name}
                            </div>
                            <div className="mt-1 text-xs text-slate-200/70">
                              {new Date(r.created_at).toLocaleString()}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void onDownloadCv(r)}
                            className="h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 text-xs font-black uppercase tracking-widest"
                          >
                            Download CV
                          </button>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs uppercase tracking-widest text-slate-200/50">Email</div>
                            <div className="mt-1 text-slate-100">{r.email}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-widest text-slate-200/50">Phone</div>
                            <div className="mt-1 text-slate-100">{r.phone_country_code} {r.phone_number}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-widest text-slate-200/50">Position</div>
                            <div className="mt-1 text-slate-100">{r.position_applied}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-widest text-slate-200/50">Location</div>
                            <div className="mt-1 text-slate-100">{r.country}</div>
                          </div>
                          <div className="sm:col-span-2">
                            <div className="text-xs uppercase tracking-widest text-slate-200/50">Address</div>
                            <div className="mt-1 text-slate-100">{r.current_address}</div>
                          </div>
                          <div className="sm:col-span-2">
                            <div className="text-xs uppercase tracking-widest text-slate-200/50">Other</div>
                            <div className="mt-1 text-slate-100">
                              {r.gender} • {r.age} • Source: {r.source}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredContactRows.map((r) => (
                      <div key={r.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-lg font-black">{r.name}</div>
                            <div className="mt-1 text-xs text-slate-200/70">
                              {new Date(r.created_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs font-black uppercase tracking-widest text-slate-200/60">
                            {r.source}
                          </div>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                          <div>
                            <div className="text-xs uppercase tracking-widest text-slate-200/50">Email</div>
                            <div className="mt-1 text-slate-100">{r.email}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-widest text-slate-200/50">Message</div>
                            <div className="mt-2 text-slate-100 whitespace-pre-wrap leading-relaxed">
                              {r.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
