
import React, { useEffect, useRef, useState } from 'react';

const Careers: React.FC = () => {
  const teamImageRef = useRef<HTMLImageElement | null>(null);
  const [isTeamImageVisible, setIsTeamImageVisible] = useState(false);

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
            <a
              href="#/contact"
              className="mt-8 inline-flex bg-[#F7B955] hover:bg-[#D4AF37] text-[#012620] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs items-center gap-3 transition-all group shadow-xl"
            >
              Join Us
              <div className="w-8 h-8 rounded-full bg-[#012620] flex items-center justify-center transition-transform group-hover:translate-x-1">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2.5"/></svg>
              </div>
            </a>
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
