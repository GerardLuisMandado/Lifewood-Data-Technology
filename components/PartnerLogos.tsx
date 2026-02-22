
import React from 'react';

const PartnerLogos: React.FC = () => {
  const partnersTop = [
    { name: 'BYU Pathway', logo: 'BYU' },
    { name: 'Ancestry', logo: 'ancestry' },
    { name: 'FamilySearch', logo: 'FamilySearch' },
    { name: 'Google Cloud', logo: 'Google' },
    { name: 'AWS', logo: 'AWS' }
  ];
  const partnersBottom = [
    { name: 'Microsoft Azure', logo: 'Azure' },
    { name: 'OpenAI', logo: 'OpenAI' },
    { name: 'NVIDIA', logo: 'NVIDIA' },
    { name: 'Meta AI', logo: 'Meta' },
    { name: 'Oracle', logo: 'Oracle' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h3 className="text-4xl md:text-5xl font-light text-[#0D4A30] mb-6">Our Clients And Partners</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            We are proud to partner with leading organizations worldwide to deliver meaningful AI data solutions.
            Lifewood&apos;s commitment to innovation and operational excellence has earned the trust of global brands across industries.
            Here are some of the valued clients and partners we collaborate with.
          </p>
        </div>
        <p className="text-center text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-12">Empowering Global Innovators</p>
        <div className="overflow-hidden w-full">
          <div
            className="flex items-center gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 whitespace-nowrap animate-marquee-left"
            style={{ animation: 'marquee-left 20s linear infinite' }}
          >
            {partnersTop.concat(partnersTop).map((p, idx) => (
              <div
                key={p.name + idx}
                className="text-3xl font-black text-[#012620] tracking-tighter hover:text-[#D4AF37] transition-colors cursor-default select-none uppercase px-8"
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden w-full mt-8">
          <div
            className="flex items-center gap-24 opacity-35 grayscale hover:grayscale-0 transition-all duration-700 whitespace-nowrap animate-marquee-right"
            style={{ animation: 'marquee-right 22s linear infinite' }}
          >
            {partnersBottom.concat(partnersBottom).map((p, idx) => (
              <div
                key={p.name + idx}
                className="text-3xl font-black text-[#0D4A30] tracking-tighter hover:text-[#D4AF37] transition-colors cursor-default select-none uppercase px-8"
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-left,
          .animate-marquee-right {
            will-change: transform;
            min-width: 200%;
          }
        `}</style>
      </div>
    </section>
  );
};

export default PartnerLogos;
