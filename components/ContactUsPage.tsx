
import React, { useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const ContactUsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  const canSubmit = useMemo(() => {
    if (submitState.status === 'submitting') return false;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return Boolean(name.trim() && emailValid && message.trim());
  }, [email, message, name, submitState.status]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitState({ status: 'idle' });

    if (!isSupabaseConfigured) {
      setSubmitState({ status: 'error', message: 'Supabase is not configured.' });
      return;
    }

    if (!canSubmit) {
      setSubmitState({ status: 'error', message: 'Please complete all fields.' });
      return;
    }

    setSubmitState({ status: 'submitting' });

    const res = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      source: 'website',
    });

    if (res.error) {
      setSubmitState({ status: 'error', message: res.error.message });
      return;
    }

    setSubmitState({ status: 'success' });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-[#FCFBF7] min-h-screen flex items-center justify-center py-20 md:py-28 px-6 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#012620] opacity-[0.02] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F7B955] opacity-[0.05] rounded-full blur-[80px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_70%_at_20%_15%,rgba(1,38,32,0.06)_0%,rgba(252,251,247,0)_60%)]" />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative">
        {/* Left Side Info */}
        <div className="space-y-7 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
             <span className="text-[11px] font-black uppercase tracking-[0.35em] text-[#012620]">Contact us</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#012620] uppercase tracking-tighter leading-[0.95]">
            Let&apos;s Start a<span className="block">Conversation</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            Whether you&apos;re looking to join our global specialist network or need enterprise-grade AI data engineering, we&apos;re here to help.
          </p>
          <div className="space-y-4 pt-10 lg:pt-12">
            <div className="flex items-center gap-4 justify-center lg:justify-start">
               <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-md border border-slate-50">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2.5"/></svg>
               </div>
               <a href="mailto:intelligence@lifewood.com" className="font-black text-[#012620] uppercase tracking-widest text-xs sm:text-sm hover:text-[#0D4A30] transition-colors">intelligence@lifewood.com</a>
            </div>
            <div className="flex items-center gap-4 justify-center lg:justify-start">
               <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-md border border-slate-50">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2.5"/></svg>
               </div>
               <span className="font-black text-[#012620] uppercase tracking-widest text-xs sm:text-sm">1 Marina Boulevard, Singapore</span>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-[#012620] to-[#0D4A30] rounded-[3rem] rotate-2 scale-105 opacity-10 group-hover:rotate-1 transition-transform duration-700" />
           <div className="bg-[#012620] rounded-[3rem] overflow-hidden shadow-[0_40px_120px_rgba(1,38,32,0.35)] relative border border-white/10 p-8 sm:p-10 lg:p-12">
              {/* Glossy green background */}
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute inset-0 bg-[linear-gradient(145deg,#0f6a4b_0%,#084934_48%,#022019_100%)]" />
                 <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_6%,rgba(191,255,224,0.26)_0%,rgba(191,255,224,0.06)_34%,rgba(2,32,25,0)_65%)]" />
                 <div className="absolute -top-16 left-8 right-8 h-44 rounded-full bg-white/25 blur-3xl opacity-35" />
                 <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-emerald-200/20 blur-3xl" />
              </div>

              <form onSubmit={onSubmit} className="relative z-10 space-y-7">
                 {!isSupabaseConfigured && (
                   <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-5 py-4 text-amber-50 text-sm">
                     Submissions are disabled until Supabase is configured.
                   </div>
                 )}

                 {submitState.status === 'error' && (
                   <div className="rounded-2xl border border-red-500/35 bg-red-500/10 px-5 py-4 text-red-50 text-sm">
                     {submitState.message}
                   </div>
                 )}

                 {submitState.status === 'success' && (
                   <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-5 py-4 text-emerald-50 text-sm">
                     Message sent. Thank you - we'll get back to you soon.
                   </div>
                 )}

                 <div className="space-y-2">
                     <label htmlFor="contact-name" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Name</label>
                     <input
                       id="contact-name"
                       name="name"
                       type="text"
                       placeholder="Your full name"
                       autoComplete="name"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/25 focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#F7B955]/60 transition-colors"
                       required
                     />
                  </div>
                  <div className="space-y-2">
                     <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Email</label>
                     <input
                       id="contact-email"
                       name="email"
                       type="email"
                       placeholder="email@company.com"
                       autoComplete="email"
                       inputMode="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/25 focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#F7B955]/60 transition-colors"
                       required
                     />
                  </div>
                  <div className="space-y-2">
                     <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Message</label>
                     <textarea
                       id="contact-message"
                       name="message"
                       rows={4}
                       placeholder="How can we collaborate?"
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/25 focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#F7B955]/60 transition-colors resize-none"
                       required
                     ></textarea>
                  </div>

                 <button
                   type="submit"
                   disabled={!canSubmit || !isSupabaseConfigured}
                    className={[
                      'w-full py-5 sm:py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl group active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                      canSubmit && isSupabaseConfigured
                        ? 'bg-[#F7B955] hover:bg-[#D4AF37] text-[#012620]'
                        : 'bg-white/10 text-white/50 cursor-not-allowed',
                    ].join(' ')}
                 >
                    {submitState.status === 'submitting' ? 'Sending...' : 'Send Message'}
                 </button>

              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
