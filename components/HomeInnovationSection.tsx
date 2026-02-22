import React, { useEffect, useState } from 'react';

const HomeInnovationSection: React.FC = () => {
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000',
      title: 'Global+',
      subtitle: 'AI Data Projects at Scale'
    },
    {
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000',
      title: 'Innovation',
      subtitle: 'Teams Solving Data Challenges'
    },
    {
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=2000',
      title: 'Delivery',
      subtitle: 'Reliable Global Execution'
    }
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [slides.length, isHovered]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-6xl font-light text-[#0A1014] tracking-tight mb-10 whitespace-nowrap">
          Constant Innovation: Unlimited Possibilities
        </h2>

        <div
          className="mb-4 rounded-3xl overflow-hidden relative min-h-[290px] md:min-h-[360px] group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {slides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.subtitle}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                activeSlide === index ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-colors duration-300 group-hover:from-black/65" />
          <div className="absolute left-6 bottom-6 text-white">
            <h3 className="text-5xl md:text-6xl font-light tracking-tight leading-none mb-2">
              {slides[activeSlide].title.includes('+') ? (
                <>
                  {slides[activeSlide].title.replace('+', '')}
                  <span className="text-[#F7B955]">+</span>
                </>
              ) : (
                slides[activeSlide].title
              )}
            </h3>
            <p className="text-xl md:text-2xl font-medium text-white/90">{slides[activeSlide].subtitle}</p>
          </div>
          <div className="absolute bottom-6 right-6 flex items-center gap-2">
            {slides.map((slide, index) => (
              <div
                key={slide.image}
                onMouseEnter={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === index ? 'w-8 bg-[#F7B955]' : 'w-2.5 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                role="button"
              />
            ))}
          </div>
        </div>

        <p className="text-center text-slate-700 text-lg md:text-xl mb-20">
          No matter the industry, size, or type of data involved, our solutions satisfy demanding AI data-processing requirements.
        </p>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-6xl md:text-8xl font-light text-[#0A1014] tracking-tight mb-6">AI DATA SERVICES</h3>
          <p className="text-slate-800 text-xl md:text-2xl leading-relaxed mb-12">
            Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity to optimize organizational performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[260px_180px] gap-3 max-w-5xl mx-auto">
          <div className="lg:col-span-9 lg:row-span-1 rounded-3xl overflow-hidden relative min-h-[260px] group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=2000"
              alt="Audio data services"
              className="w-full h-full object-cover object-[50%_55%] grayscale-0 [transition:filter_900ms_cubic-bezier(0.22,1,0.36,1),transform_700ms_cubic-bezier(0.22,1,0.36,1)] will-change-[filter,transform] group-hover:grayscale group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-black/25 transition-colors duration-500 ease-out group-hover:bg-black/60" />
            <div className="absolute top-4 left-4 text-white text-2xl font-medium">Audio</div>
            <p className="absolute left-4 bottom-4 right-4 text-white/90 text-xs md:text-sm opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              Collection, labelling, voice categorization, music categorization, intelligent cs
            </p>
          </div>

          <div className="lg:col-span-3 lg:row-span-2 rounded-3xl overflow-hidden relative min-h-[260px] lg:min-h-0 group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200"
              alt="Text data services"
              className="w-full h-full object-cover grayscale-0 [transition:filter_900ms_cubic-bezier(0.22,1,0.36,1),transform_700ms_cubic-bezier(0.22,1,0.36,1)] will-change-[filter,transform] group-hover:grayscale group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors duration-500 ease-out group-hover:bg-black/60" />
            <div className="absolute top-4 left-4 text-white text-2xl font-medium">Text</div>
            <p className="absolute left-4 bottom-4 right-4 text-white/90 text-xs md:text-sm opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              Text collection, labelling, transcription, utterance collection, sentiment analysis
            </p>
          </div>

          <div className="lg:col-span-3 lg:row-span-1 rounded-3xl overflow-hidden relative min-h-[180px] group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200"
              alt="Image data services"
              className="w-full h-full object-cover grayscale-0 [transition:filter_900ms_cubic-bezier(0.22,1,0.36,1),transform_700ms_cubic-bezier(0.22,1,0.36,1)] will-change-[filter,transform] group-hover:grayscale group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-black/25 transition-colors duration-500 ease-out group-hover:bg-black/60" />
            <div className="absolute top-4 left-4 text-white text-2xl font-medium">Image</div>
            <p className="absolute left-4 bottom-4 right-4 text-white/90 text-xs md:text-sm opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              Collection, labelling, classification, audit, object detection and tagging
            </p>
          </div>

          <div className="lg:col-span-6 lg:row-span-1 rounded-3xl overflow-hidden relative min-h-[180px] group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1600"
              alt="Video data services"
              className="w-full h-full object-cover grayscale-0 [transition:filter_900ms_cubic-bezier(0.22,1,0.36,1),transform_700ms_cubic-bezier(0.22,1,0.36,1)] will-change-[filter,transform] group-hover:grayscale group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-black/25 transition-colors duration-500 ease-out group-hover:bg-black/60" />
            <div className="absolute top-4 left-4 text-white text-2xl font-medium">Video</div>
            <p className="absolute left-4 bottom-4 right-4 text-white/90 text-xs md:text-sm opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              Collection, labelling, audit, live broadcast, subtitle generation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeInnovationSection;
