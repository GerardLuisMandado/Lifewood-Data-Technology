import React from 'react';

const AiDataServices: React.FC = () => {
  const serviceCategories = [
    {
      title: 'Video',
      desc: 'Collection, labelling, audit, live broadcast, subtitle generation, and scene review',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Image',
      desc: 'Collection, labelling, classification, audit, object detection and tagging',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Audio',
      desc: 'Collection, labelling, voice categorization, music categorization, intelligent cs',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=2000'
    },
    {
      title: 'Text',
      desc: 'Text collection, labelling, transcription, utterance collection, sentiment analysis',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  const dataAcquisitionOrbitImages = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600'
  ];

  return (
    <>
      <section id="ai-services" className="pt-24 pb-14 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-3 h-3 rounded-full bg-black" />
            <div className="w-3 h-3 rounded-full border border-slate-300" />
            <div className="h-px w-24 border-b border-dashed border-slate-300" />
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-[#0A1014] uppercase tracking-tighter mb-6">AI Data Services</h2>
          <p className="max-w-4xl text-slate-700 text-lg leading-relaxed font-medium">
            Lifewood delivers end-to-end AI data solutions from multi-language data collection and annotation to model
            training and generative AI content. Leveraging our global workforce, industrialized methodology, and
            proprietary LIFT platform, we enable organizations to scale efficiently, reduce costs, and accelerate
            decision-making with high-quality, domain-specific datasets.
          </p>

          <a href="#/contact" className="mt-8 inline-flex bg-[#F7B955] hover:bg-[#D4AF37] text-[#012620] px-5 py-2 rounded-full font-bold text-xs items-center gap-2 transition-all">
            Contact Us
            <span className="w-5 h-5 rounded-full bg-[#0D4A30] text-white inline-flex items-center justify-center text-[11px]">+</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {serviceCategories.map((cat, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm group">
              <div className="mb-4 rounded-2xl overflow-hidden">
                <img src={cat.image} alt={cat.title} className="w-full h-40 object-cover" />
              </div>
              <h3 className="text-5xl font-black text-slate-300 group-hover:text-[#F7B955] transition-colors mb-2">{cat.title}</h3>
              <p className="text-slate-600 font-medium leading-snug max-h-0 opacity-0 -translate-y-2 overflow-hidden transition-all duration-500 ease-out group-hover:max-h-40 group-hover:opacity-100 group-hover:translate-y-0">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>

        </div>
      </section>

      <section className="pb-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-5xl mx-auto rounded-[2rem] bg-white border border-slate-200 p-5 shadow-sm">
          <div className="aspect-video rounded-[1.25rem] overflow-hidden relative bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/WsYfQmbgc6E"
              title="Lifewood AI Services Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
        </div>
      </section>

      <section className="bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-slate-700 mb-4">+ Why brands trust us</p>
          <h3 className="text-5xl md:text-7xl font-black text-[#0A1014] leading-[0.95] tracking-tighter">
            Comprehensive
            <br />
            Data Solutions
          </h3>
          <a href="#/contact" className="mt-6 inline-flex items-center gap-3 text-sm font-bold text-slate-700">
            Get started
            <span className="w-8 h-8 rounded-full bg-black text-white inline-flex items-center justify-center">&rarr;</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 bg-black text-white rounded-2xl p-8 min-h-[620px] relative overflow-hidden">
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200"
                alt="Data validation sample"
                className="w-full h-44 object-cover"
              />
            </div>
            <h4 className="text-4xl font-black mb-5">Data Validation</h4>
            <p className="text-slate-300 font-medium leading-relaxed mb-4">
              The goal is to create data that is consistent, accurate and complete, preventing data loss or errors in
              transfer, code or configuration.
            </p>
            <p className="text-slate-300 font-medium leading-relaxed">
              We verify that data conforms to predefined standards, rules or constraints, ensuring the information is
              trustworthy and fit for its intended purpose.
            </p>
            <div className="absolute bottom-[-90px] right-[-40px] w-[280px] h-[280px] rounded-full border-[20px] border-slate-500/20" />
            <p className="absolute bottom-7 left-8 text-xs font-bold text-slate-400">© 2026 Lifewood Data Technology</p>
          </div>

          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-8 min-h-[360px]">
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                alt="Data collection sample"
                className="w-full h-40 object-cover"
              />
            </div>
            <h4 className="text-4xl font-black text-[#0A1014] mb-4">Data Collection</h4>
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              Lifewood delivers multi-modal data collection across text, audio, image, and video, supported by
              advanced workflows for categorization, labeling, tagging, transcription, sentiment analysis, and
              subtitle generation.
            </p>
            <div className="bg-black rounded-xl p-6 text-white">
              <svg className="w-10 h-10 mb-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M2.5 7.5A2.5 2.5 0 0 1 5 5h4.4c.5 0 .98.2 1.34.55l1.15 1.15c.35.36.84.55 1.34.55H19A2.5 2.5 0 0 1 21.5 10v1H2.5v-3.5Z"
                  fill="#FBD38D"
                />
                <path d="M2.5 11h19v6.5A2.5 2.5 0 0 1 19 20H5a2.5 2.5 0 0 1-2.5-2.5V11Z" fill="#F7B955" />
              </svg>
              <p className="text-sm text-slate-200 leading-snug">
                Our scalable processes ensure accuracy and cultural nuance across 30+ languages and regions.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-8 min-h-[360px] relative overflow-hidden flex flex-col">
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/34007241/pexels-photo-34007241.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Data acquisition sample"
                className="w-full h-40 object-cover"
              />
            </div>
            <h4 className="text-4xl font-black text-[#0A1014] mb-4">Data Acquisition</h4>
            <p className="text-slate-600 font-medium leading-relaxed">
              We provide end-to-end data acquisition solutions capturing, processing, and managing large-scale,
              diverse datasets.
            </p>
            <div className="mt-6 flex-1 min-h-[220px] flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-64">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[76%] h-[76%] rounded-full border border-slate-300/70" />
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-28 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center px-3">
                  <img
                    src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                    alt="Lifewood logo"
                    className="h-7 w-auto object-contain"
                  />
                </div>

                <div className="lw-ellipse-orbit">
                  {dataAcquisitionOrbitImages.map((image, index) => {
                    const orbitDelay = -(index * 20) / dataAcquisitionOrbitImages.length;
                    return (
                      <div key={image} className="lw-ellipse-orbit-node" style={{ ['--orbit-delay' as any]: `${orbitDelay}s` }}>
                        <img
                          src={image}
                          alt={`Data acquisition orbit ${index + 1}`}
                          className="w-12 h-12 rounded-full object-cover border border-white shadow-md"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-black border border-slate-800 rounded-2xl p-8 min-h-[250px] relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-5 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1200"
                  alt="Data curation sample"
                  className="w-full h-28 object-cover"
                />
              </div>
              <h4 className="text-4xl font-black text-white mb-4">Data Curation</h4>
              <p className="text-slate-300 font-medium leading-relaxed">
                We sift, select and index data to ensure reliability, accessibility and ease of classification.
              </p>
            </div>
          </div>

          <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-8 min-h-[250px] relative overflow-hidden">
            <div className="mb-5 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1400"
                alt="Data annotation sample"
                className="w-full h-28 object-cover"
              />
            </div>
            <h4 className="text-4xl font-black text-[#0A1014] mb-4">Data Annotation</h4>
            <p className="text-slate-600 font-medium leading-relaxed max-w-3xl">
              In the age of AI, data is the fuel for all analytic and machine learning. With our in-depth library of
              services, we support your digital strategy and accelerate your organization&apos;s cognitive systems
              development.
            </p>
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-full bg-[#F7B955]/20" />
          </div>
        </div>
        </div>
      </section>
      <style>{`
        .lw-ellipse-orbit {
          position: absolute;
          inset: 0;
          will-change: transform;
        }

        .lw-ellipse-orbit-node {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 48px;
          height: 48px;
          margin-left: -24px;
          margin-top: -24px;
          animation: lwEllipseNodeOrbit 20s linear infinite;
          animation-delay: var(--orbit-delay);
          will-change: transform;
        }

        .lw-ellipse-orbit-node img {
          transform-origin: center;
          will-change: transform;
          backface-visibility: hidden;
        }

        @keyframes lwEllipseNodeOrbit {
          from {
            transform: rotate(0deg) translateX(96px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(96px) rotate(-360deg);
          }
        }
      `}</style>
    </>
  );
};

export default AiDataServices;

