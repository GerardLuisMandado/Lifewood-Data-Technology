import React, { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type LoginState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string };

const adminEmailList = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  if (adminEmailList.length === 0) return false;
  return adminEmailList.includes(email.toLowerCase());
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<LoginState>({ status: 'idle' });

  const canSubmit = useMemo(() => {
    if (!isSupabaseConfigured) return false;
    if (state.status === 'loading') return false;
    return email.trim().length > 3 && password.length >= 6;
  }, [email, password, state.status]);

  useEffect(() => {
    const run = async () => {
      if (!isSupabaseConfigured) return;
      const { data } = await supabase.auth.getSession();
      const existingEmail = data.session?.user?.email ?? null;
      if (existingEmail && isAdminEmail(existingEmail)) {
        window.history.replaceState({}, '', '/dashboard');
        window.location.hash = '';
        window.dispatchEvent(new Event('popstate'));
      }
    };
    void run();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState({ status: 'idle' });

    if (!isSupabaseConfigured) {
      setState({ status: 'error', message: 'Supabase is not configured.' });
      return;
    }

    setState({ status: 'loading' });
    const res = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (res.error) {
      setState({ status: 'error', message: res.error.message });
      return;
    }

    const signedInEmail = res.data.user?.email ?? null;
    if (isAdminEmail(signedInEmail)) {
      window.history.pushState({}, '', '/dashboard');
      window.location.hash = '';
      window.dispatchEvent(new Event('popstate'));
      setState({ status: 'idle' });
      return;
    }

    await supabase.auth.signOut();
    setState({ status: 'error', message: 'Unauthorized: this login is for admins only.' });
  };

  return (
    <section data-no-reveal className="pt-28 pb-16 bg-[#F5EEDB] min-h-[calc(100vh-76px)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-[2rem] border border-[#DCCFAE] bg-white p-4 sm:p-6 lg:p-8 shadow-[0_24px_50px_rgba(1,38,32,0.14)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-[1.5rem] border border-[#E5DBC1] bg-[#FFFDF7] p-6 sm:p-8">
              <a
                href="#/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0D4A30] transition-colors"
              >
                <span aria-hidden="true">{'<-'}</span>
                Back to Home
              </a>

              <div className="mt-8">
                <img
                  src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                  alt="Lifewood Logo"
                  className="h-8 w-auto"
                />
              </div>

              <h1 className="mt-8 text-4xl sm:text-5xl font-black tracking-tight text-[#012620]">Sign In</h1>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                Access your Lifewood workspace with your company credentials.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button disabled className="h-12 rounded-xl bg-white border border-[#D8CCAE] text-sm font-bold text-[#0D4A30] opacity-60 cursor-not-allowed">
                  Google
                </button>
                <button disabled className="h-12 rounded-xl bg-white border border-[#D8CCAE] text-sm font-bold text-[#0D4A30] opacity-60 cursor-not-allowed">
                  GitHub
                </button>
              </div>

              <div className="my-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5DBC1]" />
                <span className="text-xs text-slate-500 uppercase tracking-[0.2em]">or</span>
                <div className="h-px flex-1 bg-[#E5DBC1]" />
              </div>

              {!isSupabaseConfigured && (
                <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-900 text-sm">
                  Supabase is not configured. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_ADMIN_EMAILS`.
                </div>
              )}

              {state.status === 'error' && (
                <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-900 text-sm">
                  {state.message}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-5 mt-8">
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-slate-500 mb-2">
                    Username or Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@lifewood.com"
                    className="w-full h-12 rounded-xl bg-white border border-[#D8CCAE] px-4 text-[#0D4A30] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold tracking-[0.12em] uppercase text-slate-500">Password</label>
                    <a href="#/contact" className="text-xs text-[#D4AF37] hover:text-[#E6C875] transition-colors">
                      Forget Password?
                    </a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-12 rounded-xl bg-white border border-[#D8CCAE] px-4 text-[#0D4A30] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={[
                    'w-full h-12 rounded-xl font-black tracking-wide transition-colors',
                    canSubmit
                      ? 'bg-[#0D4A30] text-white hover:bg-[#D4AF37] hover:text-[#0D4A30]'
                      : 'bg-[#0D4A30]/60 text-white/70 cursor-not-allowed',
                  ].join(' ')}
                >
                  {state.status === 'loading' ? 'Signing In…' : 'Sign In'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 rounded-[1.5rem] border border-[#0D4A30]/25 bg-gradient-to-br from-[#035E3E] via-[#034E34] to-[#012620] p-4 sm:p-5 overflow-hidden relative text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_26px_40px_rgba(1,38,32,0.32)]">
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#F3B347]/22 blur-3xl" />
              <div className="absolute left-10 top-10 w-40 h-40 rounded-full bg-[#1E7A56]/38 blur-3xl" />

              <div className="relative flex flex-col gap-3 h-full">
                <div className="relative overflow-hidden rounded-3xl border border-[#9CAFA4]/35 bg-[#035E3E] p-5 min-h-[320px] sm:min-h-[360px] flex flex-col justify-end shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_16px_30px_rgba(0,0,0,0.22)]">
                  <div className="absolute -right-10 bottom-5 h-24 w-24 rounded-full bg-[#F3B347]/18 blur-2xl pointer-events-none" />
                  <div className="absolute top-5 left-5 w-11 h-11 rounded-full bg-[#D4AF37] text-[#012620] flex items-center justify-center shadow-[0_8px_18px_rgba(212,175,55,0.35)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3l7 3v5c0 4.6-3.1 8.9-7 10-3.9-1.1-7-5.4-7-10V6l7-3z" strokeWidth="1.9" />
                      <path d="M9 12.5l2 2 4-4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Secure Data Operations</h3>
                  <p className="text-[#E6EEE9] mt-2">
                    Trusted access to Lifewood systems for global AI delivery teams.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-[#F4D8A0]/50 bg-gradient-to-br from-[#FFCB5B] via-[#E8A939] to-[#C17110] text-[#012620] p-5 min-h-[260px] sm:min-h-[300px] flex-1 flex flex-col justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_28px_rgba(193,113,16,0.3)]">
                  <div className="absolute inset-x-0 top-0 h-20 rounded-t-3xl bg-gradient-to-b from-white/30 via-white/12 to-transparent pointer-events-none" />
                  <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[#F3B347]/35 blur-2xl pointer-events-none" />
                  <h3 className="text-3xl font-black tracking-tight">Built for Teams</h3>
                  <p className="text-sm mt-2 font-bold text-[#013020]">
                    Access workflows, quality controls, and project delivery in one place.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
