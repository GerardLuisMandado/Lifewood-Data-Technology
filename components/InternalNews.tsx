
import React, { useEffect, useState } from 'react';

const InternalNews: React.FC = () => {
  const [stats, setStats] = useState([0, 0, 0]);

  useEffect(() => {
    const targets = [40, 56, 24];
    const duration = 1400;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setStats(targets.map((target) => Math.floor(target * eased)));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setStats(targets);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Content Header */}
        <div className="mb-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#012620]/5 border border-[#012620]/10 text-[#012620] text-[10px] font-black uppercase tracking-[0.22em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              Internal Brief
            </div>
            <h1 className="text-7xl font-black text-[#0D4A30] uppercase tracking-tighter leading-none mb-4">
              Rootstech 2026
            </h1>
            <p className="text-xl text-[#0D4A30]/80 font-medium">Coming Soon!</p>
            <div className="mt-8">
              <a
                href="#/contact"
                className="inline-flex bg-[#F7B955] hover:bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold text-sm items-center gap-2 transition-all"
              >
                Contact Us
                <div className="w-6 h-6 rounded-full bg-[#012620] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M7 17l9.2-9.2M17 17V7H7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-[#012620]/20 bg-[#012620]/5 backdrop-blur-md p-6 shadow-[0_20px_45px_rgba(1,38,32,0.12)]">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0D4A30]">Event Preview</p>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F7B955]/25 text-[#012620] border border-[#D4AF37]/40">
                  Early Access
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F7B58] text-white flex items-center justify-center text-[10px] font-black">01</div>
                  <p className="text-sm text-[#24372F] leading-relaxed">Interactive genealogy showcase with AI-enhanced records exploration.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F7B58] text-white flex items-center justify-center text-[10px] font-black">02</div>
                  <p className="text-sm text-[#24372F] leading-relaxed">Live demos on data extraction, multilingual transcription, and archival indexing.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F7B58] text-white flex items-center justify-center text-[10px] font-black">03</div>
                  <p className="text-sm text-[#24372F] leading-relaxed">Meet specialists building trusted training data for next-generation AI systems.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#012620]/20 bg-[#012620]/5 p-4 shadow-lg">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white border border-[#012620]/20 py-3">
                  <p className="text-lg font-black text-[#012620] leading-none">{stats[0]}+</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#0D4A30]/80 mt-1">Centers</p>
                </div>
                <div className="rounded-xl bg-white border border-[#012620]/20 py-3">
                  <p className="text-lg font-black text-[#012620] leading-none">{stats[1]}K+</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#0D4A30]/80 mt-1">Experts</p>
                </div>
                <div className="rounded-xl bg-white border border-[#012620]/20 py-3">
                  <p className="text-lg font-black text-[#012620] leading-none">{stats[2]}/7</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#0D4A30]/80 mt-1">Ops</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="max-w-[1000px] mx-auto">
          <div className="bg-[#F8F9FA] rounded-[3rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 group relative overflow-hidden">
            <div className="aspect-[16/9] rounded-[2rem] overflow-hidden relative shadow-2xl border border-white/40">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/ccyrQ87EJag?si=mVTUyHRvvsV4UCSB"
                title="Rootstech 2026 Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              
              {/* Logo Overlay on Video */}
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                <div className="w-3 h-3 bg-[#F7B955] rounded-sm rotate-45" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Lifewood</span>
              </div>
            </div>
            
            {/* Background Texture on Card */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#012620 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>
        </div>
      </section>

      {/* Decorative Brand Text */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-black text-[#012620] uppercase tracking-tighter leading-tight opacity-80">
          Reconnecting human lineage<br/>through digital precision.
        </h2>
      </div>
    </div>
  );
};

export default InternalNews;
