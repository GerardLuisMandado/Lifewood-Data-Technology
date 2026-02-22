
import React, { useEffect, useRef, useState } from 'react';

const AboutUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');
  const [displayMissionVisionTab, setDisplayMissionVisionTab] = useState<'mission' | 'vision'>('mission');
  const [isMissionVisionSwitching, setIsMissionVisionSwitching] = useState(false);
  const spiralSectionRef = useRef<HTMLDivElement | null>(null);
  const coreValueCopyRef = useRef<HTMLParagraphElement | null>(null);
  const coreValueListRef = useRef<HTMLDivElement | null>(null);
  const missionVisionSwitchTimeoutRef = useRef<number | null>(null);
  const [spiralProgress, setSpiralProgress] = useState(0);
  const [isCoreValueCopyVisible, setIsCoreValueCopyVisible] = useState(false);
  const [isCoreValueListVisible, setIsCoreValueListVisible] = useState(false);

  const coreValues = [
    { letter: 'D', title: 'DIVERSITY', desc: 'We celebrate differences in belief, philosophy and ways of life, because they bring unique perspectives and ideas that encourage everyone to move forward.' },
    { letter: 'C', title: 'CARING', desc: 'We care for every person deeply and equally, because without care work becomes meaningless.' },
    { letter: 'I', title: 'INNOVATION', desc: 'Innovation is at the heart of all we do, enriching our lives and challenging us to continually improve ourselves and our service.' },
    { letter: 'I', title: 'INTEGRITY', desc: 'We are dedicated to act ethically and sustainably in everything we do. More than just the bare minimum. It is the basis of our existence as a company.' }
  ];
  const coreValueLeadText = 'At Lifewood we empower our company and our clients to realise the transformative power of AI: Bringing big data to life, launching new ways of thinking, innovating, learning, and doing.';
  const coreValueLeadWords = coreValueLeadText.split(' ');
  const missionVisionContent: Record<
    'mission' | 'vision',
    { heading: string; description: string; image: string; imageAlt: string }
  > = {
    mission: {
      heading: 'Our Mission',
      description:
        'To develop and deploy cutting edge AI technologies that solve real-world problems, empower communities, and advance sustainable practices. We are committed to fostering a culture of innovation, collaborating with stakeholders across sectors, and making a meaningful impact on society and the environment.',
      image:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
      imageAlt: 'Team discussing mission and strategy'
    },
    vision: {
      heading: 'Our Vision',
      description:
        "To be the global catalyst for ethical AI development, where human potential is amplified through precise data engineering. We envision a future where technology and humanity work in perfect synergy to solve the world's most complex challenges.",
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      imageAlt: 'Futuristic city skyline representing long-term vision'
    }
  };
  const activeMissionVision = missionVisionContent[displayMissionVisionTab];

  const handleMissionVisionTabChange = (tab: 'mission' | 'vision') => {
    if (tab === activeTab && !isMissionVisionSwitching) return;

    setActiveTab(tab);
    setIsMissionVisionSwitching(true);

    if (missionVisionSwitchTimeoutRef.current !== null) {
      window.clearTimeout(missionVisionSwitchTimeoutRef.current);
    }

    missionVisionSwitchTimeoutRef.current = window.setTimeout(() => {
      setDisplayMissionVisionTab(tab);
      requestAnimationFrame(() => setIsMissionVisionSwitching(false));
      missionVisionSwitchTimeoutRef.current = null;
    }, 170);
  };

  const spiralCards = [
    { title: 'Community', image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=1200' },
    { title: 'AI Systems', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Mobility', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Analytics', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Engineering', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Data Capture', image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Cloud Ops', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Automation', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Insights', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Semantics', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Operations', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Scale', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Compute', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Delivery', image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Quality', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Codebase', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Research', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Collab', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Platform', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1200' },
    { title: 'Transformation', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=1200' }
  ];
  const spiralArmCards = Array.from({ length: 20 }, (_, index) => {
    const baseCard = spiralCards[index];
    return {
      ...baseCard,
      armId: index
    };
  });

  useEffect(() => {
    return () => {
      if (missionVisionSwitchTimeoutRef.current !== null) {
        window.clearTimeout(missionVisionSwitchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const target = coreValueCopyRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCoreValueCopyVisible(entry.isIntersecting);
      },
      { threshold: [0, 0.08] }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = coreValueListRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCoreValueListVisible(entry.isIntersecting);
      },
      { threshold: [0, 0.08] }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      if (!spiralSectionRef.current) return;
      const section = spiralSectionRef.current;
      const viewportHeight = window.innerHeight;
      const start = section.offsetTop;
      const end = start + section.offsetHeight - viewportHeight;
      if (end <= start) {
        setSpiralProgress(0);
        return;
      }
      const raw = (window.scrollY - start) / (end - start);
      const clamped = Math.max(0, Math.min(1, raw));
      setSpiralProgress(clamped);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="bg-white" data-no-reveal>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex -space-x-1">
            <div className="w-3 h-3 rounded-full bg-black" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <div className="h-px w-20 bg-slate-200" />
        </div>
        <h1 className="text-6xl font-black text-[#012620] uppercase tracking-tighter mb-8">About our company</h1>
        <p className="max-w-4xl text-slate-600 text-lg leading-relaxed font-medium">
          While we are motivated by business and economic objectives, we remain committed to our core business beliefs <span className="text-[#F7B955]">that shape our corporate and individual behaviour around the world.</span>
        </p>
      </div>

      {/* Hero Visual Section */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        <div className="md:col-span-2 rounded-[3rem] overflow-hidden shadow-xl h-[400px]">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-all duration-700" alt="Team meeting" />
        </div>
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-4 shadow-xl flex flex-col group transition-all duration-500 hover:border-[#D4AF37]/40 hover:shadow-2xl">
          <div className="rounded-[2rem] overflow-hidden h-[250px] relative">
            <video
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:saturate-125 group-hover:brightness-110"
              src="https://videos.pexels.com/video-files/6248595/6248595-hd_1920_1080_25fps.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#F7B955]/30 via-transparent to-[#012620]/35 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <div className="pt-6 pb-3 text-center flex flex-col items-center gap-4">
            <h3 className="text-2xl font-black text-[#012620] uppercase tracking-tighter">Lets collaborate</h3>
            <a
              href="#/contact"
              className="bg-[#F7B955] hover:bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold text-sm inline-flex items-center gap-2 transition-all"
            >
              Contact Us
              <span className="w-6 h-6 rounded-full bg-[#012620] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 17l9.2-9.2M17 17V7H7" strokeWidth="2.5"/></svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100">
        <div className="grid md:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
          <div className="w-full">
            <h2 className="text-5xl font-black text-[#012620] uppercase tracking-tighter flex items-center gap-4 mb-8">
              CORE <span className="bg-[#F7B955] px-4 py-1">VALUE</span>
            </h2>
            <p ref={coreValueCopyRef} className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg" aria-label={coreValueLeadText}>
              <span className="sr-only">{coreValueLeadText}</span>
              <span aria-hidden="true">
                {coreValueLeadWords.map((word, index) => (
                  <React.Fragment key={`${word}-${index}`}>
                    <span
                      className={`inline-block will-change-transform transition-all duration-700 ease-out ${
                        isCoreValueCopyVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-3 blur-[2px]'
                      }`}
                      style={{ transitionDelay: `${index * 28}ms` }}
                    >
                      {word}
                    </span>
                    {index < coreValueLeadWords.length - 1 ? ' ' : ''}
                  </React.Fragment>
                ))}
              </span>
            </p>
          </div>
          <div ref={coreValueListRef} className="space-y-4 w-full">
            {coreValues.map((val, idx) => {
              const descWords = val.desc.split(' ');

              return (
                <div key={idx} className="flex items-start gap-8 group">
                  <div className="w-20 h-20 bg-[#012620] text-white flex items-center justify-center text-4xl font-black shrink-0 transition-transform group-hover:scale-105">
                    {val.letter}
                  </div>
                  <div>
                    <h4 className="font-black text-[#D4AF37] text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                      {val.title}
                    </h4>
                    <p className="text-slate-500 font-medium leading-snug transition-colors group-hover:text-[#012620]" aria-label={val.desc}>
                      <span className="sr-only">{val.desc}</span>
                      <span aria-hidden="true">
                        {descWords.map((word, wordIndex) => (
                          <React.Fragment key={`${word}-${idx}-${wordIndex}`}>
                            <span
                              className={`inline-block will-change-transform transition-all duration-700 ease-out ${
                                isCoreValueListVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-3 blur-[2px]'
                              }`}
                              style={{ transitionDelay: `${idx * 110 + wordIndex * 18}ms` }}
                            >
                              {word}
                            </span>
                            {wordIndex < descWords.length - 1 ? ' ' : ''}
                          </React.Fragment>
                        ))}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission Vision Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-center text-5xl font-black text-[#012620] uppercase tracking-tighter mb-16">
          What drives us today, and what inspires us for tomorrow
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className={`rounded-[3rem] overflow-hidden shadow-2xl h-[500px] transition-all duration-300 ease-out ${isMissionVisionSwitching ? 'opacity-0 translate-y-2 scale-[0.985]' : 'opacity-100 translate-y-0 scale-100'}`}>
             <img
               src={activeMissionVision.image}
               className="w-full h-full object-cover transition-transform duration-700 ease-out"
               alt={activeMissionVision.imageAlt}
             />
          </div>
          <div>
            <div className="flex border-b border-slate-100 mb-8">
               <button 
                onClick={() => handleMissionVisionTabChange('mission')}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'mission' ? 'bg-[#012620] text-white' : 'text-slate-400 hover:text-black'}`}
               >
                 Mission
               </button>
               <button 
                onClick={() => handleMissionVisionTabChange('vision')}
                className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'vision' ? 'bg-[#012620] text-white' : 'text-slate-400 hover:text-black'}`}
               >
                 Vision
               </button>
            </div>
            <div className={`bg-[#FCFBF7] p-12 rounded-[2.5rem] min-h-[300px] transition-all duration-300 ease-out ${isMissionVisionSwitching ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <h3 className="text-3xl font-black text-[#012620] mb-6 uppercase tracking-tight">{activeMissionVision.heading}</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                {activeMissionVision.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Spiral Scroll Section */}
      <div ref={spiralSectionRef} className="border-t border-slate-100 bg-white min-h-[320vh]">
        <div className="sticky top-0 h-screen w-full max-w-none mx-0 px-0 overflow-hidden">
          <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 z-[200] text-center pointer-events-none">
            <img
              src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
              alt="Lifewood"
              className="h-20 md:h-24 w-auto mx-auto"
            />
            <p className="text-3xl text-slate-700 mt-3">Be Amazed</p>
          </div>

          <div className="hidden md:block relative h-full" style={{ perspective: '1600px' }}>
            <div className="absolute left-1/2 top-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
              {spiralArmCards.map((card, index) => {
                const totalCards = spiralArmCards.length;
                const spinProgress = Math.min(1, spiralProgress);
                const track = spinProgress * (totalCards - 1);
                const delta = index - track;
                const absDelta = Math.abs(delta);
                const visibleRange = 5.6;

                const turnStep = 0.95;
                const theta = delta * turnStep;

                const collapseProgress = Math.max(0, Math.min(1, (spinProgress - 0.97) / 0.03));
                const orbit = 1 - Math.pow(collapseProgress, 1.1);

                const x = Math.sin(theta) * 640 * orbit;
                const y = (delta * 118 + Math.sin(theta * 0.45) * 36) * orbit;
                const z = Math.cos(theta) * 760 * orbit;

                const depth = Math.max(0, Math.min(1, (z + 760) / 1520));
                const distanceFade = Math.max(0, 1 - absDelta / visibleRange);
                const opacity = distanceFade * (0.25 + depth * 0.75);
                const scale = (0.45 + depth * 0.9) * (0.9 + distanceFade * 0.1);
                const cardRotateY = -Math.sin(theta) * 74;
                const blur = z < 0 ? 1.9 : 0;

                return (
                  <div
                    key={`${card.title}-${card.armId}`}
                    className="absolute left-1/2 top-1/2 w-[230px] lg:w-[390px] overflow-hidden shadow-[0_20px_48px_rgba(15,23,42,0.22)] border border-slate-200"
                    style={{
                      transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${cardRotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex: Math.round(depth * 100),
                      filter: `blur(${blur}px)`
                    }}
                  >
                    <img src={card.image} alt={card.title} className="w-full h-[150px] lg:h-[240px] object-cover" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 py-10">
            {spiralArmCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="rounded-xl overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-40 object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
