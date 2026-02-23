import React, { useState } from 'react';

type ProjectItem = {
  id: string;
  title: string;
  desc: string;
  icon: 'doc' | 'gear' | 'car' | 'chat' | 'voice' | 'eye' | 'dna';
  image: string;
};

const AiProjects: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const projects: ProjectItem[] = [
    {
      id: '2.1',
      title: 'AI Data Extraction',
      desc: 'Using AI, we optimize the acquisition of image and text from multiple sources. Techniques include onsite scanning, drone photography, negotiation with archives and the formation of alliances with corporations, religious organizations and governments.',
      icon: 'doc',
      image: 'https://framerusercontent.com/images/RIqv6T7aFrp5Q9X85Zqy55KQ8x4.png?scale-down-to=1024&width=1856&height=2464'
    },
    {
      id: '2.2',
      title: 'Machine Learning Enablement',
      desc: 'Accelerating model training with high-quality annotated data streams for large-scale enterprise deployments.',
      icon: 'gear',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: '2.3',
      title: 'Autonomous Driving Technology',
      desc: 'Precision annotation for LiDAR, Radar, and visual sensors to ensure safety in autonomous vehicle systems.',
      icon: 'car',
      image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: '2.4',
      title: 'AI-Enabled Customer Service',
      desc: 'Training conversational AI agents with industry-specific sentiment and context data.',
      icon: 'chat',
      image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: '2.5',
      title: 'Natural Language Processing and Speech Acquisition',
      desc: 'Multi-lingual speech datasets for advanced LLM training and localization.',
      icon: 'voice',
      image: 'https://images.pexels.com/photos/7562103/pexels-photo-7562103.jpeg?auto=compress&cs=tinysrgb&w=1200'
    },
    {
      id: '2.6',
      title: 'Computer Vision (CV)',
      desc: 'Pixel-perfect segmentation and object tracking for healthcare, retail, and manufacturing sectors.',
      icon: 'eye',
      image: 'https://cdn.pixabay.com/photo/2018/05/04/17/16/eye-3374462_1280.jpg'
    },
    {
      id: '2.7',
      title: 'Genealogy',
      desc: 'Historical document digitization and indexing powered by human-in-the-loop verification.',
      icon: 'dna',
      image: 'https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&q=80&w=1200'
    }
  ];
  const currentProject = projects[activeIndex] ?? projects[0];
  const renderIcon = (icon: ProjectItem['icon']) => {
    const base = 'w-6 h-6 text-black';
    switch (icon) {
      case 'doc':
        return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3h6l4 4v14H8z" strokeWidth="2.2"/><path d="M14 3v4h4" strokeWidth="2.2"/></svg>;
      case 'gear':
        return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Z" strokeWidth="2.2"/><path d="m4 13 1.5.3.6 1.5-1 1.1 1.5 1.5 1.1-1 1.5.6L9 20h3l.3-1.5 1.5-.6 1.1 1 1.5-1.5-1-1.1.6-1.5L20 13v-2l-1.5-.3-.6-1.5 1-1.1-1.5-1.5-1.1 1-1.5-.6L15 4h-3l-.3 1.5-1.5.6-1.1-1L7.6 6.6l1 1.1-.6 1.5L4 11z" strokeWidth="1.6"/></svg>;
      case 'car':
        return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 13l2-5h14l2 5v5h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3z" strokeWidth="2.2"/><path d="M5 13h14" strokeWidth="2.2"/></svg>;
      case 'chat':
        return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 6h14v10H9l-4 3z" strokeWidth="2.2"/></svg>;
      case 'voice':
        return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3Z" strokeWidth="2.2"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3" strokeWidth="2.2"/></svg>;
      case 'eye':
        return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" strokeWidth="2.2"/><circle cx="12" cy="12" r="2.5" strokeWidth="2.2"/></svg>;
      case 'dna':
        return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="5" r="2" strokeWidth="2.2"/><circle cx="6" cy="11" r="2" strokeWidth="2.2"/><circle cx="18" cy="11" r="2" strokeWidth="2.2"/><circle cx="6" cy="18" r="2" strokeWidth="2.2"/><circle cx="18" cy="18" r="2" strokeWidth="2.2"/><path d="M12 7v3M8 11h8M6 13v3M18 13v3" strokeWidth="2.2"/></svg>;
    }
  };

  return (
    <section id="ai-projects" className="py-24 bg-[#FCFBF7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-1">
              <div className="w-3 h-3 rounded-full bg-black" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
            </div>
            <div className="h-px w-20 bg-slate-200" />
          </div>
          <h2 className="text-6xl font-black text-[#012620] uppercase tracking-tighter mb-8">AI Projects</h2>
          <p className="max-w-4xl text-slate-600 text-lg leading-relaxed font-medium">
            From building AI datasets in diverse languages and environments, to developing platforms that enhance productivity and open new opportunities in under-resourced economies, you&apos;ll see how Lifewood is shaping the future with innovation, integrity and a focus on people.
          </p>
          <a href="#/contact" className="mt-8 bg-[#F7B955] hover:bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold text-sm inline-flex items-center gap-2 transition-all">
            Contact Us
            <div className="w-6 h-6 rounded-full bg-[#012620] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 17l9.2-9.2M17 17V7H7" strokeWidth="2.5"/></svg>
            </div>
          </a>
        </div>

        <div className="text-center mb-16">
          <span className="bg-black text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Projects</span>
          <h3 className="text-5xl font-black text-[#012620] uppercase tracking-tighter">What we currently handle</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {currentProject.id === '2.4' ? (
            <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[700px] border border-slate-200 relative bg-gradient-to-br from-[#f8fbfd] via-[#f6f7f8] to-[#edf0f4]">
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, rgba(1,38,32,0.06), transparent 40%), radial-gradient(circle at 80% 75%, rgba(247,185,85,0.14), transparent 35%)'
                }}
              />
              <div className="relative z-10 h-full flex items-center justify-center px-8 py-10">
                <div className="w-full max-w-[360px] h-[560px] rounded-[2rem] bg-[#f3f4f6] border border-slate-200 shadow-[0_24px_70px_rgba(1,38,32,0.22)] overflow-hidden flex flex-col">
                  <div className="bg-[#012620] text-white px-4 py-5 flex items-start justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        <div className="w-5 h-[2px] rounded bg-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest uppercase leading-none">Lifewood AI</p>
                        <p className="text-[8px] text-white/70 tracking-[0.18em] uppercase mt-1">Data Strategy</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Close chatbot preview"
                      className="text-white/90 text-xs leading-none mt-0.5"
                    >
                      x
                    </button>
                  </div>

                  <div className="flex-1 px-4 py-5 bg-[#f5f6f7]">
                    <div className="max-w-[230px] bg-white border border-slate-200 rounded-md px-3 py-2 text-[10px] leading-relaxed text-slate-600 shadow-sm">
                      Welcome to Lifewood. I&apos;m your Data Strategy Consultant. How can I assist you with your AI data pipeline today?
                    </div>
                  </div>

                  <div className="bg-white border-t border-slate-200 px-4 py-4">
                    <div className="h-10 rounded-lg border border-slate-200 bg-[#f5f6f8] pl-3 pr-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">Inquire about our capabilities...</span>
                      <div className="w-6 h-6 rounded-md bg-[#012620] text-[#D4AF37] flex items-center justify-center text-[11px] font-bold">
                        AI
                      </div>
                    </div>
                    <p className="text-[8px] text-slate-300 text-center tracking-[0.22em] uppercase font-black mt-3">
                      Authorized Data Strategy Agent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[700px] border border-slate-200 relative group">
              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          <div className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="border-b border-slate-200 py-4 transition-all duration-500"
              >
                <button onClick={() => setActiveIndex(activeIndex === index ? -1 : index)} className="w-full flex items-center justify-between text-left group">
                  <div className="flex items-center gap-6">
                    <span className="inline-flex items-center justify-center w-6 h-6">{renderIcon(project.icon)}</span>
                    <span className={`text-2xl font-black tracking-tight ${activeIndex === index ? 'text-black' : 'text-black'} transition-colors`}>
                      {project.id} {project.title}
                    </span>
                  </div>
                  <div className={`w-8 h-8 min-w-8 min-h-8 shrink-0 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-500 ${activeIndex === index ? 'rotate-45 bg-[#012620] text-[#F7B955] border-[#012620]' : 'text-slate-400'}`}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5"/></svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-500 font-medium leading-relaxed pl-14 pr-10">
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiProjects;
