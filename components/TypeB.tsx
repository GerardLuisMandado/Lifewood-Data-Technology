
import React, { useState } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

type StackStep = {
  id: string;
  navLabel: string;
  title: string;
  description: string;
  image: string;
};

const TypeB: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const stackSteps: StackStep[] = [
    {
      id: '01',
      navLabel: 'TARGET',
      title: 'Target',
      description:
        'Capture and transcribe recordings from native speakers from 23 different countries (Netherlands, Spain, Norway, France, Germany, Poland, Russia, Italy, Japan, South Korea, Mexico, UAE, Saudi Arabia, Egypt, etc.). Voice content involves 6 project types and 9 data domains. A total of 25,400 valid hours durations.',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1400'
    },
    {
      id: '02',
      navLabel: 'SOLUTIONS',
      title: 'Solutions',
      description:
        'Build horizontal AI data pipelines for transcription, semantic labeling, multilingual QA, and metadata normalization. Combine human-in-the-loop workflows with domain-specific validation for consistent data quality.',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1400'
    },
    {
      id: '03',
      navLabel: 'RESULTS',
      title: 'Results',
      description:
        'Deliver model-ready datasets across voice, text, and multimodal formats with faster turnaround and higher reliability, helping enterprise teams deploy AI systems with stronger real-world performance.',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1400'
    }
  ];

  return (
    <div className="bg-[#FCFBF7]">
      <section className="max-w-7xl mx-auto px-6 py-12">
         <div className="flex items-center gap-2 mb-6">
          <div className="flex -space-x-1"><div className="w-3 h-3 rounded-full bg-black" /><div className="w-3 h-3 rounded-full bg-slate-300" /></div>
          <div className="h-px w-20 bg-slate-200" />
        </div>
        <div className="grid md:grid-cols-2 items-center gap-12 bg-[#F3EFDE] rounded-[3rem] p-16 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-7xl font-black text-[#012620] uppercase tracking-tighter mb-8 leading-none">Type B -<br/>Horizontal LLM Data</h1>
            <p className="text-xl text-slate-700 font-medium leading-relaxed max-w-md mb-10">
              Comprehensive AI data solutions that cover the entire spectrum from data collection and annotation to model testing. Creating multimodal datasets for deep learning, large language models.
            </p>
            <a
              href="#/contact"
              className="inline-flex bg-[#F7B955] hover:bg-[#D4AF37] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs items-center gap-3 transition-all group"
            >
              Contact Us
              <div className="w-8 h-8 rounded-full bg-[#012620] flex items-center justify-center transition-transform group-hover:translate-x-1">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2.5"/></svg>
              </div>
            </a>
          </div>
          <div className="relative h-[400px]">
             <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-contain grayscale invert opacity-50" alt="Abstract shapes" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-xl text-[#666666] font-medium mb-24 max-w-4xl">
          Voice, image and text for Apple Intelligence. Provided over 50 language sets.
        </p>
        
        <h2 className="text-4xl font-black text-[#133020] uppercase tracking-tighter mb-12">TYPE B: AI SOLUTIONS</h2>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,580px)] gap-14 items-start">
          <div>
            <ScrollStack
              className="typeb-scroll-stack"
              useWindowScroll
              itemDistance={44}
              itemScale={0.04}
              itemStackDistance={24}
              stackPosition="18%"
              scaleEndPosition="8%"
              baseScale={0.9}
              onActiveIndexChange={setActiveStepIndex}
            >
              {stackSteps.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <ScrollStackItem
                    key={step.id}
                    itemClassName={`!h-auto !p-8 !rounded-[2rem] !shadow-none !border transition-all duration-500 ${
                      isActive
                        ? '!bg-white !border-[#133020]/20 shadow-[0_18px_40px_rgba(0,0,0,0.08)]'
                        : '!bg-[#FCFBF7] !border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-end gap-4 mb-5">
                      <span className={`text-7xl font-black leading-none ${isActive ? 'text-[#133020]' : 'text-[#9CAFA4]'}`}>
                        {step.id}
                      </span>
                      <span className={`text-sm font-black uppercase tracking-widest mb-2 ${isActive ? 'text-[#417256]' : 'text-[#9CAFA4]'}`}>
                        {step.navLabel}
                      </span>
                    </div>
                    <h3 className={`text-3xl font-black mb-4 ${isActive ? 'text-[#133020]' : 'text-[#708E7C]'}`}>
                      {step.title}
                    </h3>
                    <p className={`font-medium leading-relaxed ${isActive ? 'text-[#666666]' : 'text-[#9CAFA4]'}`}>
                      {step.description}
                    </p>
                  </ScrollStackItem>
                );
              })}
            </ScrollStack>
          </div>
          <div className="lg:sticky lg:top-44">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl h-[450px] border border-slate-200 relative bg-white">
              {stackSteps.map((step, idx) => (
                <img
                  key={step.id}
                  src={step.image}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    idx === activeStepIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  alt={step.title}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TypeB;
