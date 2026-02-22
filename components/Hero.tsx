
import React, { useEffect, useRef, useState } from 'react';

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0, 0.2, 0.4], rootMargin: '-8% 0px -15% 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} data-no-reveal className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#f5eedb]">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      
      {/* Decorative Gold Circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#D4AF37] to-transparent rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#012620] rounded-full blur-[100px] opacity-5 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#012620]/5 border border-[#D4AF37]/30 text-[#012620] text-[10px] font-black uppercase tracking-[0.2em] mb-10 hero-slide-right ${heroVisible ? 'hero-slide-in' : ''}`}>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              Data Engineering at Global Scale
            </div>
            
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black text-[#0D4A30] leading-[0.95] mb-8 tracking-tighter hero-slide-right hero-delay-1 ${heroVisible ? 'hero-slide-in' : ''}`}>
              Fueling the world's
              <br />
              <span className="text-[#D4AF37]">Greatest AI</span> with
              <br />
              human insight.
            </h1>
            
            <p className={`text-lg md:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed font-medium hero-slide-right hero-delay-2 ${heroVisible ? 'hero-slide-in' : ''}`}>
              We specialize in enterprise-grade data engineering and workforce management, delivering precision-annotated datasets for the industry's pioneers.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 items-start max-w-xl hero-slide-right hero-delay-3 ${heroVisible ? 'hero-slide-in' : ''}`}>
              <a
                href="#/contact"
                className="bg-[#F3EFDE] text-[#012620] border-2 border-[#D4AF37] px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs transition-colors duration-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] flex items-center justify-center gap-3"
              >
                Contact us
              </a>
            </div>

          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative">
              {/* Image Frame */}
              <div className="w-[500px] h-[500px] bg-[#012620] rounded-[60px] rotate-6 relative overflow-hidden shadow-2xl border border-white/10">
                 <img 
                   src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000" 
                   className="absolute inset-0 w-full h-full object-cover -rotate-6 scale-110 opacity-70 grayscale hover:grayscale-0 transition-all duration-1000" 
                   alt="Technology abstraction"
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#012620] via-transparent to-[#D4AF37]/10" />
              </div>
              {/* Floating element with official octagon logo */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 animate-float max-w-[260px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <img 
                      src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png" 
                      alt="Lifewood Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#012620]">Data Integrity</span>
                    <span className="block text-[9px] font-bold text-slate-400">Verified by Lifewood Global</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#012620] to-[#D4AF37] w-[92%] animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter text-slate-400">
                    <span>Precision Score</span>
                    <span className="text-[#D4AF37]">99.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
