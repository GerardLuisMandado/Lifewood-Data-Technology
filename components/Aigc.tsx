
import React from 'react';
import './Aigc.css';

const Aigc: React.FC = () => {
  const aiGeneratedExamples = [
    {
      src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=900',
      alt: 'AI robot concept artwork'
    },
    {
      src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=900',
      alt: 'Generative AI neural concept'
    },
    {
      src: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=900',
      alt: 'AI generated futuristic portrait style'
    }
  ];

  return (
    <div className="bg-white">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex -space-x-1"><div className="w-3 h-3 rounded-full bg-black" /><div className="w-3 h-3 rounded-full bg-slate-300" /></div>
          <div className="h-px w-20 bg-slate-200" />
        </div>
        <h1 className="text-6xl font-black text-[#012620] uppercase tracking-tighter mb-8">AI Generated Content (AIGC)</h1>
        <p className="max-w-4xl text-slate-600 text-lg leading-relaxed font-medium mb-12">
          Lifewood's early adoption of AI tools has seen the company rapidly evolve the use of AI generated content, which has been integrated into video production for the company's communication requirements. This has been enormously successful, and these text, voice, image and video skills that comprise AIGC production, combined with more traditional production methods and our story development skills, are now being sought by other companies.
        </p>
        <a
          href="#/contact"
          className="inline-flex bg-[#F7B955] hover:bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold text-sm items-center gap-2 transition-all"
        >
          Contact Us
          <div className="w-6 h-6 rounded-full bg-[#012620] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 17l9.2-9.2M17 17V7H7" strokeWidth="2.5"/></svg>
          </div>
        </a>
      </section>

      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16">
        <div className="aspect-video bg-slate-100 rounded-[3rem] overflow-hidden relative shadow-2xl border border-slate-200">
           <video
             src="/videos/OYykWaWrUmfZYDy3CJnT4GUNL8.mp4"
             className="w-full h-full object-cover pointer-events-none select-none"
             autoPlay
             loop
             muted
             playsInline
             preload="metadata"
           />
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-14 md:pt-14 md:pb-16 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <h2 className="text-5xl font-black text-black uppercase tracking-tighter mb-8">Our Approach</h2>
          <p className="text-xl text-black font-medium leading-relaxed max-w-lg mb-8">
            Our motivation is to express the personality of your brand in a compelling and distinctive way. We specialize in story-driven content, for companies looking to join the communication revolution.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 max-w-2xl">
            <div className="relative rounded-xl border border-[#417256]/30 bg-gradient-to-br from-[#012620] via-[#034E34] to-[#417256] px-4 py-3 shadow-[0_12px_24px_rgba(1,38,32,0.22)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.26),transparent_40%)]" />
              <p className="relative z-10 text-[11px] font-black uppercase tracking-widest text-[#F7B955]">AI Image</p>
              <p className="relative z-10 text-sm font-medium text-white">Visual concept generation</p>
            </div>
            <div className="relative rounded-xl border border-[#417256]/30 bg-gradient-to-br from-[#034E34] via-[#417256] to-[#708E7C] px-4 py-3 shadow-[0_12px_24px_rgba(3,78,52,0.2)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.2),transparent_38%)]" />
              <p className="relative z-10 text-[11px] font-black uppercase tracking-widest text-[#F7B955]">AI Voice</p>
              <p className="relative z-10 text-sm font-medium text-white">Multilingual narration</p>
            </div>
            <div className="relative rounded-xl border border-[#F7B955]/45 bg-gradient-to-br from-[#F7B955] via-[#F4D0A4] to-[#FCFBF7] px-4 py-3 shadow-[0_12px_24px_rgba(247,185,85,0.24)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.32),transparent_40%)]" />
              <p className="relative z-10 text-[11px] font-black uppercase tracking-widest text-[#133020]">AI Video</p>
              <p className="relative z-10 text-sm font-medium text-[#034E34]">Fast content production</p>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="relative w-[290px] h-[360px] aigc-bounce-stage pointer-events-none select-none">
            <div className="absolute inset-0 bg-slate-200 rounded-[2rem] shadow-xl overflow-hidden aigc-bounce-card aigc-bounce-card-back">
              <img src={aiGeneratedExamples[2].src} className="w-full h-full object-cover" alt={aiGeneratedExamples[2].alt} />
            </div>
            <div className="absolute inset-0 bg-slate-100 rounded-[2rem] shadow-xl overflow-hidden aigc-bounce-card aigc-bounce-card-mid">
              <img src={aiGeneratedExamples[1].src} className="w-full h-full object-cover" alt={aiGeneratedExamples[1].alt} />
            </div>
            <div className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 aigc-bounce-card aigc-bounce-card-front">
              <img src={aiGeneratedExamples[0].src} className="w-full h-full object-cover" alt={aiGeneratedExamples[0].alt} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-100">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <svg className="w-8 h-8 text-[#F7B955] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="1.8" />
              <path d="M3 10h18M8 6l3 4M13 6l3 4M8 20v-4M13 20v-4M18 20v-4" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <p className="text-3xl text-black font-medium leading-snug">
              We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds for your videos.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="h-32 bg-slate-100 rounded-2xl overflow-hidden shadow-md"><img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Film production setup" /></div>
             <div className="h-32 bg-slate-100 rounded-2xl overflow-hidden shadow-md"><img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Video editing timeline on monitor" /></div>
             <div className="h-32 bg-slate-100 rounded-2xl overflow-hidden shadow-md"><img src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Cinema camera lens closeup" /></div>
          </div>
        </div>

        <div className="mt-14 md:mt-16 grid md:grid-cols-4 gap-4">
           <div className="md:col-span-2 rounded-[2rem] overflow-hidden h-64 relative p-8 flex items-end border border-[#417256]/30 shadow-[0_18px_40px_rgba(3,78,52,0.24)]">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?fit=crop&w=800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-55 saturate-110" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#012620]/78 via-[#034E34]/64 to-[#F7B955]/30" />
              <div className="absolute -top-10 left-14 w-56 h-24 rounded-full bg-white/25 blur-2xl" />
              <p className="relative z-10 text-white font-bold max-w-xs">We can quickly adjust the culture and language of your video to suit different world markets.</p>
           </div>
           <div className="relative rounded-[2rem] h-64 flex flex-col justify-center items-center text-center p-6 border border-[#417256]/30 bg-gradient-to-br from-[#012620] via-[#034E34] to-[#417256] shadow-[0_18px_36px_rgba(1,38,32,0.28)] overflow-hidden">
              <div className="absolute -top-8 left-6 w-28 h-20 rounded-full bg-white/20 blur-xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.22),transparent_42%)]" />
              <span className="relative z-10 text-sm font-black text-[#F7B955] uppercase tracking-widest mb-2">Multiple</span>
              <span className="relative z-10 text-lg font-bold text-white uppercase tracking-widest">Languages</span>
           </div>
           <div className="relative rounded-[2rem] h-64 flex flex-col justify-center items-center text-center p-6 border border-[#F7B955]/45 bg-gradient-to-br from-[#F7B955] via-[#F4D0A4] to-[#FCFBF7] shadow-[0_18px_36px_rgba(247,185,85,0.28)] overflow-hidden">
              <div className="absolute -top-8 right-6 w-28 h-20 rounded-full bg-white/35 blur-xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.28),transparent_38%)]" />
              <span className="relative z-10 text-6xl font-black text-[#133020] mb-2">100+</span>
              <span className="relative z-10 text-sm font-bold text-[#034E34] uppercase tracking-widest">Countries</span>
           </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <blockquote className="text-3xl font-black text-[#012620] leading-tight mb-8">
          “We understand that your customers spend hours looking at screens: so finding the one, most important thing, on which to build your message is integral to our approach, as we seek to deliver surprise and originality.”
        </blockquote>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">— Lifewood —</p>
      </section>
    </div>
  );
};

export default Aigc;
