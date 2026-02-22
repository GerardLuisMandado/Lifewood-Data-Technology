
import React from 'react';

const InternalNews: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex -space-x-1">
            <div className="w-3 h-3 rounded-full bg-black" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <div className="h-px w-24 bg-slate-200" />
        </div>

        {/* Content Header */}
        <div className="mb-12">
          <div>
            <h1 className="text-7xl font-black text-[#012620] uppercase tracking-tighter leading-none mb-4">
              Rootstech 2026
            </h1>
            <p className="text-xl text-slate-400 font-medium">Coming Soon!</p>
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
