
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type CareerApplicationFormState = {
  firstName: string;
  lastName: string;
  gender: '' | 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  age: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
  positionApplied: string;
  country: string;
  currentAddress: string;
  cvFile: File | null;
};

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const Careers: React.FC = () => {
  const teamImageRef = useRef<HTMLImageElement | null>(null);
  const [isTeamImageVisible, setIsTeamImageVisible] = useState(false);
  const applySectionRef = useRef<HTMLElement | null>(null);

  const [form, setForm] = useState<CareerApplicationFormState>({
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    phoneCountryCode: '+63',
    phoneNumber: '',
    email: '',
    positionApplied: '',
    country: '',
    currentAddress: '',
    cvFile: null,
  });

  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });
  const [isDropActive, setIsDropActive] = useState(false);

  const genderOptions = useMemo(() => ['Female', 'Male', 'Non-binary', 'Prefer not to say'] as const, []);
  const phoneCountryCodes = useMemo(
    () => [
      { label: '+63 (Philippines)', value: '+63' },
      { label: '+1 (USA/Canada)', value: '+1' },
      { label: '+61 (Australia)', value: '+61' },
      { label: '+44 (UK)', value: '+44' },
      { label: '+65 (Singapore)', value: '+65' },
      { label: '+81 (Japan)', value: '+81' },
      { label: '+971 (UAE)', value: '+971' },
    ],
    []
  );

  const positionOptions = useMemo(
    () => [
      'Data Annotator',
      'Data Collector',
      'Quality Analyst',
      'Team Lead',
      'Project Coordinator',
      'Project Manager',
      'AI/ML Support',
      'Other',
    ],
    []
  );

  const countryOptions = useMemo(
    () => [
      'Philippines',
      'Australia',
      'United States',
      'Canada',
      'United Kingdom',
      'Singapore',
      'Japan',
      'United Arab Emirates',
      'Other',
    ],
    []
  );

  useEffect(() => {
    const imageEl = teamImageRef.current;
    if (!imageEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) return;
        setIsTeamImageVisible(true);
        observer.unobserve(imageEl);
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(imageEl);
    return () => observer.disconnect();
  }, []);

  const values = [
    'Collaborative', 'Innovative', 'Flexible', 'Supportive', 'Transparent', 'Engaging', 
    'Diverse', 'Purpose-driven', 'Balanced (work-life balance)', 'Trustworthy', 'Professional', 'Reliable'
  ];
  const topValueRow = values.slice(0, Math.ceil(values.length / 2));
  const bottomValueRow = values.slice(Math.ceil(values.length / 2));

  const canSubmit = useMemo(() => {
    const ageNumber = Number(form.age);
    const ageValid = Number.isFinite(ageNumber) && ageNumber >= 16 && ageNumber <= 99;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const phoneValid = form.phoneNumber.trim().length >= 6;
    const hasRequired =
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.gender &&
      ageValid &&
      phoneValid &&
      emailValid &&
      form.positionApplied &&
      form.country &&
      form.currentAddress.trim() &&
      form.cvFile;
    return Boolean(hasRequired && submitState.status !== 'submitting');
  }, [form, submitState.status]);

  const scrollToApply = () => {
    applySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onPickCv = (file: File | null) => {
    if (!file) {
      setForm((prev) => ({ ...prev, cvFile: null }));
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    const looksLikePdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!looksLikePdf) {
      setSubmitState({ status: 'error', message: 'CV must be a PDF file.' });
      return;
    }

    if (file.size > maxBytes) {
      setSubmitState({ status: 'error', message: 'CV file is too large (max 10MB).' });
      return;
    }

    setSubmitState({ status: 'idle' });
    setForm((prev) => ({ ...prev, cvFile: file }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitState({ status: 'idle' });

    if (!isSupabaseConfigured) {
      setSubmitState({
        status: 'error',
        message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable submissions.',
      });
      return;
    }

    if (!canSubmit || !form.cvFile) {
      setSubmitState({ status: 'error', message: 'Please complete all required fields and upload your CV.' });
      return;
    }

    setSubmitState({ status: 'submitting' });

    try {
      const safeName = form.cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const random = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const filePath = `applications/${new Date().toISOString().slice(0, 10)}/${random}-${safeName}`;

      const uploadRes = await supabase.storage.from('career-cvs').upload(filePath, form.cvFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf',
      });
      if (uploadRes.error) throw uploadRes.error;

      const insertRes = await supabase.from('career_applications').insert({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        gender: form.gender,
        age: Number(form.age),
        phone_country_code: form.phoneCountryCode,
        phone_number: form.phoneNumber.trim(),
        email: form.email.trim(),
        position_applied: form.positionApplied,
        country: form.country,
        current_address: form.currentAddress.trim(),
        cv_bucket: 'career-cvs',
        cv_path: filePath,
        source: 'website',
      });
      if (insertRes.error) throw insertRes.error;

      setSubmitState({ status: 'success' });
      setForm({
        firstName: '',
        lastName: '',
        gender: '',
        age: '',
        phoneCountryCode: '+63',
        phoneNumber: '',
        email: '',
        positionApplied: '',
        country: '',
        currentAddress: '',
        cvFile: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setSubmitState({ status: 'error', message });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section data-scroll-reveal className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-8xl font-black text-[#012620] uppercase tracking-tighter leading-none mb-12">
              Careers in<br/>Lifewood
            </h1>
          </div>
          <div className="md:self-center">
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-md">
              Innovation, adaptability and the rapid development of new services separates companies that constantly deliver at the highest level from their competitors.
            </p>
            <button
              type="button"
              onClick={scrollToApply}
              className="mt-8 inline-flex bg-[#F7B955] hover:bg-[#D4AF37] text-[#012620] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs items-center gap-3 transition-all group shadow-xl"
            >
              Apply Now
              <div className="w-8 h-8 rounded-full bg-[#012620] flex items-center justify-center transition-transform group-hover:translate-x-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2.5" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Team Image Section */}
      <section data-scroll-reveal className="max-w-7xl mx-auto px-6 mb-14 md:mb-16">
        <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[600px] border border-slate-100">
           <img 
             ref={teamImageRef}
             src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
             className={`w-full h-full object-cover transition-all duration-1000 ${
               isTeamImageVisible ? 'grayscale-0' : 'grayscale'
             }`} 
             alt="Growing teams" 
           />
        </div>
      </section>

      {/* Growing Teams Section */}
      <section data-scroll-reveal className="max-w-4xl mx-auto px-6 pt-10 pb-24 text-center">
        <h2 className="text-6xl font-black text-[#012620] uppercase tracking-tighter leading-tight mb-8">
          It means motivating<br/>and growing teams
        </h2>
        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-20 max-w-2xl mx-auto">
          Teams that can initiate and learn on the run in order to deliver evolving technologies and targets. It's a big challenge, but innovation, especially across borders, has never been the easy path.
        </p>

        {/* Value Marquee */}
        <div className="mb-32 space-y-4">
          <div className="overflow-hidden w-full">
            <div
              className="flex items-center gap-4 whitespace-nowrap lw-values-marquee-left"
              style={{ animation: 'lwValuesMarqueeLeft 20s linear infinite' }}
            >
              {topValueRow.concat(topValueRow).map((val, i) => (
                <span
                  key={`${val}-${i}`}
                  className="shrink-0 bg-[#FCFBF7] text-[#012620] px-6 py-3 rounded-full text-sm font-bold border border-slate-200 shadow-sm hover:bg-[#F7B955] transition-colors cursor-default"
                >
                  {val}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden w-full">
            <div
              className="flex items-center gap-4 whitespace-nowrap lw-values-marquee-right"
              style={{ animation: 'lwValuesMarqueeRight 22s linear infinite' }}
            >
              {bottomValueRow.concat(bottomValueRow).map((val, i) => (
                <span
                  key={`${val}-${i}`}
                  className="shrink-0 bg-[#FCFBF7] text-[#012620] px-6 py-3 rounded-full text-sm font-bold border border-slate-200 shadow-sm hover:bg-[#F7B955] transition-colors cursor-default"
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-3xl text-slate-800 font-medium leading-relaxed max-w-4xl mx-auto">
          If you're looking to turn the page on a new chapter in your career make contact with us today. At Lifewood, the adventure is always before you, it's why we've been described as <span className="text-[#F7B955] font-black italic">"always on, never off."</span>
        </p>
      </section>

      {/* Application Form Section */}
      <section
        ref={applySectionRef as unknown as React.RefObject<HTMLElement>}
        data-scroll-reveal
        className="relative overflow-hidden py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#06090B] via-[#0B0F12] to-[#06090B]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(247,185,85,0.18),transparent_55%),radial-gradient(circle_at_70%_85%,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-10 pb-6">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Join Our Team</h2>
              <p className="mt-3 text-slate-200/80 text-sm">
                Please fill out the form below to apply.
              </p>
            </div>

            <form onSubmit={onSubmit} className="px-8 pb-10">
              {!isSupabaseConfigured && (
                <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-100 text-sm">
                  Submissions are disabled until Supabase is configured.
                </div>
              )}

              {submitState.status === 'error' && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100 text-sm">
                  {submitState.message}
                </div>
              )}

              {submitState.status === 'success' && (
                <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-100 text-sm">
                  Application submitted. Thank you — we’ll be in touch.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">First Name</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="e.g. Michael"
                    className="mt-2 w-full rounded-xl bg-white/10 text-white placeholder:text-slate-300/50 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="e.g. Chen"
                    className="mt-2 w-full rounded-xl bg-white/10 text-white placeholder:text-slate-300/50 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                    required
                    autoComplete="family-name"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value as CareerApplicationFormState['gender'] }))}
                    className="mt-2 w-full rounded-xl bg-white/10 text-white border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                    required
                  >
                    <option value="" disabled className="bg-slate-900">Select gender</option>
                    {genderOptions.map((g) => (
                      <option key={g} value={g} className="bg-slate-900">{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Age</label>
                  <input
                    value={form.age}
                    onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                    placeholder="e.g. 24"
                    inputMode="numeric"
                    className="mt-2 w-full rounded-xl bg-white/10 text-white placeholder:text-slate-300/50 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Phone Number</label>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-3">
                    <select
                      value={form.phoneCountryCode}
                      onChange={(e) => setForm((p) => ({ ...p, phoneCountryCode: e.target.value }))}
                      className="w-full rounded-xl bg-white/10 text-white border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                      aria-label="Country code"
                    >
                      {phoneCountryCodes.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                      ))}
                    </select>
                    <input
                      value={form.phoneNumber}
                      onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                      placeholder="912345678"
                      inputMode="tel"
                      className="w-full rounded-xl bg-white/10 text-white placeholder:text-slate-300/50 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Email Address</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="michael@example.com"
                    type="email"
                    className="mt-2 w-full rounded-xl bg-white/10 text-white placeholder:text-slate-300/50 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                    required
                    autoComplete="email"
                  />
                  <p className="mt-2 text-[11px] tracking-widest uppercase text-slate-200/50">
                    Note: Please check your email and continue with the AI pre-screening.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Position Applied</label>
                  <select
                    value={form.positionApplied}
                    onChange={(e) => setForm((p) => ({ ...p, positionApplied: e.target.value }))}
                    className="mt-2 w-full rounded-xl bg-white/10 text-white border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                    required
                  >
                    <option value="" disabled className="bg-slate-900">Select position to add</option>
                    {positionOptions.map((pos) => (
                      <option key={pos} value={pos} className="bg-slate-900">{pos}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                    className="mt-2 w-full rounded-xl bg-white/10 text-white border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                    required
                  >
                    <option value="" disabled className="bg-slate-900">Select country</option>
                    {countryOptions.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Current Address</label>
                  <input
                    value={form.currentAddress}
                    onChange={(e) => setForm((p) => ({ ...p, currentAddress: e.target.value }))}
                    placeholder="e.g. Quezon City, Metro Manila"
                    className="mt-2 w-full rounded-xl bg-white/10 text-white placeholder:text-slate-300/50 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                    required
                    autoComplete="street-address"
                  />
                </div>
              </div>

              <div className="mt-7">
                <label className="text-xs font-bold tracking-widest text-slate-200/80 uppercase">Upload CV (PDF)</label>
                <div
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDropActive(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDropActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDropActive(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDropActive(false);
                    const f = e.dataTransfer.files?.[0] ?? null;
                    onPickCv(f);
                  }}
                  className={[
                    'mt-2 rounded-2xl border border-dashed px-6 py-8 text-center transition-colors',
                    isDropActive ? 'border-[#F7B955] bg-[#F7B955]/10' : 'border-white/20 bg-white/5',
                  ].join(' ')}
                >
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-3.5 3.5M12 4l3.5 3.5M20 16.5a4.5 4.5 0 00-1.2-8.8A6 6 0 006.3 8.4 4 4 0 006 16.3" />
                    </svg>
                  </div>

                  <div className="text-sm text-slate-100/90 font-semibold">
                    {form.cvFile ? form.cvFile.name : 'Click to upload or drag and drop'}
                  </div>
                  <div className="mt-1 text-xs text-slate-200/50">PDF only (max. 10MB)</div>

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition-colors">
                      Choose File
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => onPickCv(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    {form.cvFile && (
                      <button
                        type="button"
                        onClick={() => onPickCv(null)}
                        className="rounded-xl bg-transparent hover:bg-white/5 border border-white/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-white/90 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={[
                  'mt-8 w-full rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-xs transition-all shadow-xl',
                  canSubmit
                    ? 'bg-white/15 hover:bg-white/20 text-white border border-white/10'
                    : 'bg-white/5 text-white/40 border border-white/5 cursor-not-allowed',
                ].join(' ')}
              >
                {submitState.status === 'submitting' ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes lwValuesMarqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes lwValuesMarqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .lw-values-marquee-left,
        .lw-values-marquee-right {
          min-width: 200%;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default Careers;
