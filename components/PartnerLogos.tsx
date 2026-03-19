
import React from 'react';

const PartnerLogos: React.FC = () => {
  const logosTop = [
    {
      alt: 'Client and partner collage 1',
      src: 'https://framerusercontent.com/images/Yq2A1QFJLXgGQ3b7NZPthsD9RBk.png?scale-down-to=512&width=1920&height=1080'
    },
    {
      alt: 'Client and partner collage 2',
      src: 'https://framerusercontent.com/images/m37jhLfPRl449iXOe8op7cY68c.png?scale-down-to=512&width=1920&height=1080'
    },
    {
      alt: 'Client and partner collage 3',
      src: 'https://framerusercontent.com/images/HWbvpkExIBUbdXEGILLSX4PTcEE.png?scale-down-to=512&width=1920&height=551'
    },
    {
      alt: 'Client and partner collage 4',
      src: 'https://framerusercontent.com/images/cjJDncfOy71yWizT3ZRdsZB4W0.png?scale-down-to=512&width=1920&height=1080'
    }
  ];

  const logosBottom = [
    {
      alt: 'Client and partner collage 5',
      src: 'https://framerusercontent.com/images/5mxPuoDvu4IebUtQtNowrZOfWSg.png?scale-down-to=1024&width=1920&height=1080'
    },
    {
      alt: 'Client and partner collage 6',
      src: 'https://framerusercontent.com/images/2rRd2Mk1HzeDgPbL0e8wwkUPo.png?scale-down-to=512&width=1920&height=1080'
    },
    {
      alt: 'Client and partner collage 7',
      src: 'https://framerusercontent.com/images/RyIkooWlUn6nQYbljETePWzd2Ac.png?scale-down-to=512&width=1243&height=713'
    }
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
            className="flex items-center w-max gap-20 md:gap-24 opacity-100 whitespace-nowrap animate-marquee-left"
            style={{ animation: 'marquee-left 20s linear infinite' }}
          >
            {logosTop.concat(logosTop).map((logo, idx) => (
              <div
                key={`${logo.src}-${idx}`}
                className="px-8 py-2"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain opacity-80 grayscale select-none pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden w-full mt-8">
          <div
            className="flex items-center w-max gap-20 md:gap-24 opacity-100 whitespace-nowrap animate-marquee-right"
            style={{ animation: 'marquee-right 22s linear infinite' }}
          >
            {logosBottom.concat(logosBottom).map((logo, idx) => (
              <div
                key={`${logo.src}-${idx}`}
                className="px-8 py-2"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain opacity-80 grayscale select-none pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee-left {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes marquee-right {
            from { transform: translate3d(-50%, 0, 0); }
            to { transform: translate3d(0, 0, 0); }
          }
          .animate-marquee-left,
          .animate-marquee-right {
            will-change: transform;
            backface-visibility: hidden;
          }
        `}</style>
      </div>
    </section>
  );
};

export default PartnerLogos;
