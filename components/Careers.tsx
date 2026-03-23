import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CAREER_COUNTRY_OPTIONS, CAREER_POSITION_OPTIONS } from '../lib/careerOptions';
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

  const positionOptions = useMemo(() => [...CAREER_POSITION_OPTIONS], []);
  const countryOptions = useMemo(() => [...CAREER_COUNTRY_OPTIONS], []);

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
    'Collaborative',
    'Innovative',
    'Flexible',
    'Supportive',
    'Transparent',
    'Engaging',
    'Diverse',
    'Purpose-driven',
    'Balanced (work-life balance)',
    'Trustworthy',
    'Professional',
    'Reliable',
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
      <section data-scroll-reveal className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-8xl font-black text-[#012620] uppercase tracking-tighter leading-none mb-12">
              Careers in
              <br />
              Lifewood
            </h1>
          </div>
          <div className="md:self-center">
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-md">
              Innovation, adaptability and the rapid development of new services separates companies that constantly
              deliver at the highest level from their competitors.
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

      <section data-scroll-reveal className="max-w-4xl mx-auto px-6 pt-10 pb-24 text-center">
        <h2 className="text-6xl font-black text-[#012620] uppercase tracking-tighter leading-tight mb-8">
          It means motivating
          <br />
          and growing teams
        </h2>
        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-20 max-w-2xl mx-auto">
          Teams that can initiate and learn on the run in order to deliver evolving technologies and targets. It's a
          big challenge, but innovation, especially across borders, has never been the easy path.
        </p>

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

        <p className="text-3xl text-slate-800 font-medium leading-relaxed max-w-4xl mx-auto">
          If you're looking to turn the page on a new chapter in your career make contact with us today. At Lifewood,
          the adventure is always before you, it's why we've been described as{' '}
          <span className="text-[#F7B955] font-black italic">"always on, never off."</span>
        </p>
      </section>

      <section
        ref={applySectionRef as unknown as React.RefObject<HTMLElement>}
        data-scroll-reveal
        className="relative overflow-hidden py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#06090B] via-[#0B0F12] to-[#06090B]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(247,185,85,0.18),transparent_55%),radial-gradient(circle_at_70%_85%,rgba(255,255,255,0.10),transparent_55%)]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <div className="grid lg:grid-cols-[0.92fr_1.18fr]">
              <div className="relative border-b border-white/10 bg-[linear-gradient(180deg,rgba(247,185,85,0.16),rgba(255,255,255,0.03))] px-8 py-10 md:px-10 md:py-12 lg:border-b-0 lg:border-r lg:border-white/10">
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top_left,rgba(247,185,85,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_42%)]" />
                <div className="relative">
                  <div className="inline-flex items-center rounded-full border border-[#F7B955]/25 bg-[#F7B955]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#F7B955]">
                    Careers
                  </div>
                  <h2 className="mt-6 max-w-sm text-4xl font-black leading-none tracking-tight text-white md:text-5xl">
                    Join Our Team
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-200/80 md:text-base">
                    Share your details, role preference, and CV. We review each submission carefully and continue
                    qualified applications through our AI pre-screening process.
                  </p>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {['Your profile', 'Preferred role', 'CV upload'].map((step, index) => (
                      <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#F7B955]/90">
                          0{index + 1}
                        </div>
                        <div className="mt-2 text-sm font-semibold leading-snug text-white/90">{step}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-[11px] font-black uppercase tracking-[0.28em] text-white/45">
                      Before You Start
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-slate-200/80">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#F7B955]" />
                        <p>Use an active email address so we can send your next-step screening instructions.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#F7B955]" />
                        <p>Upload your CV as a PDF file up to 10MB.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#F7B955]" />
                        <p>Complete all required fields to enable submission.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-10 md:px-10 md:py-12">
                <div className="mb-8">
                  <div className="text-[11px] font-black uppercase tracking-[0.28em] text-white/45">Application Form</div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200/72">
                    Please fill out the form below to apply.
                  </p>
                </div>

                <form onSubmit={onSubmit}>
                  {!isSupabaseConfigured && (
                    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      Submissions are disabled until Supabase is configured.
                    </div>
                  )}

                  {submitState.status === 'error' && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      {submitState.message}
                    </div>
                  )}

                  {submitState.status === 'success' && (
                    <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                      Application submitted. Thank you, we'll be in touch.
                    </div>
                  )}

                  <div className="space-y-7">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                      <div className="mb-5 text-[11px] font-black uppercase tracking-[0.28em] text-white/45">
                        Personal Details
                      </div>
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">First Name</label>
                          <input
                            value={form.firstName}
                            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                            placeholder="e.g. Michael"
                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-slate-300/50 focus:ring-2 focus:ring-[#F7B955]/60"
                            required
                            autoComplete="given-name"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">Last Name</label>
                          <input
                            value={form.lastName}
                            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                            placeholder="e.g. Chen"
                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-slate-300/50 focus:ring-2 focus:ring-[#F7B955]/60"
                            required
                            autoComplete="family-name"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">Gender</label>
                          <select
                            value={form.gender}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, gender: e.target.value as CareerApplicationFormState['gender'] }))
                            }
                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                            required
                          >
                            <option value="" disabled className="bg-slate-900">
                              Select gender
                            </option>
                            {genderOptions.map((g) => (
                              <option key={g} value={g} className="bg-slate-900">
                                {g}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">Age</label>
                          <input
                            value={form.age}
                            onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                            placeholder="e.g. 24"
                            inputMode="numeric"
                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-slate-300/50 focus:ring-2 focus:ring-[#F7B955]/60"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">Phone Number</label>
                          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-[220px_1fr]">
                            <select
                              value={form.phoneCountryCode}
                              onChange={(e) => setForm((p) => ({ ...p, phoneCountryCode: e.target.value }))}
                              className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                              aria-label="Country code"
                            >
                              {phoneCountryCodes.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-slate-900">
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <input
                              value={form.phoneNumber}
                              onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                              placeholder="912345678"
                              inputMode="tel"
                              className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-slate-300/50 focus:ring-2 focus:ring-[#F7B955]/60"
                              required
                              autoComplete="tel"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">Email Address</label>
                          <input
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            placeholder="michael@example.com"
                            type="email"
                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-slate-300/50 focus:ring-2 focus:ring-[#F7B955]/60"
                            required
                            autoComplete="email"
                          />
                          <p className="mt-2 text-[11px] uppercase tracking-widest text-slate-200/50">
                            Note: Please check your email and continue with the AI pre-screening.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                      <div className="mb-5 text-[11px] font-black uppercase tracking-[0.28em] text-white/45">
                        Role Details
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">Position Applied</label>
                          <select
                            value={form.positionApplied}
                            onChange={(e) => setForm((p) => ({ ...p, positionApplied: e.target.value }))}
                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                            required
                          >
                            <option value="" disabled className="bg-slate-900">
                              Select position to add
                            </option>
                            {positionOptions.map((pos) => (
                              <option key={pos} value={pos} className="bg-slate-900">
                                {pos}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">Country</label>
                          <select
                            value={form.country}
                            onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:ring-2 focus:ring-[#F7B955]/60"
                            required
                          >
                            <option value="" disabled className="bg-slate-900">
                              Select country
                            </option>
                            {countryOptions.map((c) => (
                              <option key={c} value={c} className="bg-slate-900">
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-200/80">Current Address</label>
                          <input
                            value={form.currentAddress}
                            onChange={(e) => setForm((p) => ({ ...p, currentAddress: e.target.value }))}
                            placeholder="e.g. Quezon City, Metro Manila"
                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-slate-300/50 focus:ring-2 focus:ring-[#F7B955]/60"
                            required
                            autoComplete="street-address"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                      <div className="mb-5 text-[11px] font-black uppercase tracking-[0.28em] text-white/45">
                        Upload CV
                      </div>
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
                          'rounded-[1.5rem] border border-dashed px-6 py-10 text-center transition-all',
                          isDropActive
                            ? 'border-[#F7B955] bg-[#F7B955]/10 shadow-[0_0_0_1px_rgba(247,185,85,0.28)]'
                            : 'border-white/20 bg-black/10 hover:bg-white/[0.04]',
                        ].join(' ')}
                      >
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10">
                          <svg className="h-7 w-7 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 16V4m0 0l-3.5 3.5M12 4l3.5 3.5M20 16.5a4.5 4.5 0 00-1.2-8.8A6 6 0 006.3 8.4 4 4 0 006 16.3"
                            />
                          </svg>
                        </div>

                        <div className="text-base font-semibold text-slate-100/95">
                          {form.cvFile ? form.cvFile.name : 'Drop your CV here or choose a file'}
                        </div>
                        <div className="mt-2 text-sm text-slate-200/60">PDF only, up to 10MB</div>

                        <div className="mt-5 flex items-center justify-center gap-3">
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/15">
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
                              className="rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-xs font-black uppercase tracking-widest text-white/90 transition-colors hover:bg-white/5"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {form.cvFile && (
                        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100/90">
                          CV attached and ready for submission.
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={[
                        'w-full rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest shadow-xl transition-all',
                        canSubmit
                          ? 'border border-[#F7B955]/80 bg-[#F7B955] text-[#071015] hover:bg-[#f2c46c]'
                          : 'cursor-not-allowed border border-white/5 bg-white/5 text-white/40',
                      ].join(' ')}
                    >
                      {submitState.status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
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
