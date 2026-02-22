
import React from 'react';

const ServicesGrid: React.FC = () => {
  const services = [
    {
      title: "Audio Intelligence",
      description: "Speech-to-text, acoustic segmentation, and voice synthesis training data at massive scale.",
      img: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800",
      span: "md:col-span-2",
      height: "h-96"
    },
    {
      title: "Natural Language",
      description: "Complex NLP datasets, RLHF, and multilingual verification services for LLM leaders.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      span: "md:row-span-2",
      height: "h-full"
    },
    {
      title: "Computer Vision",
      description: "Pixel-perfect object detection, semantic segmentation, and 3D point cloud labeling.",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      span: "md:col-span-1",
      height: "h-80"
    },
    {
      title: "Action Recognition",
      description: "Dynamic temporal tracking and complex action classification for autonomous systems.",
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
      span: "md:col-span-1",
      height: "h-80"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((service, idx) => (
        <div 
          key={idx} 
          className={`group relative overflow-hidden rounded-[2.5rem] bg-[#012620] ${service.span} ${service.height} shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-700 border border-white/5`}
        >
          <img 
            src={service.img} 
            alt={service.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#012620] via-[#012620]/40 to-transparent opacity-90" />
          
          <div className="absolute bottom-0 left-0 p-12 w-full">
            <div className="w-10 h-1 bg-[#D4AF37] mb-6 rounded-full group-hover:w-20 transition-all duration-500" />
            <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              {service.title}
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                 <svg className="w-5 h-5 text-[#012620]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md font-medium">
              {service.description}
            </p>
          </div>

          <div className="absolute top-8 right-8">
             <div className="bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 px-5 py-1.5 rounded-full text-[9px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">
               Enterprise Tier
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesGrid;
